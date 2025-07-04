'use server';
/**
 * @fileOverview A Genkit flow that analyzes the overall sentiment of a journal entry.
 *
 * - analyzeJournalEntrySentiment - Analyzes the sentiment of the provided text.
 * - AnalyzeJournalSentimentInput - Input schema for the sentiment analysis flow.
 * - AnalyzeJournalSentimentOutput - Output schema for the sentiment analysis flow.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const possibleSentiments = [
  "Very Positive", "Positive", "Neutral", "Negative", "Very Negative", "Mixed"
] as const;

// Define schemas
const inputSchema = z.object({
  text: z.string().min(10).describe('The journal entry text to be analyzed for sentiment. Should be at least 10 characters long.'),
});

const outputSchema = z.object({
  sentiment: z.enum(possibleSentiments).describe('The overall sentiment detected in the journal entry.'),
  explanation: z.string().optional().describe('A brief explanation for the detected sentiment (optional).'),
});

// Export types
export type AnalyzeJournalSentimentInput = z.infer<typeof inputSchema>;
export type AnalyzeJournalSentimentOutput = z.infer<typeof outputSchema>;

const sentimentAnalysisPrompt = ai.definePrompt({
  name: 'journalSentimentAnalysisPrompt',
  input: {
    schema: inputSchema,
  },
  output: {
    schema: outputSchema,
  },
  prompt: `You are an expert in sentiment analysis. Analyze the overall sentiment of the following journal entry. Classify the sentiment into one of these categories: ${possibleSentiments.join(', ')}.
Provide a brief explanation for your sentiment choice.
Journal Entry:
{{{text}}}

Consider the tone, keywords, and overall emotional expression. If the sentiment is clearly leaning one way, choose the appropriate positive or negative category. If it's balanced or contains conflicting emotions, choose "Mixed". If it's objective or lacks strong emotional cues, choose "Neutral".

Output only the JSON object containing the 'sentiment' and an 'explanation'.`,
});

const analyzeJournalSentimentFlow = ai.defineFlow<
  typeof inputSchema,
  typeof outputSchema
>(
  {
    name: 'analyzeJournalSentimentFlow',
    inputSchema,
    outputSchema,
  },
  async (input) => {
    try {
      const { output } = await sentimentAnalysisPrompt(input);
      if (!output || !possibleSentiments.includes(output.sentiment)) {
        console.warn('AI did not return a valid sentiment, defaulting to Neutral');
        return { sentiment: 'Neutral', explanation: 'The AI returned an invalid sentiment.' };
      }
      return output;
    } catch (error) {
      console.error("Error in sentiment analysis flow:", error);
      return { sentiment: 'Neutral', explanation: "Could not analyze sentiment due to an error." };
    }
  }
);

export async function analyzeJournalEntrySentiment(input: AnalyzeJournalSentimentInput): Promise<AnalyzeJournalSentimentOutput> {
  return analyzeJournalSentimentFlow(input);
}
