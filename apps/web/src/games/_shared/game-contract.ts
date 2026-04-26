// Strict prop contract every game must implement (Project.md §6.6).
// Ensures the GameShell can mount any game uniformly and games stay
// isolated — no game reaches outside its folder.

export interface GameWord {
  id: string;
  text: string;
  textEn: string | null;
  imageUrl: string | null;
  audioUrl: string | null;
}

export interface GameWordList {
  id: string;
  name: string;
  phonemeSymbol: string;
  words: GameWord[];
}

export interface GameProps {
  wordList: GameWordList;
  config: {
    /** How many trials to run. Bounded by the game's min/max in the seed table. */
    trials: number;
  };
  /** Called when the child + adult complete a single turn. */
  onTrialComplete: (wordId: string) => void;
  /** Called when the configured trial count is met. */
  onGameComplete: (stats: { trialsCompleted: number; durationMs: number }) => void;
}
