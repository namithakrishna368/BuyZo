/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef3f8',
          100: '#d4e0ed',
          200: '#a9c1db',
          300: '#7ea2c9',
          400: '#5383b7',
          500: '#2d6499',
          600: '#1e3a5f',
          700: '#172e4c',
          800: '#102239',
          900: '#0a1626',
        },
        cream: {
          50: '#fdfcfa',
          100: '#f8f6f3',
          200: '#f0ebe4',
          300: '#e8e0d5',
          400: '#d9cfc0',
          500: '#c9bda8',
        },
        amazon: {
          bg: '#eaeded',
          nav: '#131921',
          'nav-secondary': '#232f3e',
          dark: '#0f1111',
          gold: '#febd69',
          'gold-hover': '#f3a847',
          star: '#ffa41c',
          link: '#007185',
          'link-hover': '#c7511f',
          prime: '#00a8e1',
          cta: '#ffd814',
          'cta-hover': '#f7ca00',
          buy: '#ffa41c',
          'buy-hover': '#fa8900',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(30, 58, 95, 0.08)',
        elevated: '0 8px 32px rgba(30, 58, 95, 0.12)',
      },
    },
  },
  plugins: [],
};
