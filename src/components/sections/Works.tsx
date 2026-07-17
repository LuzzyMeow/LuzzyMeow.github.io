import { memo, useCallback, useState } from 'react'
import { FilterBar } from '../filter/FilterBar'
import { AlbumRow } from '../album/AlbumRow'
import { TrackList } from '../track/TrackList'
import { usePlayerStore } from '../../store/playerStore'
import type { Album, Track } from '../../types/manifest'

export interface WorksProps {
  tracks: Track[]
  albums: Album[]
  onPlay?: (track: Track, queue?: Track[]) => void
}

export const Works = memo(function Works({ tracks, albums, onPlay }: WorksProps) {
  const [filteredTracks, setFilteredTracks] = useState<Track[]>(tracks)
  const playTrack = usePlayerStore((s) => s.playTrack)

  const handleFilter = useCallback((filtered: Track[]) => { setFilteredTracks(filtered) }, [])

  const handlePlay = useCallback(
    (track: Track, queue?: Track[]) => {
      if (onPlay) onPlay(track, queue)
      else playTrack(track, queue ?? tracks)
    },
    [onPlay, playTrack, tracks],
  )

  const handleAlbumPlay = useCallback(
    (_album: Album, albumTracks: Track[]) => {
      if (albumTracks.length === 0) return
      handlePlay(albumTracks[0], albumTracks)
    },
    [handlePlay],
  )

  return (
    <>
      {tracks.length > 0 ? (
        <>
          <FilterBar tracks={tracks} onFilter={handleFilter} />
          {albums.length > 0 && <AlbumRow albums={albums} tracks={tracks} onPlay={handleAlbumPlay} />}
          <TrackList tracks={filteredTracks} />
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: 'var(--space-16) 0', color: 'var(--text-tertiary)', fontSize: 'var(--text-base)' }}>
          暂无作品，敬请期待
        </div>
      )}
    </>
  )
})
