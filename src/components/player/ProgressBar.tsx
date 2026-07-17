/* ========================================================================
   LuzzyMeow · 播放进度条
   玻璃风格 + 渐变已播放 + 圆形拖动手柄（hover 显示）
   支持点击跳转和拖动
   ======================================================================== */

import { memo, useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { formatDuration } from '../../lib/format'

export interface ProgressBarProps {
  /** 当前时间（秒） */
  current: number
  /** 总时长（秒） */
  duration: number
  /** 跳转回调 */
  onSeek: (time: number) => void
}

export const ProgressBar = memo(function ProgressBar({
  current,
  duration,
  onSeek,
}: ProgressBarProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragTime, setDragTime] = useState(0)

  const safeDuration = duration > 0 ? duration : 0
  const displayTime = isDragging ? dragTime : current
  const percent = safeDuration > 0 ? Math.min(100, (displayTime / safeDuration) * 100) : 0

  /** 根据鼠标位置计算时间 */
  const getTimeFromEvent = useCallback(
    (clientX: number): number => {
      const el = trackRef.current
      if (!el || safeDuration <= 0) return 0
      const rect = el.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      return ratio * safeDuration
    },
    [safeDuration],
  )

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent) => {
      if (safeDuration <= 0) return
      e.preventDefault()
      const time = getTimeFromEvent(e.clientX)
      setDragTime(time)
      setIsDragging(true)
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    },
    [getTimeFromEvent, safeDuration],
  )

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent) => {
      if (!isDragging) return
      const time = getTimeFromEvent(e.clientX)
      setDragTime(time)
    },
    [isDragging, getTimeFromEvent],
  )

  const handlePointerUp = useCallback(
    (e: ReactPointerEvent) => {
      if (!isDragging) return
      const time = getTimeFromEvent(e.clientX)
      onSeek(time)
      setIsDragging(false)
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    },
    [isDragging, getTimeFromEvent, onSeek],
  )

  // 拖动结束清理（防止意外）
  useEffect(() => {
    if (!isDragging) return
    const handleCancel = () => setIsDragging(false)
    window.addEventListener('pointercancel', handleCancel)
    return () => window.removeEventListener('pointercancel', handleCancel)
  }, [isDragging])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        width: '100%',
      }}
    >
      {/* 当前时间 */}
      <span
        className="tabular"
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--text-secondary)',
          minWidth: 40,
          textAlign: 'right',
          flexShrink: 0,
        }}
      >
        {formatDuration(displayTime)}
      </span>

      {/* 进度轨道 */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          position: 'relative',
          flex: 1,
          height: 16,
          cursor: safeDuration > 0 ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          touchAction: 'none',
        }}
      >
        {/* 轨道背景 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 6,
            borderRadius: 'var(--radius-pill)',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            overflow: 'hidden',
          }}
        >
          {/* 已播放渐变 */}
          <div
            style={{
              width: `${percent}%`,
              height: '100%',
              background:
                'linear-gradient(90deg, var(--accent), var(--sys-pink))',
              borderRadius: 'var(--radius-pill)',
              transition: isDragging ? 'none' : 'width var(--duration-fast) linear',
            }}
          />
        </div>

        {/* 拖动手柄（hover 显示） */}
        <div
          style={{
            position: 'absolute',
            left: `calc(${percent}% - 7px)`,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: 'var(--text-primary)',
            boxShadow:
              '0 1px 4px rgba(0,0,0,0.2), 0 0 0 0.5px rgba(0,0,0,0.05)',
            opacity: isDragging ? 1 : 0,
            transition: 'opacity var(--duration-fast) var(--ease-out)',
            pointerEvents: 'none',
          }}
          className="progress-handle"
        />

        {/* 拖动时显示时间 tooltip */}
        {isDragging && (
          <div
            style={{
              position: 'absolute',
              left: `calc(${percent}% - 25px)`,
              bottom: 18,
              padding: '2px var(--space-2)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--glass-bg-strong)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid var(--glass-border)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-primary)',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
            className="tabular"
          >
            {formatDuration(dragTime)}
          </div>
        )}
      </div>

      {/* 总时长 */}
      <span
        className="tabular"
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--text-tertiary)',
          minWidth: 40,
          flexShrink: 0,
        }}
      >
        {formatDuration(safeDuration)}
      </span>

      {/* hover 显示手柄 */}
      <style>{`
        .progress-handle-wrap:hover .progress-handle { opacity: 1 !important; }
      `}</style>
    </div>
  )
})
