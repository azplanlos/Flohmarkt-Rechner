const konstaConfig = require('konsta/config');

/** @type {import('tailwindcss').Config} */
module.exports = konstaConfig({
  konsta: {
    colors: {
      // "primary" is the main app color, if not specified will be default to '#007aff'
      primary: '#007aff',
      // custom colors used for Konsta UI components theming
      'brand-red': '#ff0000',
      'brand-green': '#00ff00',
      'brand-orange': '#ff5500',
    }
  },
  content: [
    './src/*.{ts,tsx}'
  ],
  darkMode: 'selector', // or 'class'
  theme: {
    extend: {},
  },
  plugins: [],
});

