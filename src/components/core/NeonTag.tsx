import type { MouseEventHandler, ReactNode } from 'react';

/* ============================================================
   霓虹标签 · 静态标签 / 可选中的筛选 chip
   ============================================================ */

interface NeonTagProps {
  children: ReactNode;
  active?: boolean;
  pink?: boolean;
  onClick?: MouseEventHandler;
}

export function NeonTag({ children, active, pink, onClick }: NeonTagProps) {
  const cls = `neon-tag ${active ? 'is-active' : ''} ${pink && !active ? 'neon-tag-pink' : ''}`;
  if (onClick) {
    return (
      <button type="button" className={cls} onClick={onClick} aria-pressed={active} style={{ cursor: 'pointer', background: 'none' }}>
        {children}
      </button>
    );
  }
  return <span className={cls}>{children}</span>;
}
