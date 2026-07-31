# LuzzyMeow 个人主页

> 暖纸·唱片内页（Editorial）风格的综合性个人主页
> 站点：<https://luzzymeow.github.io/> · 仓库：<https://github.com/LuzzyMeow/LuzzyMeow.github.io>

基于 **Vite + React 18 + TypeScript + Zustand** 构建，部署于 GitHub Pages。

主页包含 7 个模块：**Hero → 作品集 → 关于我 → 项目展示 → 时间线（项目更新日志）→ 友链 → 联系方式**。其中作品集内置完整音乐播放器（频谱可视化 + LRC 歌词同步 + 播放列表 + 循环模式），支持本地音频的播放与下载；B 站投稿曲目点击跳转原站观看。项目与时间线模块动态同步 GitHub 仓库与提交记录。

---

## 目录

- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [技术栈](#技术栈)
- [核心概念](#核心概念)
  - [数据驱动：site.json](#数据驱动sitejson)
  - [暖纸·唱片内页设计系统](#暖纸唱片内页设计系统)
  - [音乐播放器架构](#音乐播放器架构)
- [内容维护指南](#内容维护指南)
  - [新增翻唱/原创音频](#新增翻唱原创音频)
  - [编辑各模块内容](#编辑各模块内容)
  - [本地预览与部署](#本地预览与部署)
- [开发指南](#开发指南)
  - [环境要求](#环境要求)
  - [常用脚本](#常用脚本)
  - [新增 Section 组件](#新增-section-组件)
  - [类型定义参考](#类型定义参考)
- [部署机制](#部署机制)
- [常见问题](#常见问题)
- [许可证](#许可证)

---

## 快速开始

```bash
# 1. 克隆
git clone https://github.com/LuzzyMeow/LuzzyMeow.github.io.git
cd LuzzyMeow.github.io

# 2. 安装依赖
npm install

# 3. 启动开发服务器（默认 http://localhost:5173/）
npm run dev

# 4. 生产构建
npm run build

# 5. 预览构建产物
npm run preview
```

> **Node 版本要求**：≥ 18（推荐 20 LTS，与 GitHub Actions 一致）。

---

## 项目结构

```
LuzzyMeow.github.io/
├── .github/workflows/deploy.yml      # GitHub Actions 自动部署
├── .github/workflows/sync-bilibili.yml  # B 站合集每小时定时同步
├── public/
│   ├── audio/                     # MP3 音频文件目录
│   ├── lyrics/                    # LRC 歌词文件目录
│   ├── favicon.svg
│   └── site.json                  # ★ 全站数据源（核心）
├── scripts/
│   └── gen-manifest.mjs           # 自动扫描 MP3 并更新 site.json
├── src/
│   ├── components/
│   │   ├── core/                  # 基础组件（Button / Tag / Panel / Icon）
│   │   ├── layout/                # 布局（Navbar / Hero / SectionShell / Footer）
│   │   ├── player/                # 音乐播放器（PlayerBar 主组件 + 子组件）
│   │   └── sections/              # 9 个主页 section 组件
│   ├── lib/                       # 工具函数（格式化、LRC 解析、数据加载）
│   ├── store/playerStore.ts       # Zustand 播放器状态
│   ├── styles/
│   │   ├── tokens.css             # 设计令牌（CSS variables）
│   │   └── editorial.css          # 组件类样式
│   ├── types/manifest.ts          # ★ 全站类型定义（与 site.json 对齐）
│   ├── App.tsx                    # 应用入口、section 编排
│   ├── main.tsx                   # React 挂载
│   └── index.css                  # 全局重置 + 样式入口
├── PROJECT_PLAN.md                # 项目实施 Plan（历史决策记录）
├── README.md                      # 本文件
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| 构建工具 | Vite 5 | 开发服务器 + 生产打包 |
| 框架 | React 18 | 函数组件 + Hooks |
| 语言 | TypeScript 5 (strict) | 全量类型 |
| 样式 | CSS Variables 设计令牌 | `tokens.css` + `editorial.css` 双文件 |
| 状态管理 | Zustand 4 (+ persist) | 播放器状态，持久化音量与循环模式 |
| 图标 | lucide-react | 按需引入 |
| 部署 | GitHub Pages + GitHub Actions | push 到 main 自动部署 |

> **注**：本项目不使用 UI 框架，视觉完全依赖 CSS Variables 设计令牌（`tokens.css`）+ 组件类（`editorial.css`）。新增组件时优先使用令牌变量，保持视觉一致性。

---

## 核心概念

### 数据驱动：site.json

**所有页面内容均由 `public/site.json` 驱动**，组件层只负责渲染。这意味着：

- 修改文案、新增作品、更新项目 → **编辑 `site.json`，无需改代码**
- 类型定义见 [`src/types/manifest.ts`](src/types/manifest.ts)，与 JSON 结构一一对应
- 运行时通过 [`src/lib/site.ts`](src/lib/site.ts) 的 `loadSiteData()` 拉取

顶层结构：

```jsonc
{
  "version": 1,
  "owner": { /* 个人信息、关于我、联系方式 */ },
  "skills": [ /* 技能分组 */ ],
  "tracks": [ /* 曲目（翻唱+原创，靠 tag 区分） */ ],
  "albums": [ /* 专辑合集 */ ],
  "projects": [ /* 项目展示 */ ],
  "posts": [ /* 随笔文章 */ ],
  "timeline": [ /* 时间线事件 */ ],
  "friends": [ /* 友链 */ ]
}
```

### 暖纸·唱片内页设计系统

设计系统由两个文件构成，所有视觉规则集中管理：

- [`src/styles/tokens.css`](src/styles/tokens.css)：设计令牌，以 CSS Variables 形式暴露
  - 纸与墨：`--paper`（米白纸底）、`--ink`（墨黑文字）、`--paper-raised` / `--paper-deep`
  - 朱红点缀：`--accent` / `--accent-deep`，仅用于高亮与 CTA
  - 反白夜区：`--night` 系列（底部播放器与页脚用墨黑，形成唱片封套感）
  - 间距：`--space-1` ~ `--space-20`
  - 圆角：`--radius-sm/md/lg/pill`（印刷感小圆角，播放器胶囊例外）
  - 动效：`--ease-out`、`--duration-fast/normal/slow`
  - 布局：`--nav-height`、`--player-height`、`--content-max-width`

- [`src/styles/editorial.css`](src/styles/editorial.css)：组件类样式
  - `.btn` / `.btn-accent` / `.btn-dark`：按钮
  - `.tag`：小胶囊标签
  - `.card` / `.card-hover`：纸面卡片
  - `.section-head` 系列：章节标题（编号 + 衬线标题 + 细横线）
  - `.eq`：播放中均衡器指示
  - `.reveal`：入场动画（尊重 `prefers-reduced-motion`）

**基础组件**：[`Panel`](src/components/core/Panel.tsx)、[`Button`](src/components/core/Button.tsx) 和 [`Tag`](src/components/core/Tag.tsx) 封装了常用配置，新组件应优先复用。

### 音乐播放器架构

播放器是本项目最复杂的子系统，架构如下：

```
┌─────────────────────────────────────────────────────────┐
│  playerStore (Zustand)                                  │
│  状态：currentTrack / queue / isPlaying / currentTime    │
│        duration / volume / loopMode / replaySignal       │
│  持久化：volume / loopMode → localStorage                │
└──────────────┬──────────────────────────────────────────┘
               │ subscribe
┌──────────────▼──────────────────────────────────────────┐
│  AudioPlayer.tsx (主组件，固定底部)                      │
│  - 维护 <audio> 元素 + AudioContext + AnalyserNode       │
│  - 监听 audio 事件 → 同步 store                          │
│  - 监听 store isPlaying → 控制 audio.play/pause          │
│  - 监听 replaySignal → 单曲循环重放                      │
└──┬──────────┬──────────┬──────────┬──────────┬──────────┘
   │          │          │          │          │
   ▼          ▼          ▼          ▼          ▼
Visualizer  LyricView  Playlist  ProgressBar  VolumeControl
(Canvas)    (LRC滚动)  (队列浮层) (进度条)      (音量)
```

**关键实现要点**：

1. **AudioContext 懒初始化**：浏览器策略要求 AudioContext 必须在用户交互后创建。`AudioPlayer` 在首次 `play()` 时才调用 `ensureAudioContext()`，并通过 `sourceCreatedRef` 防止重复创建 MediaElementSource。
2. **频谱可视化**：`AnalyserNode.fftSize = 256`，`Visualizer` 组件用 `requestAnimationFrame` 循环读取 `getByteFrequencyData`，Canvas 渲染 64 柱状条。
3. **LRC 歌词同步**：[`src/lib/lrc.ts`](src/lib/lrc.ts) 解析 `[mm:ss.xx]` 标签，`findActiveIndex()` 二分查找当前行，`LyricView` 自动滚动并支持点击跳转。
4. **循环模式**：`list`（列表循环）/ `single`（单曲循环，通过 `replaySignal` 触发重放）/ `shuffle`（随机，避免立即重复）。
5. **移动端**：底部栏精简为 `[封面+标题] [播放] [展开]`，点击展开弹出全屏播放界面。

---

## 内容维护指南

### 新增翻唱/原创音频

**三步完成**：

```bash
# 1. 把 MP3 放进 public/audio/（文件名建议英文/数字，会作为 track id）
cp /path/to/your-song.mp3 public/audio/

# 2. 运行生成脚本，自动扫描并追加到 site.json
npm run gen-manifest

# 3. 编辑 public/site.json，补充元数据
```

`gen-manifest` 脚本的行为：

- 递归扫描 `public/audio/` 下所有 `.mp3` 文件
- 对新文件生成最小骨架（id / title / src / download.mp3）
- **已存在的文件（按 id 或 src 匹配）保留原元数据，不会被覆盖**
- 输出新增/跳过统计

生成后需要手动补充的字段：

```jsonc
{
  "id": "your-song",                    // 自动生成，建议保持
  "title": "显示标题",                   // 自动用文件名，建议改成中文标题
  "originalTitle": "原唱歌名",              // 翻唱时填，原创可空
  "date": "2026-07-15",                 // 发布日期
  "src": "/audio/your-song.mp3",        // 自动生成
  "cover": "/covers/your-song.jpg",     // 可选，封面图路径
  "lyrics": "/lyrics/your-song.lrc",    // 可选，LRC 歌词文件
  "tags": ["翻唱", "POP", "中文"],       // ★ 至少包含"翻唱"或"原创"之一
  "language": "zh",                     // zh/en/ja/ko/other
  "genre": "pop",                       // pop/rock/folk/ballad/rnb/electronic/classical/anime/game/original/cover/other
  "note": "备注",                       // 可选
  "download": {
    "mp3": "/audio/your-song.mp3",      // 自动生成
    "lossless": "https://pan.xx/...",   // ★ 第三方网盘无损链接，手动填
    "losslessLabel": "城通网盘"          // 网盘名称，仅展示用
  }
}
```

**歌词文件**：放在 `public/lyrics/`，标准 LRC 格式：

```lrc
[ti:歌曲名]
[00:12.34]第一行歌词
[00:15.67]第二行歌词
```

**封面图**：建议放在 `public/covers/`，正方形，建议 300×300 以上。

### 编辑各模块内容

直接编辑 `public/site.json` 对应字段即可，无需改代码。各字段含义详见 [类型定义参考](#类型定义参考)。

常见操作：

| 操作 | 修改位置 |
|------|---------|
| 改名字/简介/头像 | `owner.name` / `owner.bio` / `owner.avatar` |
| 改关于我长文 | `owner.about`（字符串数组，每段一个元素） |
| 改社交链接 | `owner.links`（label / url / icon） |
| 改联系方式 | `owner.contact`（email / wechat / qq / telegram / discord） |
| 加项目 | `projects` 数组追加 Project |
| 加时间线 | `timeline` 数组追加 TimelineEvent |
| 加友链 | `friends` 数组追加 Friend |

> **注**：`skills`（技能）与 `posts`（随笔）两个模块已从主页下线，对应数据保留在 site.json 中但不渲染。若日后需要恢复，在 `src/App.tsx` 中重新挂载对应 Section 组件即可。

**社交图标映射**：`owner.links[].icon` 支持的值：`Github` / `Youtube` / `Twitter` / `Mail` / `Link`，其他值会兜底为通用链接图标。

### 本地预览与部署

```bash
# 开发预览（热更新）
npm run dev

# 模拟生产构建
npm run build && npm run preview

# 类型检查（不产出文件）
npm run lint
```

**部署到 GitHub Pages**：

- push 到 `main` 分支即可，GitHub Actions 自动构建并部署
- 首次使用需在仓库 Settings → Pages → Source 选择 "GitHub Actions"
- 部署日志见 Actions 页面，约 1-2 分钟完成

---

## 开发指南

### 环境要求

- Node.js ≥ 18（推荐 20 LTS）
- npm ≥ 9
- 编辑器建议 VS Code + ESLint + Prettier（项目未强制配置，按团队约定）

### 常用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器（http://localhost:5173/） |
| `npm run build` | TypeScript 编译 + Vite 生产构建，输出到 `dist/` |
| `npm run preview` | 预览 `dist/` 构建产物 |
| `npm run gen-manifest` | 扫描 `public/audio/` 并更新 `site.json` |
| `npm run lint` | 仅运行 `tsc --noEmit` 类型检查 |

### 新增 Section 组件

若需要新增一个主页模块（例如"书单"），按以下步骤：

1. **扩展类型**：在 [`src/types/manifest.ts`](src/types/manifest.ts) 添加新接口（如 `Book`），并在 `SiteData` 中加入对应字段（如 `books?: Book[]`）。

2. **更新示例数据**：在 `public/site.json` 添加对应字段和示例数据。

3. **创建组件**：在 `src/components/sections/` 新建 `Books.tsx`，使用 `Section` 容器包裹，处理空状态，memo 导出。

4. **编排进 App**：在 [`src/App.tsx`](src/App.tsx) 中 import 并放入合适位置，同时在 `Header` 的 `NAV_ITEMS` 和 `App` 的滚动监听 `sections` 数组中注册新 section key。

5. **类型检查**：运行 `npm run lint` 确保无错误。

**Section 组件模板**：

```tsx
import { memo } from 'react'
import { Panel } from '../core/Panel'
import type { Book } from '../../types/manifest'

interface BooksProps {
  books: Book[]
}

export const Books = memo(function Books({ books }: BooksProps) {
  if (books.length === 0) {
    return <Panel style={{ padding: 'var(--space-6)' }}>暂无书单</Panel>
  }
  return (
    <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
      {books.map((book) => (
        <Panel key={book.id} hover style={{ padding: 'var(--space-4)' }}>
          {/* 渲染逻辑 */}
        </Panel>
      ))}
    </div>
  )
})
```

### 类型定义参考

完整定义见 [`src/types/manifest.ts`](src/types/manifest.ts)，以下是常用类型速查：

```ts
// 曲目
interface Track {
  id: string; title: string; originalTitle?: string;
  date?: string; src: string; duration?: number;
  cover?: string; lyrics?: string;
  tags?: string[];  // ★ 建议含 "翻唱" 或 "原创"
  language?: 'zh' | 'en' | 'ja' | 'ko' | 'other';
  genre?: Genre;
  albumId?: string;
  download: { mp3: string; lossless?: string; losslessLabel?: string };
}

// 项目
interface Project {
  id: string; title: string; description: string;
  cover?: string; links?: OwnerLink[]; tags?: string[];
  startDate?: string; endDate?: string;
  status?: 'ongoing' | 'completed' | 'archived';
  featured?: boolean;
}

// 时间线
interface TimelineEvent {
  id: string; date: string; title: string; description?: string;
  type?: 'music' | 'code' | 'study' | 'life' | 'milestone' | 'other';
  link?: OwnerLink;
}
```

---

## 部署机制

部署完全自动化，由 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) 驱动：

```
push 到 main
  → Checkout 代码
  → 安装依赖 (npm ci)
  → 运行 gen-manifest（同步音频文件到 site.json）
  → 运行 sync-bilibili（拉取 B 站合集最新投稿）
  → 生产构建 (npm run build)
  → 上传 dist/ 为 Pages artifact
  → 部署到 GitHub Pages
```

**B 站投稿动态同步**：[`.github/workflows/sync-bilibili.yml`](.github/workflows/sync-bilibili.yml) 每小时自动运行一次：

```
cron 每小时
  → 拉取 B 站合集（seasons_archives_list，无需登录）
  → 更新 public/site.json（新增/替换 B 站来源曲目，保留本地曲目）
  → 有变更则提交并 push
  → deploy.yml 通过 workflow_run 检测到同步完成，自动重新构建部署
```

因此用户在网页上看到的最长滞后约 1 小时（新投稿发布后一小时内出现在曲目表）。也可手动触发：Actions 页面运行 "Sync Bilibili Season"，或本地 `node scripts/sync-bilibili.mjs` 后 push。

**注意事项**：

- `base` 已在 [`vite.config.ts`](vite.config.ts) 配置为 `'/'`（用户主页仓库根路径部署）。若改为项目仓库（如 `LuzzyMeow/homepage`），需改为 `'/homepage/'`。
- `public/` 下的静态资源（音频、歌词、封面）会原样拷贝到 `dist/`，注意控制体积，GitHub 单文件限制 100MB、仓库建议 < 1GB。
- MP3 文件较大时建议：仓库内放压缩版（128-192kbps），无损版通过 `download.lossless` 外链到网盘。

---

## 常见问题

**Q: 启动 dev 服务器报 "Invalid hook call" 或 React 副本冲突？**

清理 Vite 缓存重启：

```bash
rm -rf node_modules/.vite
npm run dev
```

**Q: 上传新 MP3 后网站没显示？**

1. 确认文件在 `public/audio/` 下且扩展名为 `.mp3`
2. 运行 `npm run gen-manifest` 检查输出
3. 确认 `public/site.json` 的 `tracks` 数组已包含新条目
4. push 后等待 Actions 部署完成

**Q: 播放器频谱不动？**

浏览器要求 AudioContext 必须在用户交互后创建。首次点击播放按钮才会初始化 AnalyserNode，这是预期行为。若点击后仍不动，检查浏览器控制台是否有 AudioContext 相关报错。

**Q: GitHub Pages 部署失败？**

1. 进入仓库 Actions 页面查看失败日志
2. 常见原因：`npm ci` 失败（lockfile 不同步）→ 本地 `npm install` 后提交 `package-lock.json`
3. 确认仓库 Settings → Pages → Source 已选 "GitHub Actions"

**Q: 如何换主题色？**

编辑 [`src/styles/tokens.css`](src/styles/tokens.css) 中的 `--accent`（朱红）与 `--paper`（纸底）等变量即可全站生效。

**Q: build 产出 tsc 错误怎么办？**

```bash
npm run lint   # 等价于 tsc --noEmit，会列出所有类型错误
```

按错误信息修复，常见原因是 `site.json` 字段与 `manifest.ts` 类型不匹配。

---

## 许可证

代码部分：MIT
音频与文字内容：版权归 LuzzyMeow 所有，未经授权不得转载
