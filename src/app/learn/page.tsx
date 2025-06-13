
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import WordDisplayCard from '@/components/WordDisplayCard';
import { topics, getWordsByTopic, getAllWords } from '@/lib/vocabulary';
import type { Word, Topic } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { useUserProgress } from '@/contexts/UserProgressContext'; // Not needed if topics aren't locked

export default function LearnPage() {
  // const { userData } = useUserProgress(); // Not needed if topics aren't locked/tracked in user progress
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[0]?.id || '');
  const [currentIndex, setCurrentIndex] = useState(0);

  const wordsForTopic = useMemo(() => {
    if (!selectedTopicId) return [];
    const selectedTopic = topics.find(t => t.id === selectedTopicId);
    return selectedTopic ? getWordsByTopic(selectedTopic.name) : [];
  }, [selectedTopicId]);

  const currentWord = useMemo(() => {
    return wordsForTopic[currentIndex];
  }, [wordsForTopic, currentIndex]);

  useEffect(() => {
    // If there are topics and no topic is selected, select the first one.
    if (topics.length > 0 && !selectedTopicId) {
      setSelectedTopicId(topics[0].id);
    }
  }, [selectedTopicId]);

  const handleTopicChange = (topicId: string) => {
    setSelectedTopicId(topicId);
    setCurrentIndex(0); // Reset index when topic changes
  };

  const goToNextWord = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % wordsForTopic.length);
  };

  const goToPreviousWord = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + wordsForTopic.length) % wordsForTopic.length);
  };

  if (topics.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-headline mb-6 text-primary">Learn Vocabulary by Topic</h1>
        <p className="text-lg text-muted-foreground">No topics available yet. Please add some!</p>
      </div>
    );
  }

  if (!currentWord && wordsForTopic.length === 0 && selectedTopicId) {
     return (
      <div className="container mx-auto py-8 animate-fadeIn">
        <h1 className="text-4xl font-headline text-center mb-8 text-primary">Learn Words by Topic</h1>
        <div className="flex justify-center items-center mb-6 space-x-4">
          <p className="text-lg">Select Topic:</p>
          <Select onValueChange={handleTopicChange} defaultValue={selectedTopicId}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select Topic" />
            </SelectTrigger>
            <SelectContent>
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
        </div>
        <p className="text-center text-muted-foreground mt-4">No words found for the selected topic. Please add some or choose another topic.</p>
      </div>
    );
  }
  
  if (!currentWord) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-headline mb-6 text-primary">Learn Vocabulary by Topic</h1>
        <p className="text-lg text-muted-foreground">Select a topic to start learning.</p>
        <div className="my-6">
          <Select onValueChange={handleTopicChange} defaultValue={selectedTopicId || undefined}>
            <SelectTrigger className="w-[280px] mx-auto">
              <SelectValue placeholder="Select Topic" />
            </SelectTrigger>
            <SelectContent>
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
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8 animate-fadeIn">
      <h1 className="text-4xl font-headline text-center mb-8 text-primary">Learn Words by Topic</h1>
      
      <div className="flex justify-center items-center mb-6 space-x-4">
        <p className="text-lg">Select Topic:</p>
        <Select onValueChange={handleTopicChange} defaultValue={selectedTopicId}>
          <SelectTrigger className="w-full sm:w-[280px]">
            <SelectValue placeholder="Select Topic" />
          </SelectTrigger>
          <SelectContent>
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
      </div>

      {wordsForTopic.length > 0 ? (
        <div className="flex flex-col items-center space-y-6">
          <WordDisplayCard word={currentWord} />
          <div className="flex justify-between w-full max-w-md">
            <Button onClick={goToPreviousWord} variant="outline" disabled={wordsForTopic.length <= 1}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <p className="text-muted-foreground">{currentIndex + 1} / {wordsForTopic.length}</p>
            <Button onClick={goToNextWord} variant="outline" disabled={wordsForTopic.length <= 1}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No words available for this topic yet.</p>
      )}
    </div>
  );
}
