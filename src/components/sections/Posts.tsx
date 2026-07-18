import type { Post } from '../../types/manifest';
import { formatDateShort, formatRelative } from '../../lib/format';
import { Icon } from '../core/Icon';
import { NeonTag } from '../core/NeonTag';

/* ============================================================
   随笔 · 数据行列表
   ============================================================ */

export function Posts({ posts }: { posts?: Post[] }) {
  if (!posts || posts.length === 0) return null;
  return (
    <div className="reveal neon-frame">
      <div className="neon-frame-body" style={{ padding: 0 }}>
        {posts.map((post, i) => {
          const inner = (
            <>
              <span className="mono posts-date" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', width: 92, flexShrink: 0 }}>
                {formatDateShort(post.date)}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)', fontWeight: 500 }}>{post.title}</p>
                {post.excerpt && (
                  <p className="line-clamp-2" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>{post.excerpt}</p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  {post.tags?.map((t) => <NeonTag key={t}>{t}</NeonTag>)}
                  {post.readingTime && (
                    <span className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                      <Icon name="clock" size={11} /> {post.readingTime}min
                    </span>
                  )}
                  <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{formatRelative(post.date)}</span>
                </div>
              </div>
              {post.externalUrl && <Icon name="external" size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />}
            </>
          );
          const rowStyle: React.CSSProperties = {
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-4)',
            padding: 'var(--space-5)',
            borderBottom: i < posts.length - 1 ? '1px solid rgba(0,229,255,0.06)' : 'none',
            transition: 'background var(--duration-fast) var(--ease-neon)',
          };
          return post.externalUrl ? (
            <a
              key={post.id}
              href={post.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={rowStyle}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,229,255,0.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {inner}
            </a>
          ) : (
            <div key={post.id} style={rowStyle}>
              {inner}
            </div>
          );
        })}
      </div>
      <style>{`@media (max-width: 640px) { .posts-date { display: none !important; } }`}</style>
    </div>
  );
}
