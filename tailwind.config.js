/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [],
  theme: {
    extend: {
      colors: {
        'e-blue': '#0099FF',
        'e-orange': '#FF6633'
      }
    }
  }
};
