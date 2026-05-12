/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'theme-bg': '#f3f1eb',
        'theme-card': '#ffffff',
        'brand-orange-500': '#ff9b44',
        'brand-orange-600': '#fc7941',
        'brand-purple-800': '#5d387f',
        'brand-purple-900': '#41225e',
        'stat-peach': '#fde2d4',
        'stat-purple': '#f6ebff',
        'stat-green': '#dfffed',
        'stat-blue': '#4c63db',
        'text-main': '#2d3748',
        'text-muted': '#a0aec0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
}
