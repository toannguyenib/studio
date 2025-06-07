"use client";

import type { UserData, WordPerformance } from '@/types';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MAX_LEVEL } from '@/lib/vocabulary'; // Already correctly imported
// --- FIX: Change require to import at the top level ---
import { vocabulary, getWordById } from '@/lib/vocabulary'; // Import vocabulary and getWordById here

const initialUserData: UserData = {
  points: 0,
  currentDailyStreak: 0,
  longestDailyStreak: 0,
  lastQuizCompletionDate: null,
  wordStats: {},
  unlockedLevels: [1],
};

interface UserProgressContextType {
  userData: UserData;
  isLoading: boolean;
  updatePoints: (amount: number) => void;
  recordQuizCompletion: (correctCount: number, incorrectCount: number, wordsInQuiz: string[]) => void;
  updateWordStat: (wordId: string, isCorrect: boolean) => void;
  getPerformanceForWords: (wordIds: string[]) => Array<{ wordId: string; word: string; correctAnswers: number; incorrectAnswers: number }>;
  resetProgress: () => void;
  unlockNextLevel: () => boolean;
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'vocabVictorUserData';

export const UserProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Ensure unlockedLevels always contains at least level 1
        if (!parsedData.unlockedLevels || !parsedData.unlockedLevels.includes(1)) {
          parsedData.unlockedLevels = [1, ...(parsedData.unlockedLevels || [])].filter((val, idx, self) => self.indexOf(val) === idx);
        }
        setUserData(parsedData);
      } else {
        // Initialize with default if no data, ensuring level 1 is unlocked
        setUserData(prev => ({ ...prev, unlockedLevels: [1] }));
      }
    } catch (error) {
      console.error("Failed to load user data from localStorage:", error);
      setUserData(prev => ({ ...prev, unlockedLevels: [1] })); // Fallback to initial with level 1 unlocked
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
    }
  }, [userData, isLoading]);

  const updatePoints = useCallback((amount: number) => {
    setUserData(prev => ({ ...prev, points: prev.points + amount }));
  }, []);

  const updateWordStat = useCallback((wordId: string, isCorrect: boolean) => {
    setUserData(prev => {
      const stats = prev.wordStats[wordId] || { correctAnswers: 0, incorrectAnswers: 0 };
      if (isCorrect) {
        stats.correctAnswers += 1;
      } else {
        stats.incorrectAnswers += 1;
      }
      stats.lastReviewed = new Date().toISOString();
      return {
        ...prev,
        wordStats: { ...prev.wordStats, [wordId]: stats },
      };
    });
  }, []);

  const recordQuizCompletion = useCallback((correctCount: number, incorrectCount: number, wordsInQuiz: string[]) => {
    const pointsEarned = correctCount * 10 - incorrectCount * 5; // Example scoring
    setUserData(prev => {
      const today = new Date().toISOString().split('T')[0];
      let newCurrentDailyStreak = prev.currentDailyStreak;

      if (prev.lastQuizCompletionDate) {
        const lastDate = new Date(prev.lastQuizCompletionDate);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          newCurrentDailyStreak += 1;
        } else if (diffDays > 1) {
          newCurrentDailyStreak = 1; // Reset streak if more than a day passed
        }
        // If diffDays is 0, streak remains the same for multiple quizzes in one day
      } else {
        newCurrentDailyStreak = 1; // First quiz
      }

      // Ensure streak is at least 1 if a quiz was completed today
      if (prev.lastQuizCompletionDate !== today) {
         newCurrentDailyStreak = Math.max(1, newCurrentDailyStreak);
      }

      const newLongestDailyStreak = Math.max(prev.longestDailyStreak, newCurrentDailyStreak);

      return {
        ...prev,
        points: prev.points + Math.max(0, pointsEarned), // Ensure points don't go negative from a single quiz
        lastQuizCompletionDate: today,
        currentDailyStreak: newCurrentDailyStreak,
        longestDailyStreak: newLongestDailyStreak,
      };
    });
  }, []);

  const getPerformanceForWords = useCallback((wordIds: string[]): Array<{ wordId: string; word: string; correctAnswers: number; incorrectAnswers: number }> => {
    // Now vocabulary and getWordById are imported at the top level,
    // which is the standard and preferred way in Next.js/React components.
    // The "use client" directive ensures this code runs on the client.
    return wordIds.map(id => {
      const stat = userData.wordStats[id] || { correctAnswers: 0, incorrectAnswers: 0 };
      const wordEntry = getWordById(id); // Use the imported function directly
      return {
        wordId: id,
        word: wordEntry ? wordEntry.text : 'Unknown Word', // Provide actual word text
        correctAnswers: stat.correctAnswers,
        incorrectAnswers: stat.incorrectAnswers,
      };
    }).filter(item => item.word !== 'Unknown Word');
  }, [userData.wordStats]);


  const resetProgress = useCallback(() => {
    const resetData = {
      ...initialUserData,
      unlockedLevels: [1] // Ensure level 1 is always unlocked on reset
    };
    setUserData(resetData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resetData));
  }, []);

  const unlockNextLevel = useCallback(() => {
    let newLevelUnlocked = false;
    setUserData(prev => {
      const currentMaxUnlocked = Math.max(...prev.unlockedLevels, 0);
      if (currentMaxUnlocked < MAX_LEVEL) {
        const nextLevel = currentMaxUnlocked + 1;
        if (!prev.unlockedLevels.includes(nextLevel)) {
          newLevelUnlocked = true;
          return {
            ...prev,
            unlockedLevels: [...prev.unlockedLevels, nextLevel].sort((a,b) => a-b),
          };
        }
      }
      return prev;
    });
    return newLevelUnlocked;
  }, []);


  return (
    <UserProgressContext.Provider value={{ userData, isLoading, updatePoints, recordQuizCompletion, updateWordStat, getPerformanceForWords, resetProgress, unlockNextLevel }}>
      {children}
    </UserProgressContext.Provider>
  );
};

export const useUserProgress = () => {
  const context = useContext(UserProgressContext);
  if (context === undefined) {
    throw new Error('useUserProgress must be used within a UserProgressProvider');
  }
  return context;
};