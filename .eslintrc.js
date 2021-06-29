module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    },
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  "rules": {
    "indent": ["error", 4, {
      "SwitchCase": 1
    }],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "vue/jsx-uses-vars": 2,
    "no-console": ["error"],
    "@typescript-eslint/no-explicit-any": ["off"]
  }
}
