import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        syngenta: {
          blue: '#0057b8',
          deep: '#0a2240',
          green: '#78be20',
          yellow: '#f2c94c',
          offwhite: '#f5f7f4',
          earth: '#7f7566',
        },
      },
      fontFamily: {
        heading: ['Manrope', 'system-ui', 'sans-serif'],
        body: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 48px rgba(10, 34, 64, 0.12)',
        panel: '0 30px 80px rgba(7, 24, 44, 0.20)',
      },
      backgroundImage: {
        'noise-soft':
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,.35) 1px, transparent 0)",
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(3deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.12' },
          '50%': { opacity: '0.22' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        'float-slow': 'float-slow 11s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 5s ease-in-out infinite',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '[data-section-blend]::before': {
          content: '""',
          position: 'absolute',
          top: '-1px',
          left: '0',
          right: '0',
          height: '72px',
          pointerEvents: 'none',
          zIndex: '1',
        },
        '[data-section-blend="white-to-dark"]::before': { background: 'linear-gradient(to bottom, #ffffff 0%, transparent 70%)' },
        '[data-section-blend="dark-to-light"]::before': { background: 'linear-gradient(to bottom, #031a35 0%, transparent 70%)' },
        '[data-section-blend="offwhite-to-dark"]::before': { background: 'linear-gradient(to bottom, #eef4f9 0%, transparent 70%)' },

        '[data-section-blend-bottom]::after': {
          content: '""',
          position: 'absolute',
          bottom: '-1px',
          left: '0',
          right: '0',
          height: '72px',
          pointerEvents: 'none',
          zIndex: '1',
        },
        '[data-section-blend-bottom="dark-to-white"]::after': { background: 'linear-gradient(to top, #ffffff 0%, transparent 70%)' },
        '[data-section-blend-bottom="dark-to-offwhite"]::after': { background: 'linear-gradient(to top, #f5f7f4 0%, transparent 70%)' },
        '[data-section-blend-bottom="dark-to-eef"]::after': { background: 'linear-gradient(to top, #eef4f9 0%, transparent 70%)' },
      });
    }),
  ],
} satisfies Config;
