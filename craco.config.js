// craco.config.js
module.exports = {
  style: {
    postcssOptions: {
      // Updated from 'postcss' to 'postcssOptions'
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
};
