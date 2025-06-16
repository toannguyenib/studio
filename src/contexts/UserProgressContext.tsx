
"use client";

import type { UserData, WordPerformance, ApiUser } from '@/types';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, signupUser } from '@/lib/authService';
import type { LoginFormData } from '@/components/auth/LoginForm';
import type { SignupFormData } from '@/components/auth/SignupForm';

const initialUserData: UserData = {
  points: 0,
  currentDailyStreak: 0,
  longestDailyStreak: 0,
  lastQuizCompletionDate: null,
  wordStats: {},
};

interface UserProgressContextType {
  userData: UserData;
  currentUser: ApiUser | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean; // Combined loading state
  isAuthLoading: boolean; // Specific to auth operations like login/signup calls
  login: (credentials: LoginFormData) => Promise<{ success: boolean; error?: string }>;
  signup: (details: SignupFormData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updatePoints: (amount: number) => void;
  recordQuizCompletion: (correctCount: number, incorrectCount: number, wordsInQuiz: string[]) => void;
  updateWordStat: (wordId: string, isCorrect: boolean) => void;
  getPerformanceForWords: (wordIds: string[]) => Array<{ wordId: string; word: string; correctAnswers: number; incorrectAnswers: number }>;
  resetProgress: () => void;
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

const CURRENT_USER_STORAGE_KEY = 'tienganhIvyCurrentUser';
const TOKEN_STORAGE_KEY = 'tienganhIvyToken';

export const UserProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  const [isInitialAuthLoadComplete, setIsInitialAuthLoadComplete] = useState(false);
  const [isInitialProgressLoadComplete, setIsInitialProgressLoadComplete] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false); // For active login/signup calls

  const getProgressDataKey = useCallback(() => {
    return currentUser ? `tienganhIvyUserData_${currentUser.username}` : 'tienganhIvyUserData_anonymous';
  }, [currentUser]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (storedUser && storedToken) {
        setCurrentUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Failed to load auth data from localStorage:", error);
    }
    setIsInitialAuthLoadComplete(true);
  }, []);

  useEffect(() => {
    if (!isInitialAuthLoadComplete) return; // Wait for initial auth load

    setIsInitialProgressLoadComplete(false); // Reset progress load flag when user changes
    const dataKey = getProgressDataKey();
    try {
      const storedData = localStorage.getItem(dataKey);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        delete parsedData.unlockedLevels; 
        setUserData(parsedData);
      } else {
        setUserData(initialUserData);
      }
    } catch (error) {
      console.error("Failed to load user progress data from localStorage:", error);
      setUserData(initialUserData);
    }
    setIsInitialProgressLoadComplete(true);
  }, [currentUser, isInitialAuthLoadComplete, getProgressDataKey]);

  useEffect(() => {
    if (!isInitialAuthLoadComplete || !isInitialProgressLoadComplete) return; // Wait for all initial loads

    if (currentUser && token) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    
    const dataKey = getProgressDataKey();
    localStorage.setItem(dataKey, JSON.stringify(userData));

  }, [userData, currentUser, token, isInitialAuthLoadComplete, isInitialProgressLoadComplete, getProgressDataKey]);


  const login = async (credentials: LoginFormData) => {
    setIsAuthLoading(true);
    const response = await loginUser(credentials);
    setIsAuthLoading(false);
    if (response.user && response.token) {
      setCurrentUser(response.user);
      setToken(response.token);
      // UserData will be reloaded by the useEffect hook watching currentUser
      return { success: true };
    }
    return { success: false, error: response.error || "Login failed" };
  };

  const signup = async (details: SignupFormData) => {
    setIsAuthLoading(true);
    const payload = {
      first_name: details.firstName,
      last_name: details.lastName,
      email: details.email,
      mobile: details.mobile,
      passwd: details.password,
      passed_confirm: details.passwordConfirm,
    };
    const response = await signupUser(payload);
    setIsAuthLoading(false);
    if (response.error) {
      return { success: false, error: response.error };
    }
    // Assuming signup doesn't auto-login. User needs to login after signup.
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    // UserData will be reloaded by the useEffect hook for anonymous user
  };

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
        // If it's the same day, streak doesn't change yet based on this logic.
      } else {
        newCurrentDailyStreak = 1;
      }
      
      if (prev.lastQuizCompletionDate !== today) {
         // If new day, ensure streak is at least 1.
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
  }, []);

  const isLoading = !isInitialAuthLoadComplete || !isInitialProgressLoadComplete;

  return (
    <UserProgressContext.Provider value={{ 
      userData, currentUser, token, isLoggedIn: !!currentUser && !!token, 
      isLoading, isAuthLoading,
      login, signup, logout,
      updatePoints, recordQuizCompletion, updateWordStat, 
      getPerformanceForWords, resetProgress 
    }}>
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
