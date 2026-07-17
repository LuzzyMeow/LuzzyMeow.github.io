/* ========================================================================
   LuzzyMeow · 频谱可视化
   Canvas 渲染柱状频谱，响应式宽度，60fps
   ======================================================================== */

import { memo, useEffect, useRef } from 'react'

export interface VisualizerProps {
  /** AnalyserNode，懒初始化后传入 */
  analyser: AnalyserNode | null
  /** 是否正在播放 */
  isPlaying: boolean
}

const BAR_COUNT = 64
const CONTAINER_HEIGHT = 60

export const Visualizer = memo(function Visualizer({
  analyser,
  isPlaying,
}: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 颜色（从 CSS variables 读取，仅在初始化时读一次）
    const style = getComputedStyle(document.documentElement)
    const color1 = style.getPropertyValue('--visualizer-color-1').trim() || '#0071e3'
    const color2 = style.getPropertyValue('--visualizer-color-2').trim() || '#ff2d92'
    const color3 = style.getPropertyValue('--visualizer-color-3').trim() || '#5ac8fa'

    // 高 DPI 处理
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      const width = container.clientWidth
      const height = CONTAINER_HEIGHT
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    // 监听父容器宽度变化
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    // 准备 analyser 数据数组
    if (analyser) {
      const bufferLen = analyser.frequencyBinCount
      // 显式使用 ArrayBuffer 以满足 getByteFrequencyData 的类型要求
      dataArrayRef.current = new Uint8Array(new ArrayBuffer(bufferLen))
    } else {
      dataArrayRef.current = null
    }

    /** 静态相位（用于非播放时的低高度波动） */
    let phase = 0

    const draw = () => {
      const width = container.clientWidth
      const height = CONTAINER_HEIGHT
      ctx.clearRect(0, 0, width, height)

      const gap = 2
      const barWidth = (width - gap * (BAR_COUNT - 1)) / BAR_COUNT

      // 读取频谱数据
      const data = dataArrayRef.current
      if (analyser && data && isPlaying) {
        analyser.getByteFrequencyData(data)
      }

      for (let i = 0; i < BAR_COUNT; i++) {
        let value: number
        if (analyser && data && isPlaying) {
          // 取低频段（前 BAR_COUNT 个 bin）映射到柱状
          const idx = Math.floor((i / BAR_COUNT) * Math.min(data.length, BAR_COUNT))
          value = data[idx] / 255
        } else {
          // 静态低高度波动
          phase += 0.002
          value = 0.08 + 0.06 * (Math.sin(phase * 2 + i * 0.3) * 0.5 + 0.5)
        }

        const barHeight = Math.max(2, value * (height - 4))
        const x = i * (barWidth + gap)
        const y = (height - barHeight) / 2

        // 渐变颜色：color1 → color2 → color3
        const t = i / (BAR_COUNT - 1)
        let fill: string
        if (t < 0.5) {
          fill = lerpColor(color1, color2, t * 2)
        } else {
          fill = lerpColor(color2, color3, (t - 0.5) * 2)
        }

        ctx.fillStyle = fill
        // 圆角顶部柱状
        roundedTopRect(ctx, x, y, barWidth, barHeight, Math.min(barWidth / 2, 3))
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [analyser, isPlaying])

  return (
    <div
      ref={containerRef}
      className="glass-visualizer"
      style={{
        width: '100%',
        height: CONTAINER_HEIGHT,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  )
})

/** 颜色线性插值（hex → rgb） */
function lerpColor(c1: string, c2: string, t: number): string {
  const rgb1 = hexToRgb(c1)
  const rgb2 = hexToRgb(c2)
  if (!rgb1 || !rgb2) return c1
  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * t)
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * t)
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * t)
  return `rgb(${r},${g},${b})`
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace('#', '').trim()
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16)
    const g = parseInt(cleaned[1] + cleaned[1], 16)
    const b = parseInt(cleaned[2] + cleaned[2], 16)
    return { r, g, b }
  }
  if (cleaned.length === 6) {
    const r = parseInt(cleaned.slice(0, 2), 16)
    const g = parseInt(cleaned.slice(2, 4), 16)
    const b = parseInt(cleaned.slice(4, 6), 16)
    return { r, g, b }
  }
  return null
}

/** 绘制顶部圆角矩形 */
function roundedTopRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x, y + h)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.lineTo(x + w - radius, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
  ctx.lineTo(x + w, y + h)
  ctx.closePath()
}
