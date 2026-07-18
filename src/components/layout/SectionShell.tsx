import { useEffect, useRef, type ReactNode } from 'react';

/* ============================================================
   章节外壳 · 编号 + ▸ 标题 + 入场 reveal
   ============================================================ */

interface SectionShellProps {
  id: string;
  index: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function SectionShell({ id, index, title, subtitle, children }: SectionShellProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    );
    el.querySelectorAll('.reveal').forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: 'var(--content-max-width)',
        margin: '0 auto',
        padding: `var(--space-16) var(--content-padding)`,
        scrollMarginTop: 'calc(var(--nav-height) + var(--space-4))',
      }}
    >
      <div className="section-title-wrap reveal">
        <span className="section-index mono">{String(index).padStart(2, '0')} //</span>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}
