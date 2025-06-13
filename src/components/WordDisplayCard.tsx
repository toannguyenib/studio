
"use client";

import type { Word } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Volume2, Brain, Loader2, Mic } from 'lucide-react'; // Mic for pronunciation
import { Button } from './ui/button';
import React, { useState, useEffect } from 'react';
import { generateMnemonic, type GenerateMnemonicInput } from '@/ai/flows/generate-mnemonic-flow';
import { useToast } from '@/hooks/use-toast';

interface WordDisplayCardProps {
  word: Word;
}

export default function WordDisplayCard({ word }: WordDisplayCardProps) {
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [isLoadingMnemonic, setIsLoadingMnemonic] = useState(false);
  const { toast } = useToast();
  
  const speakWord = () => {
    if ('speechSynthesis' in window && word.text) {
      const utterance = new SpeechSynthesisUtterance(word.text);
      // Potentially set language for better pronunciation if needed for IELTS
      // utterance.lang = 'en-US'; 
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Speech Synthesis Not Supported",
        description: "Your browser does not support text-to-speech.",
        variant: "destructive"
      });
    }
  };

  const handleGetMnemonic = async () => {
    if (!word) return;
    setIsLoadingMnemonic(true);
    setMnemonic(null); 
    try {
      const input: GenerateMnemonicInput = { wordText: word.text, wordDefinition: word.definition };
      const result = await generateMnemonic(input);
      setMnemonic(result.mnemonic);
    } catch (error) {
      console.error("Error generating mnemonic:", error);
      toast({
        title: "Mnemonic Generation Failed",
        description: "Could not generate a mnemonic at this time. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMnemonic(false);
    }
  };

  useEffect(() => {
    setMnemonic(null);
    setIsLoadingMnemonic(false);
  }, [word]);

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-slideInUp">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="font-headline text-3xl text-primary">{word.text}</CardTitle>
          <Button variant="ghost" size="icon" onClick={speakWord} aria-label="Speak word">
            <Volume2 className="h-6 w-6 text-accent" />
          </Button>
        </div>
        <CardDescription className="text-sm text-muted-foreground">Topic: {word.topic}</CardDescription>
        {word.pronunciation && (
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <Mic className="h-4 w-4 mr-1 text-accent" />
            <span>{word.pronunciation}</span>
            {word.partOfSpeech && <span className="ml-2 italic">({word.partOfSpeech})</span>}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg">{word.definition}</p>
        {word.exampleSentence && (
          <p className="italic text-muted-foreground">
            Example: "{word.exampleSentence}"
          </p>
        )}

        <div className="mt-4 pt-4 border-t">
          <Button onClick={handleGetMnemonic} disabled={isLoadingMnemonic} variant="outline" className="w-full">
            {isLoadingMnemonic ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Brain className="mr-2 h-4 w-4" />
            )}
            {isLoadingMnemonic ? 'Generating Mnemonic...' : 'Get AI Mnemonic'}
          </Button>
          {mnemonic && (
            <div className="mt-3 p-3 bg-secondary rounded-md">
              <p className="text-sm font-semibold text-primary">Mnemonic:</p>
              <p className="text-sm italic text-foreground">{mnemonic}</p>
            </div>
          )}
        </div>

        {(word.roots && word.roots.length > 0) || 
         (word.synonyms && word.synonyms.length > 0) || 
         (word.antonyms && word.antonyms.length > 0) || 
         (word.confusedWith && word.confusedWith.length > 0) ? (
          <div className="mt-4 pt-4 border-t space-y-3">
            {word.roots && word.roots.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-primary">Roots:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                  {word.roots.map((root, index) => <li key={`root-${index}`}>{root}</li>)}
                </ul>
              </div>
            )}
            {word.synonyms && word.synonyms.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-primary">Synonyms:</h4>
                <p className="text-sm text-muted-foreground">{word.synonyms.join(', ')}</p>
              </div>
            )}
            {word.antonyms && word.antonyms.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-primary">Antonyms:</h4>
                <p className="text-sm text-muted-foreground">{word.antonyms.join(', ')}</p>
              </div>
            )}
            {word.confusedWith && word.confusedWith.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-primary">Commonly Confused With:</h4>
                 <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                  {word.confusedWith.map((item, index) => <li key={`confused-${index}`}>{item}</li>)}
                </ul>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
