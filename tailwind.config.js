/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'apathetic': {
          '100': '#F9F8FE',
          '200': '#D2CFF4',
          '300': '#ACA5EB',
          '400': '#857CE1',
          '500': '#5E52D8',
          '600': '#3C2EC9',
          '700': '#30259F',
          '800': '#231B76',
        },
      }
    }
  },
  plugins: []
}
