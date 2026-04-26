'use client';

// The "switchboard" component on the player surface — picks the game
// implementation by slug and mounts it inside the GameShell.

import { GameShell } from '@/games/_shared/game-shell';
import type { GameWordList } from '@/games/_shared/game-contract';
import { FeedTheSharkGame } from '@/games/feed-the-shark';

export function PlayerClient({
  wordList,
  gameSlug,
  trials,
}: {
  wordList: GameWordList;
  gameSlug: string;
  trials: number;
}) {
  return (
    <GameShell wordList={wordList} trials={trials}>
      {({ onTrialComplete, onGameComplete }) => {
        switch (gameSlug) {
          case 'feed-the-shark':
            return (
              <FeedTheSharkGame
                wordList={wordList}
                config={{ trials }}
                onTrialComplete={onTrialComplete}
                onGameComplete={onGameComplete}
              />
            );
          default:
            return <p className="text-muted-foreground">Juego no disponible: {gameSlug}</p>;
        }
      }}
    </GameShell>
  );
}
