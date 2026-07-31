import { useState } from 'react';
import type { SiteData } from '../../types/manifest';
import { Icon, type IconName } from '../core/Icon';

/* ============================================================
   联系 · 频道列表（复制 + 外链）
   ============================================================ */

interface Channel {
  icon: IconName;
  label: string;
  value: string;
  copyable?: boolean;
  href?: string;
}

export function Contact({ site }: { site: SiteData }) {
  const { contact, links } = site.owner;
  const [copied, setCopied] = useState<string | null>(null);

  const channels: Channel[] = [];
  if (contact?.email) channels.push({ icon: 'mail', label: 'EMAIL', value: contact.email, copyable: true, href: `mailto:${contact.email}` });
  if (contact?.qq) channels.push({ icon: 'link', label: 'QQ', value: contact.qq, copyable: true });
  if (contact?.wechat) channels.push({ icon: 'link', label: 'WECHAT', value: contact.wechat, copyable: true });
  if (contact?.telegram) channels.push({ icon: 'external', label: 'TELEGRAM', value: contact.telegram, copyable: true });
  if (contact?.discord) channels.push({ icon: 'link', label: 'DISCORD', value: contact.discord, copyable: true });
  contact?.others?.forEach((o) => channels.push({ icon: 'link', label: o.label.toUpperCase(), value: o.url, href: o.url }));
  links?.forEach((l) => channels.push({ icon: 'external', label: l.label.toUpperCase(), value: l.url, href: l.url }));

  const copy = async (ch: Channel) => {
    try {
      await navigator.clipboard.writeText(ch.value);
      setCopied(ch.label);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* 剪贴板不可用时静默 */
    }
  };

  if (channels.length === 0) return null;

  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxWidth: 680 }}>
      {channels.map((ch) => (
        <div
          key={ch.label + ch.value}
          className="card"
          style={{
            padding: 'var(--space-3) var(--space-5)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
          }}
        >
          <span
            style={{
              width: 38,
              height: 38,
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-soft)',
            }}
          >
            <Icon name={ch.icon} size={17} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--ink-faint)' }}>
              {ch.label}
            </p>
            <p className="truncate mono" style={{ fontSize: 'var(--text-sm)', color: 'var(--ink)', marginTop: 2 }}>
              {ch.value}
            </p>
          </div>
          {ch.copyable && (
            <button type="button" className="icon-btn" onClick={() => copy(ch)} aria-label={`复制 ${ch.label}`}>
              <Icon
                name={copied === ch.label ? 'check' : 'copy'}
                size={16}
                style={copied === ch.label ? { color: 'var(--accent)' } : undefined}
              />
            </button>
          )}
          {ch.href && (
            <a href={ch.href} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label={`打开 ${ch.label}`}>
              <Icon name="arrowUpRight" size={16} />
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
