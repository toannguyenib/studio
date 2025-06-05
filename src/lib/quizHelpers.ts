import type { Word, QuizQuestion } from '@/types';
import { vocabulary } from './vocabulary'; // Full vocabulary list

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export const generateQuiz = (wordsToQuiz: Word[], numberOfQuestions: number = 10, optionsCount: number = 4): QuizQuestion[] => {
  if (wordsToQuiz.length === 0) return [];

  const selectedWords = shuffleArray(wordsToQuiz).slice(0, numberOfQuestions);
  const quizQuestions: QuizQuestion[] = [];

  for (const word of selectedWords) {
    // Determine question type: 50% chance for each type
    const questionType = Math.random() < 0.5 ? 'wordToDefinition' : 'definitionToWord';
    
    let correctAnswer: string;
    let questionText: string; // This will be the word's definition or the word itself depending on type
    let options: string[];

    if (questionType === 'wordToDefinition') {
      // Guess the definition for a given word
      questionText = word.text;
      correctAnswer = word.definition;
      
      // Get distractor definitions from other words
      const distractorDefinitions = shuffleArray(
        vocabulary
          .filter(w => w.id !== word.id) // Exclude the correct word
          .map(w => w.definition)
      ).slice(0, optionsCount - 1);
      
      options = shuffleArray([correctAnswer, ...distractorDefinitions]);

    } else { // definitionToWord
      // Guess the word for a given definition
      questionText = word.definition;
      correctAnswer = word.text;

      // Get distractor words
      const distractorWords = shuffleArray(
        vocabulary
          .filter(w => w.id !== word.id) // Exclude the correct word
          .map(w => w.text)
      ).slice(0, optionsCount - 1);
      
      options = shuffleArray([correctAnswer, ...distractorWords]);
    }

    quizQuestions.push({
      wordId: word.id,
      wordText: word.text, // Always include the original word text for reference/stats
      [questionType === 'wordToDefinition' ? 'wordToGuess' : 'definitionToGuess']: questionText,
      options,
      correctAnswer,
      questionType,
    });
  }

  return quizQuestions;
};
