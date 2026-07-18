import { Icon } from '../core/Icon';

/* ============================================================
   页脚 · 等宽小字 + 源码链接
   ============================================================ */

interface FooterProps {
  siteName: string;
  icp?: string;
  sourceRepo: string;
}

export function Footer({ siteName, icp, sourceRepo }: FooterProps) {
  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 2,
        borderTop: '1px solid var(--line)',
        padding: `var(--space-10) var(--content-padding) calc(var(--player-height) + var(--space-10))`,
        textAlign: 'center',
      }}
    >
      <div
        className="mono"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-3)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-tertiary)',
          letterSpacing: '0.1em',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Icon name="star" size={12} style={{ color: 'var(--pink)' }} />
          © 2026 {siteName} // NEON DEEP-SPACE
          <Icon name="star" size={12} style={{ color: 'var(--pink)' }} />
        </span>
        <span>
          DESIGNED & BUILT BY {siteName.toUpperCase()} ·{' '}
          <a
            href={sourceRepo}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--cyan)', borderBottom: '1px solid var(--line-strong)' }}
          >
            SOURCE
          </a>
        </span>
        {icp && <span>{icp}</span>}
      </div>
    </footer>
  );
}
