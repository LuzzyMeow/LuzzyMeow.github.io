import { useEffect, useRef } from 'react';

/* ============================================================
   深空背景 · Canvas：星点视差 + 粒子流 + 底部透视网格
   ============================================================ */

interface Star {
  x: number;
  y: number;
  r: number;
  depth: number;
  tw: number;
  twSpeed: number;
}

interface Particle {
  x: number;
  y: number;
  vy: number;
  vx: number;
  size: number;
  hue: 'cyan' | 'pink' | 'violet';
  alpha: number;
}

const CYAN = '0,229,255';
const PINK = '255,45,150';
const VIOLET = '139,92,255';

export function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const stars: Star[] = [];
    const particles: Particle[] = [];

    const seed = () => {
      stars.length = 0;
      particles.length = 0;
      const starCount = Math.min(220, Math.floor((w * h) / 9000));
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.3 + 0.3,
          depth: Math.random() * 0.8 + 0.2,
          tw: Math.random() * Math.PI * 2,
          twSpeed: Math.random() * 0.015 + 0.004,
        });
      }
      const pCount = Math.min(60, Math.floor(w / 24));
      for (let i = 0; i < pCount; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vy: -(Math.random() * 0.25 + 0.06),
          vx: (Math.random() - 0.5) * 0.08,
          size: Math.random() * 1.8 + 0.6,
          hue: (['cyan', 'violet', 'pink'] as const)[Math.floor(Math.random() * 3)],
          alpha: Math.random() * 0.5 + 0.15,
        });
      }
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const drawGrid = (t: number) => {
      const horizon = h * 0.78;
      const grad = ctx.createLinearGradient(0, horizon, 0, h);
      grad.addColorStop(0, `rgba(${CYAN},0)`);
      grad.addColorStop(1, `rgba(${CYAN},0.16)`);
      ctx.strokeStyle = grad as unknown as string;
      ctx.lineWidth = 1;

      // 横线（向 horizon 收拢，随时间后移）
      const rows = 10;
      const offset = (t * 0.00006) % 1;
      for (let i = 0; i < rows; i++) {
        const p = (i + offset) / rows;
        const y = horizon + (h - horizon) * p * p;
        const alpha = 0.05 + p * 0.12;
        ctx.strokeStyle = `rgba(${CYAN},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      // 纵线（透视放射）
      const cx = w / 2 + (mouse.x - 0.5) * 40;
      const cols = 18;
      for (let i = -cols / 2; i <= cols / 2; i++) {
        const xBottom = cx + i * (w / cols) * 1.6;
        ctx.strokeStyle = `rgba(${VIOLET},0.07)`;
        ctx.beginPath();
        ctx.moveTo(cx + i * 8, horizon);
        ctx.lineTo(xBottom, h);
        ctx.stroke();
      }
      // 地平线光带
      const hg = ctx.createLinearGradient(0, horizon - 2, 0, horizon + 2);
      hg.addColorStop(0, `rgba(${PINK},0)`);
      hg.addColorStop(0.5, `rgba(${PINK},0.22)`);
      hg.addColorStop(1, `rgba(${PINK},0)`);
      ctx.fillStyle = hg;
      ctx.fillRect(0, horizon - 2, w, 4);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      // 星点（视差 + 闪烁）
      for (const s of stars) {
        s.tw += s.twSpeed;
        const twinkle = 0.55 + Math.sin(s.tw) * 0.45;
        const px = s.x + (mouse.x - 0.5) * 26 * s.depth;
        const py = s.y + (mouse.y - 0.5) * 18 * s.depth;
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,240,255,${(twinkle * 0.7 * s.depth).toFixed(3)})`;
        ctx.fill();
      }

      // 上升粒子（青/紫/品红）
      for (const p of particles) {
        p.x += p.vx + (mouse.x - 0.5) * 0.15;
        p.y += p.vy;
        if (p.y < -6) {
          p.y = h + 6;
          p.x = Math.random() * w;
        }
        const color = p.hue === 'cyan' ? CYAN : p.hue === 'pink' ? PINK : VIOLET;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.alpha.toFixed(3)})`;
        ctx.shadowColor = `rgba(${color},0.8)`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      drawGrid(t);
    };

    const loop = (t: number) => {
      if (running) draw(t);
      raf = requestAnimationFrame(loop);
    };

    const onMouse = (e: MouseEvent) => {
      mouse.tx = e.clientX / w;
      mouse.ty = e.clientY / h;
    };
    const onVis = () => {
      running = document.visibilityState === 'visible';
    };

    resize();
    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
      window.addEventListener('mousemove', onMouse, { passive: true });
      document.addEventListener('visibilitychange', onVis);
    }
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
