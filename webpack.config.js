// File: /surftrust/webpack.config.js

const defaultConfig = require("@wordpress/scripts/config/webpack.config");

module.exports = {
  ...defaultConfig,
  entry: {
    app: "./src-jsx/index.js", // For the main SPA
    builder: "./src-jsx/builder.js", // For the builder
    public: "./src-jsx/public.js",
  },
};
