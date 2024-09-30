/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./apps/**/src/**/*.{html,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require('tailwindcss-primeui')],
};
