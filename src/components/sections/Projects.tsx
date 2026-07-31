import { useEffect, useState } from 'react';
import type { Project } from '../../types/manifest';
import { Icon } from '../core/Icon';
import { Tag } from '../core/Tag';

/* ============================================================
   项目 · 动态同步 GitHub 仓库（运行时拉取，失败回退 site.json）
   - GitHub API 开放 CORS，每次打开网页拉取最新仓库列表
   - 拉取失败时展示 site.json 中手动配置的 projects
   ============================================================ */

const GITHUB_USER = 'LuzzyMeow';
const REPO_LIMIT = 6;

interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  fork: boolean;
}

function fmtDate(iso: string): string {
  return iso ? iso.slice(0, 10).replace(/-/g, '.') : ''
}

export function Projects({ projects }: { projects?: Project[] }) {
  const [repos, setRepos] = useState<GitHubRepo[] | null>(null);
  const [updated, setUpdated] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=${REPO_LIMIT}&type=public`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((list: GitHubRepo[]) => {
        if (cancelled) return;
        const own = list.filter((r) => !r.fork);
        setRepos(own);
        const newest = own.reduce((a, b) => (a.updated_at > b.updated_at ? a : b), own[0]);
        setUpdated(newest ? fmtDate(newest.updated_at) : '');
      })
      .catch(() => {
        if (!cancelled) setRepos(null); // 失败 → 回退本地 projects
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------- 兜底：site.json 中手动配置的项目 ---------- */
  if (!repos && projects && projects.length > 0) {
    return <StaticProjects projects={projects} />;
  }
  if (!repos) return null;

  return (
    <div>
      {/* 数据来源说明 */}
      <div
        className="mono reveal"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-4)',
          fontSize: 10,
          letterSpacing: '0.2em',
          color: 'var(--ink-faint)',
        }}
      >
        <span>LIVE FROM GITHUB · 仓库列表</span>
        {updated && <span>更新于 {updated}</span>}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {repos.map((repo, i) => (
          <a
            key={repo.full_name}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="card card-hover reveal"
            style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            {/* 封面 */}
            <div
              style={{
                height: 96,
                background: i % 2 === 0 ? 'var(--paper-deep)' : 'var(--accent-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--ink-faint)',
                position: 'relative',
              }}
            >
              <Icon name="disc" size={34} style={{ opacity: 0.45 }} />
              <span
                className="mono"
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 12,
                  fontSize: 10,
                  letterSpacing: '0.14em',
                  color: 'var(--accent)',
                }}
              >
                REPO
              </span>
            </div>

            <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1 }}>
              <h3 className="serif truncate" style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>
                {repo.name}
              </h3>
              {repo.description && (
                <p className="line-clamp-3" style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', flex: 1 }}>
                  {repo.description}
                </p>
              )}

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {repo.language && <Tag accent>{repo.language}</Tag>}
                {repo.stargazers_count > 0 && (
                  <Tag>
                    <Icon name="star" size={10} /> {repo.stargazers_count}
                  </Tag>
                )}
                <Tag>{fmtDate(repo.updated_at)}</Tag>
              </div>

              <div
                className="mono"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 'auto',
                  paddingTop: 'var(--space-2)',
                  fontSize: 11,
                  color: 'var(--ink-faint)',
                }}
              >
                <span>{repo.full_name}</span>
                <Icon name="arrowUpRight" size={14} style={{ color: 'var(--ink-soft)' }} />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   兜底渲染 · site.json 手动项目
   ============================================================ */

const STATUS_LABEL: Record<string, { text: string; accent?: boolean }> = {
  ongoing: { text: '进行中', accent: true },
  completed: { text: '已完成' },
  archived: { text: '已归档' },
};

function StaticProjects({ projects }: { projects: Project[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--space-6)',
      }}
    >
      {projects.map((p) => {
        const status = p.status ? STATUS_LABEL[p.status] : null;
        return (
          <div key={p.id} className="card card-hover reveal" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div
              style={{
                height: 140,
                background: 'var(--paper-deep)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--ink-faint)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {p.cover ? (
                <img src={p.cover} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Icon name="disc" size={40} style={{ opacity: 0.45 }} />
              )}
              {p.featured && (
                <Tag accent style={{ position: 'absolute', top: 10, right: 10 }}>
                  <Icon name="star" size={10} /> 置顶
                </Tag>
              )}
            </div>

            <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
                <h3 className="serif truncate" style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>{p.title}</h3>
                {status && <Tag accent={status.accent}>{status.text}</Tag>}
              </div>
              <p className="line-clamp-3" style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', flex: 1 }}>
                {p.description}
              </p>

              {p.tags && p.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {p.tags.slice(0, 4).map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 'var(--space-2)' }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>
                  {p.startDate ?? ''}{p.startDate ? ' → ' : ''}{p.endDate ?? (p.startDate ? 'NOW' : '')}
                </span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {p.links?.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-btn"
                      style={{ width: 30, height: 30 }}
                      aria-label={l.label}
                      title={l.label}
                    >
                      <Icon name={l.icon?.toLowerCase() === 'github' ? 'github' : 'arrowUpRight'} size={14} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
