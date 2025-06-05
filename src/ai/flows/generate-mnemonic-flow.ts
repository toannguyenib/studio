'use server';
/**
 * @fileOverview AI-powered mnemonic generation flow.
 *
 * - generateMnemonic - A function that generates a mnemonic for a given word and definition.
 * - GenerateMnemonicInput - The input type for the generateMnemonic function.
 * - GenerateMnemonicOutput - The return type for the generateMnemonic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMnemonicInputSchema = z.object({
  wordText: z.string().describe('The vocabulary word.'),
  wordDefinition: z.string().describe('The definition of the vocabulary word.'),
});
export type GenerateMnemonicInput = z.infer<typeof GenerateMnemonicInputSchema>;

const GenerateMnemonicOutputSchema = z.object({
  mnemonic: z.string().describe('A helpful and creative mnemonic for the word.'),
});
export type GenerateMnemonicOutput = z.infer<typeof GenerateMnemonicOutputSchema>;

export async function generateMnemonic(input: GenerateMnemonicInput): Promise<GenerateMnemonicOutput> {
  return generateMnemonicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMnemonicPrompt',
  input: {schema: GenerateMnemonicInputSchema},
  output: {schema: GenerateMnemonicOutputSchema},
  prompt: `You are an AI assistant designed to help students learn vocabulary by creating memorable mnemonics.

Given the following word and its definition, generate a creative and effective mnemonic to help remember it. The mnemonic should be concise and easy to recall.

Word: {{wordText}}
Definition: {{wordDefinition}}

Mnemonic:`,
});

const generateMnemonicFlow = ai.defineFlow(
  {
    name: 'generateMnemonicFlow',
    inputSchema: GenerateMnemonicInputSchema,
    outputSchema: GenerateMnemonicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
