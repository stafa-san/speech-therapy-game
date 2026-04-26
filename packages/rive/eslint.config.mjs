// @habla/rive is Next-specific (uses next/dynamic), so we extend the
// base config rather than `library` (which bans window/document — fine
// for SSR-safe libraries but not for the dynamic-import wrapper pattern).
import baseConfig from '@habla/config/eslint/base';

const config = [
  ...baseConfig,
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
];

export default config;
