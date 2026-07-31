import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { formatDuration } from '../../lib/format';

/* ============================================================
   播放列表面板 · 纸面浮层
   ============================================================ */

export function QueuePanel() {
  const queue = usePlayerStore((s) => s.queue);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const queueIndex = usePlayerStore((s) => s.queueIndex);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const setPlaying = usePlayerStore((s) => s.setPlaying);
  const activeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [queueIndex]);

  if (queue.length === 0) return null;

  return (
    <div
      className="card"
      style={{
        position: 'fixed',
        bottom: 'calc(var(--player-height) + 6px)',
        right: 'var(--content-padding)',
        zIndex: 65,
        width: 'min(320px, calc(100vw - 32px))',
        maxHeight: 'calc(100vh - var(--nav-height) - var(--player-height) - 24px)',
        overflow: 'hidden',
      }}
    >
      {/* 标题 */}
      <div
        style={{
          padding: 'var(--space-3) var(--space-5)',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)' }}>
          播放队列 · QUEUE
        </span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>
          {String(queueIndex + 1).padStart(2, '0')}/{String(queue.length).padStart(2, '0')}
        </span>
      </div>

      {/* 列表 */}
      <div
        className="no-scrollbar"
        style={{
          maxHeight: 'calc(100vh - var(--nav-height) - var(--player-height) - 84px)',
          overflowY: 'auto',
        }}
      >
        {queue.map((t, i) => {
          const active = t.id === currentTrack?.id;
          return (
            <div
              key={t.id}
              ref={active ? activeRef : undefined}
              onClick={() => {
                playTrack(t, queue);
                setPlaying(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: '9px var(--space-5)',
                cursor: 'pointer',
                background: active ? 'var(--accent-soft)' : 'transparent',
                borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'background var(--duration-fast) var(--ease-out)',
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = 'var(--paper-deep)';
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = 'transparent';
              }}
            >
              <span
                className="mono"
                style={{
                  fontSize: 'var(--text-xs)',
                  color: active ? 'var(--accent)' : 'var(--ink-faint)',
                  width: 26,
                  textAlign: 'right',
                  flexShrink: 0,
                }}
              >
                {active && isPlaying ? (
                  <span className="eq"><span /><span /><span /></span>
                ) : (
                  String(i + 1).padStart(2, '0')
                )}
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p className="truncate" style={{ fontSize: 'var(--text-sm)', fontWeight: active ? 600 : 400, color: active ? 'var(--ink)' : 'var(--ink-soft)' }}>
                  {t.title}
                </p>
                <p className="truncate" style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 1 }}>
                  {t.originalTitle ?? 'LuzzyMeow'}
                </p>
              </div>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-faint)', flexShrink: 0 }}>
                {formatDuration(t.duration ?? 0)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
