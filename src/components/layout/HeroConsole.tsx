import type { SiteData } from '../../types/manifest';
import { NeonButton } from '../core/NeonButton';
import { Icon, type IconName } from '../core/Icon';

/* ============================================================
   Hero 主控台 · 霓虹标题 + 数据读数 + CTA + 社交链路
   ============================================================ */

interface HeroConsoleProps {
  site: SiteData;
  latestTrackId: string | null;
  trackCount: number;
  albumCount: number;
  onPlayLatest: () => void;
  onBrowseWorks: () => void;
}

const LINK_ICON: Record<string, IconName> = {
  github: 'github',
  bilibili: 'video',
  email: 'mail',
};

const pad = (n: number) => String(n).padStart(3, '0');

export function HeroConsole({ site, trackCount, albumCount, onPlayLatest, onBrowseWorks }: HeroConsoleProps) {
  const links = (site.owner.links ?? []) as { label: string; url: string; icon?: string }[];

  return (
    <section
      id="hero"
      className="scanlines"
      style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'calc(var(--nav-height) + var(--space-16)) var(--content-padding) var(--space-20)',
        scrollMarginTop: 'var(--nav-height)',
      }}
    >
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, textAlign: 'center' }}>
        {/* 席位标号 */}
        <p
          className="mono"
          style={{
            fontSize: 'var(--text-sm)',
            letterSpacing: '0.35em',
            color: 'var(--pink)',
            textShadow: 'var(--glow-text-pink)',
            marginBottom: 'var(--space-5)',
          }}
        >
          {'// VOCAL COVER · ORIGINAL · CODE'}
        </p>

        {/* 主标题 */}
        <h1
          className="neon-flicker"
          style={{
            fontSize: 'var(--text-4xl)',
            fontWeight: 900,
            letterSpacing: '0.04em',
            marginBottom: 'var(--space-6)',
          }}
        >
          <span className="grad-text">{site.owner.name}</span>
          <span className="cursor-blink" aria-hidden="true" />
        </h1>

        {/* 简介 */}
        <p
          style={{
            fontSize: 'var(--text-md)',
            color: 'var(--text-secondary)',
            maxWidth: 560,
            margin: '0 auto var(--space-8)',
          }}
        >
          {site.owner.bio}
        </p>

        {/* 数据读数 */}
        <div
          className="mono"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-8)',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-10)',
            fontSize: 'var(--text-sm)',
          }}
        >
          {[
            { label: 'TRACKS', value: pad(trackCount) },
            { label: 'ALBUMS', value: pad(albumCount) },
            { label: 'STATUS', value: 'ACTIVE', glow: true },
          ].map((s) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ color: 'var(--text-tertiary)', letterSpacing: '0.2em' }}>{s.label}</span>
              <span
                style={{
                  color: 'var(--cyan)',
                  fontWeight: 700,
                  fontSize: 'var(--text-md)',
                  textShadow: 'var(--glow-text-cyan)',
                }}
              >
                {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-4)',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-10)',
          }}
        >
          <NeonButton variant="primary" size="lg" icon="play" onClick={onPlayLatest}>
            最新作品
          </NeonButton>
          <NeonButton size="lg" iconRight="chevronDown" onClick={onBrowseWorks}>
            全部曲目
          </NeonButton>
        </div>

        {/* 链路 */}
        {links.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)' }}>
              {links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neon-icon-btn"
                  aria-label={l.label}
                  title={l.label}
                >
                  <Icon name={LINK_ICON[(l.icon ?? l.label).toLowerCase()] ?? 'link'} size={19} />
                </a>
              ))}
            </div>
          )}
      </div>

      {/* 底部下滑提示 */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 'var(--space-8)',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'var(--text-tertiary)',
          animation: 'heroHint 2.2s var(--ease-neon) infinite',
        }}
      >
        <Icon name="chevronDown" size={20} />
        <style>{`@keyframes heroHint { 0%,100% { transform: translate(-50%,0); opacity:.4 } 50% { transform: translate(-50%,8px); opacity:1 } }`}</style>
      </div>
    </section>
  );
}
