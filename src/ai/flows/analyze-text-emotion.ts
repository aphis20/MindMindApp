
// AI-generated file. Do not edit.
'use server';
/**
 * @fileOverview A Genkit flow that analyzes the emotion expressed in a given text.
 *
 * - analyzeTextEmotion - A function that analyzes the emotion of the text.
 * - AnalyzeTextEmotionInput - The input type for the analyzeTextEmotion function.
 * - AnalyzeTextEmotionOutput - The return type for the analyzeTextEmotion function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

// Define the list of possible emotions based on the frontend map keys (excluding emojis and status)
const possibleEmotions = [
  "Joyful", "Excited", "Grateful", "Proud",
  "Calm", "Hopeful", "Curious", "Lonely",
  "Sad", "Anxious", "Angry", "Grieving", "Drained",
  "Confused", "Insecure", "Healing", "Vulnerable",
  "Unsure" // Representing "I'm not sure"
] as const; // Use 'as const' for stricter typing

const AnalyzeTextEmotionInputSchema = z.object({
  text: z.string().describe('The text to be analyzed for emotion.'),
});
export type AnalyzeTextEmotionInput = z.infer<typeof AnalyzeTextEmotionInputSchema>;

const AnalyzeTextEmotionOutputSchema = z.object({
   emotion: z.enum(possibleEmotions)
            .describe('The primary emotion detected in the text. Should be one of the provided categories.'),
});
export type AnalyzeTextEmotionOutput = z.infer<typeof AnalyzeTextEmotionOutputSchema>;

export async function analyzeTextEmotion(input: AnalyzeTextEmotionInput): Promise<AnalyzeTextEmotionOutput> {
  return analyzeTextEmotionFlow(input);
}

const analyzeTextEmotionPrompt = ai.definePrompt({
  name: 'analyzeTextEmotionPrompt',
  input: {
    schema: z.object({
      text: z.string().describe('The text to be analyzed.'),
    }),
  },
  output: {
     schema: z.object({
       emotion: z.enum(possibleEmotions)
                .describe(`The dominant emotion from the following list: ${possibleEmotions.join(', ')}`),
     }),
  },
  prompt: `Analyze the following text and determine the primary emotion expressed.

Text: {{{text}}}

Select the most fitting emotion from this list: ${possibleEmotions.join(', ')}. If no specific emotion is clear, select "Unsure". Respond only with the chosen emotion word.`,
});

const analyzeTextEmotionFlow = ai.defineFlow<
  typeof AnalyzeTextEmotionInputSchema,
  typeof AnalyzeTextEmotionOutputSchema
>(
  {
    name: 'analyzeTextEmotionFlow',
    inputSchema: AnalyzeTextEmotionInputSchema,
    outputSchema: AnalyzeTextEmotionOutputSchema,
  },
  async input => {
    const {output} = await analyzeTextEmotionPrompt(input);
    // Ensure the output format is correct, potentially add fallback logic if needed
     if (!output || !possibleEmotions.includes(output.emotion)) {
       console.warn('AI did not return a valid emotion, defaulting to Unsure');
       return { emotion: 'Unsure' };
     }
    return output;
  }
);
