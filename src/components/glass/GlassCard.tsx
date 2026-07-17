import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

/**
 * 液态玻璃卡片容器
 * 内置 .glass 类：背景模糊 + 镜面高光 + 边缘折射
 */
export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** 强玻璃：更不透明、更强模糊 */
  strong?: boolean
  /** 弱玻璃：更透 */
  subtle?: boolean
  /** 悬浮交互：上抬 + 加亮 + 强阴影 */
  hover?: boolean
  /** 圆角尺寸 */
  radius?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  /** 内边距 */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

const radiusClass = {
  sm: 'glass-radius-sm',
  md: 'glass-radius-md',
  lg: 'glass-radius-lg',
  xl: 'glass-radius-xl',
  '2xl': 'glass-radius-2xl',
}

const paddingClass = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      strong = false,
      subtle = false,
      hover = false,
      radius = 'lg',
      padding = 'lg',
      className = '',
      ...rest
    },
    ref,
  ) => {
    const classes = [
      'glass',
      strong && 'glass-strong',
      subtle && 'glass-subtle',
      hover && 'glass-hover',
      radiusClass[radius],
      paddingClass[padding],
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div ref={ref} className={classes} {...rest}>
        {children}
      </div>
    )
  },
)

GlassCard.displayName = 'GlassCard'
