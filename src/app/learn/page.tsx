"use client";

import React, { useState, useMemo } from 'react';
import WordDisplayCard from '@/components/WordDisplayCard';
import { vocabulary, getWordsByLevel, MAX_LEVEL } from '@/lib/vocabulary';
import type { Word } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useUserProgress } from '@/contexts/UserProgressContext';

export default function LearnPage() {
  const { userData } = useUserProgress();
  const [selectedLevel, setSelectedLevel] = useState<number>(userData.unlockedLevels[0] || 1);
  const [currentIndex, setCurrentIndex] = useState(0);

  const wordsForLevel = useMemo(() => {
    return getWordsByLevel(selectedLevel);
  }, [selectedLevel]);

  const currentWord = useMemo(() => {
    return wordsForLevel[currentIndex];
  }, [wordsForLevel, currentIndex]);

  const handleLevelChange = (levelValue: string) => {
    const level = parseInt(levelValue, 10);
    if (userData.unlockedLevels.includes(level)) {
      setSelectedLevel(level);
      setCurrentIndex(0); // Reset index when level changes
    }
  };

  const goToNextWord = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % wordsForLevel.length);
  };

  const goToPreviousWord = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + wordsForLevel.length) % wordsForLevel.length);
  };

  if (!currentWord) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-headline mb-6">Learn Vocabulary</h1>
        <p className="text-lg text-muted-foreground">Select a level to start learning.</p>
        <div className="my-6">
          <Select onValueChange={handleLevelChange} defaultValue={String(selectedLevel)}>
            <SelectTrigger className="w-[180px] mx-auto">
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
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
        </div>
         {selectedLevel && !userData.unlockedLevels.includes(selectedLevel) && (
          <p className="text-red-500 mt-2">This level is locked. Complete quizzes to unlock more levels.</p>
        )}
        {selectedLevel && userData.unlockedLevels.includes(selectedLevel) && wordsForLevel.length === 0 && (
          <p className="text-muted-foreground mt-4">No words found for this level.</p>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 animate-fadeIn">
      <h1 className="text-4xl font-headline text-center mb-8 text-primary">Learn Words</h1>
      
      <div className="flex justify-center items-center mb-6 space-x-4">
        <p className="text-lg">Select Level:</p>
        <Select onValueChange={handleLevelChange} defaultValue={String(selectedLevel)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Level" />
          </SelectTrigger>
          <SelectContent>
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
      </div>
       {selectedLevel && !userData.unlockedLevels.includes(selectedLevel) && (
        <p className="text-red-500 text-center mb-4">This level is locked. Complete quizzes to unlock more levels.</p>
      )}

      {wordsForLevel.length > 0 && userData.unlockedLevels.includes(selectedLevel) ? (
        <div className="flex flex-col items-center space-y-6">
          <WordDisplayCard word={currentWord} />
          <div className="flex justify-between w-full max-w-md">
            <Button onClick={goToPreviousWord} variant="outline" disabled={wordsForLevel.length <= 1}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <p className="text-muted-foreground">{currentIndex + 1} / {wordsForLevel.length}</p>
            <Button onClick={goToNextWord} variant="outline" disabled={wordsForLevel.length <= 1}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : userData.unlockedLevels.includes(selectedLevel) ? (
        <p className="text-center text-muted-foreground">No words available for this level yet.</p>
      ) : null}
    </div>
  );
}
