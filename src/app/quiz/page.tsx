
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import QuizView from '@/components/QuizView';
import { vocabulary, topics, getWordsByTopic, getAllWords } from '@/lib/vocabulary';
import type { Word, Topic } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw } from 'lucide-react';

export default function QuizPage() {
  const { userData, isLoading: userDataLoading } = useUserProgress(); // Removed unlockNextLevel
  const { toast } = useToast();
  const [selectedTopicId, setSelectedTopicId] = useState<string | 'all'>(topics[0]?.id || 'all');
  const [quizWords, setQuizWords] = useState<Word[]>([]);
  const [quizKey, setQuizKey] = useState(0); 

  const wordsForQuiz = useMemo(() => {
    if (selectedTopicId === 'all') {
      return getAllWords();
    }
    const selectedTopic = topics.find(t => t.id === selectedTopicId);
    return selectedTopic ? getWordsByTopic(selectedTopic.name) : [];
  }, [selectedTopicId]);

  useEffect(() => {
    if (!userDataLoading) {
        if (selectedTopicId === 'all') {
            setQuizWords(getAllWords());
        } else {
            const selectedTopic = topics.find(t => t.id === selectedTopicId);
            if (selectedTopic) {
                setQuizWords(getWordsByTopic(selectedTopic.name));
            } else {
                // Fallback if selectedTopicId is somehow invalid
                setSelectedTopicId(topics[0]?.id || 'all');
                setQuizWords(selectedTopicId === 'all' ? getAllWords() : getWordsByTopic(topics[0]?.name || ''));
            }
        }
        setQuizKey(prev => prev + 1);
    }
  }, [userDataLoading, selectedTopicId]);


  const handleTopicChange = (topicValue: string) => {
    setSelectedTopicId(topicValue); // topicValue is topic.id or 'all'
    if (topicValue === 'all') {
      setQuizWords(getAllWords());
    } else {
      const topic = topics.find(t => t.id === topicValue);
      if (topic) {
        setQuizWords(getWordsByTopic(topic.name));
      } else {
        setQuizWords([]); // Should not happen if UI is correct
      }
    }
    setQuizKey(prev => prev + 1); 
  };

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    // No level unlocking logic needed anymore
    toast({
        title: "Quiz Complete!",
        description: `You scored ${score} out of ${totalQuestions}. ${score * 10} points earned!`,
        variant: "default",
    });
  };
  
  if (userDataLoading) {
    return <div className="text-center py-10"><p>Loading user data...</p></div>;
  }
  
  if (topics.length === 0 && getAllWords().length === 0) {
      return <div className="text-center py-10"><p>No topics or words available for quizzes yet. Please add some vocabulary first.</p></div>;
  }


  return (
    <div className="container mx-auto py-8 animate-fadeIn">
      <h1 className="text-4xl font-headline text-center mb-8 text-primary">Test Your Knowledge</h1>
      
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle>Quiz Settings</CardTitle>
          <CardDescription>Choose a topic to start your quiz.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Select onValueChange={handleTopicChange} defaultValue={String(selectedTopicId)}>
            <SelectTrigger className="w-full sm:w-[280px]">
              <SelectValue placeholder="Select Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {topics.map(topic => (
                <SelectItem 
                  key={topic.id} 
                  value={topic.id}
                >
                  {topic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setQuizKey(prev => prev + 1)} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" /> New Quiz
          </Button>
        </CardContent>
      </Card>
      
      {quizWords.length > 0 ? (
        <QuizView 
          key={quizKey} 
          wordsForQuiz={quizWords} 
          quizTitle={`${selectedTopicId === 'all' ? 'All Topics' : topics.find(t=>t.id === selectedTopicId)?.name || 'Selected Topic'} Quiz`}
          onQuizComplete={handleQuizComplete}
        />
      ) : (
        <p className="text-center text-muted-foreground">
          Please select a topic with available words to start a quiz, or add words to the selected topic.
        </p>
      )}
    </div>
  );
}
