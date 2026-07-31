import { useEffect, useMemo, useState } from 'react';
import type { SiteData } from './types/manifest';
import { loadSiteData } from './lib/site';
import { usePlayerStore } from './store/playerStore';
import { Navbar, type NavItem } from './components/layout/Navbar';
import { Hero } from './components/layout/Hero';
import { SectionShell } from './components/layout/SectionShell';
import { Footer } from './components/layout/Footer';
import { PlayerBar } from './components/player/PlayerBar';
import { LyricPanel } from './components/player/LyricPanel';
import { QueuePanel } from './components/player/QueuePanel';
import { Works, SHOW_LOCAL_TRACKS } from './components/sections/Works';
import { About } from './components/sections/About';
import { Projects } from './components/sections/Projects';
import { Timeline } from './components/sections/Timeline';
import { Friends } from './components/sections/Friends';
import { Contact } from './components/sections/Contact';
import { Icon } from './components/core/Icon';

const NAV_ITEMS: NavItem[] = [
  { key: 'hero', label: '首页' },
  { key: 'works', label: '作品' },
  { key: 'about', label: '关于' },
  { key: 'projects', label: '项目' },
  { key: 'timeline', label: '时间线' },
  { key: 'friends', label: '友链' },
  { key: 'contact', label: '联系' },
];

export default function App() {
  const [site, setSite] = useState<SiteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState('hero');
  const [lyricOpen, setLyricOpen] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);

  const playTrack = usePlayerStore((s) => s.playTrack);
  const next = usePlayerStore((s) => s.next);
  const currentTrack = usePlayerStore((s) => s.currentTrack);

  useEffect(() => {
    loadSiteData()
      .then(setSite)
      .catch((e: Error) => setError(e.message));
  }, []);

  // 滚动侦测当前章节
  useEffect(() => {
    if (!site) return;
    const sections = NAV_ITEMS.map((n) => document.getElementById(n.key)).filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveKey(entry.target.id);
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [site]);

  const navigate = (key: string) => {
    document.getElementById(key)?.scrollIntoView({ behavior: 'smooth' });
  };

  const latestTrack = useMemo(() => {
    if (!site || site.tracks.length === 0) return null;
    return [...site.tracks].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))[0];
  }, [site]);

  /* ---------- 加载态 ---------- */
  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)' }}>
        <Icon name="x" size={36} style={{ color: 'var(--accent)' }} />
        <p className="mono" style={{ color: 'var(--ink-soft)', letterSpacing: '0.2em', fontSize: 'var(--text-sm)' }}>数据加载失败</p>
        <p style={{ color: 'var(--ink-faint)', fontSize: 'var(--text-sm)' }}>site.json 加载失败：{error}</p>
      </div>
    );
  }

  if (!site) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)' }}>
        <span className="eq" style={{ height: 20 }}>
          <span style={{ width: 3 }} />
          <span style={{ width: 3 }} />
          <span style={{ width: 3 }} />
        </span>
        <p className="mono" style={{ color: 'var(--ink-soft)', letterSpacing: '0.3em', fontSize: 'var(--text-sm)' }}>
          加载中 · LOADING
        </p>
      </div>
    );
  }

  return (
    <>
      <Navbar siteName={site.owner.name} items={NAV_ITEMS} activeKey={activeKey} onNavigate={navigate} />

      <main style={{ position: 'relative', zIndex: 2 }}>
        <Hero
          site={site}
          latestTrack={latestTrack}
          trackCount={site.tracks.filter((t) => t.bilibili || SHOW_LOCAL_TRACKS).length}
          albumCount={site.albums.length}
          onPlayLatest={() => latestTrack && playTrack(latestTrack, site.tracks)}
          onBrowseWorks={() => navigate('works')}
        />

        <SectionShell id="works" index={1} title="作品" subtitle="翻唱与原创 · 音轨库">
          <Works tracks={site.tracks} albums={site.albums} />
        </SectionShell>

        <SectionShell id="about" index={2} title="关于" subtitle="关于我 · 自我介绍">
          <About site={site} />
        </SectionShell>

        {site.projects && site.projects.length > 0 && (
          <SectionShell id="projects" index={3} title="项目" subtitle="GitHub 同步 · 造物记录">
            <Projects projects={site.projects} />
          </SectionShell>
        )}

        {site.timeline && site.timeline.length > 0 && (
          <SectionShell id="timeline" index={4} title="时间线" subtitle="CHANGELOG · 项目更新日志">
            <Timeline timeline={site.timeline} />
          </SectionShell>
        )}

        {site.friends && site.friends.length > 0 && (
          <SectionShell id="friends" index={5} title="友链" subtitle="通讯阵列">
            <Friends friends={site.friends} />
          </SectionShell>
        )}

        <SectionShell id="contact" index={6} title="联系" subtitle="建立连接">
          <Contact site={site} />
        </SectionShell>
      </main>

      <Footer siteName={site.owner.name} sourceRepo="https://github.com/LuzzyMeow/LuzzyMeow.github.io" />

      {/* 播放器层 */}
      {currentTrack && (
        <>
          {lyricOpen && <LyricPanel />}
          {queueOpen && <QueuePanel />}
          <PlayerBar
            isLyricOpen={lyricOpen}
            isQueueOpen={queueOpen}
            onToggleLyric={() => {
              setLyricOpen((v) => !v);
              setQueueOpen(false);
            }}
            onToggleQueue={() => {
              setQueueOpen((v) => !v);
              setLyricOpen(false);
            }}
            onTrackEnded={next}
          />
        </>
      )}
    </>
  );
}
