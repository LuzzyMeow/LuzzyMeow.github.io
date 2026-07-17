import { memo } from 'react'
import { Github, Heart } from 'lucide-react'

interface FooterProps {
  ownerName: string
  repoUrl?: string
}

/**
 * 底部页脚 — 暮光紫夜
 */
export const Footer = memo(function Footer({
  ownerName,
  repoUrl = 'https://github.com/LuzzyMeow/LuzzyMeow.github.io',
}: FooterProps) {
  const year = new Date().getFullYear()
  return (
    <footer
      style={{
        marginTop: 'var(--space-20)',
        marginBottom: 'calc(var(--player-height) + var(--space-8))',
        padding: 'var(--space-8) var(--content-padding)',
        textAlign: 'center',
      }}
    >
      <div
        className="glass"
        style={{
          padding: 'var(--space-8)',
          maxWidth: 'var(--content-max-width)',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-3)',
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-sm)',
          }}
        >
          <span>© {year} {ownerName}</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>Powered by GitHub Pages</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-4)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-tertiary)',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            Built with <Heart size={11} fill="currentColor" style={{ color: 'var(--sys-pink)' }} /> Liquid Glass
          </span>
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              color: 'var(--text-tertiary)',
            }}
          >
            <Github size={12} /> Source
          </a>
        </div>
      </div>
    </footer>
  )
})
