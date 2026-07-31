import type { SkillGroup } from '../../types/manifest';
import { Icon } from '../core/Icon';
import { Panel } from '../core/Panel';
import { Tag } from '../core/Tag';

/* ============================================================
   技能 · 分组面板：朱红刻度条 + 兴趣标签
   ============================================================ */

export function Skills({ skills }: { skills?: SkillGroup[] }) {
  if (!skills || skills.length === 0) return null;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
        gap: 'var(--space-6)',
      }}
    >
      {skills.map((group, gi) => (
        <Panel key={group.category} className="reveal" style={{ padding: 'var(--space-6)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-5)',
              paddingBottom: 'var(--space-3)',
              borderBottom: '1px solid var(--line)',
            }}
          >
            <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)' }}>
              {String(gi + 1).padStart(2, '0')}
            </span>
            <h3 className="serif" style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>
              {group.category}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {group.items.map((item) => (
              <div key={item.name}>
                {typeof item.level === 'number' ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>
                        {item.isHobby && <Icon name="star" size={11} style={{ color: 'var(--accent)' }} />}
                        {item.name}
                      </span>
                      <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-faint)' }}>
                        {item.level}%
                      </span>
                    </div>
                    <div style={{ height: 3, background: 'rgba(27, 23, 18, 0.08)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${item.level}%`,
                          height: '100%',
                          background: item.isHobby ? 'var(--ink)' : 'var(--accent)',
                          borderRadius: 'var(--radius-pill)',
                          transition: 'width var(--duration-slow) var(--ease-out)',
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>
                    {item.isHobby && <Icon name="star" size={11} style={{ color: 'var(--accent)' }} />}
                    <Tag accent={item.isHobby}>{item.name}</Tag>
                  </span>
                )}
              </div>
            ))}
          </div>
        </Panel>
      ))}
    </div>
  );
}
