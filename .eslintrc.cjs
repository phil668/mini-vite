process.env.ESLINT_TSCONFIG = 'tsconfig.json'

module.exports = {
  extends: '@antfu',
  rules: {
    'no-unsafe-return': 'off',
  },
  ignorePatterns: ['playground/**'],
}
