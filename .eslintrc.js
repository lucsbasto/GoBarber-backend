module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base', 'prettier'
  ],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "prettier/prettier": "error",
    "class-methods-use-this": "off",
    "no-param-reassign": ["error", {
      "props": false
    }],
    "camelcase": "off",
    "no-unused-vars": ["error", {
      "argsIgnoredPattern": "next"
    }],
    "linebreak-style": 0
  }
};
