import baseConfig from '@habla/config/eslint/base';

const config = [
  ...baseConfig,
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
];

export default config;
