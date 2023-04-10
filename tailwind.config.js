/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        apathetic: {
          50: '#eff3fe',
          100: '#e2e7fd',
          200: '#cbd3fa',
          300: '#acb7f5',
          400: '#8b91ee',
          500: '#6f6ee6',
          600: '#5e52d8',
          700: '#5144be',
          800: '#42399a',
          900: '#39357a',
          950: '#221f47'
        },
        careless: {
          50: '#eef4ff',
          100: '#e0ebff',
          200: '#c7dafe',
          300: '#a4c0fd',
          400: '#809cf9',
          500: '#6279f2',
          600: '#3e4ce5',
          700: '#3741cb',
          800: '#2f38a4',
          900: '#2e3781',
          950: '#1b1f4b'
        }
      }
    }
  },
  plugins: []
}
