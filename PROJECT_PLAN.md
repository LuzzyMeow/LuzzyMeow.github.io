# LuzzyMeow 个人主页项目实施 Plan

> 文档版本：v1.1 · 修订日期：2026-07-15
> 站点：https://luzzymeow.github.io/
> 仓库：LuzzyMeow/LuzzyMeow.github.io
> 工作目录：d:\.NekoTool\LuzzyWEB

## 修订记录

- **v1.0（2026-07-15）**：初版，以翻唱作品集为站点主体
- **v1.1（2026-07-15）**：纠正方向，重构为**综合性个人主页**，作品集作为其中一个首要模块但不是全部。新增：关于我 / 技能兴趣 / 项目展示 / 随笔文章 / 时间线 / 友链 / 联系方式 共 7 个模块。作品集内部不区分翻唱与原创，统一用 tag 筛选。

---

## 0. 用户需求确认

| 需求项 | 确认内容 |
|--------|---------|
| 站点性质 | **综合性个人主页**（不是单纯音乐站） |
| 风格 | Apple 液态玻璃（Liquid Glass）浅色 macOS Sonoma 风 |
| 页面架构 | 单页长滚动，顶部导航点击锚跳 |
| 模块清单 | Hero → 作品集（首要）→ 关于我 → 技能兴趣 → 项目展示 → 随笔文章 → 时间线 → 友链 → 联系方式 → Footer |
| 作品集 | 翻唱 + 原创混合，不分区，靠 tag 筛选；位于 Hero 下方首要位置 |
| 音频 | 全部 MP3，仓库内可播可下；外部网盘链接指向无损版本 |
| 网盘链接 | 上传时手动填写，每首歌可独立配置 |
| 播放器功能 | 播放/暂停/上下首/进度/音量 + 实时频谱可视化 + LRC 同步歌词 + 标签筛选 + 手动专辑管理 |
| 更新机制 | 支持 MP3 新增 → 自动生成清单 → 自动部署 |
| 部署 | GitHub Pages，用户主页仓库 |

---

## 1. 技术栈选型

| 层 | 技术 | 版本 | 理由 |
|----|------|------|------|
| 构建 | Vite | 5.x | 静态打包，构建快，HMR 体验好 |
| 框架 | React | 18.x | 组件化便于播放器/列表/专辑解耦 |
| 语言 | TypeScript | 5.x | 类型安全，元数据建模清晰 |
| 样式 | Tailwind CSS + 原生 CSS variables | 3.4.x | 液态玻璃核心靠 `backdrop-filter`，原生 CSS 配合最稳 |
| 图标 | lucide-react | latest | Apple 风线性图标 |
| 音频 | HTML5 Audio + Web Audio API | 原生 | 频谱可视化必须用 AnalyserNode |
| 状态 | Zustand | 4.x | 轻量，播放器全局状态最合适 |
| 部署 | GitHub Actions → Pages | 官方 | 自动构建发布 |

**不引入**：jQuery、Heavy UI 库（如 MUI/AntD）、后端服务（Pages 不支持）。

---

## 2. 仓库与部署架构

### 2.1 仓库
- 名称：`LuzzyMeow.github.io`
- 类型：Public（Pages 私有仓库仅 Pro 用户可用）
- 默认分支：`main`
- Pages 源：GitHub Actions

### 2.2 部署流程

```
[本地开发] → git push main → [GitHub Actions]
                                  ↓
                          ┌───────┴────────┐
                          ↓                ↓
                  generate-manifest    vite build
                          ↓                ↓
                          └───────┬────────┘
                                  ↓
                            upload-pages-artifact
                                  ↓
                            GitHub Pages 部署
                                  ↓
                       https://luzzymeow.github.io/
```

### 2.3 两个 Workflow

**`.github/workflows/deploy.yml`** — 主部署
- 触发：push 到 main / 手动
- 步骤：checkout → setup-node 20 → npm ci → 生成 manifest → vite build → upload artifact → deploy

**`.github/workflows/update-manifest.yml`**（备选，可合并进 deploy）
- 触发：push 到 main 且 `public/audio/**` 有变更
- 步骤：扫描 audio 目录 → 读取已有 manifest 的元数据（保留标题/歌词/网盘链接）→ 仅追加新文件 → 提交回 main（或仅在构建时生成不提交）

**最终选择合并方案**：deploy.yml 中包含 manifest 生成步骤，不单独 commit manifest，避免循环触发。manifest.json 仍允许本地手写或脚本生成后提交。

---

## 3. 项目目录结构

```
LuzzyWEB/
├── .github/
│   └── workflows/
│       └── deploy.yml                 # 部署 + manifest 生成
├── public/
│   ├── audio/                         # ★ 你所有 MP3 放这
│   │   ├── cover-2024-01.mp3
│   │   └── ...
│   ├── covers/                        # 歌曲封面（可选，jpg/png/webp）
│   ├── lyrics/                        # LRC 同步歌词（可选，.lrc 文件）
│   ├── manifest.json                  # 歌曲元数据清单（核心）
│   └── favicon.svg
├── scripts/
│   └── gen-manifest.mjs               # 本地清单生成脚本
├── src/
│   ├── components/
│   │   ├── glass/
│   │   │   ├── GlassCard.tsx          # 液态玻璃容器
│   │   │   ├── GlassButton.tsx        # 玻璃按钮
│   │   │   └── GlassPanel.tsx         # 大块玻璃面板
│   │   ├── player/
│   │   │   ├── AudioPlayer.tsx        # 底栏播放器主组件
│   │   │   ├── PlayerControls.tsx     # 播放控制
│   │   │   ├── ProgressBar.tsx        # 进度条
│   │   │   ├── VolumeControl.tsx      # 音量
│   │   │   ├── Visualizer.tsx         # 频谱可视化
│   │   │   ├── LyricView.tsx          # LRC 同步歌词
│   │   │   └── Playlist.tsx           # 播放列表
│   │   ├── track/
│   │   │   ├── TrackCard.tsx          # 单曲卡片
│   │   │   ├── TrackList.tsx          # 列表视图
│   │   │   └── TrackGrid.tsx          # 网格视图
│   │   ├── album/
│   │   │   ├── AlbumCard.tsx          # 专辑卡片
│   │   │   └── AlbumView.tsx          # 专辑详情
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Background.tsx         # 动态渐变背景
│   │   └── filter/
│   │       └── FilterBar.tsx          # 标签/语种/风格筛选
│   ├── store/
│   │   ├── playerStore.ts             # Zustand 播放器状态
│   │   └── libraryStore.ts            # 曲库/专辑状态
│   ├── lib/
│   │   ├── audio.ts                   # AudioContext 封装
│   │   ├── lrc.ts                     # LRC 解析器
│   │   ├── manifest.ts                # 清单加载与校验
│   │   └── format.ts                  # 时长/大小格式化
│   ├── types/
│   │   └── manifest.ts                # TypeScript 类型定义
│   ├── hooks/
│   │   ├── useAudio.ts                # 播放 hook
│   │   └── useVisualizer.ts           # 频谱 hook
│   ├── styles/
│   │   ├── glass.css                  # ★ 液态玻璃核心样式
│   │   └── tokens.css                 # 设计令牌（CSS variables）
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── .gitignore
└── PROJECT_PLAN.md                    # 本文档
```

---

## 4. 设计规范（液态玻璃浅色 macOS Sonoma 风）

### 4.1 设计令牌（src/styles/tokens.css）

```css
:root {
  /* 背景层 - 多层柔和渐变模拟 macOS 桌面 */
  --bg-base: #f5f5f7;                  /* Apple 标志性浅灰白 */
  --bg-gradient-1: #ffd6e7;            /* 樱粉 */
  --bg-gradient-2: #c8e7ff;            /* 天蓝 */
  --bg-gradient-3: #d6f5e7;            /* 薄荷 */
  --bg-gradient-4: #fff5d6;            /* 暖黄 */

  /* 玻璃层 */
  --glass-bg: rgba(255, 255, 255, 0.55);
  --glass-bg-hover: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(255, 255, 255, 0.65);
  --glass-border-inner: rgba(255, 255, 255, 0.85);
  --glass-shadow: 0 8px 32px rgba(31, 38, 135, 0.08);
  --glass-shadow-strong: 0 20px 60px rgba(31, 38, 135, 0.12);
  --glass-blur: 20px;
  --glass-blur-strong: 40px;
  --glass-saturation: 180%;

  /* 文字 */
  --text-primary: #1d1d1f;             /* Apple 深灰，非纯黑 */
  --text-secondary: #6e6e73;
  --text-tertiary: #a1a1a6;
  --text-on-glass: rgba(29, 29, 31, 0.95);

  /* 强调色 - Apple 系统蓝 */
  --accent: #0071e3;
  --accent-hover: #0077ed;
  --accent-soft: rgba(0, 113, 227, 0.12);

  /* 系统色（参考 macOS） */
  --sys-red: #ff3b30;
  --sys-green: #34c759;
  --sys-orange: #ff9500;
  --sys-pink: #ff2d92;
  --sys-purple: #af52de;

  /* 圆角 - Apple 大圆角 */
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 28px;
  --radius-pill: 9999px;

  /* 间距 */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;

  /* 字体栈 - SF Pro 优先 */
  --font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Display",
               "SF Pro Text", "Helvetica Neue", "PingFang SC",
               "Microsoft YaHei", sans-serif;
  --font-mono: "SF Mono", "JetBrains Mono", Menlo, monospace;

  /* 动画曲线 - Apple ease */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 200ms;
  --duration-normal: 350ms;
  --duration-slow: 600ms;
}
```

### 4.2 液态玻璃核心样式（src/styles/glass.css）

```css
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
  border: 1px solid var(--glass-border);
  box-shadow:
    var(--glass-shadow),
    inset 0 1px 0 var(--glass-border-inner),    /* 顶部高光 */
    inset 0 -1px 0 rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg);
  position: relative;
  overflow: hidden;
}

/* 镜面高光：左上角柔和反射 */
.glass::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0) 40%
  );
  pointer-events: none;
  border-radius: inherit;
}

/* 边缘高光：模拟玻璃折射 */
.glass::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9),
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.3)
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.glass-strong {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(var(--glass-blur-strong)) saturate(200%);
}

.glass-hover {
  transition: all var(--duration-normal) var(--ease-out);
}
.glass-hover:hover {
  background: var(--glass-bg-hover);
  transform: translateY(-2px);
  box-shadow: var(--glass-shadow-strong);
}
```

### 4.3 动态背景（关键氛围层）

- 全屏 fixed 背景
- 4 个大型径向渐变光晕，颜色对应 tokens 中 4 个渐变色
- 使用 CSS `@keyframes` 缓慢漂移（30s 周期）
- 落在背景层的颜色透过玻璃层 `backdrop-filter` 折射出液态质感

### 4.4 字体策略

- 标题：`var(--font-sans)` 字重 700，letter-spacing -0.02em（Apple 标志性紧凑）
- 副标题：字重 500，颜色 `--text-secondary`
- 数字（时长/进度）：`var(--font-mono)` tabular-nums
- 不引入 Google Fonts，全部使用系统字体栈，零网络请求，最快加载

---

## 5. 数据模型（manifest.json）

### 5.1 完整结构

```jsonc
{
  "version": 1,
  "owner": {
    "name": "LuzzyMeow",
    "bio": "翻唱爱好者 / Vocal cover",
    "avatar": "/covers/avatar.jpg",
    "links": [
      { "label": "网易云", "url": "https://..." },
      { "label": "B站", "url": "https://..." }
    ]
  },
  "tracks": [
    {
      "id": "cover-2024-01",
      "title": "歌曲名",
      "originalArtist": "原唱歌手",
      "coverDate": "2024-01-15",
      "src": "/audio/cover-2024-01.mp3",
      "duration": 245,                    // 秒，可省略，运行时探测
      "cover": "/covers/cover-2024-01.jpg",
      "lyrics": "/lyrics/cover-2024-01.lrc",
      "tags": ["中文", "流行", "翻唱"],
      "language": "zh",
      "genre": "pop",
      "albumId": "album-winter-2024",     // 关联专辑，可空
      "note": "某年某月某次录音",
      "download": {
        "mp3": "/audio/cover-2024-01.mp3",      // 本地直接下载
        "lossless": "https://pan.example.com/xxx"  // 第三方网盘无损链接
      }
    }
  ],
  "albums": [
    {
      "id": "album-winter-2024",
      "title": "冬日合集",
      "description": "2024 冬季翻唱合集",
      "cover": "/covers/album-winter-2024.jpg",
      "createdAt": "2024-12-01",
      "trackIds": ["cover-2024-01", "cover-2024-02"]
    }
  ]
}
```

### 5.2 字段说明

| 字段 | 必填 | 类型 | 说明 |
|------|------|------|------|
| id | ✅ | string | 全局唯一，建议 `cover-YYYY-MM-序号` |
| title | ✅ | string | 显示标题 |
| src | ✅ | string | MP3 路径，相对站点根 |
| download.lossless | ❌ | string | 第三方网盘链接，**用户手动填** |
| tags | ❌ | string[] | 自由标签 |
| language | ❌ | enum | zh/en/ja/ko/other |
| genre | ❌ | string | 风格 |
| albumId | ❌ | string | 关联专辑 |
| lyrics | ❌ | string | LRC 文件路径 |
| cover | ❌ | string | 封面图路径 |
| duration | ❌ | number | 秒，省略则运行时探测 |

### 5.3 自动生成 vs 手动编辑

- `npm run gen-manifest`：扫描 `public/audio/` 所有 MP3，**保留现有 manifest 中已存在的元数据**（标题/网盘链接/歌词/标签/专辑关联），仅追加新文件为最小骨架
- 用户可在 manifest.json 中手动编辑任何字段（推荐做法）
- CI 部署时也会跑一次该脚本，保证不漏文件

---

## 6. 音乐播放器实现

### 6.1 功能清单

| 模块 | 功能点 |
|------|--------|
| **基础控制** | 播放/暂停、上一首/下一首、进度条拖动、音量调节、播放速度（0.75/1/1.25/1.5/2x）、循环模式（列表/单曲/随机） |
| **频谱可视化** | Web Audio API `AnalyserNode`，FFT 256，柱状图渲染到 Canvas，60fps，颜色随专辑封面动态抽取 |
| **LRC 歌词** | 解析 `[mm:ss.xx]文本` 格式，当前行高亮居中，自动滚动，可点击跳转 |
| **播放列表** | 当前队列显示，可删除/拖拽排序，点击切歌 |
| **专辑管理** | 创建/编辑专辑（标题/描述/封面），增删曲目，专辑封面视图 |
| **标签筛选** | 多选标签/语种/风格，实时过滤列表 |
| **下载** | 本地 MP3 直接 a[download]；无损链接跳转新窗 |
| **持久化** | localStorage 记住：音量、循环模式、上次播放位置（可选） |

### 6.2 状态管理（Zustand）

```typescript
// store/playerStore.ts
interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  queueIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  loopMode: 'list' | 'single' | 'shuffle';
  playbackRate: number;
  // actions
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  // ...
}
```

### 6.3 频谱可视化关键实现

```typescript
// hooks/useVisualizer.ts
const audioCtx = new AudioContext();
const source = audioCtx.createMediaElementSource(audioElement);
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;       // 128 个频段
source.connect(analyser);
analyser.connect(audioCtx.destination);

// requestAnimationFrame 循环读取
const data = new Uint8Array(analyser.frequencyBinCount);
analyser.getByteFrequencyData(data);
// 绘制到 canvas，柱状图高度 = data[i] / 255 * maxHeight
```

注意：AudioContext 必须在用户首次交互后初始化（浏览器自动播放策略），点击播放按钮时 `audioCtx.resume()`。

### 6.4 LRC 解析

```typescript
// lib/lrc.ts
interface LrcLine { time: number; text: string; }
function parseLrc(content: string): LrcLine[] {
  const lines = content.split('\n');
  const result: LrcLine[] = [];
  const re = /\[(\d+):(\d+(?:\.\d+)?)\]/g;
  for (const line of lines) {
    const matches = [...line.matchAll(re)];
    const text = line.replace(re, '').trim();
    for (const m of matches) {
      const time = parseInt(m[1]) * 60 + parseFloat(m[2]);
      result.push({ time, text });
    }
  }
  return result.sort((a, b) => a.time - b.time);
}
```

---

## 7. 更新机制（你后续怎么加歌）

### 7.1 推荐工作流（手动 + 自动混合）

```bash
# 步骤 1：把新 MP3 放进 public/audio/
cp ~/Downloads/new-cover.mp3 public/audio/

# 步骤 2：本地生成清单（保留你之前填好的元数据）
npm run gen-manifest

# 步骤 3：编辑 public/manifest.json，补全新歌的标题/网盘链接/歌词等
code public/manifest.json

# 步骤 4：本地预览
npm run dev

# 步骤 5：提交推送
git add .
git commit -m "add: new-cover.mp3"
git push

# 步骤 6：GitHub Actions 自动构建部署，~1 分钟后站点更新
```

### 7.2 全自动兜底

如果你忘了跑 `gen-manifest`，CI 会在构建时再跑一次，确保新文件不漏（但元数据仅是空骨架，仍建议本地预填）。

### 7.3 本地 gen-manifest 脚本职责

- 扫描 `public/audio/**/*.mp3`
- 读取现有 `manifest.json`（如有）建立 id→track 索引
- 基于文件名生成 id（去后缀，转 kebab-case）
- 对新 id 生成最小骨架：`{ id, title: 文件名, src, download: { mp3: src } }`
- 已有 id 完全保留原字段
- 写回 `public/manifest.json`，2 空格缩进

---

## 8. 页面结构与布局

### 8.1 单页应用分区

```
┌────────────────────────────────────────────┐
│  [Header]  LuzzyMeow · 翻唱主页    [links] │  顶部固定玻璃栏
├────────────────────────────────────────────┤
│                                            │
│  [Hero]                                    │
│   大头像 + 名字 + 一句话介绍                │  动态背景 + 大玻璃
│   [最新作品] [全部曲目] [按专辑]            │
│                                            │
├────────────────────────────────────────────┤
│  [FilterBar]                               │  标签/语种/风格筛选
│   chips: 全部 | 中文 | 日文 | 流行 | 民谣  │
├────────────────────────────────────────────┤
│  [AlbumsRow]                               │  专辑横滑卡片
│   [专辑1] [专辑2] [专辑3] ...              │
├────────────────────────────────────────────┤
│  [TrackList]                               │  曲目主列表
│   # 标题       时长  标签    [播放][下载]   │
│   1 ...                                    │
│   2 ...                                    │
├────────────────────────────────────────────┤
│  [Footer]                                  │
│   © 2026 LuzzyMeow · Powered by GitHub Pgs │
├────────────────────────────────────────────┤
│  [AudioPlayer]                             │  ★ 固定底栏玻璃
│   封面 标题 [<<][▶][>>] ━━●━━ 1:23/3:45    │
│   [音量] [循环] [列表] [歌词] [频谱]        │
└────────────────────────────────────────────┘
```

### 8.2 响应式

- 桌面 ≥ 1024px：列表显示标题/原唱/时长/标签/操作 5 列
- 平板 768-1024px：列表压缩为标题/时长/操作 3 列
- 移动 < 768px：单曲卡片堆叠，底栏播放器收缩为迷你模式（点击展开全屏）

---

## 9. 实施阶段划分

### Phase 1：项目骨架与设计系统（基础）
- Vite + React + TS + Tailwind 初始化
- 设计令牌 tokens.css
- 液态玻璃核心样式 glass.css
- 动态背景 Background 组件
- Header / Hero / Footer 静态布局
- 类型定义 types/manifest.ts
- 占位 manifest.json（2 首示例）

**交付物**：本地 `npm run dev` 能看到一个空壳液态玻璃主页

### Phase 2：数据层与曲库展示
- lib/manifest.ts 加载与校验
- store/libraryStore.ts
- TrackCard / TrackList / TrackGrid
- FilterBar 标签筛选
- AlbumCard / AlbumView

**交付物**：能从 manifest.json 渲染所有曲目和专辑，可筛选

### Phase 3：音乐播放器核心
- lib/audio.ts AudioContext 封装
- store/playerStore.ts Zustand 状态
- hooks/useAudio / useVisualizer
- AudioPlayer 底栏组件
- PlayerControls / ProgressBar / VolumeControl
- Playlist 当前队列
- 本地下载 + 网盘跳转

**交付物**：能播放、控制、下载

### Phase 4：进阶播放器功能
- Visualizer 频谱可视化（Canvas 柱状图）
- LyricView LRC 解析与同步
- 循环模式 / 播放速度
- localStorage 持久化

**交付物**：完整播放器体验

### Phase 5：构建部署
- scripts/gen-manifest.mjs
- .github/workflows/deploy.yml
- vite.config.ts base 路径配置
- 创建 GitHub 仓库 `LuzzyMeow.github.io`
- 推送 + 启用 Pages → Actions 源
- 验证线上访问

**交付物**：https://luzzymeow.github.io/ 正常运行

### Phase 6：文档与示例
- 在 manifest.json 中放 2 首示例曲目（占位 MP3）
- 注释清晰的字段说明
- 在项目根写一个简短 README（仅在你同意后写）

---

## 10. 风险与备选方案

| 风险 | 影响 | 备选 |
|------|------|------|
| MP3 单文件超 100MB | 无法 push | 翻唱 MP3 极少超 10MB，无需担心；如真出现，用 `ffmpeg -b:a 320k` 压制 |
| 仓库总量超 1GB | GitHub 警告 | MP3 单首 5-10MB，可存 100+ 首；超出转 Internet Archive 直链 |
| 浏览器不支持 `backdrop-filter` | 玻璃失效 | 提供降级 `background: rgba(255,255,255,0.9)` fallback |
| iOS Safari 自动播放限制 | 首次无法自动播放 | 设计上必须用户点击播放按钮触发，符合预期 |
| AudioContext 跨域 | 频谱为 0 | MP3 与站点同源（都从 Pages 服务），无问题 |
| GitHub Pages LFS 不支持 | 大文件无法托管 | 已规避，全用普通 MP3 |
| 网盘链接失效 | 下载按钮 404 | 不做主动检测，用户每次更新时检查 |

---

## 11. 验收标准

- [ ] 本地 `npm run dev` 启动正常，液态玻璃视觉效果到位
- [ ] 移动端 / 桌面端响应式正确
- [ ] 示例 MP3 可播放、可暂停、可拖动进度
- [ ] 频谱可视化随音频实时跳动
- [ ] LRC 歌词同步滚动正确
- [ ] 标签筛选实时生效
- [ ] 专辑创建与曲目关联正常
- [ ] 本地下载触发 MP3 文件下载
- [ ] 网盘链接点击新窗打开
- [ ] `npm run gen-manifest` 能正确追加新文件
- [ ] `npm run build` 生成 dist/ 无错误
- [ ] GitHub Actions 部署成功
- [ ] https://luzzymeow.github.io/ 可访问
- [ ] 推送新 MP3 后站点自动更新

---

## 12. 待你确认事项

1. **Phase 顺序**：是否同意按 Phase 1 → 6 顺序执行？
2. **示例数据**：是否在 manifest.json 放 2 首占位曲目（无版权的 demo 音频）便于你看到效果？
3. **README**：是否需要我顺手写一份 README.md 说明如何加歌？（默认不写）
4. **头像/封面**：你有现成的头像图片吗？还是先用占位图？
5. **个人简介**：Hero 区域的"一句话介绍"想写什么？默认填 "Vocal Cover · 翻唱作品集"
6. **示例曲目文件**：你能否提供 1-2 首 MP3 用于本地测试？或者我用一段公共域音频生成占位 MP3？

---

确认后即进入 Phase 1 执行。
