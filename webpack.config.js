// File: /surftrust/webpack.config.js

const defaultConfig = require("@wordpress/scripts/config/webpack.config");

module.exports = {
  ...defaultConfig,
  entry: {
    index: "./src-jsx/index.js", // Our existing admin app
    public: "./src-jsx/public.js", // Our new public script
  },
};
