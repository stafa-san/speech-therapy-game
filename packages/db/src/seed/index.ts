// Seed runner. Invoked via `pnpm --filter @habla/db seed`.
//
// Hard rules (Project.md §2.4):
//   1. Refuses to run against production (NODE_ENV=production OR
//      DATABASE_URL contains a known-prod hostname) when any list is dummy.
//   2. Phonemes and Games are upserted by id (idempotent).
//   3. Dummy word lists are upserted by slug, *only* in non-prod.

import { PrismaClient } from '@prisma/client';

import { GAMES } from './games';
import { PHONEMES } from './phonemes';
import { DUMMY_WORD_LISTS } from './data/dummy';

function looksLikeProduction(): boolean {
  if (process.env.NODE_ENV === 'production') return true;
  const dbUrl = process.env.DATABASE_URL ?? '';
  // Heuristic: prod DB hostnames typically contain 'prod' or our domain.
  return /(?:\b|-)prod(?:\b|-)/i.test(dbUrl) || /hablajuega\.com/i.test(dbUrl);
}

async function seedPhonemes(prisma: PrismaClient) {
  for (const p of PHONEMES) {
    await prisma.phoneme.upsert({
      where: { id: p.id },
      update: {
        symbol: p.symbol,
        ipa: p.ipa,
        displayNameEs: p.displayNameEs,
        displayNameEn: p.displayNameEn,
        sortOrder: p.sortOrder,
      },
      create: p,
    });
  }
  console.warn(`[seed] phonemes: ${PHONEMES.length} upserted.`);
}

async function seedGames(prisma: PrismaClient) {
  for (const g of GAMES) {
    await prisma.game.upsert({
      where: { id: g.id },
      update: g,
      create: g,
    });
  }
  console.warn(`[seed] games: ${GAMES.length} upserted.`);
}

async function seedDummyWordLists(prisma: PrismaClient) {
  if (looksLikeProduction()) {
    console.warn(
      '[seed] Skipping dummy word lists — environment looks like production. Set NODE_ENV=development to seed dummy data.',
    );
    return;
  }

  // Look-up table for stable slug → existing list id (so re-runs don't duplicate).
  for (const list of DUMMY_WORD_LISTS) {
    const existing = await prisma.wordList.findFirst({
      where: { name: list.name, isDummyData: true },
      select: { id: true },
    });
    const data = {
      name: list.name,
      description: list.description,
      phonemeId: list.phonemeId,
      position: list.position,
      difficultyTier: list.difficultyTier,
      isSeed: true,
      isReviewed: list.isReviewed,
      reviewer: list.reviewer,
      locale: list.locale,
      isDummyData: true,
      ownerTherapistId: null,
    } satisfies Parameters<typeof prisma.wordList.update>[0]['data'];

    let listId: string;
    if (existing) {
      const updated = await prisma.wordList.update({ where: { id: existing.id }, data });
      listId = updated.id;
      // Replace words wholesale on each re-seed.
      await prisma.word.deleteMany({ where: { wordListId: listId } });
    } else {
      const created = await prisma.wordList.create({ data });
      listId = created.id;
    }

    await prisma.word.createMany({
      data: list.words.map((w, i) => ({
        wordListId: listId,
        text: w.text,
        textEn: w.textEn,
        ipa: w.ipa,
        position: w.position,
        imageUrl: null,
        audioUrl: null,
        dialectNotes: w.dialectNotes,
        sortOrder: i + 1,
      })),
    });
  }
  console.warn(
    `[seed] dummy word lists: ${DUMMY_WORD_LISTS.length} upserted (${DUMMY_WORD_LISTS.reduce((sum, l) => sum + l.words.length, 0)} words total).`,
  );
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error(
      '[seed] DATABASE_URL is not set. Set it in apps/web/.env.local or in your shell before running.',
    );
    process.exit(1);
  }

  const prisma = new PrismaClient();
  try {
    await seedPhonemes(prisma);
    await seedGames(prisma);
    await seedDummyWordLists(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('[seed] failed:', err);
  process.exit(1);
});
