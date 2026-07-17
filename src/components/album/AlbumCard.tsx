import { memo } from 'react'
import { Music } from 'lucide-react'
import { GlassCard } from '../glass/GlassCard'
import { formatDateShort } from '../../lib/format'
import type { Album } from '../../types/manifest'

export interface AlbumCardProps {
  album: Album
  trackCount: number
  onClick?: () => void
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

export const AlbumCard = memo(function AlbumCard({ album, trackCount, onClick }: AlbumCardProps) {
  return (
    <GlassCard hover radius="lg" padding="none" onClick={onClick}
      role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}
      style={{ width: 200, flexShrink: 0, cursor: onClick ? 'pointer' : 'default', overflow: 'hidden' }}>
      {/* 方形封面 */}
      <div style={{
        width: '100%', aspectRatio: '1 / 1',
        background: album.cover ? undefined : coverGradient(album.id),
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      }}>
        {album.cover ? (
          <img src={album.cover} alt={album.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
        ) : (
          <Music size={40} color="rgba(255,255,255,0.85)" strokeWidth={1.8} />
        )}
      </div>

      {/* 信息区 */}
      <div style={{ padding: 'var(--space-3)' }}>
        <div className="truncate" style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          {album.title}
        </div>
        {album.description && (
          <div className="line-clamp-2" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)', lineHeight: 1.4 }}>
            {album.description}
          </div>
        )}
        <div className="tabular" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          <span>{trackCount} 首</span>
          {album.createdAt && (<><span>·</span><span>{formatDateShort(album.createdAt)}</span></>)}
        </div>
      </div>
    </GlassCard>
  )
})
