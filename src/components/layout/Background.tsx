import { memo } from 'react'

/**
 * 全屏动态渐变背景 — 暮光紫夜 v2
 * 4 个大型径向渐变光晕，紫/品红/蓝/青 缓慢漂移
 */
export const Background = memo(function Background() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: 'var(--bg-base)',
      }}
    >
      {/* 4 个光晕 */}
      <div
        className="bg-blob bg-blob-1"
        style={{
          position: 'absolute',
          width: '65vw',
          height: '65vw',
          top: '-20vw',
          left: '-12vw',
          background: `radial-gradient(circle, rgba(124, 58, 237, 0.35) 0%, transparent 70%)`,
          filter: 'blur(50px)',
          borderRadius: '50%',
        }}
      />
      <div
        className="bg-blob bg-blob-2"
        style={{
          position: 'absolute',
          width: '55vw',
          height: '55vw',
          top: '15vw',
          right: '-15vw',
          background: `radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)`,
          filter: 'blur(50px)',
          borderRadius: '50%',
        }}
      />
      <div
        className="bg-blob bg-blob-3"
        style={{
          position: 'absolute',
          width: '50vw',
          height: '50vw',
          bottom: '-12vw',
          left: '15vw',
          background: `radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)`,
          filter: 'blur(50px)',
          borderRadius: '50%',
        }}
      />
      <div
        className="bg-blob bg-blob-4"
        style={{
          position: 'absolute',
          width: '45vw',
          height: '45vw',
          top: '35vh',
          left: '35vw',
          background: `radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)`,
          filter: 'blur(50px)',
          borderRadius: '50%',
        }}
      />

      {/* 星点噪点纹理：模拟星空 */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" opacity="0.05" />
      </svg>

      {/* 动画关键帧 */}
      <style>{`
        @keyframes blobFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(10vw, 6vh) scale(1.08); }
          66% { transform: translate(-5vw, 10vh) scale(0.93); }
        }
        @keyframes blobFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-8vw, -5vh) scale(0.93); }
          66% { transform: translate(5vw, 8vh) scale(1.07); }
        }
        @keyframes blobFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(8vw, -10vh) scale(1.1); }
        }
        @keyframes blobFloat4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-10vw, 5vh) scale(0.9); }
        }
        .bg-blob-1 { animation: blobFloat1 30s var(--ease-in-out) infinite; }
        .bg-blob-2 { animation: blobFloat2 34s var(--ease-in-out) infinite; }
        .bg-blob-3 { animation: blobFloat3 28s var(--ease-in-out) infinite; }
        .bg-blob-4 { animation: blobFloat4 32s var(--ease-in-out) infinite; }

        @media (prefers-reduced-motion: reduce) {
          .bg-blob { animation: none !important; }
        }
      `}</style>
    </div>
  )
})
