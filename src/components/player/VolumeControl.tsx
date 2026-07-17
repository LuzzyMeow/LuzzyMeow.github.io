/* ========================================================================
   LuzzyMeow · 音量控制
   图标按钮 + 水平音量条
   ======================================================================== */

import { memo, useCallback, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { Volume2, Volume1, VolumeX } from 'lucide-react'

export interface VolumeControlProps {
  /** 音量 0-1 */
  volume: number
  /** 是否静音 */
  isMuted: boolean
  /** 音量变化回调 */
  onVolumeChange: (v: number) => void
  /** 切换静音回调 */
  onToggleMute: () => void
}

export const VolumeControl = memo(function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}: VolumeControlProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  // 实际生效音量（静音时视为 0）
  const effectiveVolume = isMuted ? 0 : volume
  const percent = Math.round(effectiveVolume * 100)

  // 图标选择
  const Icon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2

  const getVolumeFromEvent = useCallback((clientX: number): number => {
    const el = trackRef.current
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return ratio
  }, [])

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent) => {
      e.preventDefault()
      const v = getVolumeFromEvent(e.clientX)
      onVolumeChange(v)
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    },
    [getVolumeFromEvent, onVolumeChange],
  )

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent) => {
      if (e.buttons !== 1) return
      const v = getVolumeFromEvent(e.clientX)
      onVolumeChange(v)
    },
    [getVolumeFromEvent, onVolumeChange],
  )

  return (
    <div
      className="volume-control"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        flexShrink: 0,
      }}
    >
      <button
        type="button"
        onClick={onToggleMute}
        aria-label={isMuted ? '取消静音' : '静音'}
        style={{
          width: 32,
          height: 32,
          borderRadius: 'var(--radius-pill)',
          border: 'none',
          background: 'transparent',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all var(--duration-fast) var(--ease-out)',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--text-primary)'
          e.currentTarget.style.background = 'var(--glass-bg)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-secondary)'
          e.currentTarget.style.background = 'transparent'
        }}
      >
        <Icon size={18} />
      </button>

      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        style={{
          position: 'relative',
          width: 80,
          height: 16,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          touchAction: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 4,
            borderRadius: 'var(--radius-pill)',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${percent}%`,
              height: '100%',
              background: 'var(--accent)',
              borderRadius: 'var(--radius-pill)',
            }}
          />
        </div>
      </div>
    </div>
  )
})
