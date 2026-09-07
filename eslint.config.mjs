export default [
  {
    ignores: [
      'node_modules/**',
      'coverage/**',
      'results/**',
      'static/vendor/**',
      'public/vendor/**',
    ],
  },
  {
    files: ['**/*.{js,cjs,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
    },
    rules: {
      'no-dupe-args': 'error',
      'no-dupe-keys': 'error',
      'no-unreachable': 'error',
      'valid-typeof': 'error',
    },
  },
];
