import type { TimelineEvent } from '../../types/manifest';
import { Icon, type IconName } from '../core/Icon';

/* ============================================================
   时间线 · 航行日志（竖轴 + 发光节点）
   ============================================================ */

const TYPE_META: Record<string, { icon: IconName; pink?: boolean }> = {
  music: { icon: 'music' },
  code: { icon: 'github' },
  study: { icon: 'star' },
  life: { icon: 'mapPin', pink: true },
  milestone: { icon: 'star', pink: true },
  other: { icon: 'clock' },
};

export function Timeline({ timeline }: { timeline?: TimelineEvent[] }) {
  if (!timeline || timeline.length === 0) return null;
  return (
    <div className="reveal" style={{ position: 'relative', paddingLeft: 28 }}>
      {/* 竖轴 */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 8,
          top: 6,
          bottom: 6,
          width: 1,
          background: 'linear-gradient(180deg, var(--cyan), var(--violet), var(--pink))',
          opacity: 0.5,
          boxShadow: '0 0 8px rgba(0,229,255,0.4)',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        {timeline.map((ev) => {
          const meta = TYPE_META[ev.type ?? 'other'] ?? TYPE_META.other;
          const color = meta.pink ? 'var(--pink)' : 'var(--cyan)';
          return (
            <div key={ev.id} style={{ position: 'relative' }}>
              {/* 节点 */}
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: -24,
                  top: 6,
                  width: 11,
                  height: 11,
                  transform: 'rotate(45deg)',
                  background: 'var(--bg-void)',
                  border: `1.5px solid ${color}`,
                  boxShadow: meta.pink ? 'var(--glow-pink)' : 'var(--glow-cyan)',
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <span className="mono" style={{ fontSize: 'var(--text-xs)', color, letterSpacing: '0.1em', textShadow: meta.pink ? 'var(--glow-text-pink)' : 'var(--glow-text-cyan)' }}>
                  {ev.date}
                </span>
                <Icon name={meta.icon} size={14} style={{ color }} />
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>{ev.title}</h3>
              </div>
              {ev.description && (
                <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', maxWidth: 640 }}>
                  {ev.description}
                </p>
              )}
              {ev.link && (
                <a
                  href={ev.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    marginTop: 'var(--space-2)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--cyan)',
                    borderBottom: '1px solid var(--line-strong)',
                  }}
                >
                  {ev.link.label} <Icon name="external" size={11} />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
