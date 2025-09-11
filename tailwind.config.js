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
        // Updated palette to match logo
        primary: {
          50: '#eef6f1',
          100: '#d7e9df',
          200: '#a9d0bd',
          300: '#72b395',
          400: '#3f946e',
          500: '#216d4d',
          600: '#1b5a40',
          700: '#164a35',
          800: '#123c2b',
          900: '#0f3224',
        },
        secondary: {
          50: '#fbf6ef',
          100: '#f5ead8',
          200: '#ead2ad',
          300: '#dbb480',
          400: '#c9965b',
          500: '#a8743e',
          600: '#8e6033',
          700: '#724c29',
          800: '#5b3e21',
          900: '#4b341b',
        },
        cream: '#f3efdf',
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
