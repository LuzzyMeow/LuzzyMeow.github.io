import { useEffect, useMemo, useRef, useState } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { parseLrc } from '../../lib/lrc';
import { Icon } from '../core/Icon';

/* ============================================================
   歌词面板 · 纸面浮层 + 衬线高亮句
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
      className="card"
      style={{
        position: 'fixed',
        top: 'calc(var(--nav-height) + 12px)',
        right: 'var(--content-padding)',
        zIndex: 65,
        width: 'min(340px, calc(100vw - 32px))',
        maxHeight: 'calc(100vh - var(--nav-height) - var(--player-height) - 20px)',
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
          gap: 'var(--space-3)',
        }}
      >
        <span className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', flexShrink: 0 }}>
          歌词 · LYRICS
        </span>
        <span className="truncate" style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', minWidth: 0 }}>
          {track.title}
        </span>
      </div>

      {/* 歌词内容 */}
      <div
        className="no-scrollbar"
        style={{
          maxHeight: 'calc(100vh - var(--nav-height) - var(--player-height) - 84px)',
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
                  padding: '6px 0 6px 12px',
                  borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                  fontSize: active ? 'var(--text-md)' : 'var(--text-sm)',
                  fontFamily: active ? 'var(--font-serif)' : 'var(--font-sans)',
                  fontWeight: active ? 600 : 400,
                  lineHeight: 1.75,
                  color: active ? 'var(--ink)' : 'var(--ink-faint)',
                  transition: 'color var(--duration-fast) var(--ease-out)',
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
              color: 'var(--ink-faint)',
            }}
          >
            <Icon name="lyric" size={28} style={{ opacity: 0.4 }} />
            <span className="mono" style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.2em' }}>
              暂无歌词数据
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
