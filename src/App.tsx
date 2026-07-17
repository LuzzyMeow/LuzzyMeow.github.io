import { useEffect, useState, useCallback } from 'react'
import { Background } from './components/layout/Background'
import { Header, type SectionKey } from './components/layout/Header'
import { Hero } from './components/layout/Hero'
import { Footer } from './components/layout/Footer'
import { Section } from './components/layout/Section'
import { GlassCard } from './components/glass/GlassCard'
import { Works } from './components/sections/Works'
import { About } from './components/sections/About'
import { Skills } from './components/sections/Skills'
import { Projects } from './components/sections/Projects'
import { Posts } from './components/sections/Posts'
import { Timeline } from './components/sections/Timeline'
import { Friends } from './components/sections/Friends'
import { Contact } from './components/sections/Contact'
import { AudioPlayer } from './components/player/AudioPlayer'
import { usePlayerStore } from './store/playerStore'
import { loadSiteData } from './lib/site'
import type { SiteData, Track } from './types/manifest'

export default function App() {
  const [site, setSite] = useState<SiteData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<SectionKey>('hero')

  const playTrack = usePlayerStore((s) => s.playTrack)

  // 加载站点数据
  useEffect(() => {
    let cancelled = false
    loadSiteData()
      .then((data) => {
        if (!cancelled) setSite(data)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // 监听滚动自动激活对应 section 导航
  useEffect(() => {
    const sections: SectionKey[] = [
      'hero',
      'works',
      'about',
      'skills',
      'projects',
      'posts',
      'timeline',
      'friends',
      'contact',
    ]
    let ticking = false
    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const scrollY = window.scrollY + 120 // 偏移以提前激活
        let current: SectionKey = 'hero'
        for (const key of sections) {
          const el = document.getElementById(`section-${key}`)
          if (el && el.offsetTop <= scrollY) {
            current = key
          }
        }
        setActiveSection(current)
        ticking = false
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [site])

  const handleNavigate = useCallback((s: SectionKey) => {
    setActiveSection(s)
    if (s === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const el = document.getElementById(`section-${s}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  const handlePlayTrack = useCallback(
    (track: Track, queue?: Track[]) => {
      playTrack(track, queue)
    },
    [playTrack],
  )

  // 加载中
  if (!site && !error) {
    return (
      <>
        <Background />
        <div
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-md)',
          }}
        >
          <div className="glass" style={{ padding: 'var(--space-8)' }}>
            正在加载...
          </div>
        </div>
      </>
    )
  }

  // 加载失败
  if (error) {
    return (
      <>
        <Background />
        <div
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <GlassCard padding="lg" style={{ maxWidth: 480, textAlign: 'center' }}>
            <h2 style={{ marginBottom: 'var(--space-3)' }}>加载失败</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
              无法加载 site.json：{error}
            </p>
            <p
              style={{
                color: 'var(--text-tertiary)',
                fontSize: 'var(--text-xs)',
                marginTop: 'var(--space-3)',
              }}
            >
              请检查 public/site.json 是否存在且格式正确
            </p>
          </GlassCard>
        </div>
      </>
    )
  }

  const {
    owner,
    skills = [],
    tracks,
    albums,
    projects = [],
    posts = [],
    timeline = [],
    friends = [],
  } = site!

  return (
    <>
      <Background />
      <Header
        ownerName={owner.name}
        active={activeSection}
        onNavigate={handleNavigate}
      />

      <main style={{ paddingBottom: 'calc(var(--player-height) + var(--space-8))' }}>
        {/* Hero 区 - 不用 Section 包裹，使用自身布局 */}
        <Hero
          owner={owner}
          trackCount={tracks.length}
          albumCount={albums.length}
          onBrowse={() => handleNavigate('works')}
          onLatest={() => handleNavigate('works')}
        />

        {/* 作品集 - 首要模块 */}
        <Section
          id="works"
          title="作品"
          subtitle={`共 ${tracks.length} 首 · 翻唱与原创`}
          marginTop="var(--space-12)"
        >
          <Works tracks={tracks} albums={albums} onPlay={handlePlayTrack} />
        </Section>

        {/* 关于我 */}
        <Section id="about" title="关于我" subtitle="关于 LuzzyMeow">
          <About owner={owner} />
        </Section>

        {/* 技能与兴趣 */}
        <Section id="skills" title="技能与兴趣" subtitle="会什么、喜欢什么">
          <Skills skills={skills} />
        </Section>

        {/* 项目展示 */}
        <Section id="projects" title="项目" subtitle="其他作品与代码项目">
          <Projects projects={projects} />
        </Section>

        {/* 随笔文章 */}
        <Section id="posts" title="随笔" subtitle="文字与碎碎念">
          <Posts posts={posts} />
        </Section>

        {/* 时间线 */}
        <Section id="timeline" title="时间线" subtitle="一路走来">
          <Timeline events={timeline} />
        </Section>

        {/* 友链 */}
        <Section id="friends" title="友链" subtitle="朋友们">
          <Friends friends={friends} />
        </Section>

        {/* 联系方式 */}
        <Section id="contact" title="联系" subtitle="与我联系">
          <Contact owner={owner} />
        </Section>

        <Footer ownerName={owner.name} />
      </main>

      {/* 固定底部音乐播放器 */}
      <AudioPlayer />
    </>
  )
}
