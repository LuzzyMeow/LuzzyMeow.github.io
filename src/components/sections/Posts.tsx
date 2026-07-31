import type { Post } from '../../types/manifest';
import { formatDateShort, formatRelative } from '../../lib/format';
import { Icon } from '../core/Icon';
import { Tag } from '../core/Tag';

/* ============================================================
   随笔 · 文章列表
   ============================================================ */

export function Posts({ posts }: { posts?: Post[] }) {
  if (!posts || posts.length === 0) return null;
  return (
    <div className="reveal card" style={{ overflow: 'hidden' }}>
      {posts.map((post, i) => {
        const inner = (
          <>
            <span className="mono posts-date" style={{ fontSize: 11, color: 'var(--ink-faint)', width: 88, flexShrink: 0 }}>
              {formatDateShort(post.date)}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="serif" style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--ink)' }}>
                {post.title}
              </p>
              {post.excerpt && (
                <p className="line-clamp-2" style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', marginTop: 4 }}>
                  {post.excerpt}
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-2)', flexWrap: 'wrap' }}>
                {post.tags?.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
                {post.readingTime && (
                  <span className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--ink-faint)' }}>
                    <Icon name="clock" size={11} /> {post.readingTime}min
                  </span>
                )}
                <span className="mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{formatRelative(post.date)}</span>
              </div>
            </div>
            {post.externalUrl && (
              <Icon name="arrowUpRight" size={15} style={{ color: 'var(--ink-faint)', flexShrink: 0 }} />
            )}
          </>
        );
        const rowStyle: React.CSSProperties = {
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--space-5)',
          padding: 'var(--space-5) var(--space-6)',
          borderBottom: i < posts.length - 1 ? '1px solid var(--line)' : 'none',
          transition: 'background var(--duration-fast) var(--ease-out)',
        };
        return post.externalUrl ? (
          <a
            key={post.id}
            href={post.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={rowStyle}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--paper-deep)')}
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
      <style>{`@media (max-width: 640px) { .posts-date { display: none !important; } }`}</style>
    </div>
  );
}
