const correctnessRules = {
  'no-dupe-args': 'error',
  'no-dupe-keys': 'error',
  'no-unreachable': 'error',
  'valid-typeof': 'error',
};

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
    files: ['**/*.js', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
    },
    rules: correctnessRules,
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: correctnessRules,
  },
];
