import type { CSSProperties, ReactNode } from 'react';

/* ============================================================
   标签 · 细线小胶囊
   ============================================================ */

interface TagProps {
  children?: ReactNode;
  accent?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Tag({ children, accent, className = '', style }: TagProps) {
  return (
    <span className={`tag ${accent ? 'tag-accent' : ''} ${className}`.trim()} style={style}>
      {children}
    </span>
  );
}
