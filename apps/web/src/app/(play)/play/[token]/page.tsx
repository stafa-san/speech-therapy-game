// Family player surface — public, COPPA-strict.
//
// Validates the token shape, picks a game (from `?game=` for the demo;
// production resolves it from the assignment), then hands off to the
// client-side player. Today runs in "demo mode" with the first dummy
// word list from the seed data; once Neon is wired the lookup in
// play.byToken becomes authoritative.

import { notFound } from 'next/navigation';

import { DUMMY_WORD_LISTS, GAMES, PHONEMES } from '@habla/db/seed/data';

import { PlayerClient } from '@/features/player/player-client';

interface PlayPageProps {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ game?: string }>;
}

// Production tokens are 22 chars from randomBytes(16).toString('base64url').
// Demo mode (no DB) accepts any URL-safe string so /play/demo works for
// previewing without setting up Neon.
const TOKEN_RE = /^[A-Za-z0-9_-]{1,64}$/;

export default async function PlayPage({ params, searchParams }: PlayPageProps) {
  const { token } = await params;
  const { game: gameQuery } = await searchParams;
  if (!TOKEN_RE.test(token)) notFound();

  const gameSlug = GAMES.find((g) => g.slug === gameQuery)?.slug ?? 'feed-the-shark';

  // TODO: replace with `getPlayCaller().play.byToken({ token })` once the DB
  // is wired. Select clause MUST omit studentLabel (§8).
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
      gameSlug={gameSlug}
      trials={10}
    />
  );
}
