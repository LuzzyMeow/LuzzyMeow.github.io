import { memo } from 'react'
import { Github, Youtube, Twitter, Mail, Link2, MapPin } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Section } from '../layout/Section'
import { GlassCard } from '../glass/GlassCard'
import type { Owner } from '../../types/manifest'

const ICON_MAP: Record<string, LucideIcon> = {
  Github, Youtube, Twitter, Mail, Link: Link2, Link2,
}

function iconMap(name?: string): LucideIcon {
  if (!name) return Link2
  return ICON_MAP[name] ?? Link2
}

interface AboutProps { owner: Owner }

/**
 * 关于我 — 暮光紫夜
 * 左侧大头像带渐变光晕 + 右侧多段介绍
 */
export const About = memo(function About({ owner }: AboutProps) {
  return (
    <Section id="about" title="关于我" subtitle="一些关于我的介绍">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)',
          alignItems: 'start',
        }}
      >
        {/* 左栏：头像 + 基本信息 */}
        <GlassCard padding="xl" style={{ textAlign: 'center' }}>
          {/* 发光环头像 */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 'var(--space-5)' }}>
            <div
              style={{
                position: 'absolute',
                inset: -4,
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, var(--accent), var(--sys-pink), var(--sys-teal), var(--accent))',
                opacity: 0.5,
                filter: 'blur(4px)',
                animation: 'heroSpin 8s linear infinite',
              }}
            />
            <div
              style={{
                position: 'relative',
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: owner.avatar
                  ? `url(${owner.avatar}) center/cover`
                  : 'linear-gradient(135deg, var(--accent), var(--sys-pink), var(--sys-teal))',
                border: '3px solid rgba(255,255,255,0.15)',
                boxShadow: '0 0 30px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.9)',
                fontSize: 44,
                fontWeight: 700,
                letterSpacing: '-0.04em',
              }}
            >
              {!owner.avatar && owner.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <h3 style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-2)',
            letterSpacing: '-0.01em',
          }}>
            {owner.name}
          </h3>

          {owner.bio && (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
              {owner.bio}
            </p>
          )}

          {owner.location && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)',
            }}>
              <MapPin size={12} /> {owner.location}
            </div>
          )}

          {owner.links && owner.links.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {owner.links.map((link, i) => {
                const Icon = iconMap(link.icon)
                return (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" title={link.label}
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.04)', border: '1px solid var(--glass-border)',
                      color: 'var(--text-secondary)',
                      transition: 'all var(--duration-fast) var(--ease-out)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--glass-border-accent)'
                      e.currentTarget.style.color = 'var(--accent)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--glass-border)'
                      e.currentTarget.style.color = 'var(--text-secondary)'
                    }}
                  >
                    <Icon size={16} />
                  </a>
                )
              })}
            </div>
          )}
        </GlassCard>

        {/* 右栏：长介绍 */}
        <GlassCard padding="xl">
          {owner.about && owner.about.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {owner.about.map((p, i) => (
                <p key={i} style={{
                  fontSize: 'var(--text-base)', lineHeight: 1.75,
                  color: 'var(--text-primary)', margin: 0,
                }}>
                  {p}
                </p>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 'var(--space-8) 0', margin: 0 }}>
              暂无介绍
            </p>
          )}
        </GlassCard>
      </div>
      <style>{`@keyframes heroSpin { to { transform: rotate(360deg); } }`}</style>
    </Section>
  )
})
