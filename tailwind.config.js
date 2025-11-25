/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F7F4',
          100: '#D1EAE1',
          200: '#A3D4C5',
          300: '#75BFA8',
          400: '#4A9B7F',
          500: '#2C5F4F',
          600: '#245449',
          700: '#1C4240',
          800: '#153136',
          900: '#0E212A'
        },
        secondary: {
          50: '#F5F2ED',
          100: '#E8E0D3',
          200: '#D1C1A7',
          300: '#BAA17B',
          400: '#A6844F',
          500: '#8B6F47',
          600: '#7D633F',
          700: '#6F5737',
          800: '#614B2F',
          900: '#533F27'
        },
        accent: {
          50: '#FBF3E6',
          100: '#F5E2C0',
          200: '#EFC581',
          300: '#E9A842',
          400: '#D4922F',
          500: '#BF7C1A',
          600: '#AA6E15',
          700: '#956010',
          800: '#80520B',
          900: '#6B4406'
        },
        surface: '#FFFFFF',
        background: '#F8F6F3'
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-in': 'bounceIn 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}