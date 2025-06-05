"use client";

import React, { useState } from 'react';
import ReviewSuggestions from '@/components/ReviewSuggestions';
import QuizView from '@/components/QuizView';
import type { Word } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ReviewPage() {
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizWords, setQuizWords] = useState<Word[]>([]);

  const handleStartQuizWithSuggestions = (suggestedWordsList: Word[]) => {
    setQuizWords(suggestedWordsList);
    setIsQuizMode(true);
  };

  const handleBackToSuggestions = () => {
    setIsQuizMode(false);
    setQuizWords([]);
  };
  
  const handleQuizComplete = () => {
    // After quiz, could show results then option to go back or get new suggestions
    // For now, just go back to suggestions view.
    setIsQuizMode(false); 
    setQuizWords([]);
  }

  return (
    <div className="container mx-auto py-8 animate-fadeIn">
      {!isQuizMode ? (
        <>
          <h1 className="text-4xl font-headline text-center mb-8 text-primary">AI Review Session</h1>
          <ReviewSuggestions onStartQuizWithSuggestions={handleStartQuizWithSuggestions} />
        </>
      ) : (
        <>
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={handleBackToSuggestions} className="mr-4">
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Suggestions
            </Button>
            <h1 className="text-3xl font-headline text-primary">Review Quiz</h1>
          </div>
          {quizWords.length > 0 ? (
             <QuizView 
                wordsForQuiz={quizWords} 
                quizTitle="AI Suggested Review Quiz" 
                onQuizComplete={handleQuizComplete}
             />
          ) : (
            <p className="text-center text-muted-foreground">No words selected for quiz.</p>
          )}
        </>
      )}
    </div>
  );
}
