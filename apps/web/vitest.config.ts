import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.spec.ts', 'src/**/*.spec.ts'],
    testTimeout: 120_000, // The COPPA scan kicks off a fresh `next build` if .next is missing.
  },
});
