import type { Friend } from '../../types/manifest';
import { Icon } from '../core/Icon';

/* ============================================================
   友链 · 通讯阵列卡片
   ============================================================ */

export function Friends({ friends }: { friends?: Friend[] }) {
  if (!friends || friends.length === 0) return null;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 'var(--space-4)',
      }}
    >
      {friends.map((f) => (
        <a
          key={f.id}
          href={f.url}
          target="_blank"
          rel="noopener noreferrer"
          className="neon-frame reveal"
          style={{ display: 'block' }}
        >
          <div className="neon-frame-body neon-scan" style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {/* 头像 */}
            <span
              style={{
                width: 44,
                height: 44,
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--line-strong)',
                background: 'rgba(0,229,255,0.08)',
                color: 'var(--cyan)',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'var(--text-md)',
                overflow: 'hidden',
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
              }}
            >
              {f.avatar ? (
                <img src={f.avatar} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                f.name.charAt(0).toUpperCase()
              )}
            </span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p className="truncate" style={{ fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--text-primary)' }}>{f.name}</p>
              {f.description && (
                <p className="truncate" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>{f.description}</p>
              )}
            </div>
            <Icon name="link" size={15} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          </div>
        </a>
      ))}
    </div>
  );
}
