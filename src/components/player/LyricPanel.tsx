import { useEffect, useMemo, useRef, useState } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { parseLrc } from '../../lib/lrc';
import { Icon } from '../core/Icon';

/* ============================================================
   歌词面板 · 平滑跟随 + 高亮句
   ============================================================ */

export function LyricPanel() {
  const track = usePlayerStore((s) => s.currentTrack);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const [lines, setLines] = useState<{ time: number; text: string }[]>([]);
  const activeRef = useRef<HTMLDivElement | null>(null);

  const currentIndex = useMemo(() => {
    if (!lines.length) return -1;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (currentTime >= lines[i].time) return i;
    }
    return -1;
  }, [lines, currentTime]);

  useEffect(() => {
    if (track?.lyrics) {
      fetch(track.lyrics)
        .then((r) => r.text())
        .then((text) => setLines(parseLrc(text)))
        .catch(() => setLines([]));
    } else {
      setLines([]);
    }
  }, [track]);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentIndex]);

  if (!track) return null;

  return (
    <div
      className="neon-frame"
      style={{
        position: 'fixed',
        top: 'calc(var(--nav-height) + 10px)',
        right: 'var(--content-padding)',
        zIndex: 65,
        width: 340,
        maxHeight: 'calc(100vh - var(--nav-height) - var(--player-height) - 30px)',
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
            LRC //
          </span>
          <span className="truncate" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', maxWidth: 180 }}>
            {track.title}
          </span>
        </div>

        {/* 歌词内容 */}
        <div
          className="no-scrollbar"
          style={{
            maxHeight: 'calc(100vh - var(--nav-height) - var(--player-height) - 90px)',
            overflowY: 'auto',
            padding: 'var(--space-4) var(--space-5)',
          }}
        >
          {lines.length > 0 ? (
            lines.map((l, i) => {
              const active = i === currentIndex;
              return (
                <div
                  key={i}
                  ref={active ? activeRef : undefined}
                  style={{
                    padding: '7px 0',
                    fontSize: 'var(--text-sm)',
                    lineHeight: 1.7,
                    color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    textShadow: active ? '0 0 8px rgba(0,229,255,0.4)' : 'none',
                    transition: 'color var(--duration-fast) var(--ease-neon)',
                  }}
                >
                  {l.text || <span style={{ opacity: 0.4 }}>···</span>}
                </div>
              );
            })
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-8) 0',
                color: 'var(--text-tertiary)',
              }}
            >
              <Icon name="lyric" size={32} style={{ opacity: 0.3 }} />
              <span className="mono" style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.15em' }}>
                NO LRC DATA
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
