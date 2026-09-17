/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['DM Sans', 'sans-serif'], display: ['Space Grotesk', 'sans-serif'] },
      colors: {
        ink: '#0b1020',
        canvas: '#f8fafc',
        accent: '#4f46e5',
        violet: '#8a6ff0',
        mint: '#10b981',
        navy: {
          950: '#070c18',
          900: '#0b1329',
          800: '#111c38',
          700: '#1e293b',
          600: '#334155',
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.05)',
        glow: '0 14px 40px rgba(79, 70, 229, 0.20)',
        card: '0 2px 12px -1px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 12px 32px -4px rgba(15, 23, 42, 0.10), 0 4px 12px -2px rgba(15, 23, 42, 0.05)',
      },
    },
  },
  plugins: [],
};
