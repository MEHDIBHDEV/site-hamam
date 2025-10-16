import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0E0E10',
        surface: '#111317',
        gold: '#3A86FF',
        eucalyptus: '#6BA892',
        text: '#F5F5F5',
        textMuted: '#C9CDD2',
        border: '#23262B',
      },
      fontFamily: {
        display: ['"Bodoni Moda"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        xl2: '0 25px 50px -12px rgba(0,0,0,0.5)',
      },
      borderRadius: {
        '2xl': '1rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
} satisfies Config
