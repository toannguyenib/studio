"use client";

import React, { useState, useMemo, useEffect } from 'react';
import QuizView from '@/components/QuizView';
import { vocabulary, getWordsByLevel, MAX_LEVEL } from '@/lib/vocabulary';
import type { Word } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw } from 'lucide-react';

export default function QuizPage() {
  const { userData, isLoading: userDataLoading, unlockNextLevel } = useUserProgress();
  const { toast } = useToast();
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>(userData.unlockedLevels[0] || 1);
  const [quizWords, setQuizWords] = useState<Word[]>([]);
  const [quizKey, setQuizKey] = useState(0); // Used to force re-render of QuizView

  const wordsForQuiz = useMemo(() => {
    if (selectedLevel === 'all') {
      // Quiz on all words from unlocked levels
      return vocabulary.filter(word => userData.unlockedLevels.includes(word.level));
    }
    return getWordsByLevel(selectedLevel as number);
  }, [selectedLevel, userData.unlockedLevels]);

  useEffect(() => {
    // Set initial quiz words when component mounts or user data loads
    if (!userDataLoading) {
        if (selectedLevel === 'all') {
            setQuizWords(vocabulary.filter(word => userData.unlockedLevels.includes(word.level)));
        } else if (userData.unlockedLevels.includes(selectedLevel as number)) {
            setQuizWords(getWordsByLevel(selectedLevel as number));
        } else {
            // Fallback to the first unlocked level if current selection is invalid
            const firstUnlocked = userData.unlockedLevels[0] || 1;
            setSelectedLevel(firstUnlocked);
            setQuizWords(getWordsByLevel(firstUnlocked));
        }
        setQuizKey(prev => prev + 1); // Trigger quiz generation
    }
  }, [userDataLoading, selectedLevel, userData.unlockedLevels]);


  const handleLevelChange = (levelValue: string) => {
    const level = levelValue === 'all' ? 'all' : parseInt(levelValue, 10);
    if (level === 'all' || userData.unlockedLevels.includes(level)) {
      setSelectedLevel(level);
      if (level === 'all') {
        setQuizWords(vocabulary.filter(word => userData.unlockedLevels.includes(word.level)));
      } else {
        setQuizWords(getWordsByLevel(level));
      }
      setQuizKey(prev => prev + 1); // Force QuizView to re-initialize with new words
    }
  };

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    // Try to unlock next level if user scored well (e.g., >70%)
    if (totalQuestions > 0 && (score / totalQuestions) >= 0.7) {
      const newLevelWasUnlocked = unlockNextLevel();
      if (newLevelWasUnlocked) {
        toast({
          title: "Level Up!",
          description: `Congratulations! You've unlocked a new level.`,
          variant: "default",
        });
      }
    }
  };
  
  if (userDataLoading) {
    return <div className="text-center py-10"><p>Loading user data...</p></div>;
  }

  return (
    <div className="container mx-auto py-8 animate-fadeIn">
      <h1 className="text-4xl font-headline text-center mb-8 text-primary">Test Your Knowledge</h1>
      
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle>Quiz Settings</CardTitle>
          <CardDescription>Choose a level to start your quiz.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Select onValueChange={handleLevelChange} defaultValue={String(selectedLevel)}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Unlocked Levels</SelectItem>
              {Array.from({ length: MAX_LEVEL }, (_, i) => i + 1).map(level => (
                <SelectItem 
                  key={level} 
                  value={String(level)}
                  disabled={!userData.unlockedLevels.includes(level)}
                >
                  Level {level} {userData.unlockedLevels.includes(level) ? "" : "(Locked)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setQuizKey(prev => prev + 1)} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" /> New Quiz
          </Button>
        </CardContent>
      </Card>
      
      {selectedLevel !== 'all' && !userData.unlockedLevels.includes(selectedLevel as number) && (
         <p className="text-red-500 text-center mb-4">This level is locked. Complete quizzes on unlocked levels to unlock more.</p>
      )}

      {quizWords.length > 0 ? (
        <QuizView 
          key={quizKey} 
          wordsForQuiz={quizWords} 
          quizTitle={`Level ${selectedLevel === 'all' ? 'Mix' : selectedLevel} Quiz`}
          onQuizComplete={handleQuizComplete}
        />
      ) : (
        <p className="text-center text-muted-foreground">
          { (selectedLevel !== 'all' && !userData.unlockedLevels.includes(selectedLevel as number)) 
            ? "Please select an unlocked level to start a quiz." 
            : "No words available for this level to start a quiz. Try learning some first!"}
        </p>
      )}
    </div>
  );
}
