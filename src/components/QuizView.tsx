"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { QuizQuestion, Word } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { generateQuiz } from '@/lib/quizHelpers';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Trophy, BookCopy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizViewProps {
  wordsForQuiz: Word[];
  quizTitle?: string;
  onQuizComplete?: (score: number, totalQuestions: number) => void;
}

export default function QuizView({ wordsForQuiz, quizTitle = "Vocabulary Quiz", onQuizComplete }: QuizViewProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState<'' | 'correct' | 'incorrect'>('');
  
  const { updateWordStat, recordQuizCompletion, userData } = useUserProgress();
  const { toast } = useToast();

  useEffect(() => {
    if (wordsForQuiz.length > 0) {
      setQuestions(generateQuiz(wordsForQuiz, Math.min(10, wordsForQuiz.length))); // Max 10 questions or num available words
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setScore(0);
      setShowResults(false);
      setFeedback('');
    }
  }, [wordsForQuiz]);

  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);
    const isCorrect = answer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback('correct');
      updateWordStat(currentQuestion.wordId, true);
      toast({
        title: "Correct!",
        description: "Great job!",
        variant: "default",
        duration: 2000,
      });
    } else {
      setFeedback('incorrect');
      updateWordStat(currentQuestion.wordId, false);
      toast({
        title: "Incorrect",
        description: `The correct answer was: ${currentQuestion.correctAnswer}`,
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setFeedback('');
    } else {
      // Quiz finished
      recordQuizCompletion(score, questions.length - score, questions.map(q => q.wordId));
      setShowResults(true);
      if (onQuizComplete) {
        onQuizComplete(score, questions.length);
      }
    }
  };

  const restartQuiz = () => {
    setQuestions(generateQuiz(wordsForQuiz, Math.min(10, wordsForQuiz.length)));
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
    setFeedback('');
  };

  if (wordsForQuiz.length === 0) {
    return <p className="text-center text-muted-foreground">Not enough words to start a quiz for this selection.</p>;
  }
  
  if (questions.length === 0) {
    return <p className="text-center text-muted-foreground">Loading quiz...</p>;
  }

  if (showResults) {
    return (
      <Card className="w-full max-w-lg mx-auto text-center shadow-xl animate-fadeIn">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary flex items-center justify-center">
            <Trophy className="w-8 h-8 mr-2 text-yellow-500" /> Quiz Completed!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-2xl">Your Score: {score} / {questions.length}</p>
          <p className="text-lg">You earned {score * 10} points!</p>
          <Button onClick={restartQuiz} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            Play Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) {
     return <p className="text-center text-muted-foreground">No more questions available or error loading question.</p>;
  }

  const questionPrompt = currentQuestion.questionType === 'wordToDefinition' 
    ? `What is the definition of "${currentQuestion.wordToGuess}"?`
    : `Which word means "${currentQuestion.definitionToGuess}"?`;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl animate-slideInUp">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">{quizTitle}</CardTitle>
        <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="mt-2" />
        <CardDescription className="mt-2 text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {questions.length}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-secondary rounded-lg min-h-[80px] flex items-center justify-center">
          <p className="text-lg font-semibold text-center">{questionPrompt}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              size="lg"
              className={cn(
                "justify-start text-left h-auto py-3 whitespace-normal break-words",
                selectedAnswer === option && (feedback === 'correct' ? "bg-green-200 border-green-500 text-green-700" : "bg-red-200 border-red-500 text-red-700"),
                selectedAnswer === option && isAnswered && (feedback === 'correct' ? "animate-pulse-correct" : "animate-pulse-incorrect"),
                isAnswered && option === currentQuestion.correctAnswer && selectedAnswer !== option && "bg-green-100 border-green-300" // Highlight correct if wrong one chosen
              )}
              onClick={() => handleAnswerSelect(option)}
              disabled={isAnswered}
            >
              {isAnswered && selectedAnswer === option && (
                feedback === 'correct' ? <CheckCircle className="mr-2 h-5 w-5 text-green-600" /> : <XCircle className="mr-2 h-5 w-5 text-red-600" />
              )}
               {isAnswered && option === currentQuestion.correctAnswer && selectedAnswer !== option && (
                 <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
               )}
              {option}
            </Button>
          ))}
        </div>

        {isAnswered && (
          <div className="text-center mt-4">
            {feedback === 'incorrect' && (
              <p className="text-destructive font-semibold">
                Correct Answer: {currentQuestion.correctAnswer}
              </p>
            )}
            <Button onClick={handleNextQuestion} className="mt-2 bg-primary hover:bg-primary/90" size="lg">
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Show Results'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
