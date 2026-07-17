/* ========================================================================
   LuzzyMeow · 播放列表浮层
   列出当前队列，当前行高亮，点击切换
   ======================================================================== */

import { memo } from 'react'
import { Play } from 'lucide-react'
import { GlassCard } from '../glass/GlassCard'
import { formatDuration } from '../../lib/format'
import type { Track } from '../../types/manifest'

export interface PlaylistProps {
  /** 队列曲目 */
  tracks: Track[]
  /** 当前曲目索引 */
  currentIndex: number
  /** 选中某首 */
  onSelect: (index: number) => void
}

export const Playlist = memo(function Playlist({
  tracks,
  currentIndex,
  onSelect,
}: PlaylistProps) {
  if (tracks.length === 0) {
    return (
      <GlassCard padding="lg" radius="md">
        <div
          style={{
            textAlign: 'center',
            color: 'var(--text-tertiary)',
            fontSize: 'var(--text-sm)',
            padding: 'var(--space-6) 0',
          }}
        >
          播放列表为空
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard
      padding="none"
      radius="md"
      style={{
        maxHeight: 400,
        overflowY: 'auto',
      }}
      className="no-scrollbar"
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {tracks.map((track, idx) => {
          const isCurrent = idx === currentIndex
          return (
            <div
              key={track.id}
              onClick={() => onSelect(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-2) var(--space-4)',
                cursor: 'pointer',
                background: isCurrent ? 'var(--accent-soft)' : 'transparent',
                transition: 'background var(--duration-fast) var(--ease-out)',
                borderBottom: '1px solid var(--glass-border)',
              }}
              onMouseEnter={(e) => {
                if (!isCurrent) e.currentTarget.style.background = 'var(--glass-bg-hover)'
              }}
              onMouseLeave={(e) => {
                if (!isCurrent) e.currentTarget.style.background = 'transparent'
              }}
            >
              {/* 序号 / 播放图标 */}
              <div
                style={{
                  width: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {isCurrent ? (
                  <Play
                    size={14}
                    color="var(--accent)"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                ) : (
                  <span
                    className="tabular"
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {idx + 1}
                  </span>
                )}
              </div>

              {/* 标题 + 原唱 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  className="truncate"
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: isCurrent ? 600 : 400,
                    color: isCurrent ? 'var(--accent)' : 'var(--text-primary)',
                  }}
                >
                  {track.title}
                </div>
                {track.originalArtist && (
                  <div
                    className="truncate"
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-tertiary)',
                      marginTop: 1,
                    }}
                  >
                    {track.originalArtist}
                  </div>
                )}
              </div>

              {/* 时长 */}
              {track.duration != null && track.duration > 0 && (
                <span
                  className="tabular"
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-tertiary)',
                    flexShrink: 0,
                  }}
                >
                  {formatDuration(track.duration)}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
})
