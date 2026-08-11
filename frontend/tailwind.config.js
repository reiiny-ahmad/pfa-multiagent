/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        manus: {
          black: '#0a0a0a',
          card: '#161616',
          border: '#262626',
          hover: '#1f1f1f',
        },
        snrt: {
          purple: '#8b5cf6',
          violet: '#a78bfa',
          indigo: '#6366f1',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      }
    },
  },
  plugins: [],
}