import { memo } from 'react'
import { Section } from '../layout/Section'
import { GlassCard } from '../glass/GlassCard'
import type { SkillGroup } from '../../types/manifest'

interface SkillsProps { skills: SkillGroup[] }

/**
 * 技能与兴趣 — 暮光紫夜
 * 标签云风格 + 紫蓝渐变进度条
 */
export const Skills = memo(function Skills({ skills }: SkillsProps) {
  if (!skills || skills.length === 0) {
    return (
      <Section id="skills" title="技能与兴趣" subtitle="我会的和我爱的">
        <GlassCard padding="xl">
          <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 'var(--space-8) 0', margin: 0 }}>
            暂无技能数据
          </p>
        </GlassCard>
      </Section>
    )
  }

  return (
    <Section id="skills" title="技能与兴趣" subtitle="我会的和我爱的">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--space-5)',
      }}>
        {skills.map((group, gi) => (
          <GlassCard key={gi} padding="lg">
            <h3 style={{
              fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-primary)',
              marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)',
              borderBottom: '1px solid var(--glass-border)',
              letterSpacing: '-0.01em',
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--sys-pink))',
                flexShrink: 0,
              }} />
              {group.category}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {group.items.map((item, ii) => {
                const hasLevel = typeof item.level === 'number'
                const level = hasLevel ? Math.max(0, Math.min(100, item.level as number)) : 0
                return (
                  <div key={ii}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      marginBottom: hasLevel ? 'var(--space-2)' : 0,
                    }}>
                      <span style={{
                        fontSize: 'var(--text-sm)', fontWeight: 500,
                        color: item.isHobby ? 'var(--sys-pink)' : 'var(--text-primary)',
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                      }}>
                        {item.isHobby && <span aria-hidden="true" style={{ fontSize: '0.85em' }}>⭐</span>}
                        {item.name}
                      </span>
                      {hasLevel && (
                        <span className="tabular" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                          {level}
                        </span>
                      )}
                    </div>
                    {hasLevel && (
                      <div style={{
                        height: 6, borderRadius: 'var(--radius-pill)',
                        background: 'rgba(168,85,247,0.1)', overflow: 'hidden',
                        border: '1px solid rgba(168,85,247,0.15)',
                      }}>
                        <div style={{
                          width: `${level}%`, height: '100%', borderRadius: 'var(--radius-pill)',
                          background: item.isHobby
                            ? 'linear-gradient(90deg, var(--sys-pink), var(--accent))'
                            : 'linear-gradient(90deg, var(--accent), var(--sys-teal))',
                          boxShadow: '0 0 8px rgba(168,85,247,0.4)',
                          transition: 'width var(--duration-slow) var(--ease-out)',
                        }} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </GlassCard>
        ))}
      </div>
    </Section>
  )
})
