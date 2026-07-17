import { memo } from 'react'
import { GlassButton } from '../glass/GlassButton'
import type { Owner } from '../../types/manifest'

interface HeroProps {
  owner: Owner
  trackCount: number
  albumCount: number
  onBrowse?: () => void
  onLatest?: () => void
}

/**
 * Hero 区域 - 暮光紫夜
 * 大标题 + 头像（带发光环）+ 数据 + CTA
 */
export const Hero = memo(function Hero({
  owner,
  trackCount,
  albumCount,
  onBrowse,
  onLatest,
}: HeroProps) {
  return (
    <section
      style={{
        paddingTop: 'calc(var(--header-height) + var(--space-16))',
        paddingBottom: 'var(--space-20)',
        maxWidth: 'var(--content-max-width)',
        margin: '0 auto',
        paddingInline: 'var(--content-padding)',
      }}
    >
      <div
        className="glass glass-strong animate-fade-in-up"
        style={{
          padding: 'var(--space-16) var(--space-12)',
          textAlign: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* 头像 — 带发光环 */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {/* 外发光环 */}
          <div
            style={{
              position: 'absolute',
              inset: -6,
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, var(--accent), var(--sys-pink), var(--sys-teal), var(--accent))',
              opacity: 0.6,
              filter: 'blur(2px)',
              animation: 'spin 8s linear infinite',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div
            style={{
              position: 'relative',
              width: 128,
              height: 128,
              margin: '0 auto',
              borderRadius: '50%',
              background: owner.avatar
                ? `url(${owner.avatar}) center/cover`
                : 'linear-gradient(135deg, var(--accent), var(--sys-pink), var(--sys-teal))',
              border: '3px solid rgba(255, 255, 255, 0.15)',
              boxShadow:
                '0 0 40px rgba(168, 85, 247, 0.4), 0 0 80px rgba(168, 85, 247, 0.15), inset 0 2px 0 rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: '-0.04em',
            }}
          >
            {!owner.avatar && owner.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* 名字 */}
        <h1
          style={{
            fontSize: 'clamp(36px, 6vw, var(--text-4xl))',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            marginTop: 'var(--space-8)',
            marginBottom: 'var(--space-3)',
            color: 'var(--text-primary)',
            background: 'linear-gradient(135deg, var(--accent-hover), var(--sys-teal))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {owner.name}
        </h1>

        {/* 简介 */}
        {owner.bio && (
          <p
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--text-secondary)',
              maxWidth: 540,
              margin: '0 auto var(--space-8)',
              fontWeight: 400,
            }}
          >
            {owner.bio}
          </p>
        )}

        {/* 数据 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-16)',
            marginBottom: 'var(--space-10)',
          }}
        >
          <Stat label="曲目" value={trackCount} />
          <Stat label="专辑" value={albumCount} />
          <Stat label="更新" value="持续中" />
        </div>

        {/* CTA */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-4)',
            flexWrap: 'wrap',
          }}
        >
          <GlassButton primary size="lg" onClick={onLatest}>
            最新作品
          </GlassButton>
          <GlassButton size="lg" onClick={onBrowse}>
            全部曲目
          </GlassButton>
        </div>

        {/* 外链 */}
        {owner.links && owner.links.length > 0 && (
          <div
            style={{
              marginTop: 'var(--space-8)',
              display: 'flex',
              justifyContent: 'center',
              gap: 'var(--space-4)',
              flexWrap: 'wrap',
            }}
          >
            {owner.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(168, 85, 247, 0.08)',
                  transition: 'all var(--duration-fast) var(--ease-out)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--glass-border-accent)'
                  e.currentTarget.style.color = 'var(--text-primary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--glass-border)'
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
})

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div
        className="tabular"
        style={{
          fontSize: 'var(--text-3xl)',
          fontWeight: 800,
          color: 'var(--accent)',
          letterSpacing: '-0.02em',
          textShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  )
}
