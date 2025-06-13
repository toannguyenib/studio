
"use client";

import type { UserData, WordPerformance } from '@/types';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { MAX_LEVEL } from '@/lib/vocabulary'; // MAX_LEVEL removed

const initialUserData: UserData = {
  points: 0,
  currentDailyStreak: 0,
  longestDailyStreak: 0,
  lastQuizCompletionDate: null,
  wordStats: {},
  // unlockedLevels: [1], // Removed
};

interface UserProgressContextType {
  userData: UserData;
  isLoading: boolean;
  updatePoints: (amount: number) => void;
  recordQuizCompletion: (correctCount: number, incorrectCount: number, wordsInQuiz: string[]) => void;
  updateWordStat: (wordId: string, isCorrect: boolean) => void;
  getPerformanceForWords: (wordIds: string[]) => Array<{ wordId: string; word: string; correctAnswers: number; incorrectAnswers: number }>;
  resetProgress: () => void;
  // unlockNextLevel: () => boolean; // Removed
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'tienganhIvyUserData'; // Updated key

export const UserProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Ensure backward compatibility if old data structure exists without unlockedLevels
        delete parsedData.unlockedLevels; 
        setUserData(parsedData);
      } else {
        setUserData(initialUserData);
      }
    } catch (error) {
      console.error("Failed to load user data from localStorage:", error);
      setUserData(initialUserData);
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
    const pointsEarned = correctCount * 10 - incorrectCount * 5;
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
          newCurrentDailyStreak = 1;
        }
      } else {
        newCurrentDailyStreak = 1;
      }
      
      if (prev.lastQuizCompletionDate !== today) {
         newCurrentDailyStreak = Math.max(1, newCurrentDailyStreak);
      }

      const newLongestDailyStreak = Math.max(prev.longestDailyStreak, newCurrentDailyStreak);

      return {
        ...prev,
        points: prev.points + Math.max(0, pointsEarned),
        lastQuizCompletionDate: today,
        currentDailyStreak: newCurrentDailyStreak,
        longestDailyStreak: newLongestDailyStreak,
      };
    });
  }, []);
  
  const getPerformanceForWords = useCallback((wordIds: string[]): Array<{ wordId: string; word: string; correctAnswers: number; incorrectAnswers: number }> => {
    const { getWordById } = require('@/lib/vocabulary'); 

    return wordIds.map(id => {
      const stat = userData.wordStats[id] || { correctAnswers: 0, incorrectAnswers: 0 };
      const wordEntry = getWordById(id);
      return {
        wordId: id,
        word: wordEntry ? wordEntry.text : 'Unknown Word', 
        correctAnswers: stat.correctAnswers,
        incorrectAnswers: stat.incorrectAnswers,
      };
    }).filter(item => item.word !== 'Unknown Word');
  }, [userData.wordStats]);


  const resetProgress = useCallback(() => {
    setUserData(initialUserData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialUserData));
  }, []);

  // unlockNextLevel function is removed as levels are replaced by topics
  // const unlockNextLevel = useCallback(() => { ... });


  return (
    <UserProgressContext.Provider value={{ userData, isLoading, updatePoints, recordQuizCompletion, updateWordStat, getPerformanceForWords, resetProgress }}>
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
