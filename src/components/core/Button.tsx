import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

/* ============================================================
   按钮 · accent（朱红实心）/ outline（描边）/ dark（墨黑）/ ghost（无框）
   ============================================================ */

interface ButtonProps {
  children?: ReactNode;
  variant?: 'accent' | 'outline' | 'dark' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconName;
  iconRight?: IconName;
  block?: boolean;
  href?: string;
  external?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}

export function Button({
  children,
  variant = 'outline',
  size = 'md',
  icon,
  iconRight,
  block,
  href,
  external,
  disabled,
  onClick,
  className = '',
  style,
  ariaLabel,
}: ButtonProps) {
  const cls = [
    'btn',
    variant === 'accent' ? 'btn-accent' : '',
    variant === 'dark' ? 'btn-dark' : '',
    size === 'sm' ? 'btn-sm' : '',
    size === 'lg' ? 'btn-lg' : '',
    block ? 'btn-block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={cls}
        style={style}
        aria-label={ariaLabel}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={cls} style={style} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {content}
    </button>
  );
}
