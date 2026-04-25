import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import baseConfig from './base.mjs';

/**
 * Trackers and analytics SDKs that must NEVER be imported from the player route.
 * Keep this list narrow — the runtime bundle scan in `apps/web/tests/coppa.spec.ts`
 * is the authoritative gate; this rule is the cheap pre-commit signal.
 */
const PLAYER_FORBIDDEN = [
  '@sentry/*',
  'posthog-js',
  'posthog-js/*',
  '@vercel/analytics',
  '@vercel/analytics/*',
  '@vercel/speed-insights',
  '@vercel/speed-insights/*',
  'mixpanel-browser',
  'amplitude-js',
  '@amplitude/*',
  'react-ga',
  'react-ga4',
  '@datadog/browser-rum',
  '@hotjar/*',
  'segment',
  '@segment/*',
];

const nextConfig = [
  ...baseConfig,
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      '@next/next/no-img-element': 'error',
      'react/no-unescaped-entities': 'off',
    },
  },
  {
    // COPPA guard — the family player route must never reach for analytics.
    // See Project.md §8 and docs/coppa-compliance.md.
    files: ['**/app/play/**', '**/app/api/play/**', '**/features/player/**', '**/games/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: PLAYER_FORBIDDEN.map((pattern) => ({
            group: [pattern],
            message:
              'Analytics / replay / tracker SDKs are forbidden on the player surface. See docs/coppa-compliance.md.',
          })),
        },
      ],
    },
  },
];

export default nextConfig;
