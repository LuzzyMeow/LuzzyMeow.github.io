import { useEffect, useMemo, useState } from 'react';
import type { SiteData } from './types/manifest';
import { loadSiteData } from './lib/site';
import { usePlayerStore } from './store/playerStore';
import { StarfieldBackground } from './components/layout/StarfieldBackground';
import { Navbar, type NavItem } from './components/layout/Navbar';
import { HeroConsole } from './components/layout/HeroConsole';
import { SectionShell } from './components/layout/SectionShell';
import { Footer } from './components/layout/Footer';
import { PlayerBar } from './components/player/PlayerBar';
import { LyricPanel } from './components/player/LyricPanel';
import { QueuePanel } from './components/player/QueuePanel';
import { Works } from './components/sections/Works';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { Posts } from './components/sections/Posts';
import { Timeline } from './components/sections/Timeline';
import { Friends } from './components/sections/Friends';
import { Contact } from './components/sections/Contact';
import { Icon } from './components/core/Icon';

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
        <Icon name="x" size={40} style={{ color: 'var(--pink)' }} />
        <p className="mono" style={{ color: 'var(--pink)', letterSpacing: '0.2em', fontSize: 'var(--text-sm)' }}>SIGNAL LOST</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>site.json 加载失败：{error}</p>
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
        <p className="mono" style={{ color: 'var(--cyan)', letterSpacing: '0.3em', fontSize: 'var(--text-sm)', textShadow: 'var(--glow-text-cyan)' }}>
          CONNECTING…
        </p>
      </div>
    );
  }

  return (
    <>
      <StarfieldBackground />
      <Navbar siteName={site.owner.name} items={NAV_ITEMS} activeKey={activeKey} onNavigate={navigate} />

      <main style={{ position: 'relative', zIndex: 2 }}>
        <HeroConsole
          site={site}
          latestTrackId={latestTrack?.id ?? null}
          trackCount={site.tracks.length}
          albumCount={site.albums.length}
          onPlayLatest={() => latestTrack && playTrack(latestTrack, site.tracks)}
          onBrowseWorks={() => navigate('works')}
        />

        <SectionShell id="works" index={1} title="作品" subtitle="翻唱与原创 · 音轨库">
          <Works tracks={site.tracks} albums={site.albums} />
        </SectionShell>

        <SectionShell id="about" index={2} title="关于" subtitle="信号源识别">
          <About site={site} />
        </SectionShell>

        {site.skills && site.skills.length > 0 && (
          <SectionShell id="skills" index={3} title="技能" subtitle="能力矩阵">
            <Skills skills={site.skills} />
          </SectionShell>
        )}

        {site.projects && site.projects.length > 0 && (
          <SectionShell id="projects" index={4} title="项目" subtitle="造物记录">
            <Projects projects={site.projects} />
          </SectionShell>
        )}

        {site.posts && site.posts.length > 0 && (
          <SectionShell id="posts" index={5} title="随笔" subtitle="数据残片">
            <Posts posts={site.posts} />
          </SectionShell>
        )}

        {site.timeline && site.timeline.length > 0 && (
          <SectionShell id="timeline" index={6} title="时间线" subtitle="航行日志">
            <Timeline timeline={site.timeline} />
          </SectionShell>
        )}

        {site.friends && site.friends.length > 0 && (
          <SectionShell id="friends" index={7} title="友链" subtitle="通讯阵列">
            <Friends friends={site.friends} />
          </SectionShell>
        )}

        <SectionShell id="contact" index={8} title="联系" subtitle="建立连接">
          <Contact site={site} />
        </SectionShell>
      </main>

      <Footer siteName={site.owner.name} sourceRepo="https://github.com/lucky9dev/luzzymeow" />

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
