process.env.ESLINT_TSCONFIG = 'tsconfig.json'

module.exports = {
  extends: '@antfu',
  rules: {
    'no-unsafe-return': 'off',
    'no-console': 'off',
  },
  ignorePatterns: ['playground/**'],
}
