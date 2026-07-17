/* ========================================================================
   LuzzyMeow · 歌词视图
   滚动歌词 + 当前行高亮 + 点击跳转 + 上下渐隐遮罩
   ======================================================================== */

import { memo, useEffect, useRef } from 'react'
import { findActiveIndex, type LrcLine } from '../../lib/lrc'

export interface LyricViewProps {
  /** 已解析的歌词行 */
  lyrics: LrcLine[]
  /** 当前播放时间（秒） */
  currentTime: number
  /** 点击歌词行跳转 */
  onSeek: (time: number) => void
}

export const LyricView = memo(function LyricView({
  lyrics,
  currentTime,
  onSeek,
}: LyricViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const activeLineRef = useRef<HTMLDivElement>(null)

  const activeIndex = findActiveIndex(lyrics, currentTime)

  // 自动滚动到当前行
  useEffect(() => {
    const container = containerRef.current
    const active = activeLineRef.current
    if (!container || !active) return
    active.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [activeIndex])

  if (lyrics.length === 0) {
    return (
      <div
        style={{
          height: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-tertiary)',
          fontSize: 'var(--text-sm)',
        }}
      >
        暂无歌词
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="no-scrollbar"
      style={{
        height: 200,
        overflowY: 'auto',
        padding: 'var(--space-4) var(--space-4)',
        // 上下渐隐遮罩
        maskImage:
          'linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%)',
        scrollBehavior: 'smooth',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {/* 顶部留白，确保第一行能居中 */}
        <div style={{ height: 60, flexShrink: 0 }} />
        {lyrics.map((line, idx) => {
          const isActive = idx === activeIndex
          const isPast = idx < activeIndex
          return (
            <div
              key={`${line.time}-${idx}`}
              ref={isActive ? activeLineRef : undefined}
              onClick={() => onSeek(line.time)}
              style={{
                textAlign: 'center',
                fontSize: isActive ? 'var(--text-md)' : 'var(--text-sm)',
                fontWeight: isActive ? 700 : 400,
                color: isActive
                  ? 'var(--accent)'
                  : isPast
                    ? 'var(--text-tertiary)'
                    : 'var(--text-secondary)',
                transform: isActive ? 'scale(1.04)' : 'scale(1)',
                transition:
                  'all var(--duration-normal) var(--ease-out)',
                cursor: 'pointer',
                padding: 'var(--space-1) var(--space-2)',
                lineHeight: 1.5,
                userSelect: 'none',
              }}
            >
              {line.text}
            </div>
          )
        })}
        {/* 底部留白 */}
        <div style={{ height: 60, flexShrink: 0 }} />
      </div>
    </div>
  )
})
