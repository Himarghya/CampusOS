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
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        brand: {
          dark: '#0B1220',
          card: '#111C30',
          accent: '#4F46E5',
        },
        edu: {
          purple: '#6366F1',
          purpleLight: '#EEF2FF',
          green: '#10B981',
          greenLight: '#ECFDF5',
          amber: '#F59E0B',
          amberLight: '#FFFBEB',
          rose: '#F43F5E',
          roseLight: '#FFF1F2',
          blue: '#3B82F6',
          blueLight: '#EFF6FF',
          bg: '#F8FAFC'
        }
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
        'card': '0 2px 12px -2px rgba(0, 0, 0, 0.05), 0 4px 8px -2px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 25px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px -5px rgba(99, 102, 241, 0.3)',
      }
    },
  },
  plugins: [],
}
