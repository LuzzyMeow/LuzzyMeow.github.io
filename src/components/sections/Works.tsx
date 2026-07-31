import { useMemo, useState } from 'react';
import type { Album, Track } from '../../types/manifest';
import { usePlayerStore } from '../../store/playerStore';
import { formatDuration, formatDateShort } from '../../lib/format';
import { Icon } from '../core/Icon';
import { VisualizerBars } from '../player/VisualizerBars';

/* ============================================================
   作品 · 唱片曲目表
   - 合集封面大卡 + 编号曲目行（hover 出操作）
   - B 站曲目：点击外链跳转；本地曲目：进入站内播放器
   ============================================================ */

interface WorksProps {
  tracks: Track[];
  albums: Album[];
}

/** 本地作品区块显示开关：false 时即使有本地曲目也不渲染（框架保留） */
export const SHOW_LOCAL_TRACKS: boolean = false;

export function Works({ tracks, albums }: WorksProps) {
  const { localTracks, biliTracks } = useMemo(() => {
    const local: Track[] = [];
    const bili: Track[] = [];
    for (const t of tracks) {
      if (t.bilibili) bili.push(t);
      else local.push(t);
    }
    return { localTracks: local, biliTracks: bili };
  }, [tracks]);

  const album = albums[0] ?? null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
      {/* 频谱条 */}
      <div className="reveal" style={{ height: 52, opacity: 0.9 }}>
        <VisualizerBars />
      </div>

      {/* 合集大卡 */}
      {album && (
        <div className="reveal card" style={{ overflow: 'hidden' }}>
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-6)',
              padding: 'var(--space-6)',
              flexWrap: 'wrap',
            }}
          >
            <img
              src={album.cover}
              alt={album.title}
              referrerPolicy="no-referrer"
              style={{
                width: 148,
                height: 148,
                objectFit: 'cover',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--line)',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--space-2)' }}>
              <span className="mono" style={{ fontSize: 10, letterSpacing: '0.24em', color: 'var(--accent)' }}>
                ALBUM · 合集
              </span>
              <h3 className="serif" style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>
                {album.title}
              </h3>
              {album.description && (
                <p className="line-clamp-3" style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', maxWidth: 560 }}>
                  {album.description}
                </p>
              )}
              <div
                className="mono"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                  flexWrap: 'wrap',
                  marginTop: 'var(--space-2)',
                  fontSize: 11,
                  color: 'var(--ink-faint)',
                }}
              >
                <span>{biliTracks.length} 首曲目</span>
                {album.createdAt && <span>{formatDateShort(album.createdAt)}</span>}
                {biliTracks[0]?.bilibili?.url && (
                  <a href={biliTracks[0].bilibili.url} target="_blank" rel="noopener noreferrer" className="text-link" style={{ fontSize: 11 }}>
                    在 B 站查看合集
                    <Icon name="arrowUpRight" size={11} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* B 站曲目表 */}
      {biliTracks.length > 0 && (
        <div className="reveal card" style={{ overflow: 'hidden' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-3) var(--space-6)',
              borderBottom: '1px solid var(--line)',
            }}
          >
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--ink-soft)' }}>
              TRACKLIST · 曲目
            </span>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-faint)' }}>
              {String(biliTracks.length).padStart(2, '0')} TRACKS
            </span>
          </div>
          {biliTracks.map((track, i) => (
            <TrackRow key={track.id} track={track} index={i} list={biliTracks} />
          ))}
        </div>
      )}

      {/* 本地作品区块（框架保留，开关关闭时不展示） */}
      {SHOW_LOCAL_TRACKS && localTracks.length > 0 && (
        <div className="reveal card" style={{ overflow: 'hidden' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-3) var(--space-6)',
              borderBottom: '1px solid var(--line)',
            }}
          >
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--ink-soft)' }}>
              LOCAL · 本地作品
            </span>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-faint)' }}>
              {String(localTracks.length).padStart(2, '0')} TRACKS
            </span>
          </div>
          {localTracks.map((track, i) => (
            <TrackRow key={track.id} track={track} index={i} list={localTracks} />
          ))}
        </div>
      )}

      {localTracks.length === 0 && biliTracks.length === 0 && (
        <div className="reveal card" style={{ padding: 'var(--space-10)', textAlign: 'center' }}>
          <p className="mono" style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-faint)', letterSpacing: '0.2em' }}>
            暂无曲目
          </p>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   单行曲目 · hover 时时长位置切换为操作提示
   ============================================================ */

interface TrackRowProps {
  track: Track;
  index: number;
  list: Track[];
}

function TrackRow({ track, index, list }: TrackRowProps) {
  const [hover, setHover] = useState(false);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playTrack = usePlayerStore((s) => s.playTrack);

  const active = track.id === currentTrack?.id;
  const isBili = Boolean(track.bilibili);

  const handleClick = () => {
    // B站 来源 → 外链跳转；本地 → 站内播放
    if (isBili && track.bilibili) {
      window.open(track.bilibili.url, '_blank', 'noopener,noreferrer');
      return;
    }
    playTrack(track, list);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        padding: '10px var(--space-6)',
        cursor: 'pointer',
        background: hover ? 'var(--paper-deep)' : active ? 'var(--accent-soft)' : 'transparent',
        borderBottom: index < list.length - 1 ? '1px solid var(--line)' : 'none',
        transition: 'background var(--duration-fast) var(--ease-out)',
      }}
    >
      {/* 序号 / 播放态 */}
      <span
        className="mono"
        style={{
          width: 26,
          textAlign: 'right',
          flexShrink: 0,
          fontSize: 'var(--text-xs)',
          color: active ? 'var(--accent)' : 'var(--ink-faint)',
        }}
      >
        {active && isPlaying ? (
          <span className="eq"><span /><span /><span /></span>
        ) : (
          String(index + 1).padStart(2, '0')
        )}
      </span>

      {/* 封面缩略图（保留原比例，B 站封面通常 16:9） */}
      <div
        style={{
          width: 52,
          height: 29,
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          flexShrink: 0,
          border: '1px solid var(--line)',
          background: 'var(--paper-deep)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--ink-faint)',
        }}
      >
        {track.cover ? (
          <img src={track.cover} alt="" referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Icon name="music" size={14} />
        )}
      </div>

      {/* 标题信息 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          className="truncate"
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--ink)',
            fontWeight: active ? 600 : 400,
          }}
        >
          {track.title}
        </p>
        {/* 歌名（小字） */}
        {track.originalTitle && (
          <p className="truncate mono" style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 1 }}>
            {track.originalTitle}
          </p>
        )}
      </div>

      {/* 播放量 */}
      {track.bilibili?.view != null && (
        <span className="mono track-view" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--ink-faint)', flexShrink: 0 }}>
          <Icon name="eye" size={12} />
          {track.bilibili.view}
        </span>
      )}
      {/* 时长 / hover 操作 */}
      <span className="mono" style={{ width: 52, textAlign: 'right', flexShrink: 0, fontSize: 11, color: hover ? 'var(--accent)' : 'var(--ink-faint)', transition: 'color var(--duration-fast) var(--ease-out)' }}>
        {hover ? (isBili ? '观看 ↗' : '播放 →') : formatDuration(track.duration ?? 0)}
      </span>

      {/* 原站按钮：B站 曲目跳转观看视频；本地曲目下载 */}
      {isBili && track.bilibili ? (
        <a
          href={track.bilibili.url}
          target="_blank"
          rel="noopener noreferrer"
          className="icon-btn"
          style={{ width: 30, height: 30, flexShrink: 0 }}
          aria-label={`在 B站 观看 ${track.title}`}
          title="原站观看"
          onClick={(e) => e.stopPropagation()}
        >
          <Icon name="arrowUpRight" size={14} />
        </a>
      ) : (
        <a
          href={track.download.mp3}
          download
          className="icon-btn"
          style={{ width: 30, height: 30, flexShrink: 0 }}
          aria-label={`下载 ${track.title}`}
          title="下载"
          onClick={(e) => e.stopPropagation()}
        >
          <Icon name="download" size={14} />
        </a>
      )}
    </div>
  );
}
