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

const emotionColorMap: { [key: string]: string } = {
  "Joyful 😊": "joy",
  "Excited 🤩": "excited",
  "Grateful 🙏": "grateful",
  "Proud 🏆": "proud",
  "Calm 🌿": "calm",
  "Hopeful 🌤️": "hopeful",
  "Curious 🤔": "curious",
  "Lonely 🧍‍♂️": "lonely",
  "Sad 😔": "sad",
  "Anxious 😰": "anxious",
  "Angry 😠": "angry",
  "Grieving 🖤": "grieving",
  "Drained 🥱": "drained",
  "Confused 😕": "confused",
  "Insecure 😟": "insecure",
  "Healing 💖": "healing",
  "Vulnerable 🫥": "vulnerable",
  "I'm not sure 🤔": "muted",
  "Just Browsing 😌": "secondary",
};

export default function Home() {
  const [emotion, setEmotion] = useState<string | null>(null);
  const router = useRouter();

  const handleCameraDetection = async () => {
    // Placeholder for camera emotion detection
    console.log("Camera detection triggered");
    const emotionData = await detectEmotion(Buffer.from("")); // Replace with actual image buffer
    setEmotion(`Anxious 😰`); // Update with actual emotion detection logic
  };

  const handleVoiceDetection = async () => {
    // Placeholder for voice emotion detection
    console.log("Voice detection triggered");
    const emotionData = await detectVoiceEmotion(Buffer.from("")); // Replace with actual audio buffer
    setEmotion(`Calm 🌿`); // Update with actual emotion detection logic
  };

  const handleManualSelection = (selectedEmotion: string) => {
    setEmotion(selectedEmotion);
  };

  const trendingEmotions = [
    "Joyful 😊",
    "Sad 😔",
    "Anxious 😰",
    "Grateful 🙏",
    "Lonely 🧍‍♂️",
  ];

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
              <div className="flex flex-wrap justify-center gap-2">
                {trendingEmotions.map((emotion) => (
                  <Button
                    key={emotion}
                    variant="secondary"
                    className={`bg-[var(--${
                      emotionColorMap[emotion] || "muted"
                    })] text-white rounded-full px-4 py-2`}
                    onClick={() => handleManualSelection(emotion)}
                  >
                    {emotion}
                  </Button>
                ))}
                <Button
                  variant="secondary"
                  className="bg-[var(--muted)] text-white rounded-full px-4 py-2"
                  onClick={() => handleManualSelection("I'm not sure 🤔")}
                >
                  I'm not sure 🤔
                </Button>
                <Button
                  variant="secondary"
                  className="bg-[var(--secondary)] text-white rounded-full px-4 py-2"
                  onClick={() => handleManualSelection("Just Browsing 😌")}
                >
                  Just Browsing 😌
                </Button>
              </div>
            </div>
            {emotion && (
              <div className="mt-4">
                <p>
                  You’re feeling: <span className="font-bold">{emotion}</span>
                </p>
                <div className="mt-4 flex space-x-4">
                  <Button
                    variant="secondary"
                    onClick={() => router.push("/circles")}
                  >
                    Join a Circle
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => router.push("/ask")}
                  >
                    Ask a Support Question
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
