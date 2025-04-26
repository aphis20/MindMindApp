"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { detectEmotion } from "@/services/affectiva";
import { detectEmotion as detectVoiceEmotion } from "@/services/deepgram";
import { useRouter } from "next/navigation";

export default function Home() {
  const [emotion, setEmotion] = useState<string | null>(null);
    const router = useRouter();


  const handleCameraDetection = async () => {
    // Placeholder for camera emotion detection
    console.log("Camera detection triggered");
    const emotionData = await detectEmotion(Buffer.from("")); // Replace with actual image buffer
    setEmotion(`Anxious + Overwhelmed 😔`); // Update with actual emotion detection logic
  };

  const handleVoiceDetection = async () => {
    // Placeholder for voice emotion detection
    console.log("Voice detection triggered");
    const emotionData = await detectVoiceEmotion(Buffer.from("")); // Replace with actual audio buffer
    setEmotion(`Calm + Reflective 😌`); // Update with actual emotion detection logic
  };

  const handleManualSelection = (selectedEmotion: string) => {
    setEmotion(selectedEmotion);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 text-center">
        <h1 className="text-4xl font-bold">MindBridge</h1>
        <p className="text-lg mt-3">
          A safe, AI-powered emotional support network.
        </p>

        <Card className="w-full max-w-md mt-10">
          <CardHeader>
            <CardTitle>Detect Your Emotion</CardTitle>
            <CardDescription>
              Use camera, voice, or manual selection to identify your current
              emotional state.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Button onClick={handleCameraDetection}>Detect via Camera</Button>
            <Button onClick={handleVoiceDetection}>Detect via Microphone</Button>
            <div>
              <p className="mb-2">Select Manually:</p>
              <div className="flex space-x-2">
                <Button onClick={() => handleManualSelection("Happy 😊")}>
                  Happy 😊
                </Button>
                <Button onClick={() => handleManualSelection("Sad 😔")}>
                  Sad 😔
                </Button>
                <Button onClick={() => handleManualSelection("Anxious 😟")}>
                  Anxious 😟
                </Button>
              </div>
            </div>
            {emotion && (
              <div className="mt-4">
                <p>
                  You’re feeling: <span className="font-bold">{emotion}</span>
                </p>
                <div className="mt-4 flex space-x-4">
                  <Button variant="secondary" onClick={() => router.push('/circles')}>Join a Circle</Button>
                  <Button variant="secondary">Ask a Support Question</Button>
                  <Button variant="secondary">Write a Journal Entry</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

