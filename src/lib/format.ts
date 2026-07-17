/**
 * 格式化工具
 */

/** 秒数转 mm:ss 或 h:mm:ss */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--'
  const total = Math.floor(seconds)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m)
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

/** 字节数转人类可读 */
export function formatBytes(bytes: number): string {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`
}

/** ISO 日期转中文日期 YYYY年MM月DD日 */
export function formatDateCN(iso: string): string {
  if (!iso) return ''
  // 兼容 YYYY / YYYY-MM / YYYY-MM-DD
  const parts = iso.split('-')
  if (parts.length === 1) return `${parts[0]}年`
  if (parts.length === 2) return `${parts[0]}年${parseInt(parts[1])}月`
  return `${parts[0]}年${parseInt(parts[1])}月${parseInt(parts[2])}日`
}

/** ISO 日期转简洁显示 YYYY.MM.DD */
export function formatDateShort(iso: string): string {
  if (!iso) return ''
  return iso.replace(/-/g, '.')
}

/** 相对时间，如 "3 天前" */
export function formatRelative(iso: string): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  const now = Date.now()
  const diff = now - date.getTime()
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return '刚刚'
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min} 分钟前`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} 小时前`
  const day = Math.floor(hr / 24)
  if (day < 30) return `${day} 天前`
  const mon = Math.floor(day / 30)
  if (mon < 12) return `${mon} 个月前`
  const yr = Math.floor(mon / 12)
  return `${yr} 年前`
}
