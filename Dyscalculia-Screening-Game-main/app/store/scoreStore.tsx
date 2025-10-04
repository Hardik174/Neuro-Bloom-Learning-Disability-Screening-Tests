// store/scoreStore.ts
import { create } from 'zustand';

type GameResult = {
  score: number;
  averageTime?: number; // Optional property
};

type GameScores = {
  [gameName: string]: GameResult; // Now stores an object instead of just number
};

interface ScoreStore {
  scores: GameScores;
  addScore: (gameName: string, result: GameResult) => void;
  resetScores: () => void;
}

const useScoreStore = create<ScoreStore>((set) => ({
  scores: {},
  addScore: (gameName, result) => 
    set((state) => ({
      scores: { ...state.scores, [gameName]: result }
    })),
  resetScores: () => set({ scores: {} }),
}));

export default useScoreStore;