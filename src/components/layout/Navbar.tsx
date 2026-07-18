import { useEffect, useState } from 'react';
import { Icon } from '../core/Icon';

/* ============================================================
   导航栏 · 固定顶栏 + 激活霓虹下划线 + 移动端面板
   ============================================================ */

export interface NavItem {
  key: string;
  label: string;
}

interface NavbarProps {
  siteName: string;
  items: NavItem[];
  activeKey: string;
  onNavigate: (key: string) => void;
}

export function Navbar({ siteName, items, activeKey, onNavigate }: NavbarProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 'var(--nav-height)',
          background: 'rgba(5, 6, 15, 0.72)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--content-max-width)',
            margin: '0 auto',
            height: '100%',
            padding: '0 var(--content-padding)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
          }}
        >
          {/* Logo */}
          <button
            type="button"
            onClick={() => onNavigate('hero')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              background: 'none',
              border: 0,
              cursor: 'pointer',
              padding: 0,
            }}
            aria-label="回到顶部"
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                color: 'var(--cyan)',
                border: '1px solid var(--line-strong)',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(0,229,255,0.08)',
                boxShadow: 'var(--glow-cyan)',
                clipPath: 'polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))',
              }}
            >
              <Icon name="music" size={17} />
            </span>
            <span
              className="neon-flicker"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 17,
                letterSpacing: '0.08em',
                color: 'var(--text-primary)',
                textShadow: '0 0 18px rgba(0,229,255,0.35)',
              }}
            >
              {siteName}
            </span>
          </button>

          {/* 桌面导航 */}
          <nav className="nav-desktop" aria-label="主导航" style={{ display: 'flex', gap: 2 }}>
            {items.map((item) => {
              const active = item.key === activeKey;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onNavigate(item.key)}
                  aria-current={active ? 'true' : undefined}
                  style={{
                    position: 'relative',
                    background: 'none',
                    border: 0,
                    cursor: 'pointer',
                    padding: '8px 12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-sm)',
                    letterSpacing: '0.08em',
                    color: active ? 'var(--cyan)' : 'var(--text-secondary)',
                    textShadow: active ? 'var(--glow-text-cyan)' : 'none',
                    transition: 'color var(--duration-fast) var(--ease-neon)',
                  }}
                >
                  {item.label}
                  <span
                    style={{
                      position: 'absolute',
                      left: 12,
                      right: 12,
                      bottom: 2,
                      height: 2,
                      background: 'var(--grad-neon)',
                      boxShadow: active ? '0 0 8px rgba(0,229,255,0.8)' : 'none',
                      transform: active ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform var(--duration-normal) var(--ease-neon)',
                    }}
                  />
                </button>
              );
            })}
          </nav>

          {/* 移动端汉堡 */}
          <button
            type="button"
            className="nav-burger neon-icon-btn"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? '关闭菜单' : '打开菜单'}
            aria-expanded={open}
            style={{ display: 'none' }}
          >
            <Icon name={open ? 'x' : 'menu'} size={20} />
          </button>
        </div>
      </header>

      {/* 移动端导航面板 */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 95,
            background: 'rgba(5, 6, 15, 0.94)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            paddingTop: 'var(--nav-height)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-2)',
          }}
        >
          {items.map((item, i) => {
            const active = item.key === activeKey;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  onNavigate(item.key);
                  setOpen(false);
                }}
                className="mono"
                style={{
                  background: 'none',
                  border: 0,
                  cursor: 'pointer',
                  padding: '14px 24px',
                  fontSize: 'var(--text-lg)',
                  letterSpacing: '0.15em',
                  color: active ? 'var(--cyan)' : 'var(--text-secondary)',
                  textShadow: active ? 'var(--glow-text-cyan)' : 'none',
                  animation: `navItemIn 0.4s var(--ease-neon) ${i * 0.05}s both`,
                }}
              >
                <span style={{ color: 'var(--pink)', marginRight: 10, fontSize: 'var(--text-sm)' }}>
                  {String(i).padStart(2, '0')}
                </span>
                {item.label}
              </button>
            );
          })}
          <style>{`@keyframes navItemIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }`}</style>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .nav-desktop { display: none !important; }
          .nav-burger { display: inline-flex !important; }
        }
      `}</style>
    </>
  );
}
