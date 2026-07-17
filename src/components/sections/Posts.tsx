import { memo, type ReactNode } from 'react'
import { Clock } from 'lucide-react'
import { Section } from '../layout/Section'
import { GlassCard } from '../glass/GlassCard'
import { formatDateShort } from '../../lib/format'
import type { Post } from '../../types/manifest'

interface PostsProps { posts: Post[] }

/**
 * 随笔列表 — 暮光紫夜
 * 垂直排列，时间轴风格左边装饰线
 */
export const Posts = memo(function Posts({ posts }: PostsProps) {
  if (!posts || posts.length === 0) {
    return (
      <Section id="posts" title="随笔" subtitle="写下的字句">
        <GlassCard padding="xl">
          <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 'var(--space-8) 0', margin: 0 }}>
            暂无随笔
          </p>
        </GlassCard>
      </Section>
    )
  }

  return (
    <Section id="posts" title="随笔" subtitle="写下的字句">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {posts.map((post) => {
          const content: ReactNode = (
            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
              <time style={{
                flexShrink: 0, width: 90,
                fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)',
                color: 'var(--text-tertiary)', paddingTop: 2,
              }}>
                {formatDateShort(post.date)}
              </time>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  fontSize: 'var(--text-md)', fontWeight: 600,
                  color: 'var(--text-primary)', marginBottom: 'var(--space-1)',
                  margin: '0 0 var(--space-1) 0', letterSpacing: '-0.01em',
                }}>
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="line-clamp-2" style={{
                    fontSize: 'var(--text-sm)', color: 'var(--text-secondary)',
                    lineHeight: 1.6, margin: '0 0 var(--space-2) 0',
                  }}>
                    {post.excerpt}
                  </p>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', alignItems: 'center' }}>
                  {post.tags?.map((t, ti) => (
                    <span key={ti} style={{
                      fontSize: 'var(--text-xs)', padding: '2px 8px', borderRadius: 'var(--radius-pill)',
                      background: 'rgba(168,85,247,0.12)', color: 'var(--accent)', fontWeight: 500,
                    }}>{t}</span>
                  ))}
                  {typeof post.readingTime === 'number' && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                      <Clock size={11} /> {post.readingTime} 分钟阅读
                    </span>
                  )}
                </div>
              </div>
            </div>
          )

          if (post.externalUrl) {
            return (
              <a key={post.id} href={post.externalUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                <GlassCard hover padding="lg">{content}</GlassCard>
              </a>
            )
          }
          return <GlassCard key={post.id} hover padding="lg">{content}</GlassCard>
        })}
      </div>
    </Section>
  )
})
