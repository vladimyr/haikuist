module.exports = {
  extends: 'semistandard',
  rules: {
    'valid-jsdoc': 'error',
    'prefer-const': 'error',
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never'
    }]
  }
};
