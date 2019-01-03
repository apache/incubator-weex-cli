module.exports = {
  "parserOptions": {
    "ecmaVersion": 2017,
    "sourceType": "module"
  },
  "env": {
      "es6": true
  },
  plugins: [
    "node"
  ],
  env: {
    "jest": true
  },
  rules: {
    "indent": ["error", 2, {
      "MemberExpression": "off"
    }]
  }
}