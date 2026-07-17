/* ========================================================================
   LuzzyMeow · 专辑横向滚动列表
   每张 AlbumCard 固定 200px，点击播放整个专辑
   ======================================================================== */

import { memo, useCallback } from 'react'
import { AlbumCard } from './AlbumCard'
import type { Album, Track } from '../../types/manifest'

export interface AlbumRowProps {
  albums: Album[]
  tracks: Track[]
  /** 点击专辑播放其曲目 */
  onPlay?: (album: Album, albumTracks: Track[]) => void
}

export const AlbumRow = memo(function AlbumRow({ albums, tracks, onPlay }: AlbumRowProps) {
  const handleClick = useCallback(
    (album: Album) => {
      if (!onPlay) return
      // 按 album.trackIds 过滤出本专辑曲目；无 trackIds 时回退到 albumId 匹配
      let albumTracks: Track[]
      if (album.trackIds && album.trackIds.length > 0) {
        const idSet = new Set(album.trackIds)
        albumTracks = tracks.filter((t) => idSet.has(t.id))
      } else {
        albumTracks = tracks.filter((t) => t.albumId === album.id)
      }
      if (albumTracks.length === 0) return
      onPlay(album, albumTracks)
    },
    [onPlay, tracks],
  )

  if (albums.length === 0) return null

  return (
    <div
      className="no-scrollbar"
      style={{
        display: 'flex',
        gap: 'var(--space-4)',
        overflowX: 'auto',
        paddingBottom: 'var(--space-2)',
        marginBottom: 'var(--space-6)',
      }}
    >
      {albums.map((album) => {
        // 计算专辑曲目数
        let trackCount: number
        if (album.trackIds && album.trackIds.length > 0) {
          trackCount = album.trackIds.length
        } else {
          trackCount = tracks.filter((t) => t.albumId === album.id).length
        }
        return (
          <AlbumCard
            key={album.id}
            album={album}
            trackCount={trackCount}
            onClick={onPlay ? () => handleClick(album) : undefined}
          />
        )
      })}
    </div>
  )
})
