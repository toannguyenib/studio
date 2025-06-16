
export interface Word {
  id: string;
  text: string;
  definition: string;
  topic: string;
  exampleSentence?: string;
  roots?: string[];
  synonyms?: string[];
  antonyms?: string[];
  confusedWith?: string[];
  pronunciation?: string;
  partOfSpeech?: string;
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
  // name field was previously optional, but login response provides first_name, last_name
}

export interface ApiUser {
  first_name: string;
  last_name: string;
  username: string;
  // Add other fields from your API user object if needed e.g. email, mobile
  login_counts?: number;
}

export interface QuizQuestion {
  wordId: string;
  wordText: string;
  definitionToGuess?: string;
  wordToGuess?: string;
  options: string[];
  correctAnswer: string;
  questionType: 'definitionToWord' | 'wordToDefinition';
}

export type League = {
  name: string;
  minPoints: number;
  icon?: React.ElementType;
};

export interface Topic {
  id: string;
  name: string;
  description?: string;
}
