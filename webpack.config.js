// File: /surftrust/webpack.config.js

const defaultConfig = require("@wordpress/scripts/config/webpack.config");

module.exports = {
  ...defaultConfig,
  entry: {
    app: "./src-jsx/index.js", // Our new single admin app
    public: "./src-jsx/public.js", // The public script remains
  },
};
