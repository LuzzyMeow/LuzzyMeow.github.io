import { memo, type MouseEvent as ReactMouseEvent } from 'react'
import { Play, Pause, Music, Download, ExternalLink } from 'lucide-react'
import { GlassCard } from '../glass/GlassCard'
import { formatDuration } from '../../lib/format'
import type { Track } from '../../types/manifest'

export interface TrackCardProps {
  track: Track
  isCurrent?: boolean
  isPlaying?: boolean
  onPlay: (track: Track, queue?: Track[]) => void
}

function coverGradient(id: string): string {
  const palettes = [
    'linear-gradient(135deg, var(--accent), var(--sys-pink))',
    'linear-gradient(135deg, var(--sys-pink), var(--sys-teal))',
    'linear-gradient(135deg, var(--sys-teal), var(--accent))',
    'linear-gradient(135deg, #8b5cf6, var(--accent))',
    'linear-gradient(135deg, var(--accent), #6366f1)',
  ]
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0
  return palettes[Math.abs(hash) % palettes.length]
}

function triggerDownload(mp3Url: string, filename: string) {
  const a = document.createElement('a')
  a.href = mp3Url; a.download = filename; a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function extractFilename(url: string): string {
  const cleaned = url.split('?')[0].split('#')[0]
  const parts = cleaned.split('/')
  return parts[parts.length - 1] || 'track.mp3'
}

export const TrackCard = memo(function TrackCard({ track, isCurrent = false, isPlaying = false, onPlay }: TrackCardProps) {
  const handlePlayClick = () => { onPlay(track) }
  const handleDownloadClick = (e: ReactMouseEvent) => {
    e.stopPropagation()
    if (track.download.lossless) {
      window.open(track.download.lossless, '_blank', 'noopener,noreferrer')
      return
    }
    triggerDownload(track.download.mp3, extractFilename(track.download.mp3))
  }
  const hasLossless = Boolean(track.download.lossless)

  return (
    <GlassCard hover radius="md" padding="none" className="track-card"
      style={{
        position: 'relative', padding: 'var(--space-3) var(--space-4)',
        display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
        ...(isCurrent ? {
          borderColor: 'var(--glass-border-accent)',
          boxShadow: 'inset 3px 0 0 var(--accent), var(--accent-glow), var(--glass-shadow), var(--glass-shadow-inset)',
        } : {}),
      }}>
      {/* 封面 */}
      <div style={{
        position: 'relative', width: 48, height: 48, borderRadius: 'var(--radius-md)',
        overflow: 'hidden', flexShrink: 0,
        background: track.cover ? undefined : coverGradient(track.id),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {track.cover ? (
          <img src={track.cover} alt={track.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
        ) : (
          <Music size={20} color="rgba(255,255,255,0.85)" strokeWidth={2} />
        )}
      </div>

      {/* 信息 */}
      <div className="track-card-info" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <div className="truncate" style={{
          fontSize: 'var(--text-base)', fontWeight: 600,
          color: isCurrent ? 'var(--accent)' : 'var(--text-primary)',
          letterSpacing: '-0.01em',
        }}>
          {track.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {track.originalArtist && (
            <span className="track-card-artist truncate" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', maxWidth: 160 }}>
              {track.originalArtist}
            </span>
          )}
          {track.tags && track.tags.length > 0 && (
            <div className="track-card-tags" style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
              {track.tags.slice(0, 3).map((tag) => (
                <span key={tag} style={{
                  fontSize: 'var(--text-xs)', padding: '1px var(--space-2)', borderRadius: 'var(--radius-pill)',
                  background: 'rgba(0,0,0,0.05)', color: 'var(--accent)', whiteSpace: 'nowrap',
                }}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 操作 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
        {track.duration != null && track.duration > 0 && (
          <span className="track-card-duration tabular" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            {formatDuration(track.duration)}
          </span>
        )}
        <button type="button" onClick={handlePlayClick} aria-label={isCurrent && isPlaying ? '暂停' : '播放'}
          style={{
            width: 36, height: 36, borderRadius: 'var(--radius-pill)', border: 'none',
            background: isCurrent && isPlaying
              ? 'linear-gradient(135deg, var(--accent), var(--accent-dark))'
              : 'rgba(0,0,0,0.04)',
            color: isCurrent && isPlaying ? 'var(--text-inverse)' : 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all var(--duration-fast) var(--ease-out)',
            boxShadow: isCurrent && isPlaying ? 'var(--accent-glow)' : 'none',
          }}>
          {isCurrent && isPlaying ? <Pause size={16} fill="currentColor" strokeWidth={0} /> : <Play size={16} fill="currentColor" strokeWidth={0} style={{ marginLeft: 2 }} />}
        </button>
        <button type="button" onClick={handleDownloadClick}
          aria-label={hasLossless ? '无损版下载' : '下载 MP3'}
          style={{
            width: 32, height: 32, borderRadius: 'var(--radius-pill)', border: 'none',
            background: 'transparent', color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all var(--duration-fast) var(--ease-out)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = 'var(--text-primary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
          {hasLossless ? <ExternalLink size={16} /> : <Download size={16} />}
        </button>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .track-card-duration { display: none !important; }
          .track-card-artist { max-width: 100px !important; }
          .track-card-tags { display: none !important; }
        }
      `}</style>
    </GlassCard>
  )
})
