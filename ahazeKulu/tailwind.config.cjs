module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ethiopia: {
          50: '#f6fbf6',
          100: '#eaf7ea',
          200: '#cdeccf',
          300: '#b0e1b4',
          400: '#6fc76f',
          500: '#2ca12c',
          600: '#238a23',
          700: '#196b19',
          800: '#114f11',
          900: '#083308'
        },
        ethiopiaYellow: '#ffd400',
        ethiopiaRed: '#e21b24'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    },
  },
  plugins: [],
}
