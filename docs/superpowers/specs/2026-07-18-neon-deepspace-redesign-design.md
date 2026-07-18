# 霓虹深空（Neon Deep-Space）前端全量重置设计

> 日期：2026-07-18 · 状态：已确认（用户选定方案 A，并授权直接实施）
> 项目：LuzzyMeow 个人主页 · d:\.NekoTool\LuzzyWEB

## 背景

现有前端为浅色液态玻璃风，全部废弃。页面信息结构保持单页 9 模块（Hero → 作品 → 关于 → 技能 → 项目 → 随笔 → 时间线 → 友链 → 联系），数据层（site.json / types / lib / gen-manifest / CI）不动。

## 设计方向：霓虹深空

- 深空黑蓝底 `#05060F`，主色电子青 `#00E5FF`，辅色品红 `#FF2D96`，过渡电紫 `#8B5CFF`
- 全屏 Canvas 星空粒子背景（星点视差 + 粒子流 + 底部透视网格，reduced-motion 静态化）
- 面板：暗色半透明 + 霓虹描边 + 切角（clip-path frame），hover 边缘扫光
- 字体：Orbitron（展示/标题）+ Noto Sans SC（中文正文）+ JetBrains Mono（数据/标签），自托管（@fontsource），删除阿里巴巴字体
- 图标：自绘 26 枚霓虹线性 SVG（core/Icon.tsx），移除 lucide-react
- 动效：IntersectionObserver 入场 reveal、霓虹呼吸/闪烁、扫描线、hover 辉光

## 组件体系（全删重建）

- core/：Icon、NeonPanel（frame+body 切角）、NeonButton（primary/ghost）、NeonTag
- layout/：StarfieldBackground、Navbar（激活霓虹下划线）、HeroConsole（主控台 Hero）、SectionShell（编号 + ▸ 标题）、Footer
- player/：PlayerBar、VisualizerBars（对数刻度 + 平滑）、LyricPanel、QueuePanel、ProgressRail、VolumeRail
- sections/：Works / About / Skills / Projects / Posts / Timeline / Friends / Contact

## 播放器优化

- 保留：AudioContext 懒初始化、LRC 同步、队列、循环三模式、音量/循环持久化
- 新增：播放速度（0.75–2x，持久化）、键盘快捷键（空格/←→/↑↓/M）、Media Session API、频谱 smoothingTimeConstant + 对数频段映射
- playerStore 追加 playbackRate

## 构建层

- 移除 tailwindcss / postcss / autoprefixer / lucide-react 及 tailwind.config.ts、postcss.config.js
- 样式统一走 CSS 变量（tokens.css）+ 原生 CSS（cyber.css）+ index.css
- index.html theme-color → #05060F，favicon 换霓虹音符 SVG
