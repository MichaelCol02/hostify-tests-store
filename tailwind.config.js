/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'verde': '#4B4602',
        'marron': '#563D06',
        'dorado': '#CC9933',
        'verde-light': '#788C2C',
        'marron-dorado': '#9F610E',
      },
      fontFamily: {
        'cormorant': ['Cormorant Garamond', 'serif'],
        'barlow': ['Barlow', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
