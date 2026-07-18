/* ========================================================================
   LuzzyMeow · 站点数据类型定义
   综合性个人主页：个人介绍 + 作品集（音频）+ 项目 + 随笔 + 时间线 + 友链 + 联系
   与 public/site.json 结构对齐
   ======================================================================== */

// -------------------- 通用 --------------------

export type Language = 'zh' | 'en' | 'ja' | 'ko' | 'other'

export type Genre =
  | 'pop'
  | 'rock'
  | 'folk'
  | 'ballad'
  | 'rnb'
  | 'electronic'
  | 'classical'
  | 'anime'
  | 'game'
  | 'original'
  | 'cover'
  | 'other'

export type LoopMode = 'list' | 'single' | 'shuffle'

/** 外部链接（社交/网站/网盘等） */
export interface OwnerLink {
  label: string
  url: string
  /** 可选图标名（lucide-react），如 Github / Twitter / Mail */
  icon?: string
}

// -------------------- 关于我 / 联系方式 --------------------

/** 站点所有者完整信息 */
export interface Owner {
  name: string
  /** 一句话简介（Hero 用） */
  bio: string
  /** 头像路径 */
  avatar?: string
  /** 关于我的长介绍，多段文本，每段一个元素 */
  about?: string[]
  /** 所在地 */
  location?: string
  /** 社交外链 */
  links?: OwnerLink[]
  /** 联系方式 */
  contact?: Contact
}

/** 联系方式 */
export interface Contact {
  email?: string
  wechat?: string  // 微信号
  qq?: string
  telegram?: string
  discord?: string
  /** 其他自定义联系渠道 */
  others?: OwnerLink[]
}

// -------------------- 技能与兴趣 --------------------

export interface SkillGroup {
  /** 分组名，如 "编程语言" / "音乐" / "设计" */
  category: string
  /** 该组下的技能项 */
  items: SkillItem[]
}

export interface SkillItem {
  name: string
  /** 0-100 熟练度，可选；不填则只显示标签 */
  level?: number
  /** 标记为兴趣而非技能（影响呈现） */
  isHobby?: boolean
}

// -------------------- 作品集（音频）--------------------

/** 下载资源：本地 MP3 + 第三方网盘无损链接 */
export interface DownloadSources {
  /** 本地 MP3 直链，必填，相对站点根 */
  mp3: string
  /** 第三方网盘无损版本链接（用户上传时手动填） */
  lossless?: string
  /** 网盘标签，如 "城通网盘" / "OneDrive"，仅展示用 */
  losslessLabel?: string
}

/** 单首曲目（含翻唱和原创，靠 tag 区分） */
export interface Track {
  /** 全局唯一 ID，建议 cover-YYYY-MM-序号 或 orig-YYYY-MM-序号 */
  id: string
  /** 显示标题 */
  title: string
  /** 原唱歌手（翻唱时填，原创可空） */
  originalArtist?: string
  /** 发布日期 YYYY-MM-DD */
  date?: string
  /** MP3 路径，相对站点根 */
  src: string
  /** 时长（秒），可省略，运行时探测 */
  duration?: number
  /** 封面图路径 */
  cover?: string
  /** LRC 文件路径 */
  lyrics?: string
  /**
   * 自由标签
   * 推荐包含 "翻唱" 或 "原创" 之一作为类型 tag
   * 其他自由：语种、风格、心情等
   */
  tags?: string[]
  /** 语种 */
  language?: Language
  /** 风格 */
  genre?: Genre
  /** 关联专辑 ID */
  albumId?: string
  /** 备注 */
  note?: string
  /** 下载资源 */
  download: DownloadSources
  /**
   * B 站合集来源信息
   * 当曲目来自 B 站合集时填充，点击将外链跳转到 B 站播放
   * 此时 src 可为空字符串，站内播放器不播放
   */
  bilibili?: {
    /** 视频 BV 号，如 BV129Vf67E8N */
    bvid: string
    /** 完整 B 站视频 URL */
    url: string
    /** 播放量 */
    view?: number
  }
}

/** 专辑（合集） */
export interface Album {
  id: string
  title: string
  description?: string
  cover?: string
  createdAt?: string
  trackIds?: string[]
}

// -------------------- 项目展示（非音频）--------------------

export interface Project {
  id: string
  title: string
  description: string
  /** 项目封面/缩略图 */
  cover?: string
  /** 项目链接（仓库/演示站） */
  links?: OwnerLink[]
  /** 技术栈/标签 */
  tags?: string[]
  /** 起始日期 YYYY-MM */
  startDate?: string
  /** 结束日期 YYYY-MM，进行中可空 */
  endDate?: string
  /** 状态：ongoing / completed / archived */
  status?: 'ongoing' | 'completed' | 'archived'
  /** 是否置顶 */
  featured?: boolean
}

// -------------------- 随笔/文章 --------------------

export interface Post {
  id: string
  title: string
  /** 摘要 */
  excerpt?: string
  /** 发布日期 YYYY-MM-DD */
  date: string
  /** 外部链接（如指向 blog 站点）；为空则需在站内提供 content */
  externalUrl?: string
  /** 站内 markdown 内容路径（可选，未来支持站内文章渲染） */
  content?: string
  tags?: string[]
  /** 阅读时长（分钟），可选 */
  readingTime?: number
}

// -------------------- 时间线 --------------------

export interface TimelineEvent {
  id: string
  /** 日期 YYYY-MM-DD 或 YYYY-MM 或 YYYY */
  date: string
  /** 事件标题 */
  title: string
  /** 详细描述 */
  description?: string
  /** 类型，影响图标和颜色 */
  type?: 'music' | 'code' | 'study' | 'life' | 'milestone' | 'other'
  /** 关联链接 */
  link?: OwnerLink
}

// -------------------- 友链 --------------------

export interface Friend {
  id: string
  name: string
  url: string
  avatar?: string
  description?: string
}

// -------------------- 顶层站点数据 --------------------

export interface SiteData {
  version: number
  owner: Owner
  skills?: SkillGroup[]
  tracks: Track[]
  albums: Album[]
  projects?: Project[]
  posts?: Post[]
  timeline?: TimelineEvent[]
  friends?: Friend[]
}
