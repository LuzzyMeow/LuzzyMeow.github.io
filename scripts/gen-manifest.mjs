#!/usr/bin/env node
/* ========================================================================
   LuzzyMeow · site.json 自动生成 / 追加脚本
   扫描 public/audio/ 下所有 .mp3 文件，保留已存在的元数据，
   仅对新文件生成最小骨架并追加到 site.json 的 tracks 数组
   ======================================================================== */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, extname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const AUDIO_DIR = join(ROOT, 'public', 'audio')
const SITE_FILE = join(ROOT, 'public', 'site.json')

/** 文件名转 kebab-case ID */
function toId(filename) {
  return basename(filename, extname(filename))
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5\-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

/** 扫描 audio 目录，递归获取所有 mp3 */
async function scanAudio(dir) {
  if (!existsSync(dir)) return []
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await scanAudio(full)))
    } else if (entry.isFile() && /\.mp3$/i.test(entry.name)) {
      files.push(full)
    }
  }
  return files
}

/** 将绝对路径转为相对站点根的路径 */
function toSitePath(absPath) {
  const rel = absPath.replace(/\\/g, '/').replace(/.*\/public\//, '/')
  return rel
}

async function main() {
  console.log('扫描 public/audio/ ...')
  const audioFiles = await scanAudio(AUDIO_DIR)
  console.log(`找到 ${audioFiles.length} 个 MP3 文件`)

  if (audioFiles.length === 0) {
    console.log('未发现 MP3 文件，跳过')
    return
  }

  // 读取现有 site.json
  let site
  if (existsSync(SITE_FILE)) {
    const raw = await readFile(SITE_FILE, 'utf-8')
    site = JSON.parse(raw)
    if (!Array.isArray(site.tracks)) site.tracks = []
    if (!Array.isArray(site.albums)) site.albums = []
  } else {
    console.error('未找到 public/site.json，请先创建')
    process.exit(1)
  }

  // 建立已存在 track 的 id → track 索引
  const existing = new Map()
  for (const t of site.tracks) existing.set(t.id, t)

  // 建立已存在 track 的 src → track 索引（防止同文件名重复添加）
  const existingBySrc = new Map()
  for (const t of site.tracks) {
    if (t.src) existingBySrc.set(t.src, t)
  }

  let added = 0
  let skipped = 0

  for (const file of audioFiles) {
    const src = toSitePath(file)
    const id = toId(basename(file))

    // 已存在（按 src 或 id）则跳过，保留原元数据
    if (existingBySrc.has(src) || existing.has(id)) {
      skipped++
      continue
    }

    // 生成最小骨架
    const newTrack = {
      id,
      title: basename(file, extname(file)),
      src,
      tags: [],
      download: {
        mp3: src,
        lossless: '',
        losslessLabel: '',
      },
    }
    site.tracks.push(newTrack)
    existing.set(id, newTrack)
    existingBySrc.set(src, newTrack)
    added++
    console.log(`  + 新增: ${id} (${src})`)
  }

  if (added === 0) {
    console.log(`\n无新增文件，跳过 ${skipped} 个已存在`)
    return
  }

  // 写回
  await writeFile(SITE_FILE, JSON.stringify(site, null, 2) + '\n', 'utf-8')
  console.log(`\n完成：新增 ${added} 首，跳过 ${skipped} 个已存在`)
  console.log(`已写回 ${SITE_FILE}`)
  console.log('\n下一步：编辑 site.json 补充标题/原唱/标签/网盘链接等元数据')
}

main().catch((e) => {
  console.error('错误：', e)
  process.exit(1)
})
