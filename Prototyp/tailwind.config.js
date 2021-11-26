const colors = require('tailwindcss/colors')

module.exports = {
  // add daisyUI plugin
  plugins: [
    require('daisyui'),
  ],
  // config (optional)
  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
  },

}