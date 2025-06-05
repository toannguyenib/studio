
'use server';

/**
 * @fileOverview AI-powered word review suggestion flow.
 *
 * - suggestWordsForReview - A function that suggests words for review based on past performance.
 * - SuggestWordsForReviewInput - The input type for the suggestWordsForReview function.
 * - SuggestWordsForReviewOutput - The return type for the suggestWordsForReview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestWordsForReviewInputSchema = z.object({
  pastPerformance: z
    .array(z.object({
      word: z.string().describe('The vocabulary word.'),
      correctAnswers: z.number().describe('Number of times the word was answered correctly.'),
      incorrectAnswers: z.number().describe('Number of times the word was answered incorrectly.'),
    }))
    .describe('An array of past performance data for each vocabulary word.'),
  numberOfWordsToSuggest: z.number().describe('The number of words to suggest for review.'),
});
export type SuggestWordsForReviewInput = z.infer<typeof SuggestWordsForReviewInputSchema>;

const SuggestWordsForReviewOutputSchema = z.object({
  suggestedWords: z.array(z.string()).describe('An array of vocabulary words suggested for review.'),
});
export type SuggestWordsForReviewOutput = z.infer<typeof SuggestWordsForReviewOutputSchema>;

export async function suggestWordsForReview(input: SuggestWordsForReviewInput): Promise<SuggestWordsForReviewOutput> {
  return suggestWordsForReviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestWordsForReviewPrompt',
  input: {schema: SuggestWordsForReviewInputSchema},
  output: {schema: SuggestWordsForReviewOutputSchema},
  prompt: `You are an AI assistant designed to suggest vocabulary words for review based on a student's past performance.

Given the following past performance data, suggest {{numberOfWordsToSuggest}} words that the student should review.

Past Performance:
{{#each pastPerformance}}
- Word: {{word}}, Correct Answers: {{correctAnswers}}, Incorrect Answers: {{incorrectAnswers}}
{{/each}}

Consider words with a higher number of incorrect answers relative to correct answers as higher priority for review.

Output the suggested words as a simple array of strings.

Suggested Words:`, // Keep as simple array of strings for now
});

const suggestWordsForReviewFlow = ai.defineFlow(
  {
    name: 'suggestWordsForReviewFlow',
    inputSchema: SuggestWordsForReviewInputSchema,
    outputSchema: SuggestWordsForReviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
