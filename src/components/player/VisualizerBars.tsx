import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../store/playerStore';

/* ============================================================
   频谱可视化 · 对数刻度 + 平滑 + 青→紫→品红渐变
   ============================================================ */

const BAR_COUNT = 48;
const FFT_SIZE = 1024;

export function VisualizerBars() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const prevRef = useRef<Float32Array>(new Float32Array(BAR_COUNT));

  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentTrack = usePlayerStore((s) => s.currentTrack);

  useEffect(() => {
    const audioEl = document.querySelector('audio') as HTMLAudioElement | null;
    if (!audioEl) return;
    let ctx: AudioContext | null = null;
    let src: MediaElementAudioSourceNode | null = null;
    let analyser: AnalyserNode | null = null;

    const ensureCtx = () => {
      if (!ctx) {
        ctx = new AudioContext();
      }
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
    };

    const setup = () => {
      ensureCtx();
      if (!ctx) return;
      if (!src) {
        src = ctx.createMediaElementSource(audioEl);
        analyser = ctx.createAnalyser();
        analyser.fftSize = FFT_SIZE;
        analyser.smoothingTimeConstant = 0.8;
        src.connect(analyser);
        analyser.connect(ctx.destination);
        analyserRef.current = analyser;
        dataRef.current = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;
      }
    };

    const onFirst = () => setup();
    audioEl.addEventListener('play', onFirst, { once: true });

    // 自动切换曲目时，如果 AudioContext 已存在，只需确保 analyser 在 chain 中
    const onPlay = () => {
      ensureCtx();
      if (!src && ctx) {
        src = ctx.createMediaElementSource(audioEl);
        analyser = ctx.createAnalyser();
        analyser.fftSize = FFT_SIZE;
        analyser.smoothingTimeConstant = 0.8;
        src.connect(analyser);
        analyser.connect(ctx.destination);
        analyserRef.current = analyser;
        dataRef.current = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;
      }
    };
    audioEl.addEventListener('play', onPlay);

    return () => {
      audioEl.removeEventListener('play', onFirst);
      audioEl.removeEventListener('play', onPlay);
      if (ctx) ctx.close();
    };
  }, [currentTrack]); // 重新挂载时（曲目切换）重建 AudioContext

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      const analyser = analyserRef.current;
      const data = dataRef.current;
      if (!analyser || !data || !isPlaying) {
        // 静默时画底噪
        for (let i = 0; i < BAR_COUNT; i++) {
          const bw = w / BAR_COUNT;
          const x = i * bw + bw * 0.12;
          const bwDraw = bw * 0.76;
          const level = 2 + Math.random() * 1.5;
          const ratio = i / BAR_COUNT;
          const r = Math.floor(0 + 255 * ratio * 0.5);
          const g = Math.floor(229 - 229 * ratio * 0.3);
          const b = Math.floor(255 - 255 * ratio * 0.6);
          ctx.fillStyle = `rgba(${r},${g},${b},0.14)`;
          ctx.fillRect(x, h - level, bwDraw, level);
        }
        return;
      }

      analyser.getByteFrequencyData(data);
      const prev = prevRef.current;
      const freqCount = data.length;
      const nyquist = 22050; // 44.1kHz sample rate
      const maxFreq = 8000; // 只取人耳敏感频段
      const minFreq = 40;
      const maxIdx = Math.floor((maxFreq / nyquist) * freqCount);
      const minIdx = Math.max(1, Math.floor((minFreq / nyquist) * freqCount));

      for (let i = 0; i < BAR_COUNT; i++) {
        // 对数刻度：低频更密集
        const t0 = i / BAR_COUNT;
        const t1 = (i + 1) / BAR_COUNT;
        const logMin = Math.log2(minIdx + 1);
        const logMax = Math.log2(maxIdx + 1);
        const idx0 = Math.floor(Math.pow(2, logMin + t0 * (logMax - logMin))) - 1 + minIdx;
        const idx1 = Math.floor(Math.pow(2, logMin + t1 * (logMax - logMin))) - 1 + minIdx;
        let sum = 0;
        let count = 0;
        for (let j = idx0; j <= idx1 && j < data.length; j++) {
          sum += data[j];
          count++;
        }
        const raw = count > 0 ? sum / count / 255 : 0;
        // 平滑
        const smooth = prev[i] + (raw - prev[i]) * 0.3;
        prev[i] = smooth;

        const bw = w / BAR_COUNT;
        const x = i * bw + bw * 0.12;
        const bwDraw = bw * 0.76;
        const barH = Math.max(2, smooth * h * 0.88);
        const ratio = i / BAR_COUNT;
        // 青 → 紫 → 品红
        const r = Math.floor(0 + 255 * ratio * 0.5);
        const g = Math.floor(229 - 229 * ratio * 0.3);
        const b = Math.floor(255 - 255 * ratio * 0.6);
        ctx.fillStyle = `rgba(${r},${g},${b},${0.6 + smooth * 0.4})`;
        ctx.fillRect(x, h - barH, bwDraw, barH);
        // 顶部高光
        ctx.fillStyle = `rgba(232,240,255,${0.3 + smooth * 0.5})`;
        ctx.fillRect(x, h - barH, bwDraw, 1.5);
      }
    };

    const loop = () => {
      draw();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
