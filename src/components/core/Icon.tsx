import type { CSSProperties, ReactNode } from 'react';

/* ============================================================
   霓虹图标库 · 自绘 SVG（统一 1.5px 描边 / 24 viewBox）
   ============================================================ */

const PATHS: Record<string, ReactNode> = {
  play: <path d="M8.5 5.8v12.4L19 12z" fill="currentColor" stroke="none" />,
  pause: (
    <>
      <rect x="7" y="5.5" width="3.4" height="13" rx="1" fill="currentColor" stroke="none" />
      <rect x="13.6" y="5.5" width="3.4" height="13" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  skipBack: (
    <>
      <path d="M6.5 5.5v13" />
      <path d="M18.5 6v12L9.8 12z" fill="currentColor" stroke="none" />
    </>
  ),
  skipForward: (
    <>
      <path d="M17.5 5.5v13" />
      <path d="M5.5 6v12l8.7-6z" fill="currentColor" stroke="none" />
    </>
  ),
  repeat: (
    <>
      <path d="M17 2.5 20.5 6 17 9.5" />
      <path d="M4 11V9a3 3 0 0 1 3-3h13.5" />
      <path d="m7 21.5-3.5-3.5L7 14.5" />
      <path d="M20 13v2a3 3 0 0 1-3 3H3.5" />
    </>
  ),
  repeat1: (
    <>
      <path d="M17 2.5 20.5 6 17 9.5" />
      <path d="M4 11V9a3 3 0 0 1 3-3h13.5" />
      <path d="m7 21.5-3.5-3.5L7 14.5" />
      <path d="M20 13v2a3 3 0 0 1-3 3H3.5" />
      <path d="M12.2 10.2 13.4 9.5v5.5" strokeWidth="1.6" />
    </>
  ),
  shuffle: (
    <>
      <path d="M16 3.5h4.5V8" />
      <path d="M3.5 20.5 20.5 3.5" />
      <path d="M16 20.5h4.5V16" />
      <path d="m13.7 13.8 6.8 6.7" />
      <path d="M3.5 3.5l5.9 5.9" />
    </>
  ),
  listMusic: (
    <>
      <path d="M4 6h11M4 10h11M4 14h5" />
      <path d="M15 13.5V5.5l5-1.5V12" />
      <circle cx="12.5" cy="16" r="2.5" />
      <circle cx="17.5" cy="12" r="2" />
    </>
  ),
  lyric: (
    <>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.6 3.8a.5.5 0 0 1-.9-.4V16" />
      <path d="M8 8.5h8M8 12h5" />
    </>
  ),
  chevronUp: <path d="m5.5 14.5 6.5-6.5 6.5 6.5" />,
  chevronDown: <path d="m5.5 9.5 6.5 6.5 6.5-6.5" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  music: (
    <>
      <path d="M9.5 18.5V6.8l9-2.2v11.2" />
      <circle cx="7" cy="18.5" r="2.5" />
      <circle cx="16" cy="15.8" r="2.5" />
    </>
  ),
  download: <path d="M12 3.5v11m0 0 4.2-4.2M12 14.5 7.8 10.3M4.5 20h15" />,
  external: (
    <>
      <path d="M13.5 4.5H20V11" />
      <path d="M20 4.5 10.5 14" />
      <path d="M19 14.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4.5" />
    </>
  ),
  github: (
    <path
      fill="currentColor"
      stroke="none"
      d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
    />
  ),
  video: (
    <>
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="m9.5 3.5 2.5 3.5 2.5-3.5" />
      <path d="m10.5 11 4.5 2.5-4.5 2.5z" fill="currentColor" stroke="none" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4.5 7.5 7.5 6 7.5-6" />
    </>
  ),
  link: (
    <>
      <path d="M10 14a4 4 0 0 0 6 .4l3-3a4 4 0 0 0-5.6-5.6l-1.7 1.7" />
      <path d="M14 10a4 4 0 0 0-6-.4l-3 3a4 4 0 0 0 5.6 5.6l1.7-1.7" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="1.5" />
      <path d="M5.5 15H5a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 5 3h9A1.5 1.5 0 0 1 15.5 4.5V5" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.2l3.4 2" />
    </>
  ),
  mapPin: (
    <>
      <path d="M12 21.5s7-6 7-11.5a7 7 0 1 0-14 0c0 5.5 7 11.5 7 11.5z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  star: (
    <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" />
  ),
  volume2: (
    <>
      <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor" stroke="none" />
      <path d="M15 8.8a4.5 4.5 0 0 1 0 6.4" />
      <path d="M17.8 6a8 8 0 0 1 0 12" />
    </>
  ),
  volume1: (
    <>
      <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor" stroke="none" />
      <path d="M15 8.8a4.5 4.5 0 0 1 0 6.4" />
    </>
  ),
  volumeX: (
    <>
      <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor" stroke="none" />
      <path d="m15 9.5 6 6m0-6-6 6" />
    </>
  ),
  disc: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
};

export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, className, style, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
