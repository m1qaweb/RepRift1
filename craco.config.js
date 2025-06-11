// craco.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  webpack: {
    plugins: {
      add: [
        // Only run analyzer in production build mode
        process.env.NODE_ENV === 'production' && new BundleAnalyzerPlugin({
          analyzerMode: 'static', // Generates a report file
          reportFilename: 'report.html',
          openAnalyzer: true, // Opens the report in the browser
        }),
      ].filter(Boolean),
    }
  },
  style: {
    postcssOptions: {
      // Updated from 'postcss' to 'postcssOptions'
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  jest: {
    configure: (jestConfig) => {
      jestConfig.setupFilesAfterEnv = [
        "<rootDir>/config/jest/setupPolyfills.js",
        "<rootDir>/src/setupTests.ts",
      ];
      jestConfig.testEnvironment = "jsdom";
      jestConfig.transformIgnorePatterns = [
        "/node_modules/(?!@bundled-es-modules/tough-cookie).+\\.js$",
      ];
      return jestConfig;
    },
  },
};
