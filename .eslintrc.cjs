process.env.ESLINT_TSCONFIG = 'tsconfig.json'

module.exports = {
  extends: '@antfu',
  rules: {
    '@typescript-eslint/no-unsafe-return': 'off',
    'no-console': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
  },
  ignorePatterns: ['playground/**'],
}
