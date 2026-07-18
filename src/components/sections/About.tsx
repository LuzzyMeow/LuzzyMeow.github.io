import type { SiteData } from '../../types/manifest';
import { Icon, type IconName } from '../core/Icon';
import { NeonPanel } from '../core/NeonPanel';

/* ============================================================
   关于 · 身份卡 + 长介绍
   ============================================================ */

const LINK_ICON: Record<string, IconName> = {
  github: 'github',
  bilibili: 'video',
  email: 'mail',
  mail: 'mail',
};

export function About({ site }: { site: SiteData }) {
  const { owner } = site;
  return (
    <div
      className="reveal"
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 320px) minmax(0, 1fr)',
        gap: 'var(--space-6)',
      }}
    >
      {/* 身份卡 */}
      <NeonPanel scan>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          {/* 头像环 */}
          <div
            style={{
              position: 'relative',
              width: 132,
              height: 132,
              marginBottom: 'var(--space-5)',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, var(--cyan), var(--violet), var(--pink), var(--cyan))',
                animation: 'aboutRingSpin 8s linear infinite',
                opacity: 0.85,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 3,
                borderRadius: '50%',
                background: 'var(--bg-panel-solid)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--cyan)',
              }}
            >
              {owner.avatar ? (
                <img src={owner.avatar} alt={owner.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Icon name="music" size={44} />
              )}
            </div>
          </div>

          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>{owner.name}</h3>
          <p className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--pink)', letterSpacing: '0.2em', marginTop: 6, textShadow: 'var(--glow-text-pink)' }}>
            STATUS: ONLINE
          </p>

          {owner.location && (
            <p style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              <Icon name="mapPin" size={14} style={{ color: 'var(--cyan)' }} />
              {owner.location}
            </p>
          )}

          {owner.links && owner.links.length > 0 && (
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-5)' }}>
              {owner.links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="neon-icon-btn" aria-label={l.label} title={l.label}>
                  <Icon name={LINK_ICON[(l.icon ?? l.label).toLowerCase()] ?? 'link'} size={18} />
                </a>
              ))}
            </div>
          )}
        </div>
      </NeonPanel>

      {/* 介绍文本 */}
      <NeonPanel>
        <p className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--pink)', letterSpacing: '0.2em', marginBottom: 'var(--space-5)' }}>
          {'// PROFILE.TXT'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {(owner.about?.length ? owner.about : [owner.bio]).map((para, i) => (
            <p key={i} style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.9 }}>
              {para}
            </p>
          ))}
        </div>
      </NeonPanel>
      <style>{`@keyframes aboutRingSpin { to { transform: rotate(360deg); } } @media (max-width: 860px) { #about .reveal { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
