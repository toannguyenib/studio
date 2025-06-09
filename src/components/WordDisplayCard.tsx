"use client";

import type { Word } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Volume2, Brain, Loader2 } from 'lucide-react';
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
      speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser or no word to speak.");
    }
  };

  const handleGetMnemonic = async () => {
    if (!word) return;
    setIsLoadingMnemonic(true);
    setMnemonic(null); // Clear previous mnemonic
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

  // Reset mnemonic when the word changes
  useEffect(() => {
    setMnemonic(null);
    setIsLoadingMnemonic(false);
  }, [word]);

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
          <p className="italic text-lg text-muted-foreground">
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

        {(word.roots || word.synonyms || word.antonyms || word.confusedWith) && (
          <div className="mt-4 pt-4 border-t space-y-3">
            {word.roots && word.roots.length > 0 && (
              <div>
                <h4 className="text-xl font-semibold text-primary">Roots:</h4>
                <ul className="list-disc list-inside text-lg text-muted-foreground ml-4">
                  {word.roots.map((root, index) => <li key={`root-${index}`}>{root}</li>)}
                </ul>
              </div>
            )}
            {word.synonyms && word.synonyms.length > 0 && (
              <div>
                <h4 className="text-xl font-semibold text-primary">Synonyms:</h4>
                <p className="text-lg text-muted-foreground">{word.synonyms.join(', ')}</p>
              </div>
            )}
            {word.antonyms && word.antonyms.length > 0 && (
              <div>
                <h4 className="text-xl font-semibold text-primary">Antonyms:</h4>
                <p className="text-lg text-muted-foreground">{word.antonyms.join(', ')}</p>
              </div>
            )}
            {word.confusedWith && word.confusedWith.length > 0 && (
              <div>
                <h4 className="text-xl font-semibold text-primary">Commonly Confused With:</h4>
                 <ul className="list-disc list-inside text-lg text-muted-foreground ml-4">
                  {word.confusedWith.map((item, index) => <li key={`confused-${index}`}>{item}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
