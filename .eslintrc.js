module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    "plugin:vue/base"
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    },
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  rules: {
    // "indent": ["error", 4, {
    //   "SwitchCase": 1
    // }],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "vue/jsx-uses-vars": 2,
    "no-console": ["error"],
    "@typescript-eslint/no-explicit-any": ["off"],
    "vue/no-use-v-if-with-v-for": ["error", {
      "allowUsingIterationVar": false
    }],
    "@typescript-eslint/no-empty-function": 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  }
}
