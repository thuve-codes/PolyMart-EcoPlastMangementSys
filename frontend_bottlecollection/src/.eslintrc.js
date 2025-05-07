// .eslintrc.js
module.exports = {
    env: {
      browser: true,  // Ensure that browser-specific globals are available
      es2021: true,   // Set ECMAScript version
    },
    globals: {
      google: 'readonly',  // Add 'google' as a readonly global variable
    },
    extends: [
      'react-app',
      'eslint:recommended',
    ],
    rules: {
      // Your custom rules, if any
    },
  };
  