export interface Word {
  id: string;
  text: string;
  definition: string;
  level: number; // e.g., 1, 2, 3
  exampleSentence?: string;
  roots?: string[]; // Array of strings
  synonyms?: string[]; // Array of strings
  antonyms?: string[]; // Array of strings
  confusedWith?: string[]; // Array of strings
}

export interface WordPerformance {
  correctAnswers: number;
  incorrectAnswers: number;
  lastReviewed?: string; // ISO date string
}

export interface UserData {
  points: number;
  currentDailyStreak: number;
  longestDailyStreak: number;
  lastQuizCompletionDate: string | null; // YYYY-MM-DD format
  wordStats: Record<string, WordPerformance>; // Keyed by Word ID
  unlockedLevels: number[];
  name?: string; // Optional user name
}

export interface QuizQuestion {
  wordId: string;
  wordText: string;
  definitionToGuess?: string; // For "match word to definition"
  wordToGuess?: string; // For "match definition to word"
  options: string[]; // Definitions or words
  correctAnswer: string; // The correct definition or word
  questionType: 'definitionToWord' | 'wordToDefinition';
}

export type League = {
  name: string;
  minPoints: number;
  icon?: React.ElementType;
};
