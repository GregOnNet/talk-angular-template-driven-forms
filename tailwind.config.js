/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./{apps,libs}/**/src/**/*.{html,ts}'],
  theme: {
    extend: {}
  },
  plugins: [require('tailwindcss-primeui')]
}
