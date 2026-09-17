/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0B0F17',
          surface: '#121B2A',
          card: '#111827',
          cardElevated: '#162032',
          border: '#1F293D',
          borderHover: '#334155',
          cyan: '#00F2FE',
          cyanGlow: 'rgba(0, 242, 254, 0.4)',
          purple: '#A855F7',
          purpleGlow: 'rgba(168, 85, 247, 0.4)',
          emerald: '#10B981',
          slate: '#94A3B8',
        },
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        brand: {
          dark: '#0B0F17',
          card: '#121B2A',
          accent: '#00F2FE',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 12px 30px -4px rgba(0, 0, 0, 0.6), 0 4px 10px -2px rgba(0, 242, 254, 0.1)',
        'glow-cyan': '0 0 25px -5px rgba(0, 242, 254, 0.35)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.35)',
      }
    },
  },
  plugins: [],
}
