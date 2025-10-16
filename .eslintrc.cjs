module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  extends: ['eslint:recommended', 'plugin:react-hooks/recommended', 'prettier'],
  settings: {},
  rules: {
    'react-refresh/only-export-components': 'warn'
  },
}

