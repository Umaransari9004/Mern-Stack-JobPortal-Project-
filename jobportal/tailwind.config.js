/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'picton-blue': {
          '50': '#effaff',
          '100': '#def4ff',
          '200': '#b6ebff',
          '300': '#75deff',
          '400': '#2ccfff',
          '500': '#00bfff',
          '600': '#0095d4',
          '700': '#0076ab',
          '800': '#00638d',
          '900': '#065374',
          '950': '#04344d',
        },
        'gray': {
          '50': '#f6f6f6',
          '100': '#e7e7e7',
          '200': '#d1d1d1',
          '300': '#b0b0b0',
          '400': '#808080',
          '500': '#6d6d6d',
          '600': '#5d5d5d',
          '700': '#4f4f4f',
          '800': '#454545',
          '900': '#3d3d3d',
          '950': '#262626',
        },
      },
      keyframes: {
        'option-animation': {
          form: { opacity: '0', transform: 'translateX(-20px)' },
          t0: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'option-animation': 'option-animation 200ms ease forwards',
      },
    },
    screens: {
      'xsm': '350px',
      'xs': '476px',
      'sm': '640px',
      'md': '768px',
      'bs': '900px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',

      '2xl-mx': { 'max': '1535'},
      'xl-mx': { 'max': '1279px'},
      'lg-mx': { 'max': '1023px'},
      'bs-mx': { 'max': '899px'},
      'md-mx': { 'max': '767px'},
      'sm-mx': { 'max': '639px'},
      'xs-mx': { 'max': '475px'},
      'xsm-mx': { 'max': '349px'},

    },
  },
  plugins: [],
}