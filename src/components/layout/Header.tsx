import { memo, useState, useEffect } from 'react'
import { Music2, Menu, X } from 'lucide-react'

export type SectionKey =
  | 'hero'
  | 'works'
  | 'about'
  | 'skills'
  | 'projects'
  | 'posts'
  | 'timeline'
  | 'friends'
  | 'contact'

interface NavItem {
  key: SectionKey
  label: string
}

interface HeaderProps {
  ownerName: string
  active: SectionKey
  onNavigate: (section: SectionKey) => void
}

const NAV_ITEMS: NavItem[] = [
  { key: 'hero', label: '首页' },
  { key: 'works', label: '作品' },
  { key: 'about', label: '关于' },
  { key: 'skills', label: '技能' },
  { key: 'projects', label: '项目' },
  { key: 'posts', label: '随笔' },
  { key: 'timeline', label: '时间线' },
  { key: 'friends', label: '友链' },
  { key: 'contact', label: '联系' },
]

/**
 * 顶部固定玻璃栏 - 暮光紫夜
 * 桌面端：横向导航；移动端：汉堡菜单
 */
export const Header = memo(function Header({
  ownerName,
  active,
  onNavigate,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [active])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--header-height)',
        zIndex: 100,
      }}
    >
      <div
        className="glass glass-strong"
        style={{
          height: '100%',
          borderRadius: 0,
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 var(--content-padding)',
          gap: 'var(--space-6)',
        }}
      >
        {/* Logo */}
        <button
          type="button"
          onClick={() => onNavigate('hero')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: 0,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, var(--accent), var(--sys-pink))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--accent-glow)',
            }}
          >
            <Music2 size={18} strokeWidth={2.2} color="var(--text-inverse)" />
          </div>
          <span
            style={{
              fontSize: 'var(--text-md)',
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            {ownerName}
          </span>
        </button>

        {/* 桌面导航 */}
        <nav
          className="header-nav-desktop"
          style={{
            display: 'flex',
            gap: 'var(--space-1)',
            marginLeft: 'auto',
            alignItems: 'center',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.key
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onNavigate(item.key)}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  color: isActive ? 'var(--text-inverse)' : 'var(--text-secondary)',
                  background: isActive
                    ? 'linear-gradient(135deg, var(--accent), var(--accent-dark))'
                    : 'transparent',
                  transition: 'all var(--duration-fast) var(--ease-out)',
                  cursor: 'pointer',
                  border: 'none',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? 'var(--accent-glow)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-primary)'
                    e.currentTarget.style.background = 'rgba(168, 85, 247, 0.1)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-secondary)'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* 移动端汉堡按钮 */}
        <button
          type="button"
          className="header-nav-toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="切换导航"
          style={{
            marginLeft: 'auto',
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: 'var(--space-2)',
          }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* 移动端下拉导航 */}
      {mobileOpen && (
        <div
          className="glass glass-strong header-nav-mobile"
          style={{
            marginTop: 1,
            padding: 'var(--space-3)',
            display: 'none',
            flexDirection: 'column',
            gap: 'var(--space-1)',
            borderBottom: '1px solid var(--glass-border)',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.key
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onNavigate(item.key)}
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-md)',
                  fontWeight: 500,
                  color: isActive ? 'var(--text-inverse)' : 'var(--text-primary)',
                  background: isActive
                    ? 'linear-gradient(135deg, var(--accent), var(--accent-dark))'
                    : 'rgba(168, 85, 247, 0.08)',
                  transition: 'all var(--duration-fast) var(--ease-out)',
                  cursor: 'pointer',
                  border: 'none',
                  textAlign: 'left',
                }}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      )}

      {/* 响应式 CSS */}
      <style>{`
        @media (max-width: 900px) {
          .header-nav-desktop { display: none !important; }
          .header-nav-toggle { display: block !important; }
          .header-nav-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  )
})
