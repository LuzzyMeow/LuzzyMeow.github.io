import type { Project } from '../../types/manifest';
import { Icon } from '../core/Icon';
import { NeonTag } from '../core/NeonTag';

/* ============================================================
   项目 · 切角卡片阵列
   ============================================================ */

const STATUS_LABEL: Record<string, { text: string; pink?: boolean }> = {
  ongoing: { text: 'ONGOING' },
  completed: { text: 'DONE', pink: true },
  archived: { text: 'ARCHIVED', pink: true },
};

export function Projects({ projects }: { projects?: Project[] }) {
  if (!projects || projects.length === 0) return null;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--space-6)',
      }}
    >
      {projects.map((p) => {
        const status = p.status ? STATUS_LABEL[p.status] : null;
        return (
          <div key={p.id} className="neon-frame reveal" style={{ height: '100%' }}>
            <div className="neon-frame-body neon-scan" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* 封面 */}
              <div
                style={{
                  height: 150,
                  background: 'linear-gradient(135deg, rgba(0,229,255,0.1), rgba(139,92,255,0.12), rgba(255,45,150,0.1))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--cyan)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {p.cover ? (
                  <img src={p.cover} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Icon name="disc" size={44} style={{ opacity: 0.6 }} />
                )}
                {p.featured && (
                  <span
                    className="mono"
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 10,
                      letterSpacing: '0.12em',
                      color: 'var(--pink)',
                      background: 'rgba(5,6,15,0.8)',
                      border: '1px solid var(--line-pink)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '3px 8px',
                      textShadow: 'var(--glow-text-pink)',
                    }}
                  >
                    <Icon name="star" size={10} /> PIN
                  </span>
                )}
              </div>

              {/* 内容 */}
              <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
                  <h3 className="truncate" style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)' }}>{p.title}</h3>
                  {status && <NeonTag pink={status.pink}>{status.text}</NeonTag>}
                </div>
                <p className="line-clamp-2" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', flex: 1 }}>{p.description}</p>

                {p.tags && p.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {p.tags.slice(0, 4).map((t) => (
                      <NeonTag key={t}>{t}</NeonTag>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                    {p.startDate ?? ''}{p.startDate ? ' → ' : ''}{p.endDate ?? (p.startDate ? 'NOW' : '')}
                  </span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {p.links?.map((l) => (
                      <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="neon-icon-btn" style={{ width: 30, height: 30 }} aria-label={l.label} title={l.label}>
                        <Icon name={l.icon?.toLowerCase() === 'github' ? 'github' : 'external'} size={15} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
