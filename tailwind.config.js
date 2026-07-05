/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sepia: {
          100: '#f3ead9',
          200: '#e7d7ba',
          300: '#d9c19a',
          400: '#c8a97a',
          500: '#b08f5c',
          600: '#8d6f45',
          700: '#6b5334',
        },
      },
      fontFamily: {
        display: ['"Iowan Old Style"', '"Palatino Linotype"', 'Palatino', 'Georgia', 'serif'],
        body: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
