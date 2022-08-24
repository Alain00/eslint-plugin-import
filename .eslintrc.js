"use strict";

module.exports = {
  root: true,
  parserOptions: {
    ecmaFeatures: {
      ecmaVersion: 6
    },
    sourceType: 'module'
  },
  env: {
    es6: true,
    node: true
  },
  plugins: ['import'],
  // extends: [
  //   "eslint:recommended",
  //   "plugin:eslint-plugin/recommended",
  //   "plugin:node/recommended",
  // ],
  overrides: [
    {
      files: ["tests/**/*.js"],
      env: { mocha: true },
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js']
      }
    }
  }
};
