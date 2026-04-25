import baseConfig from '@habla/config/eslint/base';

const config = [
  ...baseConfig,
  {
    ignores: ['prisma/migrations/**', 'dist/**', 'node_modules/**'],
  },
  {
    rules: {
      // Seed runner uses console.warn for status output.
      'no-console': 'off',
    },
  },
];

export default config;
