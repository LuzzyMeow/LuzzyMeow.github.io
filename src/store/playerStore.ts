/* ========================================================================
   LuzzyMeow · 播放器状态（Zustand）
   管理当前曲目、队列、播放状态、进度、音量、循环模式
   持久化：volume、loopMode
   ======================================================================== */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { LoopMode, Track } from '../types/manifest'

export interface PlayerState {
  // ---- 状态 ----
  /** 当前曲目 */
  currentTrack: Track | null
  /** 当前播放队列 */
  queue: Track[]
  /** 当前曲目在队列中的索引（-1 表示不在队列中） */
  queueIndex: number
  /** 是否正在播放 */
  isPlaying: boolean
  /** 当前播放时间（秒） */
  currentTime: number
  /** 总时长（秒） */
  duration: number
  /** 音量 0-1 */
  volume: number
  /** 是否静音 */
  isMuted: boolean
  /** 播放速度 */
  playbackRate: number
  /** 循环模式 */
  loopMode: LoopMode
  /** 单曲循环重放信号：每次切换单曲循环重播时自增，由 audio 元素监听 */
  replaySignal: number

  // ---- Actions ----
  /** 播放指定曲目，可附带队列（默认 [track]） */
  playTrack: (track: Track, queue?: Track[]) => void
  /** 切换播放/暂停 */
  togglePlay: () => void
  /** 暂停 */
  pause: () => void
  /** 下一首 */
  next: () => void
  /** 上一首 */
  prev: () => void
  /** 跳转到指定时间 */
  seek: (time: number) => void
  /** 设置音量 0-1 */
  setVolume: (volume: number) => void
  /** 切换静音 */
  toggleMute: () => void
  /** 设置播放速度 */
  setPlaybackRate: (rate: number) => void
  /** 设置循环模式 */
  setLoopMode: (mode: LoopMode) => void
  /** 设置当前时间（由 audio timeupdate 触发） */
  setCurrentTime: (time: number) => void
  /** 设置总时长（由 audio loadedmetadata 触发） */
  setDuration: (duration: number) => void
  /** 停止播放并清空 */
  stop: () => void
  /** 标记为正在播放 */
  setPlaying: (playing: boolean) => void
}

/**
 * 在队列中按 list 模式取下一首索引
 * 到末尾回到 0（不自动停止）
 */
function nextIndexList(queueLen: number, currentIndex: number): number {
  if (queueLen === 0) return -1
  return (currentIndex + 1) % queueLen
}

/**
 * shuffle 模式取下一首索引
 * 避免立即重复当前曲目（队列长度 > 1 时）
 */
function nextIndexShuffle(queueLen: number, currentIndex: number): number {
  if (queueLen === 0) return -1
  if (queueLen === 1) return 0
  let idx = currentIndex
  while (idx === currentIndex) {
    idx = Math.floor(Math.random() * queueLen)
  }
  return idx
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      // ---- 初始状态 ----
      currentTrack: null,
      queue: [],
      queueIndex: -1,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      isMuted: false,
      playbackRate: 1,
      loopMode: 'list',
      replaySignal: 0,

      // ---- Actions ----
      playTrack: (track, queue) => {
        const q = queue && queue.length > 0 ? queue : [track]
        const idx = q.findIndex((t) => t.id === track.id)
        set({
          currentTrack: track,
          queue: q,
          queueIndex: idx >= 0 ? idx : 0,
          isPlaying: true,
          currentTime: 0,
          duration: track.duration ?? 0,
        })
      },

      togglePlay: () => {
        const { currentTrack } = get()
        if (!currentTrack) return
        set((s) => ({ isPlaying: !s.isPlaying }))
      },

      pause: () => set({ isPlaying: false }),

      setPlaying: (playing) => set({ isPlaying: playing }),

      next: () => {
        const { queue, queueIndex, loopMode, currentTrack } = get()
        if (queue.length === 0 || !currentTrack) return

        // 单曲循环：同曲重新播放（emit 信号）
        if (loopMode === 'single') {
          set((s) => ({
            replaySignal: s.replaySignal + 1,
            isPlaying: true,
            currentTime: 0,
          }))
          return
        }

        // shuffle：随机选下一首
        const nextIdx =
          loopMode === 'shuffle'
            ? nextIndexShuffle(queue.length, queueIndex)
            : nextIndexList(queue.length, queueIndex)

        if (nextIdx < 0) return
        const nextTrack = queue[nextIdx]
        set({
          currentTrack: nextTrack,
          queueIndex: nextIdx,
          isPlaying: true,
          currentTime: 0,
          duration: nextTrack.duration ?? 0,
        })
      },

      prev: () => {
        const { queue, queueIndex, currentTrack, currentTime } = get()
        if (queue.length === 0 || !currentTrack) return

        // 播放超过 3 秒，回到本曲开头
        if (currentTime > 3) {
          set({ currentTime: 0, replaySignal: get().replaySignal + 1 })
          return
        }

        let prevIdx: number
        if (queue.length === 1) {
          prevIdx = 0
        } else {
          prevIdx = (queueIndex - 1 + queue.length) % queue.length
        }
        const prevTrack = queue[prevIdx]
        set({
          currentTrack: prevTrack,
          queueIndex: prevIdx,
          isPlaying: true,
          currentTime: 0,
          duration: prevTrack.duration ?? 0,
        })
      },

      seek: (time) => set({ currentTime: time }),

      setVolume: (volume) => {
        const v = Math.max(0, Math.min(1, volume))
        set({ volume: v, isMuted: v === 0 })
      },

      toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),

      setPlaybackRate: (rate) => set({ playbackRate: rate }),

      setLoopMode: (mode) => set({ loopMode: mode }),

      setCurrentTime: (time) => set({ currentTime: time }),

      setDuration: (duration) => set({ duration }),

      stop: () =>
        set({
          currentTrack: null,
          queue: [],
          queueIndex: -1,
          isPlaying: false,
          currentTime: 0,
          duration: 0,
        }),
    }),
    {
      name: 'luzzymeow-player',
      storage: createJSONStorage(() => localStorage),
      // 仅持久化 volume、loopMode、playbackRate
      partialize: (state) => ({
        volume: state.volume,
        loopMode: state.loopMode,
        playbackRate: state.playbackRate,
      }),
    },
  ),
)
