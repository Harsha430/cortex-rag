/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'bg-base': '#080810',
        'bg-surface': '#0f0f1a',
        'bg-card': '#141420',
        'bg-elevated': '#1a1a2e',
        'cx-violet': '#7c6af7',
        'cx-cyan': '#22d3ee',
        'cx-emerald': '#10b981',
        'cx-amber': '#f59e0b',
        'cx-red': '#ef4444',
        'cx-muted': '#4b5563',
        'cx-secondary': '#9ca3af',
        'cx-primary': '#f1f5f9',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
