import type { SiteData } from '../types/manifest'

/**
 * 加载站点数据
 * 从 /site.json 拉取并校验最小结构
 */
export async function loadSiteData(): Promise<SiteData> {
  const res = await fetch('/site.json', { cache: 'no-cache' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data: SiteData = await res.json()
  if (!data || typeof data !== 'object') {
    throw new Error('site.json 不是有效对象')
  }
  if (!data.owner || !data.owner.name) {
    throw new Error('site.json 缺少 owner.name')
  }
  if (!Array.isArray(data.tracks)) {
    data.tracks = []
  }
  if (!Array.isArray(data.albums)) {
    data.albums = []
  }
  return data
}
