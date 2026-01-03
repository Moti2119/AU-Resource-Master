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
          DEFAULT: '#428bca', // Ambo University Blue
          dark: '#357abd',
          light: '#5ba0d4',
          lighter: '#7eb5dd',
        },
        secondary: {
          DEFAULT: '#F2B705', // Ambo University Gold
          dark: '#D9A504',
          light: '#FFC926',
        },
        ambo: {
          blue: '#428bca',
          'blue-dark': '#357abd',
          'blue-light': '#5ba0d4',
          gold: '#F2B705',
          'gold-dark': '#D9A504',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

