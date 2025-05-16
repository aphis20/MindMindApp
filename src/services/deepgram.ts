import { Deepgram, DeepgramClient } from '@deepgram/sdk';

// Initialize Deepgram with API key
const deepgram = new DeepgramClient({
  key: process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY || '',
});

/**
 * Represents the emotion data detected from the user's voice.
 */
export interface EmotionData {
  /**
   * The level of joy detected in the user's voice.
   */
  joy: number;
  /**
   * The level of sadness detected in the user's voice.
   */
  sadness: number;
  /**
   * The level of anger detected in the user's voice.
   */
  anger: number;
  /**
   * The level of fear detected in the user's voice.
   */
  fear: number;
  /**
   * The level of surprise detected in the user's voice.
   */
  surprise: number;
}

/**
 * Asynchronously analyzes the user's voice to detect emotions.
 *
 * @param audioBuffer The buffer of the audio to analyze.
 * @returns A promise that resolves to an EmotionData object containing the detected emotions.
 */
export async function detectVoiceEmotion(audioBuffer: ArrayBuffer): Promise<EmotionData> {
  try {
    // Call Deepgram API with v3 format
    const response = await deepgram.transcription.syncPrerecorded(
      {
        buffer: audioBuffer,
        mimetype: 'audio/wav',
      },
      {
        smart_format: true,
        model: 'nova-2',
        language: 'en',
        detect_topics: true,
        sentiment: true,
      }
    );

    // Extract sentiment data from response
    const sentiment = response.results?.channels[0]?.alternatives[0]?.sentiment || {};
    
    // Map sentiment to emotion scores
    return {
      joy: sentiment.positive || 0,
      sadness: sentiment.negative || 0,
      anger: sentiment.negative || 0,
      fear: sentiment.negative || 0,
      surprise: sentiment.positive || 0,
    };
  } catch (error) {
    console.error('Deepgram API error:', error);
    throw new Error('Failed to process voice emotion');
  }
}
