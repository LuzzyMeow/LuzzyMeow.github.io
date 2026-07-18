import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

/* ============================================================
   霓虹按钮 · primary（实心青）/ ghost（描边）/ pink（品红幽灵）
   ============================================================ */

interface NeonButtonProps {
  children?: ReactNode;
  variant?: 'primary' | 'ghost' | 'pink';
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

export function NeonButton({
  children,
  variant = 'ghost',
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
}: NeonButtonProps) {
  const cls = [
    'neon-btn',
    variant === 'primary' ? 'neon-btn-primary' : '',
    variant === 'pink' ? 'neon-btn-pink' : '',
    size === 'sm' ? 'neon-btn-sm' : '',
    size === 'lg' ? 'neon-btn-lg' : '',
    block ? 'neon-btn-block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {icon && <Icon name={icon} size={size === 'sm' ? 15 : size === 'lg' ? 19 : 17} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'sm' ? 15 : size === 'lg' ? 19 : 17} />}
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
