import type { CSSProperties, ReactNode } from 'react';

/* ============================================================
   面板 · 纸面卡片
   ============================================================ */

interface PanelProps {
  children?: ReactNode;
  hover?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Panel({ children, hover, className = '', style }: PanelProps) {
  return (
    <div className={`card ${hover ? 'card-hover' : ''} ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
