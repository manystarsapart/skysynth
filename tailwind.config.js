module.exports = {
  content: ["./*.html"],
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        "pressstart2p": ["PressStart2P"]  
      },
      // color: {
      //   "light-red": "#F08080",
      //   "light-green": "#588157"
      // }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
