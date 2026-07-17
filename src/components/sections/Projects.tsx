import { memo } from 'react'
import { Github, ExternalLink, Link2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Section } from '../layout/Section'
import { GlassCard } from '../glass/GlassCard'
import { GlassButton } from '../glass/GlassButton'
import { formatDateShort } from '../../lib/format'
import type { Project } from '../../types/manifest'

const ICON_MAP: Record<string, LucideIcon> = { Github, ExternalLink, Link: Link2, Link2 }

function iconMap(name?: string): LucideIcon {
  if (!name) return Link2
  return ICON_MAP[name] ?? Link2
}

type StatusKey = NonNullable<Project['status']>
const statusConfig: Record<StatusKey, { label: string; color: string; bg: string }> = {
  ongoing: { label: '进行中', color: 'var(--sys-teal)', bg: 'rgba(6,182,212,0.12)' },
  completed: { label: '已完成', color: 'var(--accent)', bg: 'rgba(168,85,247,0.12)' },
  archived: { label: '已归档', color: 'var(--text-tertiary)', bg: 'rgba(96,96,120,0.12)' },
}

interface ProjectsProps { projects: Project[] }

/**
 * 项目展示 — 暮光紫夜
 * 卡片带渐变边框光晕 hover 效果
 */
export const Projects = memo(function Projects({ projects }: ProjectsProps) {
  if (!projects || projects.length === 0) {
    return (
      <Section id="projects" title="项目" subtitle="我做过的一些东西">
        <GlassCard padding="xl">
          <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 'var(--space-8) 0', margin: 0 }}>
            暂无项目
          </p>
        </GlassCard>
      </Section>
    )
  }

  const sorted = [...projects].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))

  return (
    <Section id="projects" title="项目" subtitle="我做过的一些东西">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: 'var(--space-5)',
      }}>
        {sorted.map((p) => {
          const status = p.status ? statusConfig[p.status] : null
          const dateRange = [p.startDate, p.endDate].filter(Boolean).map((d) => formatDateShort(d as string)).join(' — ')
          return (
            <GlassCard key={p.id} hover padding="none" style={{ display: 'flex', flexDirection: 'column' }}>
              {/* 封面 */}
              <div style={{
                width: '100%', height: 160, position: 'relative',
                background: p.cover
                  ? `url(${p.cover}) center/cover`
                  : 'linear-gradient(135deg, var(--accent), var(--sys-pink), var(--sys-teal))',
              }}>
                {p.featured && (
                  <span style={{
                    position: 'absolute', top: 'var(--space-3)', left: 'var(--space-3)',
                    padding: '4px 12px', borderRadius: 'var(--radius-pill)',
                    fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-inverse)',
                    background: 'linear-gradient(135deg, var(--accent), var(--sys-pink))',
                    boxShadow: '0 2px 12px rgba(168,85,247,0.5)',
                  }}>★ 置顶</span>
                )}
                {status && (
                  <span style={{
                    position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)',
                    padding: '4px 10px', borderRadius: 'var(--radius-pill)',
                    fontSize: 'var(--text-xs)', fontWeight: 600,
                    color: status.color, background: status.bg,
                    backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                  }}>{status.label}</span>
                )}
              </div>

              {/* 内容 */}
              <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1 }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em', margin: 0 }}>
                  {p.title}
                </h3>
                <p className="line-clamp-2" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {p.description}
                </p>
                {p.tags && p.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    {p.tags.map((t, ti) => (
                      <span key={ti} style={{
                        fontSize: 'var(--text-xs)', padding: '2px 10px', borderRadius: 'var(--radius-pill)',
                        background: 'rgba(168,85,247,0.12)', color: 'var(--accent)', fontWeight: 500,
                      }}>{t}</span>
                    ))}
                  </div>
                )}
                {dateRange && (
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                    {dateRange}
                  </div>
                )}
                {p.links && p.links.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'auto', paddingTop: 'var(--space-2)' }}>
                    {p.links.map((l, li) => {
                      const Icon = iconMap(l.icon)
                      return (
                        <GlassButton key={li} size="sm" iconLeft={<Icon size={13} />}
                          onClick={() => window.open(l.url, '_blank', 'noopener,noreferrer')}>
                          {l.label}
                        </GlassButton>
                      )
                    })}
                  </div>
                )}
              </div>
            </GlassCard>
          )
        })}
      </div>
    </Section>
  )
})
