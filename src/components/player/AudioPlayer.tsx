/* ========================================================================
   LuzzyMeow · 主音频播放器  v2 — 暮光紫夜
   固定底部深色玻璃栏
   ======================================================================== */

import { memo, useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, ListMusic, ChevronUp, X, Music } from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore'
import { parseLrc, type LrcLine } from '../../lib/lrc'
import { ProgressBar } from './ProgressBar'
import { VolumeControl } from './VolumeControl'
import { Visualizer } from './Visualizer'
import { LyricView } from './LyricView'
import { Playlist } from './Playlist'

function coverGradient(id: string): string {
  const palettes = [
    'linear-gradient(135deg, var(--accent), var(--sys-pink))',
    'linear-gradient(135deg, var(--sys-pink), var(--sys-teal))',
    'linear-gradient(135deg, var(--sys-teal), var(--accent))',
    'linear-gradient(135deg, var(--accent), var(--accent-dark))',
  ]
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0
  return palettes[Math.abs(hash) % palettes.length]
}

export const AudioPlayer = memo(function AudioPlayer() {
  const currentTrack = usePlayerStore((s) => s.currentTrack)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const currentTime = usePlayerStore((s) => s.currentTime)
  const duration = usePlayerStore((s) => s.duration)
  const volume = usePlayerStore((s) => s.volume)
  const isMuted = usePlayerStore((s) => s.isMuted)
  const loopMode = usePlayerStore((s) => s.loopMode)
  const queue = usePlayerStore((s) => s.queue)
  const queueIndex = usePlayerStore((s) => s.queueIndex)
  const replaySignal = usePlayerStore((s) => s.replaySignal)

  const togglePlay = usePlayerStore((s) => s.togglePlay)
  const next = usePlayerStore((s) => s.next)
  const prev = usePlayerStore((s) => s.prev)
  const seek = usePlayerStore((s) => s.seek)
  const setVolume = usePlayerStore((s) => s.setVolume)
  const toggleMute = usePlayerStore((s) => s.toggleMute)
  const setLoopMode = usePlayerStore((s) => s.setLoopMode)
  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime)
  const setDuration = usePlayerStore((s) => s.setDuration)
  const setPlaying = usePlayerStore((s) => s.setPlaying)
  const playTrack = usePlayerStore((s) => s.playTrack)

  const audioRef = useRef<HTMLAudioElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const sourceCreatedRef = useRef(false)

  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [lyrics, setLyrics] = useState<LrcLine[]>([])
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [showLyrics, setShowLyrics] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const ensureAudioContext = useCallback(() => {
    if (sourceCreatedRef.current) {
      if (audioContextRef.current?.state === 'suspended') audioContextRef.current.resume().catch(() => {})
      return
    }
    const audio = audioRef.current
    if (!audio) return
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioCtx()
      const src = ctx.createMediaElementSource(audio)
      const an = ctx.createAnalyser()
      an.fftSize = 256
      src.connect(an)
      an.connect(ctx.destination)
      audioContextRef.current = ctx; sourceRef.current = src; analyserRef.current = an
      sourceCreatedRef.current = true
      setAnalyser(an)
    } catch {}
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return
    if (audio.src !== currentTrack.src) { audio.src = currentTrack.src; audio.load() }
  }, [currentTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return
    if (isPlaying) { ensureAudioContext(); audio.play().catch(() => setPlaying(false)) }
    else audio.pause()
  }, [isPlaying, currentTrack, ensureAudioContext, setPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack || replaySignal === 0) return
    audio.currentTime = 0
    if (isPlaying) audio.play().catch(() => {})
  }, [replaySignal, currentTrack, isPlaying])

  useEffect(() => {
    if (!currentTrack?.lyrics) { setLyrics([]); return }
    let cancelled = false
    fetch(currentTrack.lyrics).then((r) => r.ok ? r.text() : Promise.reject())
      .then((text) => { if (!cancelled) setLyrics(parseLrc(text)) })
      .catch(() => { if (!cancelled) setLyrics([]) })
    return () => { cancelled = true }
  }, [currentTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const hTU = () => setCurrentTime(audio.currentTime)
    const hLM = () => setDuration(audio.duration)
    const hPlay = () => setPlaying(true)
    const hPause = () => { if (!audio.ended) setPlaying(false) }
    const hEnded = () => next()
    audio.addEventListener('timeupdate', hTU)
    audio.addEventListener('loadedmetadata', hLM); audio.addEventListener('durationchange', hLM)
    audio.addEventListener('play', hPlay); audio.addEventListener('pause', hPause)
    audio.addEventListener('ended', hEnded)
    return () => {
      audio.removeEventListener('timeupdate', hTU)
      audio.removeEventListener('loadedmetadata', hLM); audio.removeEventListener('durationchange', hLM)
      audio.removeEventListener('play', hPlay); audio.removeEventListener('pause', hPause)
      audio.removeEventListener('ended', hEnded)
    }
  }, [setCurrentTime, setDuration, setPlaying, next])

  useEffect(() => {
    return () => { if (audioContextRef.current?.state !== 'closed') audioContextRef.current?.close().catch(() => {}) }
  }, [])

  const handleSeek = useCallback((t: number) => {
    const audio = audioRef.current
    if (audio) audio.currentTime = t
    seek(t)
  }, [seek])

  const cycleLoopMode = useCallback(() => {
    if (loopMode === 'list') setLoopMode('single')
    else if (loopMode === 'single') setLoopMode('shuffle')
    else setLoopMode('list')
  }, [loopMode, setLoopMode])

  const LoopIcon = loopMode === 'single' ? Repeat1 : loopMode === 'shuffle' ? Shuffle : Repeat

  const handleSelectFromQueue = useCallback((index: number) => {
    if (index < 0 || index >= queue.length) return
    playTrack(queue[index], queue)
  }, [queue, playTrack])

  if (!currentTrack) return null

  const cover = (
    <div style={{ position: 'relative', width: 48, height: 48, borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0, background: currentTrack.cover ? undefined : coverGradient(currentTrack.id), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {currentTrack.cover ? <img src={currentTrack.cover} alt={currentTrack.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Music size={20} color="var(--text-on-glass)" strokeWidth={2} />}
    </div>
  )

  const trackInfo = (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div className="truncate" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{currentTrack.title}</div>
      {currentTrack.originalArtist && <div className="truncate" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 1 }}>{currentTrack.originalArtist}</div>}
    </div>
  )

  const ctrlBtnStyle: CSSProperties = { width: 36, height: 36, borderRadius: 'var(--radius-pill)', border: 'none', background: 'transparent', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all var(--duration-fast) var(--ease-out)', flexShrink: 0 }

  const playBtnStyle: CSSProperties = { width: 44, height: 44, borderRadius: 'var(--radius-pill)', border: 'none', background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', color: 'var(--text-inverse)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all var(--duration-fast) var(--ease-out)', flexShrink: 0, boxShadow: 'var(--accent-shadow)' }

  return (
    <>
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />

      <div className="audio-player-bar" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 'var(--player-height)', zIndex: 100 }}>
        <div className="glass glass-strong" style={{ height: '100%', borderRadius: 0, borderTop: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', padding: '0 var(--content-padding)', gap: 'var(--space-4)' }}>
          {/* 左 */}
          <div className="ap-left" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: 0, flex: '0 1 220px' }}>
            {cover}{trackInfo}
          </div>

          {/* 中 */}
          <div className="ap-center" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', minWidth: 0 }}>
            <div className="ap-visualizer" style={{ height: 28, overflow: 'hidden' }}>
              <div style={{ transform: 'scale(0.46)', transformOrigin: 'top left', height: '60px' }}>
                <Visualizer analyser={analyser} isPlaying={isPlaying} />
              </div>
            </div>
            <div className="ap-controls" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <button type="button" onClick={prev} aria-label="上一首" style={ctrlBtnStyle} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                <SkipBack size={18} fill="currentColor" strokeWidth={0} />
              </button>
              <button type="button" onClick={togglePlay} aria-label={isPlaying ? '暂停' : '播放'} style={playBtnStyle} onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, var(--accent-hover), var(--accent-dark))'; e.currentTarget.style.boxShadow = 'var(--accent-shadow-hover)' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, var(--accent), var(--accent-dark))'; e.currentTarget.style.boxShadow = 'var(--accent-shadow)' }}>
                {isPlaying ? <Pause size={20} fill="currentColor" strokeWidth={0} /> : <Play size={20} fill="currentColor" strokeWidth={0} style={{ marginLeft: 2 }} />}
              </button>
              <button type="button" onClick={next} aria-label="下一首" style={ctrlBtnStyle} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                <SkipForward size={18} fill="currentColor" strokeWidth={0} />
              </button>
              <div style={{ flex: 1, minWidth: 0 }}><ProgressBar current={currentTime} duration={duration} onSeek={handleSeek} /></div>
            </div>
          </div>

          {/* 右 */}
          <div className="ap-right" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
            <div className="ap-volume"><VolumeControl volume={volume} isMuted={isMuted} onVolumeChange={setVolume} onToggleMute={toggleMute} /></div>
            <button type="button" onClick={cycleLoopMode} aria-label={`循环模式：${loopMode}`} style={{ ...ctrlBtnStyle, color: loopMode !== 'list' ? 'var(--accent)' : 'var(--text-secondary)' }}><LoopIcon size={18} /></button>
            <button type="button" onClick={() => { setShowPlaylist((v) => !v); setShowLyrics(false) }} aria-label="播放列表" style={{ ...ctrlBtnStyle, color: showPlaylist ? 'var(--accent)' : 'var(--text-secondary)' }}><ListMusic size={18} /></button>
            {lyrics.length > 0 && (
              <button type="button" onClick={() => { setShowLyrics((v) => !v); setShowPlaylist(false) }} aria-label="歌词" className="ap-lyrics-btn" style={{ ...ctrlBtnStyle, color: showLyrics ? 'var(--accent)' : 'var(--text-secondary)' }}><ChevronUp size={18} /></button>
            )}

            {showPlaylist && (
              <div style={{ position: 'absolute', bottom: 'calc(var(--player-height) - 8px)', right: 'var(--content-padding)', width: 320, maxWidth: 'calc(100vw - 2 * var(--content-padding))', zIndex: 200 }}>
                <Playlist tracks={queue} currentIndex={queueIndex} onSelect={(idx) => { handleSelectFromQueue(idx); setShowPlaylist(false) }} />
              </div>
            )}

            {showLyrics && lyrics.length > 0 && (
              <div style={{ position: 'absolute', bottom: 'calc(var(--player-height) - 8px)', right: 'var(--content-padding)', width: 360, maxWidth: 'calc(100vw - 2 * var(--content-padding))', zIndex: 200 }} className="glass glass-strong">
                <LyricView lyrics={lyrics} currentTime={currentTime} onSeek={handleSeek} />
              </div>
            )}
          </div>

          <button type="button" onClick={() => setIsExpanded(true)} aria-label="展开播放器" className="ap-expand-btn" style={{ ...ctrlBtnStyle, display: 'none' }}><ChevronUp size={20} /></button>
        </div>
      </div>

      {/* 移动端全屏展开 */}
      {isExpanded && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', flexDirection: 'column' }} className="glass glass-strong ap-expanded">
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 'var(--space-4)' }}>
            <button type="button" onClick={() => setIsExpanded(false)} aria-label="关闭" style={ctrlBtnStyle}><X size={22} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--space-4) var(--space-6)', gap: 'var(--space-4)' }}>
            <div style={{ width: 200, height: 200, borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: currentTrack.cover ? undefined : coverGradient(currentTrack.id), display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--accent-glow)' }}>
              {currentTrack.cover ? <img src={currentTrack.cover} alt={currentTrack.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Music size={64} color="var(--text-on-glass)" strokeWidth={1.5} />}
            </div>
            <div style={{ textAlign: 'center', width: '100%' }}>
              <div className="truncate" style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>{currentTrack.title}</div>
              {currentTrack.originalArtist && <div className="truncate" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' }}>{currentTrack.originalArtist}</div>}
            </div>
          </div>
          <div style={{ padding: '0 var(--space-6)' }}><Visualizer analyser={analyser} isPlaying={isPlaying} /></div>
          <div style={{ padding: 'var(--space-4) var(--space-6)' }}><ProgressBar current={currentTime} duration={duration} onSeek={handleSeek} /></div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-8)', padding: 'var(--space-4)' }}>
            <button type="button" onClick={prev} aria-label="上一首" style={{ ...ctrlBtnStyle, width: 48, height: 48 }}><SkipBack size={26} fill="currentColor" strokeWidth={0} /></button>
            <button type="button" onClick={togglePlay} aria-label={isPlaying ? '暂停' : '播放'} style={{ ...playBtnStyle, width: 72, height: 72 }}>
              {isPlaying ? <Pause size={34} fill="currentColor" strokeWidth={0} /> : <Play size={34} fill="currentColor" strokeWidth={0} style={{ marginLeft: 3 }} />}
            </button>
            <button type="button" onClick={next} aria-label="下一首" style={{ ...ctrlBtnStyle, width: 48, height: 48 }}><SkipForward size={26} fill="currentColor" strokeWidth={0} /></button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-6)', padding: 'var(--space-2)' }}>
            <button type="button" onClick={cycleLoopMode} style={{ ...ctrlBtnStyle, color: loopMode !== 'list' ? 'var(--accent)' : 'var(--text-secondary)' }}><LoopIcon size={20} /></button>
            <VolumeControl volume={volume} isMuted={isMuted} onVolumeChange={setVolume} onToggleMute={toggleMute} />
          </div>
          {lyrics.length > 0 && (
            <div style={{ flex: 1, padding: 'var(--space-4) var(--space-6)', overflow: 'hidden' }}><LyricView lyrics={lyrics} currentTime={currentTime} onSeek={handleSeek} /></div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .ap-visualizer { display: none !important; }
          .ap-volume { display: none !important; }
          .ap-lyrics-btn { display: none !important; }
          .ap-center { flex: 0 0 auto !important; }
          .ap-controls > button:not(:nth-child(2)) { display: none !important; }
          .ap-controls > div { display: none !important; }
          .ap-expand-btn { display: flex !important; }
          .ap-right > button:not(.ap-expand-btn) { display: none !important; }
          .ap-left { flex: 1 1 auto !important; }
        }
      `}</style>
    </>
  )
})
