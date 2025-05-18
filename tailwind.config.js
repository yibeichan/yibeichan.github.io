/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Variable', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      colors: {
        'mit-red': '#A31F34',
      }
    },
  },
  plugins: [],
}