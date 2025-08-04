/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'barca-blue': '#004d98',
        'barca-red': '#dc143c',
        'barca-dark-blue': '#003366',
        'barca-light-blue': '#1e5fa8',
      },
      fontFamily: {
        'mono': ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}