import { useEffect, useState } from 'react';
import type { TimelineEvent } from '../../types/manifest';
import { Icon, type IconName } from '../core/Icon';

/* ============================================================
   时间线 · 本项目 CHANGELOG（运行时拉取 GitHub commits）
   - 容器内部限高滚动，更新日志累积不会撑长页面
   - 拉取失败时回退展示 site.json 中配置的 timeline 事件
   ============================================================ */

const GITHUB_REPO = 'LuzzyMeow/LuzzyMeow.github.io';
const COMMIT_LIMIT = 20;

interface GitCommit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { date: string } | null;
  };
}

/** ISO 时间（UTC）转本地时间 YYYY.MM.DD HH:mm */
function fmtDateTime(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

export function Timeline({ timeline }: { timeline?: TimelineEvent[] }) {
  const [commits, setCommits] = useState<GitCommit[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=${COMMIT_LIMIT}`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((list: GitCommit[]) => {
        if (cancelled) return;
        // 去重：提交信息相同的只保留最新一条（如定时同步产生的重复 chore 提交）
        const seen = new Map<string, GitCommit>();
        for (const c of list) {
          const key = c.commit.message.split('\n')[0];
          if (!seen.has(key)) seen.set(key, c);
        }
        setCommits([...seen.values()]);
      })
      .catch(() => {
        if (!cancelled) setCommits(null); // 失败 → 回退本地 timeline
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const entries = commits ?? timeline ?? [];
  if (entries.length === 0) return null;

  return (
    <div
      className="reveal"
      style={{
        position: 'relative',
        paddingLeft: 24,
        maxHeight: 460,
        overflowY: 'auto',
        paddingRight: 8,
      }}
    >
      {/* 竖轴 */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 5.5,
          top: 8,
          bottom: 8,
          width: 1,
          background: 'var(--line-strong)',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {commits
          ? commits.map((c) => {
              const msg = c.commit.message.split('\n')[0].slice(0, 72);
              return (
                <div key={c.sha} style={{ position: 'relative' }}>
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: -22.5,
                      top: 6,
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      background: 'var(--paper)',
                      border: '1.5px solid var(--accent)',
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                    <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', letterSpacing: '0.06em' }}>
                      {fmtDateTime(c.commit.author?.date ?? '')}
                    </span>
                    <Icon name="github" size={13} style={{ color: 'var(--ink-faint)' }} />
                    <a
                      href={c.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono"
                      style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-faint)' }}
                      title={c.sha}
                    >
                      {c.sha.slice(0, 7)}
                    </a>
                  </div>
                  <a
                    href={c.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginTop: 2, fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--ink)', fontFamily: 'var(--font-sans)', display: 'block' }}
                  >
                    {msg}
                  </a>
                </div>
              );
            })
          : timeline?.map((ev) => {
              const meta = TYPE_META[ev.type ?? 'other'] ?? TYPE_META.other;
              const accent = ev.type === 'milestone' || ev.type === 'music';
              const color = accent ? 'var(--accent)' : 'var(--ink-soft)';
              return (
                <div key={ev.id} style={{ position: 'relative' }}>
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: -22.5,
                      top: 6,
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      background: 'var(--paper)',
                      border: `1.5px solid ${color}`,
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                    <span className="mono" style={{ fontSize: 'var(--text-xs)', color, letterSpacing: '0.1em' }}>
                      {ev.date}
                    </span>
                    <Icon name={meta.icon} size={13} style={{ color: 'var(--ink-faint)' }} />
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                      {ev.title}
                    </h3>
                  </div>
                  {ev.description && (
                    <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', maxWidth: 640 }}>
                      {ev.description}
                    </p>
                  )}
                </div>
              );
            })}
      </div>
    </div>
  );
}

/* ============================================================
   兜底时间线 · 类型图标
   ============================================================ */

const TYPE_META: Record<string, { icon: IconName }> = {
  music: { icon: 'music' },
  code: { icon: 'github' },
  study: { icon: 'star' },
  life: { icon: 'mapPin' },
  milestone: { icon: 'star' },
  other: { icon: 'clock' },
};
