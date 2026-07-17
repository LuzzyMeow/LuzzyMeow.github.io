import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // 颜色与字体均通过 CSS variables 注入，Tailwind 仅作为工具类
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
      },
      fontFamily: {
        sans: ['"Alibaba PuHuiTi"', '"Alibaba Sans"', 'sans-serif'],
        mono: ['"Alibaba Sans"', '"SF Mono"', '"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'glass-sm': 'var(--radius-sm)',
        'glass-md': 'var(--radius-md)',
        'glass-lg': 'var(--radius-lg)',
        'glass-xl': 'var(--radius-xl)',
      },
      transitionTimingFunction: {
        'apple-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'apple-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config
