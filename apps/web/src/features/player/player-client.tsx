'use client';

// The "switchboard" component on the player surface — picks the game
// implementation by slug and mounts it inside the GameShell.

import type { GameProps, GameWordList } from '@/games/_shared/game-contract';
import { GameShell } from '@/games/_shared/game-shell';
import { BuildAMonsterGame } from '@/games/build-a-monster';
import { FeedTheSharkGame } from '@/games/feed-the-shark';
import { SpinTheWheelGame } from '@/games/spin-the-wheel';

type GameComponent = (props: GameProps) => React.ReactNode;

const GAMES: Record<string, GameComponent> = {
  'feed-the-shark': FeedTheSharkGame,
  'build-a-monster': BuildAMonsterGame,
  'spin-the-wheel': SpinTheWheelGame,
};

export function PlayerClient({
  wordList,
  gameSlug,
  trials,
}: {
  wordList: GameWordList;
  gameSlug: string;
  trials: number;
}) {
  const Game = GAMES[gameSlug] ?? FeedTheSharkGame;

  return (
    <GameShell wordList={wordList} trials={trials} gameSlug={gameSlug}>
      {({ onTrialComplete, onGameComplete }) => (
        <Game
          wordList={wordList}
          config={{ trials }}
          onTrialComplete={onTrialComplete}
          onGameComplete={onGameComplete}
        />
      )}
    </GameShell>
  );
}
