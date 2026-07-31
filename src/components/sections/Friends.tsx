import type { Friend } from '../../types/manifest';
import { Icon } from '../core/Icon';

/* ============================================================
   友链 · 卡片阵列
   ============================================================ */

export function Friends({ friends }: { friends?: Friend[] }) {
  if (!friends || friends.length === 0) return null;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
        gap: 'var(--space-4)',
      }}
    >
      {friends.map((f) => (
        <a
          key={f.id}
          href={f.url}
          target="_blank"
          rel="noopener noreferrer"
          className="card card-hover reveal"
          style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}
        >
          {/* 头像 */}
          <span
            style={{
              width: 44,
              height: 44,
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              border: '1px solid var(--line-strong)',
              background: 'var(--paper-deep)',
              color: 'var(--ink-soft)',
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 'var(--text-md)',
              overflow: 'hidden',
            }}
          >
            {f.avatar ? (
              <img src={f.avatar} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              f.name.charAt(0).toUpperCase()
            )}
          </span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p className="truncate" style={{ fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--ink)' }}>
              {f.name}
            </p>
            {f.description && (
              <p className="truncate" style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-faint)', marginTop: 2 }}>
                {f.description}
              </p>
            )}
          </div>
          <Icon name="arrowUpRight" size={14} style={{ color: 'var(--ink-faint)', flexShrink: 0 }} />
        </a>
      ))}
    </div>
  );
}
