import type { CSSProperties, ReactNode } from 'react';

/* ============================================================
   霓虹切角面板 · frame（渐变描边）+ body（暗色玻璃）
   ============================================================ */

interface NeonPanelProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  scan?: boolean;
}

export function NeonPanel({ children, className = '', style, scan = false }: NeonPanelProps) {
  return (
    <div className={`neon-frame ${className}`} style={style}>
      <div className={`neon-frame-body ${scan ? 'neon-scan' : ''}`} style={{ padding: 'var(--space-6)' }}>
        {children}
      </div>
    </div>
  );
}
