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

// Token shape: randomBytes(16).toString('base64url') = 22 chars URL-safe.
const TOKEN_RE = /^[A-Za-z0-9_-]{20,64}$/;

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
