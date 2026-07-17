import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

export interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  /** 蓝色实心强调按钮 */
  primary?: boolean
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 圆角 */
  pill?: boolean
  /** 全宽 */
  block?: boolean
  /** 左侧图标 */
  iconLeft?: ReactNode
  /** 右侧图标 */
  iconRight?: ReactNode
}

const sizeClass = {
  sm: 'px-3 py-1.5 text-[13px] gap-1.5',
  md: 'px-4 py-2 text-[15px] gap-2',
  lg: 'px-6 py-3 text-[17px] gap-2.5',
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      children,
      primary = false,
      size = 'md',
      pill = true,
      block = false,
      iconLeft,
      iconRight,
      className = '',
      type = 'button',
      disabled = false,
      ...rest
    },
    ref,
  ) => {
    const classes = [
      primary ? 'glass-button-primary' : 'glass-button',
      sizeClass[size],
      pill ? '' : 'rounded-[var(--radius-md)]',
      block ? 'w-full justify-center' : 'inline-flex items-center',
      'font-medium',
      'inline-flex items-center',
      disabled ? 'opacity-50 cursor-not-allowed' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled}
        {...rest}
      >
        {iconLeft}
        <span>{children}</span>
        {iconRight}
      </button>
    )
  },
)

GlassButton.displayName = 'GlassButton'
