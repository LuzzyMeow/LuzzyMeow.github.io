/* ============================================================
   页脚 · 墨黑反白极简
   ============================================================ */

interface FooterProps {
  siteName: string;
  icp?: string;
  sourceRepo: string;
}

export function Footer({ siteName, icp, sourceRepo }: FooterProps) {
  return (
    <footer
      className="zone-night"
      style={{
        position: 'relative',
        zIndex: 2,
        background: 'var(--night)',
        borderTop: '1px solid var(--night-line)',
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
          gap: 'var(--space-2)',
          fontSize: 'var(--text-xs)',
          color: 'var(--night-soft)',
          letterSpacing: '0.08em',
        }}
      >
        <span aria-hidden="true" style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, color: 'var(--accent-night)', lineHeight: 1 }}>
          ♪
        </span>
        <span>© 2026 {siteName} · 翻唱 / 原创 / 代码</span>
        <span>
          DESIGNED & BUILT BY {siteName.toUpperCase()} ·{' '}
          <a
            href={sourceRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
            style={{ fontSize: 'var(--text-xs)' }}
          >
            SOURCE
          </a>
        </span>
        {icp && <span style={{ color: 'var(--night-faint)' }}>{icp}</span>}
      </div>
    </footer>
  );
}
