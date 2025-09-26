// File: /surftrust/webpack.config.js

const defaultConfig = require("@wordpress/scripts/config/webpack.config");

module.exports = {
  ...defaultConfig,
  entry: {
    // The key 'settings' will create a 'build/settings.js' file
    settings: "./src-jsx/settings/settings.js",

    // The key 'analytics' will create a 'build/analytics.js' file
    analytics: "./src-jsx/analytics/analytics.js",
    dashboard: "./src-jsx/dashboard/dashboard.js",
    builder: "./src-jsx/builder/builder.js",
    public: "./src-jsx/public.js",
  },
};
