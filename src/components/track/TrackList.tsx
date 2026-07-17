/* ========================================================================
   LuzzyMeow · 曲目列表
   从 playerStore 读取当前播放状态，渲染 TrackCard 列表
   ======================================================================== */

import { memo } from 'react'
import { TrackCard } from './TrackCard'
import { usePlayerStore } from '../../store/playerStore'
import type { Track } from '../../types/manifest'

export interface TrackListProps {
  tracks: Track[]
}

export const TrackList = memo(function TrackList({ tracks }: TrackListProps) {
  const currentTrack = usePlayerStore((s) => s.currentTrack)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const playTrack = usePlayerStore((s) => s.playTrack)

  if (tracks.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: 'var(--space-12) 0',
          color: 'var(--text-tertiary)',
          fontSize: 'var(--text-sm)',
        }}
      >
        暂无曲目
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
      }}
    >
      {tracks.map((track) => {
        const isCurrent = currentTrack?.id === track.id
        return (
          <TrackCard
            key={track.id}
            track={track}
            isCurrent={isCurrent}
            isPlaying={isCurrent && isPlaying}
            onPlay={(t, queue) => playTrack(t, queue ?? tracks)}
          />
        )
      })}
    </div>
  )
})
