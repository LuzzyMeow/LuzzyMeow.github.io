#!/usr/bin/env node
/* ========================================================================
   LuzzyMeow · B 站合集同步脚本
   拉取指定 B 站合集元数据，生成/更新 site.json 中的 tracks
   - 仅同步元数据（标题/封面/时长/发布日期/BV 号）
   - 不下载音频，站内播放器不播放 B 站来源曲目，点击外链跳转
   - 保留本地 MP3 曲目（无 bilibili 字段的曲目不动）
   ======================================================================== */

import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SITE_FILE = join(ROOT, 'public', 'site.json')

// 合集 ID（从环境变量或默认值读取）
const SEASON_ID = process.env.BILI_SEASON_ID || '8529939'
// 合集所属 UP 主 mid（用于校验）
const SEASON_MID = process.env.BILI_SEASON_MID || '3690972504394108'
// API 端点
const API_URL = `https://api.bilibili.com/x/polymer/web-space/seasons_archives_list?season_id=${SEASON_ID}&mid=${SEASON_MID}&page_num=1&page_size=100`

/** 请求 B 站 API，带 UA 和超时 */
async function fetchSeason() {
  console.log(`拉取合集 season_id=${SEASON_ID} ...`)
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 15000)
  try {
    const res = await fetch(API_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        Referer: 'https://www.bilibili.com/',
      },
      signal: ctrl.signal,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    if (json.code !== 0) throw new Error(`B站 API 错误: ${json.message ?? json.code}`)
    return json.data
  } finally {
    clearTimeout(timer)
  }
}

/** 秒数转 mm:ss 或 h:mm:ss */
function formatDuration(sec) {
  if (!Number.isFinite(sec) || sec < 0) return ''
  const total = Math.floor(sec)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m)
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

/** Unix 时间戳转 YYYY-MM-DD */
function tsToDate(ts) {
  const d = new Date(ts * 1000)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** 从标题中尝试提取原唱歌手，失败返回空
 *  支持格式：【沐梓溪/翻唱/孤身】、【沐梓溪/原创/琥珀色麦芽糖】等
 *  匹配所有 【...】 块，找含 /翻唱/ 或 /原创/ 的，取最后一段
 */
function guessOriginalArtist(title) {
  const blocks = title.match(/【[^】]*】/g) || []
  for (const b of blocks) {
    const m = b.match(/\/\s*([^\/\】]+)\s*[\】]\s*$/)
    if (m && m[1]) return m[1].trim()
  }
  // 兼容旧格式：/xxx】 结尾
  const m2 = title.match(/\/\s*([^\/\】]+)\s*\】/)
  if (m2 && m2[1]) return m2[1].trim()
  return ''
}

/** 清理标题：移除所有【...】块（如【沐梓溪/翻唱/孤身】） */
function cleanTitle(title) {
  return title
    .replace(/【[^】]*】/g, '')
    .replace(/[[【][^\】\]]*[\】\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

async function main() {
  const data = await fetchSeason()
  const archives = data.archives ?? []
  const meta = data.meta ?? {}
  console.log(`合集: ${meta.title ?? '(无名)'} 共 ${archives.length} 个视频`)

  if (archives.length === 0) {
    console.log('合集为空，跳过')
    return
  }

  // 读取现有 site.json
  if (!existsSync(SITE_FILE)) {
    console.error('未找到 public/site.json，请先创建')
    process.exit(1)
  }
  const site = JSON.parse(await readFile(SITE_FILE, 'utf-8'))
  if (!Array.isArray(site.tracks)) site.tracks = []
  if (!Array.isArray(site.albums)) site.albums = []

  // 策略：先清空所有 bilibili 来源的 track，再重新写入（保证与合集同步）
  const localTracks = site.tracks.filter((t) => !t.bilibili)
  const biliTracksBefore = site.tracks.length - localTracks.length
  console.log(`本地曲目 ${localTracks.length} 个，B 站来源曲目 ${biliTracksBefore} 个（将被替换）`)

  // 构建新的 B 站 track 列表
  const newBiliTracks = archives.map((a) => {
    const url = `https://www.bilibili.com/video/${a.bvid}/`
    const originalArtist = guessOriginalArtist(a.title)
    const track = {
      id: `bili-${a.bvid}`,
      title: cleanTitle(a.title),
      date: tsToDate(a.pubdate),
      // B 站来源无 MP3 直链，src 留空
      src: '',
      duration: a.duration,
      cover: a.pic ? (a.pic.startsWith('//') ? `https:${a.pic}` : a.pic.replace(/^http:\/\//, 'https://')) : '',
      tags: ['B站', '翻唱'],
      bilibili: {
        bvid: a.bvid,
        url,
        view: a.stat?.view ?? 0,
      },
      download: {
        mp3: '',
        lossless: url,
        losslessLabel: 'B站',
      },
    }
    if (originalArtist) track.originalArtist = originalArtist
    return track
  })

  // 合并：本地曲目 + B 站曲目
  site.tracks = [...localTracks, ...newBiliTracks]

  // 同步专辑信息：用合集元数据更新或创建一个专辑
  const albumId = `bili-season-${SEASON_ID}`
  let album = site.albums.find((al) => al.id === albumId)
  const albumMeta = {
    id: albumId,
    title: meta.title ?? 'B 站合集',
    description: meta.description ?? '',
    cover: meta.cover ?? '',
    createdAt: meta.ptime ? tsToDate(meta.ptime) : '',
    trackIds: newBiliTracks.map((t) => t.id),
  }
  if (album) {
    Object.assign(album, albumMeta)
  } else {
    site.albums.push(albumMeta)
  }

  // 写回
  await writeFile(SITE_FILE, JSON.stringify(site, null, 2) + '\n', 'utf-8')
  console.log(`\n完成：本地 ${localTracks.length} 首 + B 站 ${newBiliTracks.length} 首 = ${site.tracks.length} 首`)
  console.log(`专辑: ${albumMeta.title} (${newBiliTracks.length} 首)`)
  console.log(`已写回 ${SITE_FILE}`)
}

main().catch((e) => {
  console.error('错误：', e)
  process.exit(1)
})
