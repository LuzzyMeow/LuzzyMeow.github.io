import { useMemo } from 'react';
import type { Album, Track } from '../../types/manifest';
import { usePlayerStore } from '../../store/playerStore';
import { formatDuration } from '../../lib/format';
import { Icon } from '../core/Icon';
import { VisualizerBars } from '../player/VisualizerBars';

/* ============================================================
   作品 · 音轨库：专辑列 + 曲目列表
   - 本地 MP3 曲目：点击播放
   - B 站来源曲目：点击外链跳转 B 站
   ============================================================ */

interface WorksProps {
  tracks: Track[];
  albums: Album[];
}

/** 本地作品区块显示开关：false 时即使有本地曲目也不渲染（框架保留） */
const SHOW_LOCAL_TRACKS: boolean = false;

export function Works({ tracks, albums }: WorksProps) {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playTrack = usePlayerStore((s) => s.playTrack);

  // 本地曲目（可播放）与 B 站曲目（外链）分组
  const { localTracks, biliTracks } = useMemo(() => {
    const local: Track[] = [];
    const bili: Track[] = [];
    for (const t of tracks) {
      if (t.bilibili) bili.push(t);
      else local.push(t);
    }
    return { localTracks: local, biliTracks: bili };
  }, [tracks]);

  const playAlbum = (album: Album) => {
    const list = (album.trackIds ?? [])
      .map((id) => localTracks.find((t) => t.id === id))
      .filter((t): t is Track => Boolean(t));
    if (list.length > 0) playTrack(list[0], list);
  };
  // 保留引用：专辑播放逻辑预留给未来本地作品区块恢复时使用
  void playAlbum; void albums;

  const renderTrackRow = (track: Track, i: number, list: Track[]) => {
    const active = track.id === currentTrack?.id;
    const isBili = Boolean(track.bilibili);

    // 点击：B 站来源 → 外链打开；本地 → 播放
    const handleClick = () => {
      if (isBili && track.bilibili) {
        window.open(track.bilibili.url, '_blank', 'noopener,noreferrer');
        return;
      }
      playTrack(track, list);
    };

    return (
      <div
        key={track.id}
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          padding: '12px var(--space-5)',
          cursor: 'pointer',
          borderLeft: active ? '2px solid var(--cyan)' : '2px solid transparent',
          borderBottom: i < list.length - 1 ? '1px solid rgba(0,229,255,0.06)' : 'none',
          background: active ? 'rgba(0,229,255,0.05)' : 'transparent',
          transition: 'background var(--duration-fast) var(--ease-neon)',
        }}
        onMouseEnter={(e) => {
          if (!active) e.currentTarget.style.background = 'rgba(0,229,255,0.04)';
        }}
        onMouseLeave={(e) => {
          if (!active) e.currentTarget.style.background = 'transparent';
        }}
      >
        {/* 序号 / 播放态 */}
        <span
          className="mono"
          style={{
            width: 30,
            textAlign: 'right',
            flexShrink: 0,
            fontSize: 'var(--text-xs)',
            color: active ? 'var(--cyan)' : 'var(--text-tertiary)',
            textShadow: active ? 'var(--glow-text-cyan)' : 'none',
          }}
        >
          {active && isPlaying ? (
            <span className="eq"><span /><span /><span /></span>
          ) : (
            String(i + 1).padStart(2, '0')
          )}
        </span>

        {/* 封面缩略图（保留原比例，B 站封面通常 16:9） */}
        <div
          style={{
            width: 56,
            height: 32,
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            flexShrink: 0,
            border: '1px solid var(--line)',
            background: 'linear-gradient(135deg, rgba(0,229,255,0.08), rgba(255,45,150,0.08))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-tertiary)',
          }}
        >
          {track.cover ? (
            <img src={track.cover} alt="" referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Icon name="music" size={16} />
          )}
        </div>

        {/* 标题信息 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            className="truncate"
            style={{
              fontSize: 'var(--text-base)',
              color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: active ? 500 : 400,
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            {track.title}
            {isBili && (
              <span
                className="mono"
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--pink)',
                  border: '1px solid var(--line-pink)',
                  padding: '0 6px',
                  borderRadius: 'var(--radius-sm)',
                  letterSpacing: '0.1em',
                  flexShrink: 0,
                }}
              >
                B站
              </span>
            )}
          </p>
          {track.originalArtist && (
            <p className="truncate mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
              原唱 {track.originalArtist}
            </p>
          )}
        </div>

        {/* 时长 */}
        <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', width: 44, textAlign: 'right', flexShrink: 0 }}>
          {formatDuration(track.duration ?? 0)}
        </span>

        {/* 操作按钮 */}
        {isBili ? (
          <a
            href={track.bilibili!.url}
            target="_blank"
            rel="noopener noreferrer"
            className="neon-icon-btn"
            style={{ width: 30, height: 30, flexShrink: 0 }}
            aria-label={`在 B 站观看 ${track.title}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Icon name="external" size={15} />
          </a>
        ) : (
          <>
            <a
              href={track.download.mp3}
              download
              className="neon-icon-btn"
              style={{ width: 30, height: 30, flexShrink: 0 }}
              aria-label={`下载 ${track.title}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Icon name="download" size={15} />
            </a>
            {track.download.lossless && (
              <a
                href={track.download.lossless}
                target="_blank"
                rel="noopener noreferrer"
                className="neon-icon-btn"
                style={{ width: 30, height: 30, flexShrink: 0 }}
                aria-label={`${track.download.losslessLabel ?? '网盘'} 无损`}
                onClick={(e) => e.stopPropagation()}
              >
                <Icon name="external" size={15} />
              </a>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* 频谱条 */}
      <div className="reveal" style={{ height: 72, marginBottom: 'var(--space-8)', opacity: 0.9 }}>
        <VisualizerBars />
      </div>

      {/* 本地作品区块（框架保留，开关关闭时不展示） */}
      {SHOW_LOCAL_TRACKS && localTracks.length > 0 && (
        <div className="reveal neon-frame" style={{ marginBottom: 'var(--space-8)' }}>
          <div className="neon-frame-body" style={{ padding: 0 }}>
            <div
              className="mono"
              style={{
                padding: '10px var(--space-5)',
                fontSize: 'var(--text-xs)',
                color: 'var(--cyan)',
                letterSpacing: '0.2em',
                borderBottom: '1px solid var(--line)',
                background: 'rgba(0,229,255,0.04)',
              }}
            >
              LOCAL · 本地作品
            </div>
            {localTracks.map((track, i) => renderTrackRow(track, i, localTracks))}
          </div>
        </div>
      )}

      {/* B 站合集曲目列表 */}
      {biliTracks.length > 0 && (
        <div className="reveal neon-frame">
          <div className="neon-frame-body" style={{ padding: 0 }}>
            <div
              className="mono"
              style={{
                padding: '10px var(--space-5)',
                fontSize: 'var(--text-xs)',
                color: 'var(--pink)',
                letterSpacing: '0.2em',
                borderBottom: '1px solid var(--line-pink)',
                background: 'rgba(255,45,150,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>BILIBILI · 翻唱合集</span>
              <a
                href={`https://www.bilibili.com/video/${biliTracks[0].bilibili?.bvid ?? ''}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="neon-icon-btn"
                style={{ width: 24, height: 24 }}
                aria-label="前往 B 站合集"
              >
                <Icon name="external" size={13} />
              </a>
            </div>
            {biliTracks.map((track, i) => renderTrackRow(track, i, biliTracks))}
          </div>
        </div>
      )}

      {localTracks.length === 0 && biliTracks.length === 0 && (
        <div className="reveal neon-frame">
          <div className="neon-frame-body" style={{ padding: 0 }}>
            <p className="mono" style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', letterSpacing: '0.15em' }}>
              NO SIGNAL
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
