// Family player surface — public, COPPA-strict.
//
// Validates the token shape, then hands off to the client-side player.
// Until the DB is wired, the player runs in "demo mode" with the first
// dummy word list from @habla/db's seed data, which is fine for previewing
// the UX with any token. Once PR 7's DB lookups land, this server
// component will resolve the assignment and pass the resolved word list +
// game id to the client component.

import { notFound } from 'next/navigation';

import { DUMMY_WORD_LISTS, PHONEMES } from '@habla/db/seed/data';

import { PlayerClient } from '@/features/player/player-client';

interface PlayPageProps {
  params: Promise<{ token: string }>;
}

// Production tokens are 22 chars from randomBytes(16).toString('base64url').
// Demo mode (no DB) accepts any URL-safe string so /play/demo works for
// previewing without setting up Neon. Once DATABASE_URL is set, the lookup
// in play.byToken is the gate — short demo tokens won't match a real row.
const TOKEN_RE = /^[A-Za-z0-9_-]{1,64}$/;

export default async function PlayPage({ params }: PlayPageProps) {
  const { token } = await params;
  if (!TOKEN_RE.test(token)) notFound();

  // TODO(PR 12): replace with `getPlayCaller().play.byToken({ token })`.
  // The select clause MUST omit studentLabel (§8).
  const demoList = DUMMY_WORD_LISTS[0]!;
  const phonemeSymbol = PHONEMES.find((p) => p.id === demoList.phonemeId)?.symbol ?? '/?/';

  return (
    <PlayerClient
      wordList={{
        id: demoList.slug,
        name: demoList.name,
        phonemeSymbol,
        words: demoList.words.slice(0, 12).map((w, i) => ({
          id: `${demoList.slug}-w-${i}`,
          text: w.text,
          textEn: w.textEn,
          imageUrl: null,
          audioUrl: null,
        })),
      }}
      gameSlug="feed-the-shark"
      trials={10}
    />
  );
}
