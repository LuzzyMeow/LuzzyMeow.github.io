import type { SiteData, Track } from '../../types/manifest';
import { Button } from '../core/Button';
import { Icon } from '../core/Icon';
import { formatDateShort } from '../../lib/format';

/* ============================================================
   Hero 报头 · 衬线大字报名 + 数据 + CTA + 最新作品唱片卡
   ============================================================ */

interface HeroProps {
  site: SiteData;
  latestTrack: Track | null;
  trackCount: number;
  albumCount: number;
  onPlayLatest: () => void;
  onBrowseWorks: () => void;
}

const pad = (n: number) => String(n).padStart(3, '0');

export function Hero({ site, latestTrack, trackCount, albumCount, onPlayLatest, onBrowseWorks }: HeroProps) {
  const links = (site.owner.links ?? []) as { label: string; url: string; icon?: string }[];
  const isBili = Boolean(latestTrack?.bilibili);
  const update = latestTrack?.date ? latestTrack.date.slice(0, 7).replace('-', '.') : '—';

  const handlePlayLatest = () => {
    if (!latestTrack) return;
    // B站 来源 → 外链跳转；本地 → 站内播放
    if (latestTrack.bilibili) {
      window.open(latestTrack.bilibili.url, '_blank', 'noopener,noreferrer');
      return;
    }
    onPlayLatest();
  };

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        zIndex: 2,
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        padding: 'calc(var(--nav-height) + var(--space-16)) var(--content-padding) var(--space-20)',
        scrollMarginTop: 'var(--nav-height)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--content-max-width)',
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(320px, 0.85fr)',
          gap: 'clamp(48px, 7vw, 96px)',
          alignItems: 'center',
        }}
        className="hero-grid"
      >
        {/* —— 左：报头 —— */}
        <div>
          <p
            className="mono"
            style={{
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.32em',
              color: 'var(--ink-faint)',
            }}
          >
            VOCAL COVER · ORIGINAL MUSIC · CODE
          </p>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-4xl)',
              fontWeight: 400,
              lineHeight: 1.04,
              letterSpacing: '0.01em',
              margin: 'var(--space-5) 0 var(--space-5)',
            }}
          >
            {site.owner.name.slice(0, -3)}
            <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{site.owner.name.slice(-3)}</em>
          </h1>

          <p
            style={{
              fontSize: 'var(--text-md)',
              color: 'var(--ink-soft)',
              maxWidth: 520,
              marginBottom: 'var(--space-8)',
            }}
          >
            {site.owner.bio}
          </p>

          {/* 数据 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-6)',
              marginBottom: 'var(--space-8)',
              flexWrap: 'wrap',
            }}
          >
            {[
              { label: '音轨', value: pad(trackCount) },
              { label: '合集', value: pad(albumCount) },
              { label: '更新', value: update },
            ].map((s, i) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
                {i > 0 && <span aria-hidden="true" style={{ width: 1, height: 34, background: 'var(--line)' }} />}
                <div>
                  <div className="serif" style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.1, color: 'var(--ink)' }}>
                    {s.value}
                  </div>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--ink-faint)', marginTop: 4 }}>
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-8)' }}>
            <Button variant="accent" size="lg" icon="play" onClick={handlePlayLatest}>
              {isBili ? '观看最新作品' : '播放最新作品'}
            </Button>
            <Button size="lg" iconRight="arrowDown" onClick={onBrowseWorks}>
              浏览全部曲目
            </Button>
          </div>

          {/* 社交链路 */}
          {links.length > 0 && (
            <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
              {links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link"
                  style={{ fontSize: 'var(--text-sm)' }}
                >
                  {l.label}
                  <Icon name="arrowUpRight" size={13} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* —— 右：最新作品唱片卡 —— */}
        {latestTrack && (
          <div className="reveal card hero-record" style={{ padding: 'var(--space-4)', maxWidth: 420, justifySelf: 'end', width: '100%' }}>
            <div
              style={{
                aspectRatio: '16 / 9',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                border: '1px solid var(--line)',
                background: 'var(--paper-deep)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--ink-faint)',
              }}
            >
              {latestTrack.cover ? (
                <img
                  src={latestTrack.cover}
                  alt={latestTrack.title}
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Icon name="music" size={40} style={{ opacity: 0.5 }} />
              )}
            </div>

            <div style={{ padding: 'var(--space-4) var(--space-2) var(--space-2)' }}>
              <div
                className="mono"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-2)',
                }}
              >
                <span style={{ fontSize: 10, letterSpacing: '0.24em', color: 'var(--accent)' }}>
                  LATEST · 最新作品
                </span>
                {latestTrack.date && (
                  <span style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-faint)' }}>
                    {formatDateShort(latestTrack.date)}
                  </span>
                )}
              </div>

              <p className="serif" style={{ fontSize: 'var(--text-lg)', fontWeight: 600, lineHeight: 1.45 }}>
                {latestTrack.title}
              </p>
              <p className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-faint)', marginTop: 4 }}>
                {latestTrack.originalTitle ?? (isBili ? '' : 'LuzzyMeow')}
                {latestTrack.bilibili?.view != null && ` · ${latestTrack.bilibili.view} 播放`}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-4)' }}>
                <Button size="sm" variant={isBili ? 'outline' : 'accent'} icon={isBili ? 'video' : 'play'} onClick={handlePlayLatest}>
                  {isBili ? '在 B站 观看' : '立即播放'}
                </Button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {isBili && latestTrack.bilibili && (
                    <a
                      href={latestTrack.bilibili.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-btn"
                      style={{ width: 30, height: 30 }}
                      aria-label="在 B站 观看原视频"
                      title="原站观看"
                    >
                      <Icon name="arrowUpRight" size={14} />
                    </a>
                  )}
                  <Button size="sm" variant="ghost" iconRight="arrowRight" onClick={onBrowseWorks}>
                    全部曲目
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: var(--space-8) !important; }
          .hero-record { max-width: 100% !important; justify-self: auto !important; }
        }
      `}</style>
    </section>
  );
}
