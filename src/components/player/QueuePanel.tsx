import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { formatDuration } from '../../lib/format';

/* ============================================================
   播放列表面板 · 曲目 + 当前高亮 + 正在播放指示
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
      className="neon-frame"
      style={{
        position: 'fixed',
        bottom: 'calc(var(--player-height) + 12px)',
        right: 'var(--content-padding)',
        zIndex: 65,
        width: 320,
        maxHeight: 'calc(100vh - var(--nav-height) - var(--player-height) - 40px)',
      }}
    >
      <div className="neon-frame-body" style={{ padding: 0 }}>
        {/* 标题 */}
        <div
          style={{
            padding: 'var(--space-4) var(--space-5)',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span className="mono" style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.15em', color: 'var(--pink)' }}>
            QUEUE // {String(queue.length).padStart(3, '0')}
          </span>
          <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            {String(queueIndex + 1).padStart(2, '0')}/{String(queue.length).padStart(2, '0')}
          </span>
        </div>

        {/* 列表 */}
        <div
          className="no-scrollbar"
          style={{
            maxHeight: 'calc(100vh - var(--nav-height) - var(--player-height) - 90px)',
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
                  padding: '10px var(--space-5)',
                  cursor: 'pointer',
                  borderLeft: active ? '2px solid var(--cyan)' : '2px solid transparent',
                  background: active ? 'rgba(0,229,255,0.05)' : 'transparent',
                  transition: 'background var(--duration-fast) var(--ease-neon)',
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = 'rgba(0,229,255,0.04)';
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: active ? 'var(--cyan)' : 'var(--text-tertiary)',
                    width: 28,
                    textAlign: 'right',
                    flexShrink: 0,
                    textShadow: active ? 'var(--glow-text-cyan)' : 'none',
                  }}
                >
                  {active && isPlaying ? (
                    <span className="eq">
                      <span />
                      <span />
                      <span />
                    </span>
                  ) : (
                    String(i + 1).padStart(2, '0')
                  )}
                </span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p className="truncate" style={{ fontSize: 'var(--text-sm)', color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {t.title}
                  </p>
                  <p className="truncate" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                    {t.originalArtist ? `原唱 ${t.originalArtist}` : 'LuzzyMeow'}
                  </p>
                </div>
                <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', flexShrink: 0 }}>
                  {formatDuration(t.duration ?? 0)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
