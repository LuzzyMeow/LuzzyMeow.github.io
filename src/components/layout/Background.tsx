import { memo } from 'react'

/**
 * 全屏动态渐变背景 — 极简白灰 v3
 * 4 个极淡灰色渐变光晕，几乎不可见
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
      <div
        className="bg-blob bg-blob-1"
        style={{
          position: 'absolute',
          width: '65vw',
          height: '65vw',
          top: '-20vw',
          left: '-12vw',
          background: `radial-gradient(circle, rgba(0,0,0,0.04) 0%, transparent 70%)`,
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
          background: `radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%)`,
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
          background: `radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%)`,
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
          background: `radial-gradient(circle, rgba(0,0,0,0.02) 0%, transparent 70%)`,
          filter: 'blur(50px)',
          borderRadius: '50%',
        }}
      />

      <style>{`
        @keyframes blobFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(8vw, 4vh) scale(1.05); }
          66% { transform: translate(-4vw, 6vh) scale(0.96); }
        }
        @keyframes blobFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-6vw, -3vh) scale(0.96); }
          66% { transform: translate(4vw, 5vh) scale(1.04); }
        }
        @keyframes blobFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(6vw, -6vh) scale(1.06); }
        }
        @keyframes blobFloat4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-6vw, 3vh) scale(0.94); }
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
