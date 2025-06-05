
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain, Zap, Loader2 } from 'lucide-react';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { suggestWordsForReview, type SuggestWordsForReviewInput } from '@/ai/flows/suggest-words-for-review';
import { useToast } from '@/hooks/use-toast';
import type { Word } from '@/types';
import { getWordById, vocabulary } from '@/lib/vocabulary'; // Assuming vocabulary is the full list of Word objects

interface ReviewSuggestionsProps {
  onStartQuizWithSuggestions: (suggestedWordsList: Word[]) => void;
}

export default function ReviewSuggestions({ onStartQuizWithSuggestions }: ReviewSuggestionsProps) {
  const { userData, getPerformanceForWords } = useUserProgress();
  const [suggestedWords, setSuggestedWords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchReviewSuggestions = useCallback(async () => {
    setIsLoading(true);
    setSuggestedWords([]);

    const allWordIds = Object.keys(userData.wordStats);
    if (allWordIds.length === 0) {
        toast({
            title: "Not Enough Data",
            description: "You need to complete some quizzes first for AI to suggest words.",
            variant: "default"
        });
        setIsLoading(false);
        return;
    }
    
    const performanceData = getPerformanceForWords(allWordIds);
    
    // Filter out words with 0 incorrect answers if too many words, or based on some logic
    // For now, send all words with stats if they have been interacted with
    const relevantPerformanceData = performanceData.filter(p => p.correctAnswers > 0 || p.incorrectAnswers > 0);

    if (relevantPerformanceData.length === 0) {
         toast({
            title: "Great Job!",
            description: "AI found no specific words needing urgent review, or you haven't made mistakes yet!",
            variant: "default"
        });
        setIsLoading(false);
        return;
    }
    
    const input: SuggestWordsForReviewInput = {
      pastPerformance: relevantPerformanceData.map(p => ({
        word: p.word, // The AI flow expects the word string itself
        correctAnswers: p.correctAnswers,
        incorrectAnswers: p.incorrectAnswers,
      })),
      numberOfWordsToSuggest: 5, // Suggest 5 words
    };

    try {
      const result = await suggestWordsForReview(input);
      if (result.suggestedWords && result.suggestedWords.length > 0) {
        setSuggestedWords(result.suggestedWords);
        toast({
          title: "Suggestions Ready!",
          description: `AI has suggested ${result.suggestedWords.length} words for you to review.`,
        });
      } else {
        toast({
          title: "No Specific Suggestions",
          description: "AI couldn't pinpoint specific words for review right now. Keep learning!",
        });
      }
    } catch (error) {
      console.error("Error fetching review suggestions:", error);
      toast({
        title: "Error",
        description: "Could not fetch review suggestions at this time.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userData.wordStats, getPerformanceForWords, toast]);

  const handleStartQuiz = () => {
    if (suggestedWords.length > 0) {
      const wordsToQuiz: Word[] = suggestedWords
        .map(wordText => vocabulary.find(vWord => vWord.text === wordText))
        .filter((word): word is Word => !!word); // Type guard to filter out undefined
      
      if (wordsToQuiz.length > 0) {
        onStartQuizWithSuggestions(wordsToQuiz);
      } else {
         toast({ title: "Error", description: "Could not find details for suggested words.", variant: "destructive"});
      }
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
          <Brain className="mr-2 h-7 w-7 text-primary" />
          AI Word Review
        </CardTitle>
        <CardDescription>
          Let AI analyze your performance and suggest words you should focus on.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button onClick={fetchReviewSuggestions} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90" size="lg">
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Brain className="mr-2 h-5 w-5" />
          )}
          {isLoading ? 'Analyzing...' : 'Get AI Suggestions'}
        </Button>

        {suggestedWords.length > 0 && !isLoading && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold">Words to Review:</h3>
            <ul className="list-disc list-inside space-y-1 bg-secondary p-4 rounded-md">
              {suggestedWords.map((word, index) => (
                <li key={index} className="text-foreground">{word}</li>
              ))}
            </ul>
            <Button onClick={handleStartQuiz} className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
              <Zap className="mr-2 h-5 w-5" /> Start Quiz with these Words
            </Button>
          </div>
        )}
         {!isLoading && suggestedWords.length === 0 && (
          <p className="text-muted-foreground text-center pt-4">Click the button above to get suggestions, or AI found nothing to review yet!</p>
        )}
      </CardContent>
    </Card>
  );
}
