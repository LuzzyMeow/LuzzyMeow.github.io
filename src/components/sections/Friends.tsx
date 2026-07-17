import { memo } from 'react'
import { Section } from '../layout/Section'
import { GlassCard } from '../glass/GlassCard'
import type { Friend } from '../../types/manifest'

interface FriendsProps { friends: Friend[] }

/**
 * 友链 — 暮光紫夜
 * 网格 + 渐边 hover 发光
 */
export const Friends = memo(function Friends({ friends }: FriendsProps) {
  if (!friends || friends.length === 0) {
    return (
      <Section id="friends" title="友链" subtitle="朋友们">
        <GlassCard padding="xl">
          <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 'var(--space-8) 0', margin: 0 }}>
            暂无友链，欢迎与我交换
          </p>
        </GlassCard>
      </Section>
    )
  }

  return (
    <Section id="friends" title="友链" subtitle="朋友们">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 'var(--space-4)',
      }}>
        {friends.map((f) => (
          <a key={f.id} href={f.url} target="_blank" rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'inherit' }}>
            <GlassCard hover padding="md" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{
                flexShrink: 0, width: 48, height: 48, borderRadius: '50%',
                background: f.avatar
                  ? `url(${f.avatar}) center/cover`
                  : 'linear-gradient(135deg, var(--accent), var(--sys-pink))',
                border: '2px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.9)', fontSize: 20, fontWeight: 700,
              }}>
                {!f.avatar && f.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                  {f.name}
                </div>
                {f.description && (
                  <div className="truncate" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                    {f.description}
                  </div>
                )}
              </div>
            </GlassCard>
          </a>
        ))}
      </div>
    </Section>
  )
})
