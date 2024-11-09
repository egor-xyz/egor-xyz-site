/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [],
  theme: {
    extend: {
      animation: {
        'fall': 'fall linear forwards 1'
      },
      colors: {
        'e-blue': '#0099FF',
        'e-orange': '#FF6633'
      },
      keyframes: {
        fall: {
          '0%': { transform: 'translateY(-120vh) rotate(0deg);' },
          '100%': { transform: 'translateY(120vh) rotate(360deg)' }
        }
      }
    }
  }
};
