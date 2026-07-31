import { useEffect, useState } from 'react';
import { Icon } from '../core/Icon';

/* ============================================================
   导航栏 · 编辑风顶栏：朱红方块 logo + 细线导航 + 移动端整屏面板
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
          background: 'rgba(245, 242, 234, 0.94)',
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
              aria-hidden="true"
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: 'var(--accent)',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 19,
                fontWeight: 400,
                letterSpacing: '0.02em',
                color: 'var(--ink)',
              }}
            >
              {siteName}
            </span>
          </button>

          {/* 桌面导航 */}
          <nav className="nav-desktop" aria-label="主导航" style={{ display: 'flex', gap: 'var(--space-6)' }}>
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
                    padding: '6px 0',
                    fontSize: 'var(--text-sm)',
                    letterSpacing: '0.02em',
                    color: active ? 'var(--ink)' : 'var(--ink-soft)',
                    transition: 'color var(--duration-fast) var(--ease-out)',
                  }}
                >
                  {item.label}
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: 1.5,
                      background: 'var(--accent)',
                      transform: active ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform var(--duration-normal) var(--ease-out)',
                    }}
                  />
                </button>
              );
            })}
          </nav>

          {/* 移动端汉堡 */}
          <button
            type="button"
            className="nav-burger icon-btn"
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
            background: 'var(--paper)',
            paddingTop: 'var(--nav-height)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-3)',
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
                style={{
                  background: 'none',
                  border: 0,
                  cursor: 'pointer',
                  padding: '10px 24px',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-xl)',
                  letterSpacing: '0.04em',
                  color: active ? 'var(--accent)' : 'var(--ink)',
                  display: 'inline-flex',
                  alignItems: 'baseline',
                  gap: 'var(--space-3)',
                  animation: `navItemIn 0.4s var(--ease-out) ${i * 0.04}s both`,
                }}
              >
                <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {item.label}
              </button>
            );
          })}
          <style>{`@keyframes navItemIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }`}</style>
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
