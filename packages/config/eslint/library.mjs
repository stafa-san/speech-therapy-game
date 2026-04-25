import baseConfig from './base.mjs';

const libraryConfig = [
  ...baseConfig,
  {
    rules: {
      // Library code should never reach for app-level globals.
      'no-restricted-globals': [
        'error',
        { name: 'window', message: 'Library code must be SSR-safe; guard window access.' },
        { name: 'document', message: 'Library code must be SSR-safe; guard document access.' },
      ],
    },
  },
];

export default libraryConfig;
