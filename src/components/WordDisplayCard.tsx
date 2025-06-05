"use client";

import type { Word } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Volume2 } from 'lucide-react';
import { Button } from './ui/button';

interface WordDisplayCardProps {
  word: Word;
}

export default function WordDisplayCard({ word }: WordDisplayCardProps) {
  
  const speakWord = () => {
    if ('speechSynthesis' in window && word.text) {
      const utterance = new SpeechSynthesisUtterance(word.text);
      // Optional: Configure voice, pitch, rate
      // utterance.voice = speechSynthesis.getVoices()[0]; // Example: use the first available voice
      // utterance.pitch = 1;
      // utterance.rate = 1;
      speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser or no word to speak.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg_ animate-slideInUp">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="font-headline text-3xl text-primary">{word.text}</CardTitle>
          <Button variant="ghost" size="icon" onClick={speakWord} aria-label="Speak word">
            <Volume2 className="h-6 w-6 text-accent" />
          </Button>
        </div>
        <CardDescription className="text-sm text-muted-foreground">Level {word.level}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-lg">{word.definition}</p>
        {word.exampleSentence && (
          <p className="italic text-muted-foreground">
            Example: "{word.exampleSentence}"
          </p>
        )}
      </CardContent>
    </Card>
  );
}
