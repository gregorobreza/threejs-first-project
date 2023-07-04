/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      "rich-black": "#080C1D",
      "indigo-dye": "#0B447A",
      "rose": "#FE0172",
      "columbia-blue": "#C4DEE8",
      "baby-powder": "#FFFCF9",
    },
    extend: {


    },
  },
  plugins: [],
}

