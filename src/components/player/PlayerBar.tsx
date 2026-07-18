import { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { Icon } from '../core/Icon';
import type { LoopMode } from '../../types/manifest';

/* ============================================================
   底部播放器栏 · 封面 + 信息 + 控制 + 功能按钮
   ============================================================ */

interface PlayerBarProps {
  onToggleLyric: () => void;
  onToggleQueue: () => void;
  isLyricOpen: boolean;
  isQueueOpen: boolean;
  onTrackEnded: () => void;
}

const LOOP_ICONS: Record<LoopMode, 'repeat' | 'repeat1' | 'shuffle'> = {
  list: 'repeat',
  single: 'repeat1',
  shuffle: 'shuffle',
};

const RATES = [0.75, 1, 1.25, 1.5, 2];

export function PlayerBar({ onToggleLyric, onToggleQueue, isLyricOpen, isQueueOpen, onTrackEnded }: PlayerBarProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const track = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const volume = usePlayerStore((s) => s.volume);
  const isMuted = usePlayerStore((s) => s.isMuted);
  const playbackRate = usePlayerStore((s) => s.playbackRate);
  const loopMode = usePlayerStore((s) => s.loopMode);
  const replaySignal = usePlayerStore((s) => s.replaySignal);

  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const prev = usePlayerStore((s) => s.prev);
  const seek = usePlayerStore((s) => s.seek);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const toggleMute = usePlayerStore((s) => s.toggleMute);
  const setPlaybackRate = usePlayerStore((s) => s.setPlaybackRate);
  const setLoopMode = usePlayerStore((s) => s.setLoopMode);
  const setPlaying = usePlayerStore((s) => s.setPlaying);
  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime);
  const setDuration = usePlayerStore((s) => s.setDuration);

  const audio = audioRef.current;

  // 键盘快捷键
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!track) return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable) return;
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(Math.min(currentTime + 5, duration));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(Math.max(currentTime - 5, 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(volume + 0.05, 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(volume - 0.05, 0));
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [track, currentTime, duration, volume, togglePlay, seek, setVolume, toggleMute]);

  // Media Session API
  useEffect(() => {
    if (!track || !('mediaSession' in navigator)) return;
    const ms = (navigator as any).mediaSession;
    ms.metadata = new MediaMetadata({
      title: track.title,
      artist: track.originalArtist ?? '',
      album: '',
      artwork: track.cover ? [{ src: track.cover, sizes: '512x512' }] : [],
    });
    ms.setActionHandler('play', () => setPlaying(true));
    ms.setActionHandler('pause', () => setPlaying(false));
    ms.setActionHandler('previoustrack', () => prev());
    ms.setActionHandler('nexttrack', () => next());
    return () => {
      ms.setActionHandler('play', null);
      ms.setActionHandler('pause', null);
      ms.setActionHandler('previoustrack', null);
      ms.setActionHandler('nexttrack', null);
    };
  }, [track, setPlaying, prev, next]);

  // audio 属性同步
  useEffect(() => {
    if (!audio) return;
    if (isPlaying) {
      const play = audio.play();
      if (play?.catch) play.catch(() => {});
    } else {
      audio.pause();
    }
  }, [audio, isPlaying]);

  useEffect(() => { if (audio) audio.volume = isMuted ? 0 : volume; }, [audio, volume, isMuted]);
  useEffect(() => { if (audio) audio.playbackRate = playbackRate; }, [audio, playbackRate]);
  // 仅当 store 时间与 audio 偏差较大（外部 seek）时才回写，避免 timeupdate 循环
  useEffect(() => {
    if (audio && Math.abs(audio.currentTime - currentTime) > 0.6) {
      audio.currentTime = currentTime;
    }
  }, [audio, currentTime]);
  // 单曲循环重播信号
  useEffect(() => {
    if (audio) {
      audio.currentTime = 0;
      if (isPlaying) audio.play().catch(() => {});
    }
  }, [audio, replaySignal, isPlaying]);

  if (!track) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        height: 'var(--player-height)',
        background: 'rgba(5, 6, 15, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--line)',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.4)',
      }}
    >
      {/* 进度条 */}
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        onSeek={(t) => {
          seek(t);
          if (audio) audio.currentTime = t;
        }}
      />

      <div
        style={{
          maxWidth: 'var(--content-max-width)',
          margin: '0 auto',
          height: 'calc(var(--player-height) - 2px)',
          padding: '0 var(--content-padding)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
        }}
      >
        {/* 左侧：封面 + 信息 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1, minWidth: 0 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              border: '1px solid var(--line)',
              flexShrink: 0,
              boxShadow: isPlaying ? '0 0 12px rgba(0,229,255,0.25)' : 'none',
            }}
          >
            {track.cover ? (
              <img src={track.cover} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'var(--bg-panel)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-tertiary)',
                }}
              >
                <Icon name="music" size={18} />
              </div>
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <p className="truncate" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
              {track.title}
            </p>
            <p className="truncate" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
              {track.originalArtist ? `原唱 ${track.originalArtist}` : 'LuzzyMeow'}
            </p>
          </div>
        </div>

        {/* 中间：控制 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: '0 0 auto', justifyContent: 'center' }}>
          <button type="button" className="neon-icon-btn" onClick={prev} aria-label="上一首">
            <Icon name="skipBack" size={20} />
          </button>
          <button
            type="button"
            aria-label={isPlaying ? '暂停' : '播放'}
            onClick={togglePlay}
            style={{
              width: 44,
              height: 44,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--cyan)',
              background: 'rgba(0,229,255,0.12)',
              color: 'var(--cyan)',
              cursor: 'pointer',
              boxShadow: 'var(--glow-cyan)',
              transition: 'transform var(--duration-fast) var(--ease-neon)',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.9)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Icon name={isPlaying ? 'pause' : 'play'} size={22} />
          </button>
          <button type="button" className="neon-icon-btn" onClick={next} aria-label="下一首">
            <Icon name="skipForward" size={20} />
          </button>
        </div>

        {/* 右侧：功能按钮 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 'var(--space-2)',
            flex: 1,
          }}
        >
          {/* 播放速度 */}
          <button
            type="button"
            className="mono neon-icon-btn"
            onClick={() => {
              const idx = RATES.indexOf(playbackRate);
              const nextIdx = (idx + 1) % RATES.length;
              setPlaybackRate(RATES[nextIdx]);
            }}
            aria-label={`当前播放速度 ${playbackRate}x`}
            style={{ fontSize: 'var(--text-xs)', width: 40, letterSpacing: '0.05em' }}
          >
            {playbackRate}x
          </button>
          {/* 循环模式 */}
          <button
            type="button"
            className={`neon-icon-btn ${isLyricOpen ? 'is-active' : ''}`}
            onClick={onToggleLyric}
            aria-label={isLyricOpen ? '关闭歌词' : '歌词'}
            aria-pressed={isLyricOpen}
          >
            <Icon name="lyric" size={18} />
          </button>
          <button
            type="button"
            className={`neon-icon-btn ${isQueueOpen ? 'is-active' : ''}`}
            onClick={onToggleQueue}
            aria-label={isQueueOpen ? '关闭列表' : '播放列表'}
            aria-pressed={isQueueOpen}
          >
            <Icon name="listMusic" size={18} />
          </button>
          {/* 音量控制 */}
          <VolumeRail
            volume={volume}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            onSetVolume={(v) => setVolume(v)}
          />
          {/* 循环模式 */}
          <button
            type="button"
            className="neon-icon-btn"
            onClick={() => {
              const modes: LoopMode[] = ['list', 'single', 'shuffle'];
              const idx = modes.indexOf(loopMode);
              setLoopMode(modes[(idx + 1) % modes.length]);
            }}
            aria-label={`循环模式：${loopMode}`}
          >
            <Icon name={LOOP_ICONS[loopMode]} size={18} style={{ color: 'var(--cyan)' }} />
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={track.src}
        crossOrigin="anonymous"
        preload="metadata"
        loop={loopMode === 'single'}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration || 0);
          }
        }}
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onEnded={() => {
          if (loopMode === 'single') {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(() => {});
            }
          } else {
            onTrackEnded();
          }
        }}
      />
    </div>
  );
}

/* ============================================================
   进度条（PlayerBar 内联）
   ============================================================ */
function ProgressBar({ currentTime, duration, onSeek }: { currentTime: number; duration: number; onSeek: (t: number) => void }) {
  const [hover, setHover] = useState(false);
  const [hoverPos, setHoverPos] = useState(0);
  const barRef = useRef<HTMLDivElement | null>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const onBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(pct * duration);
  };

  const onBarMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPos(pct * 100);
  };

  return (
    <div
        ref={barRef}
        role="slider"
        aria-label="播放进度"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
        tabIndex={0}
        onClick={onBarClick}
        onMouseMove={onBarMove}
        onMouseEnter={() => { setHover(true); if (barRef.current) barRef.current.style.height = '6px'; }}
        onMouseLeave={() => { setHover(false); if (barRef.current) barRef.current.style.height = '3px'; }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') onSeek(Math.max(0, currentTime - 5));
          if (e.key === 'ArrowRight') onSeek(Math.min(duration, currentTime + 5));
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'rgba(0,229,255,0.08)',
          cursor: 'pointer',
          transition: 'height 0.2s ease',
        }}
      >
      <div
        style={{
          width: `${progress}%`,
          height: '100%',
          background: 'var(--grad-neon)',
          boxShadow: '0 0 8px rgba(0,229,255,0.5)',
        }}
      />
      {/* hover 预览线 */}
      {hover && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: `${hoverPos}%`,
            width: 1,
            height: '100%',
            background: 'rgba(0,229,255,0.6)',
            boxShadow: 'var(--glow-cyan)',
          }}
        />
      )}
    </div>
  );
}

/* ============================================================
   音量滑条（PlayerBar 内联）
   ============================================================ */
function VolumeRail({
  volume,
  isMuted,
  onToggleMute,
  onSetVolume,
}: {
  volume: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onSetVolume: (v: number) => void;
}) {
  const [show, setShow] = useState(false);
  const [dragging, setDragging] = useState(false);
  const railRef = useRef<HTMLDivElement | null>(null);
  const vol = isMuted ? 0 : volume;

  const getVolFromEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = railRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  };

  const onStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    const v = getVolFromEvent(e);
    onSetVolume(v);
  };
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const v = getVolFromEvent(e);
    onSetVolume(v);
  };
  const onEnd = () => setDragging(false);

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => {
        setShow(false);
        setDragging(false);
      }}
    >
      <button
        type="button"
        className="neon-icon-btn"
        onClick={onToggleMute}
        aria-label={isMuted ? '取消静音' : '静音'}
      >
        <Icon name={isMuted ? 'volumeX' : volume > 0.5 ? 'volume2' : 'volume1'} size={18} />
      </button>
      {(show || dragging) && (
        <div
          ref={railRef}
          style={{
            position: 'absolute',
            bottom: 42,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 120,
            height: 6,
            background: 'rgba(0,229,255,0.08)',
            borderRadius: 3,
            border: '1px solid var(--line)',
            cursor: 'pointer',
            padding: '2px',
          }}
          onMouseDown={onStart}
          onMouseMove={onMove}
          onMouseUp={onEnd}
          onMouseLeave={onEnd}
        >
          <div
            style={{
              width: `${vol * 100}%`,
              height: '100%',
              background: 'var(--grad-neon)',
              borderRadius: 2,
              boxShadow: '0 0 6px rgba(0,229,255,0.4)',
            }}
          />
        </div>
      )}
    </div>
  );
}
