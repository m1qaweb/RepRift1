// craco.config.js
module.exports = {
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
