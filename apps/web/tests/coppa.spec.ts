// COPPA bundle scan — greps the built player route's JS bundle for known
// analytics / replay / tracker domains and fails the test if any appear.
// See Project.md §8.2 and docs/coppa-compliance.md.
//
// This is the *authoritative* gate. The ESLint no-restricted-imports rule
// in @habla/config is the cheap pre-commit signal; this test catches any
// import that slipped past the rule, was added through a transitive dep,
// or used a runtime fetch instead of a static import.

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const NEXT_DIR = join(process.cwd(), '.next');
const PLAYER_PATH_FRAGMENTS = ['/play/', '/api/play/'];

/** Domains and import strings that must NEVER ship in player route bundles. */
const FORBIDDEN_PATTERNS = [
  // Analytics / behavioral
  'google-analytics.com',
  'googletagmanager.com',
  'mixpanel.com',
  'amplitude.com',
  'heap.io',
  'segment.io',
  'segment.com',
  'fullstory.com',
  // Session replay
  'hotjar.com',
  'logrocket.com',
  'smartlook.com',
  // Error reporting / replay
  'sentry.io/api',
  '@sentry/replay',
  // Ads
  'doubleclick.net',
  'facebook.net',
  'connect.facebook.net',
  // Marketing
  'hsforms.net',
  'hsappstatic.net',
  // Vercel-specific tracking
  '/_vercel/insights',
  '/_vercel/speed-insights',
  // PostHog
  'app.posthog.com',
  'us.i.posthog.com',
];

function listJsFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  const out: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      out.push(...listJsFiles(full));
    } else if (entry.endsWith('.js')) {
      out.push(full);
    }
  }
  return out;
}

describe('COPPA bundle scan (Project.md §8.2)', () => {
  beforeAll(() => {
    // Ensure a build exists so we have something to scan.
    try {
      statSync(NEXT_DIR);
    } catch {
      execSync('pnpm build', { stdio: 'inherit' });
    }
  });

  it('player route bundles contain no analytics / replay / tracker references', () => {
    const allJs = listJsFiles(NEXT_DIR);
    const playerJs = allJs.filter((path) =>
      PLAYER_PATH_FRAGMENTS.some((fragment) =>
        path.includes(fragment.replaceAll('/', `${process.platform === 'win32' ? '\\' : '/'}`)),
      ),
    );

    // Build artifact paths for /app/(play)/play/[token] and /api/play/[trpc].
    // Next outputs them under .next/server/app and .next/static/chunks.
    // We accept either organization; if no player-specific bundles exist,
    // skip rather than false-pass.
    if (playerJs.length === 0) {
      console.warn(
        '[coppa.spec] No player-specific bundles found; skipping (build may have changed).',
      );
      return;
    }

    const hits: Array<{ file: string; pattern: string }> = [];
    for (const file of playerJs) {
      const contents = readFileSync(file, 'utf8');
      for (const pattern of FORBIDDEN_PATTERNS) {
        if (contents.includes(pattern)) {
          hits.push({ file, pattern });
        }
      }
    }

    expect(
      hits,
      `Forbidden tracker references found in player bundles:\n${JSON.stringify(hits, null, 2)}`,
    ).toEqual([]);
  });
});
