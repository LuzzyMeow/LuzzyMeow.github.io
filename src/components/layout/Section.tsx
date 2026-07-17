import { memo, type ReactNode } from 'react'

interface SectionProps {
  id: string
  title: string
  subtitle?: ReactNode
  children: ReactNode
  marginTop?: string
  hideHeader?: boolean
}

/**
 * 通用 Section 容器 - 暮光紫夜
 */
export const Section = memo(function Section({
  id,
  title,
  subtitle,
  children,
  marginTop = 'var(--space-16)',
  hideHeader = false,
}: SectionProps) {
  return (
    <section
      id={`section-${id}`}
      style={{
        maxWidth: 'var(--content-max-width)',
        margin: `${marginTop} auto`,
        paddingInline: 'var(--content-padding)',
        scrollMarginTop: 'calc(var(--header-height) + var(--space-4))',
      }}
    >
      {!hideHeader && (
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h2
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              position: 'relative',
              display: 'inline-block',
            }}
          >
            {/* 左侧紫色竖线装饰 */}
            <span
              style={{
                display: 'inline-block',
                width: 4,
                height: '1em',
                borderRadius: 'var(--radius-pill)',
                background: 'linear-gradient(180deg, var(--accent), var(--sys-pink))',
                marginRight: 'var(--space-3)',
                verticalAlign: 'middle',
                position: 'relative',
                top: -1,
              }}
            />
            {title}
          </h2>
          {subtitle && (
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-tertiary)',
                marginTop: 'var(--space-2)',
                marginLeft: 'calc(4px + var(--space-3))',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  )
})
