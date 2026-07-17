/* ========================================================================
   LuzzyMeow · LRC 歌词解析
   解析 [mm:ss.xx] 文本 格式，支持一行多个时间标签
   ======================================================================== */

export interface LrcLine {
  /** 该行起始时间（秒） */
  time: number
  /** 歌词文本 */
  text: string
}

/** 匹配 [mm:ss.xx] / [mm:ss] / [mm:ss:xx] 形式的时间标签 */
const TIME_TAG_RE = /\[(\d{1,3}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g

/**
 * 将 mm:ss.xx 各部分解析为秒数
 * - mm: 分钟
 * - ss: 秒
 * - xx: 毫秒（2 位表示百分秒，3 位表示毫秒，统一按毫秒处理）
 */
function parseTime(mm: string, ss: string, frac: string | undefined): number {
  const minutes = parseInt(mm, 10)
  const seconds = parseInt(ss, 10)
  let millis = 0
  if (frac) {
    // 2 位 → 百分秒；3 位 → 毫秒。统一转毫秒。
    if (frac.length === 2) {
      millis = parseInt(frac, 10) * 10
    } else if (frac.length === 3) {
      millis = parseInt(frac, 10)
    } else {
      // 其他长度按 10 的幂归一到毫秒
      millis = Math.round((parseInt(frac, 10) / Math.pow(10, frac.length)) * 1000)
    }
  }
  return minutes * 60 + seconds + millis / 1000
}

/**
 * 解析 LRC 文本为歌词行数组
 * - 支持一行多个时间标签：`[00:01.00][00:05.00]同一句`
 * - 自动过滤元信息行（如 [ti:]、[ar:]、[al:]、[by:] 等非时间标签）
 * - 过滤空文本行
 * - 按 time 升序排序
 */
export function parseLrc(content: string): LrcLine[] {
  if (!content) return []

  const lines: LrcLine[] = []
  const rawLines = content.split(/\r?\n/)

  for (const rawLine of rawLines) {
    if (!rawLine) continue

    // 收集所有时间标签
    TIME_TAG_RE.lastIndex = 0
    const times: number[] = []
    let match: RegExpExecArray | null
    while ((match = TIME_TAG_RE.exec(rawLine)) !== null) {
      times.push(parseTime(match[1], match[2], match[3]))
    }

    // 没有时间标签：跳过（含 [ti:] 等元信息行）
    if (times.length === 0) continue

    // 提取歌词文本：移除所有时间标签后剩余内容
    const text = rawLine.replace(TIME_TAG_RE, '').trim()

    // 过滤空文本行
    if (!text) continue

    for (const time of times) {
      lines.push({ time, text })
    }
  }

  // 按 time 升序排序（稳定）
  lines.sort((a, b) => a.time - b.time)

  return lines
}

/**
 * 返回当前时间对应的歌词行索引
 * 找最后一个 time <= currentTime 的行
 * 无匹配返回 -1
 */
export function findActiveIndex(lines: LrcLine[], currentTime: number): number {
  if (lines.length === 0) return -1
  // 早于第一行
  if (currentTime < lines[0].time) return -1

  // 二分查找：找最后一个 time <= currentTime
  let lo = 0
  let hi = lines.length - 1
  let result = -1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (lines[mid].time <= currentTime) {
      result = mid
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  return result
}
