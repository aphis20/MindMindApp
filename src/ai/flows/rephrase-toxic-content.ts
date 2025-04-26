// AI-generated file. Do not edit.
'use server';
/**
 * @fileOverview A Genkit flow that rephrases potentially toxic or harmful content into a more constructive and empathetic version.
 *
 * - rephraseToxicContent - A function that rephrases the given content.
 * - RephraseToxicContentInput - The input type for the rephraseToxicContent function.
 * - RephraseToxicContentOutput - The return type for the rephraseToxicContent function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const RephraseToxicContentInputSchema = z.object({
  text: z.string().describe('The text to be rephrased.'),
});
export type RephraseToxicContentInput = z.infer<typeof RephraseToxicContentInputSchema>;

const RephraseToxicContentOutputSchema = z.object({
  rephrasedText: z.string().describe('The rephrased text, which is more constructive and empathetic.'),
});
export type RephraseToxicContentOutput = z.infer<typeof RephraseToxicContentOutputSchema>;

export async function rephraseToxicContent(input: RephraseToxicContentInput): Promise<RephraseToxicContentOutput> {
  return rephraseToxicContentFlow(input);
}

const rephraseToxicContentPrompt = ai.definePrompt({
  name: 'rephraseToxicContentPrompt',
  input: {
    schema: z.object({
      text: z.string().describe('The text to be rephrased.'),
    }),
  },
  output: {
    schema: z.object({
      rephrasedText: z.string().describe('The rephrased text, which is more constructive and empathetic.'),
    }),
  },
  prompt: `You are an AI assistant designed to rephrase potentially toxic or harmful content into a more constructive and empathetic version.

Original Text: {{{text}}}

Rephrased Text:`,
});

const rephraseToxicContentFlow = ai.defineFlow<
  typeof RephraseToxicContentInputSchema,
  typeof RephraseToxicContentOutputSchema
>(
  {
    name: 'rephraseToxicContentFlow',
    inputSchema: RephraseToxicContentInputSchema,
    outputSchema: RephraseToxicContentOutputSchema,
  },
  async input => {
    const {output} = await rephraseToxicContentPrompt(input);
    return output!;
  }
);
