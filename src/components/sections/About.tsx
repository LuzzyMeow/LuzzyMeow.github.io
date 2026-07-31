import type { SiteData } from '../../types/manifest';
import { Icon, type IconName } from '../core/Icon';
import { Panel } from '../core/Panel';

/* ============================================================
   关于 · 身份卡 + 衬线长文
   ============================================================ */

const LINK_ICON: Record<string, IconName> = {
  github: 'github',
  bilibili: 'video',
  youtube: 'video',
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
        gridTemplateColumns: 'minmax(0, 300px) minmax(0, 1fr)',
        gap: 'var(--space-6)',
      }}
    >
      {/* 身份卡 */}
      <Panel style={{ padding: 'var(--space-8) var(--space-6)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {/* 头像 */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '1px solid var(--line-strong)',
            background: 'var(--paper-deep)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--ink-faint)',
          }}
        >
          {owner.avatar ? (
            <img src={owner.avatar} alt={owner.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span className="serif" style={{ fontSize: 44, color: 'var(--ink-soft)' }}>
              {owner.name.charAt(0)}
            </span>
          )}
        </div>

        <h3 className="serif" style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginTop: 'var(--space-4)' }}>
          {owner.name}
        </h3>
        <span className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', marginTop: 6 }}>
          VOCAL COVER · ORIGINAL
        </span>

        {owner.location && (
          <p style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)' }}>
            <Icon name="mapPin" size={13} style={{ color: 'var(--accent)' }} />
            {owner.location}
          </p>
        )}

        {owner.links && owner.links.length > 0 && (
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-5)' }}>
            {owner.links.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label={l.label} title={l.label}>
                <Icon name={LINK_ICON[(l.icon ?? l.label).toLowerCase()] ?? 'link'} size={17} />
              </a>
            ))}
          </div>
        )}
      </Panel>

      {/* 介绍长文 */}
      <Panel style={{ padding: 'var(--space-8) var(--space-8)', display: 'flex', flexDirection: 'column' }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: '0.24em', color: 'var(--accent)', marginBottom: 'var(--space-5)' }}>
          ABOUT · 关于
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {(owner.about?.length ? owner.about : [owner.bio]).map((para, i) => {
            // 标题行：「名称：」等以短前缀 + 冒号开头 → 前缀朱红、内容墨色
            const head = para.match(/^([^：\n]{1,8}：)([\s\S]*)$/)
            const lines = para.split('\n')
            return (
              <p key={i} className="serif" style={{ fontSize: 'var(--text-md)', lineHeight: 2, color: 'var(--ink-soft)' }}>
                {lines.map((line, j) => (
                  <span
                    key={j}
                    style={{
                      display: 'block',
                      paddingLeft: line.startsWith('［') || line.startsWith('[') ? '1.2em' : 0,
                    }}
                  >
                    {j === 0 && head ? (
                      <>
                        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{head[1]}</span>
                        <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{head[2]}</span>
                      </>
                    ) : (
                      line
                    )}
                  </span>
                ))}
              </p>
            )
          })}
        </div>
      </Panel>
      <style>{`@media (max-width: 860px) { #about .reveal { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
