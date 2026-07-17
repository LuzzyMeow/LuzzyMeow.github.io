import { memo } from 'react'
import { Section } from '../layout/Section'
import { GlassCard } from '../glass/GlassCard'
import { formatDateCN } from '../../lib/format'
import type { TimelineEvent } from '../../types/manifest'

type EventType = NonNullable<TimelineEvent['type']>
const typeColor: Record<EventType, string> = {
  music: 'var(--sys-pink)',
  code: 'var(--accent)',
  study: 'var(--sys-purple)',
  life: 'var(--sys-teal)',
  milestone: 'var(--sys-orange)',
  other: 'var(--text-tertiary)',
}

interface TimelineProps { events: TimelineEvent[] }

/**
 * 时间线 — 暮光紫夜
 * 左侧发光圆点 + 渐变连接线
 */
export const Timeline = memo(function Timeline({ events }: TimelineProps) {
  if (!events || events.length === 0) {
    return (
      <Section id="timeline" title="时间线" subtitle="一路走来的足迹">
        <GlassCard padding="xl">
          <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 'var(--space-8) 0', margin: 0 }}>
            暂无时间线
          </p>
        </GlassCard>
      </Section>
    )
  }

  const colWidth = 'clamp(80px, 20vw, 120px)'
  const dotSize = 'clamp(10px, 2.5vw, 14px)'

  return (
    <Section id="timeline" title="时间线" subtitle="一路走来的足迹">
      <div>
        {events.map((ev, index) => {
          const color = ev.type ? typeColor[ev.type] : 'var(--text-tertiary)'
          const isLast = index === events.length - 1
          return (
            <div key={ev.id} style={{ display: 'flex', gap: 'var(--space-4)' }}>
              {/* 左栏 */}
              <div style={{
                flexShrink: 0, width: colWidth, display: 'flex',
                flexDirection: 'column', alignItems: 'center',
              }}>
                <div style={{
                  fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-mono)', textAlign: 'center',
                  lineHeight: 1.3, marginBottom: 'var(--space-2)',
                }}>
                  {formatDateCN(ev.date)}
                </div>
                <div style={{
                  width: dotSize, height: dotSize, borderRadius: '50%',
                  background: color, border: 'none',
                  boxShadow: `0 0 8px ${color}88, 0 0 16px ${color}44`,
                  flexShrink: 0, zIndex: 1,
                }} />
                {!isLast && (
                  <div style={{
                    flex: 1, width: 2,
                    background: 'linear-gradient(to bottom, var(--glass-border-accent), var(--glass-border))',
                    marginTop: 'var(--space-1)', minHeight: 'var(--space-4)',
                  }} />
                )}
              </div>

              {/* 右栏 */}
              <div style={{ flex: 1, minWidth: 0, paddingBottom: isLast ? 0 : 'var(--space-6)' }}>
                <GlassCard padding="lg">
                  <h3 style={{
                    fontSize: 'var(--text-base)', fontWeight: 600,
                    color: 'var(--text-primary)', margin: '0 0 var(--space-1) 0',
                    letterSpacing: '-0.01em',
                  }}>
                    {ev.title}
                  </h3>
                  {ev.description && (
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                      {ev.description}
                    </p>
                  )}
                  {ev.link && (
                    <a href={ev.link.url} target="_blank" rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        fontSize: 'var(--text-xs)', color: 'var(--accent)',
                        marginTop: 'var(--space-2)', textDecoration: 'none',
                      }}>
                      {ev.link.label} ↗
                    </a>
                  )}
                </GlassCard>
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
})
