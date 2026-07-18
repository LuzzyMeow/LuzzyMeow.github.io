import type { SkillGroup } from '../../types/manifest';
import { Icon } from '../core/Icon';
import { NeonPanel } from '../core/NeonPanel';
import { NeonTag } from '../core/NeonTag';

/* ============================================================
   技能 · 能量条（技能=青 / 兴趣=品红）
   ============================================================ */

export function Skills({ skills }: { skills?: SkillGroup[] }) {
  if (!skills || skills.length === 0) return null;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--space-6)',
      }}
    >
      {skills.map((group, gi) => (
        <NeonPanel key={group.category} className="reveal" scan={gi % 2 === 0}>
          <p className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--pink)', letterSpacing: '0.2em', marginBottom: 'var(--space-5)' }}>
            {String(gi + 1).padStart(2, '0')} // {group.category}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {group.items.map((item) => {
              const color = item.isHobby ? 'var(--pink)' : 'var(--cyan)';
              return (
                <div key={item.name}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                      {item.isHobby && <Icon name="star" size={12} style={{ color: 'var(--pink)' }} />}
                      {item.name}
                    </span>
                    {typeof item.level === 'number' && (
                      <span className="mono" style={{ fontSize: 'var(--text-xs)', color }}>{item.level}%</span>
                    )}
                  </div>
                  {typeof item.level === 'number' ? (
                    <div style={{ height: 4, background: 'rgba(0,229,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${item.level}%`,
                          height: '100%',
                          background: item.isHobby
                            ? 'linear-gradient(90deg, var(--violet), var(--pink))'
                            : 'linear-gradient(90deg, var(--cyan), var(--violet))',
                          boxShadow: item.isHobby ? '0 0 8px rgba(255,45,150,0.5)' : '0 0 8px rgba(0,229,255,0.5)',
                          borderRadius: 2,
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <NeonTag pink={item.isHobby}>{item.isHobby ? 'HOBBY' : 'TAG'}</NeonTag>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </NeonPanel>
      ))}
    </div>
  );
}
