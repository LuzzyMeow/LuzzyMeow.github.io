import { memo, useState } from 'react'
import { Mail, MessageCircle, Send, MessageSquare, Github, Youtube, Twitter, Link2, Copy, Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Section } from '../layout/Section'
import { GlassCard } from '../glass/GlassCard'
import type { Owner } from '../../types/manifest'

const LINK_ICON_MAP: Record<string, LucideIcon> = {
  Github, Youtube, Twitter, Mail, MessageCircle, Send, MessageSquare,
  Link: Link2, Link2,
}

function linkIconMap(name?: string): LucideIcon {
  if (!name) return Link2
  return LINK_ICON_MAP[name] ?? Link2
}

interface ContactRow {
  icon: LucideIcon; label: string; value: string; href?: string; copyable?: boolean
}

interface ContactProps { owner: Owner }

/**
 * 联系我 — 暮光紫夜
 */
export const Contact = memo(function Contact({ owner }: ContactProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 1500)
    }).catch(() => {})
  }

  const rows: ContactRow[] = []
  const c = owner.contact
  if (c?.email) rows.push({ icon: Mail, label: '邮箱', value: c.email, href: `mailto:${c.email}` })
  if (c?.wechat) rows.push({ icon: MessageCircle, label: '微信', value: c.wechat, copyable: true })
  if (c?.qq) rows.push({ icon: MessageCircle, label: 'QQ', value: c.qq, copyable: true })
  if (c?.telegram) rows.push({ icon: Send, label: 'Telegram', value: c.telegram, href: `https://t.me/${c.telegram}` })
  if (c?.discord) rows.push({ icon: MessageSquare, label: 'Discord', value: c.discord, copyable: true })
  if (c?.others) c.others.forEach((o) => rows.push({ icon: linkIconMap(o.icon), label: o.label, value: o.url, href: o.url }))
  if (owner.links) owner.links.forEach((l) => rows.push({ icon: linkIconMap(l.icon), label: l.label, value: l.url, href: l.url }))

  return (
    <Section id="contact" title="联系我" subtitle="找我聊聊">
      <GlassCard padding="xl" style={{ maxWidth: 600, margin: '0 auto' }}>
        {rows.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 'var(--space-4) 0', margin: 0 }}>
            暂无联系方式
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {rows.map((row, i) => {
              const Icon = row.icon
              const key = `${row.label}-${i}`
              const isCopied = copiedKey === key
              return (
                <div key={key} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0,0,0,0.03)',
                  border: '1px solid var(--glass-border)',
                }}>
                  <div style={{
                    flexShrink: 0, width: 40, height: 40, borderRadius: '50%',
                    background: 'var(--accent-soft)', color: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 2 }}>
                      {row.label}
                    </div>
                    {row.href ? (
                      <a href={row.href} target={row.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                        style={{ fontSize: 'var(--text-sm)', color: 'var(--accent)', textDecoration: 'none', wordBreak: 'break-all' }}>
                        {row.value}
                      </a>
                    ) : (
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                        {row.value}
                      </span>
                    )}
                  </div>
                  {row.copyable && (
                    <button type="button" onClick={() => handleCopy(key, row.value)} aria-label={`复制${row.label}`}
                      style={{
                        flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '4px 10px', fontSize: 'var(--text-xs)', borderRadius: 'var(--radius-pill)',
                        border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.04)',
                        color: isCopied ? 'var(--sys-teal)' : 'var(--text-secondary)',
                        cursor: 'pointer', transition: 'all var(--duration-fast) var(--ease-out)',
                        fontFamily: 'var(--font-sans)',
                      }}>
                      {isCopied ? <Check size={12} /> : <Copy size={12} />}
                      {isCopied ? '已复制' : '复制'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <p style={{
          textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)',
          marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)',
          borderTop: '1px solid var(--glass-border)',
          margin: 'var(--space-5) 0 0 0',
        }}>
          期待与你交流
        </p>
      </GlassCard>
    </Section>
  )
})
