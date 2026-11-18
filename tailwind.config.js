/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        terracotta: {
          50: '#fbf1ec', 100: '#f5ddd2', 200: '#ebbba5', 300: '#dd9475', 400: '#cd7550',
          500: '#b95d3b', 600: '#a14b2f', 700: '#833c28', 800: '#6b3326', 900: '#582d23',
        },
        sandstone: {
          50: '#faf6ee', 100: '#f1e8d7', 200: '#e5d4b5', 300: '#d4bb90', 400: '#c3a371',
          500: '#ad8a58', 600: '#8f6f45', 700: '#735839', 800: '#5e4a33', 900: '#4e3e2d',
        },
        ivory: { DEFAULT: '#fbf7ee', dark: '#f4ecdc' },
        charcoal: {
          50: '#f5f4f3', 100: '#e6e3e0', 200: '#cbc6c0', 300: '#a8a199', 400: '#847c73',
          500: '#675f57', 600: '#524b45', 700: '#433d38', 800: '#35302c', 900: '#2a2623',
        },
        olive: {
          50: '#f4f6ec', 100: '#e5ead3', 200: '#cbd5a9', 300: '#aab97b', 400: '#8c9d57',
          500: '#6f8040', 600: '#586733', 700: '#46522b', 800: '#394325', 900: '#2f3720',
        },
        gold: { 300: '#dcc589', 400: '#cdae62', 500: '#b8933f', 600: '#9a7832' },
      },
      fontFamily: {
        display: ['"Playfair Display"', '"Noto Serif Telugu"', 'Georgia', 'serif'],
        sans: ['Inter', '"Noto Sans Telugu"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(42,38,35,.05), 0 8px 24px -8px rgba(42,38,35,.14)',
        lift: '0 2px 4px rgba(42,38,35,.06), 0 18px 40px -12px rgba(42,38,35,.24)',
      },
      borderRadius: { xl2: '1.25rem', xl3: '1.75rem' },
      keyframes: {
        rise: { '0%': { opacity: 0, transform: 'translateY(14px)' }, '100%': { opacity: 1, transform: 'none' } },
        pop: { '0%': { opacity: 0, transform: 'scale(.96)' }, '100%': { opacity: 1, transform: 'none' } },
        slide: { '0%': { opacity: 0, transform: 'translateX(24px)' }, '100%': { opacity: 1, transform: 'none' } },
      },
      animation: {
        rise: 'rise .6s cubic-bezier(.2,.7,.2,1) both',
        pop: 'pop .22s ease-out both',
        slide: 'slide .28s ease-out both',
      },
    },
  },
  plugins: [],
};
