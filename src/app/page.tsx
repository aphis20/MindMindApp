"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { detectEmotion as detectFaceEmotion } from "@/services/affectiva"; // Renamed for clarity
import { detectEmotion as detectVoiceEmotion } from "@/services/deepgram";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; // Added loader icon
import { toast } from "@/hooks/use-toast"; // For user feedback

const emotionColorMap: { [key: string]: string } = {
  "Joyful 😊": "joy",
  "Excited 🤩": "excited",
  "Grateful 🙏": "grateful",
  "Proud 🏆": "proud", // Added
  "Calm 🌿": "calm",
  "Hopeful 🌤️": "hopeful",
  "Curious 🤔": "curious",
  "Lonely 🧍‍♂️": "lonely",
  "Sad 😔": "sad", // Changed emoji
  "Anxious 😰": "anxious",
  "Angry 😠": "angry",
  "Grieving 🖤": "grieving",
  "Drained 🥱": "drained",
  "Confused 😕": "confused",
  "Insecure 😟": "insecure",
  "Healing 💖": "healing",
  "Vulnerable 🫥": "vulnerable",
  "I'm not sure 🤔": "muted",
  "Just Browsing 😌": "secondary", // Keep secondary for neutral browsing
};

// Use the more comprehensive list for manual selection
const allEmotions = Object.keys(emotionColorMap);
const trendingEmotions = [
  "Joyful 😊",
  "Sad 😔",
  "Anxious 😰",
  "Grateful 🙏",
  "Lonely 🧍‍♂️",
];

export default function Home() {
  const [emotion, setEmotion] = useState<string | null>(null);
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);
  const router = useRouter();

  const handleCameraDetection = async () => {
    setIsLoadingCamera(true);
    setEmotion(null); // Reset emotion while detecting
    try {
      // Placeholder for actual camera capture and processing
      // In a real app, you'd use getUserMedia, capture a frame, convert to buffer
      const imageBuffer = Buffer.from(""); // Replace with actual image buffer from camera

      if (!imageBuffer || imageBuffer.length === 0) {
         toast({
             variant: "destructive",
             title: "Camera Error",
             description: "Could not capture image from camera.",
         });
         setIsLoadingCamera(false);
         return;
      }

      const emotionData = await detectFaceEmotion(imageBuffer);
      // --- Logic to map detected emotionData to one of the predefined emotion strings ---
      // This is a simplified example; you'd need a more robust mapping based on dominant emotion
      let detectedEmotion = "I'm not sure 🤔"; // Default
      if (emotionData.joy > 0.5) detectedEmotion = "Joyful 😊";
      else if (emotionData.sadness > 0.5) detectedEmotion = "Sad 😔";
      else if (emotionData.anger > 0.5) detectedEmotion = "Angry 😠";
      // Add more sophisticated mapping logic here based on your API's output
      // For example, check anxiety proxies if the API provides them

      setEmotion(detectedEmotion);
      toast({
        title: "Emotion Detected",
        description: `Detected: ${detectedEmotion}`,
      });
    } catch (error) {
      console.error("Camera detection error:", error);
      toast({
        variant: "destructive",
        title: "Detection Failed",
        description: "Could not detect emotion from camera. Please try again or select manually.",
      });
       setEmotion("I'm not sure 🤔"); // Set to unsure on error
    } finally {
      setIsLoadingCamera(false);
    }
  };

  const handleVoiceDetection = async () => {
    setIsLoadingVoice(true);
    setEmotion(null);
    try {
      // Placeholder for actual microphone recording and processing
      // In a real app, you'd use MediaRecorder API, get audio blob, convert to buffer
      const audioBuffer = Buffer.from(""); // Replace with actual audio buffer

      if (!audioBuffer || audioBuffer.length === 0) {
         toast({
             variant: "destructive",
             title: "Microphone Error",
             description: "Could not record audio from microphone.",
         });
         setIsLoadingVoice(false);
         return;
      }


      const emotionData = await detectVoiceEmotion(audioBuffer);
      // --- Logic to map detected emotionData to one of the predefined emotion strings ---
      let detectedEmotion = "I'm not sure 🤔";
       if (emotionData.joy > 0.5) detectedEmotion = "Joyful 😊";
       else if (emotionData.sadness > 0.5) detectedEmotion = "Sad 😔";
       // Add more mapping logic
      setEmotion(detectedEmotion);
       toast({
        title: "Emotion Detected",
        description: `Detected: ${detectedEmotion}`,
      });
    } catch (error) {
      console.error("Voice detection error:", error);
       toast({
        variant: "destructive",
        title: "Detection Failed",
        description: "Could not detect emotion from voice. Please try again or select manually.",
      });
       setEmotion("I'm not sure 🤔");
    } finally {
      setIsLoadingVoice(false);
    }
  };

  const handleManualSelection = (selectedEmotion: string) => {
    setEmotion(selectedEmotion);
    // Optionally, add a toast confirmation for manual selection
     toast({
       title: "Emotion Selected",
       description: `You selected: ${selectedEmotion}`,
     });
  };

  const isLoading = isLoadingCamera || isLoadingVoice;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 text-center">
         {/* Updated Logo */}
         <div className="flex items-center gap-2 mb-4 text-4xl font-bold">
             <svg
               width="32" // Increased size
               height="32"
               viewBox="0 0 24 24"
               fill="none"
               xmlns="http://www.w3.org/2000/svg"
               className="text-primary"
             >
              <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                  fill="currentColor"
              />
              <path
                  d="M12 6C9.24 6 7 8.24 7 11C7 13.76 9.24 16 12 16C14.76 16 17 13.76 17 11C17 8.24 14.76 6 12 6ZM12 14C10.34 14 9 12.66 9 11C9 9.34 10.34 8 12 8C13.66 8 15 9.34 15 11C15 12.66 13.66 14 12 14Z"
                  fill="currentColor"
              />
              <path
                  d="M18 11H20C20 14.31 17.31 17 14 17V19C18.42 19 22 15.42 22 11H18ZM4 11H6C6 7.69 8.69 5 12 5V3C7.58 3 4 6.58 4 11Z"
                  fill="currentColor"
                  opacity="0.6"
               />
             </svg>
             <span className="text-primary">Mind</span>
             <span>Bridge</span> {/* Second part uses default foreground color */}
         </div>
        <p className="text-lg mt-3 text-muted-foreground max-w-prose">
          A safe, AI-powered emotional support network. How are you feeling today?
        </p>

        <Card className="w-full max-w-lg mt-10 shadow-lg"> {/* Increased max-width */}
          <CardHeader>
            <CardTitle className="text-2xl">Check In</CardTitle> {/* Adjusted size */}
            <CardDescription>
              Use camera, voice, or manual selection to identify your current
              emotional state.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-6"> {/* Increased spacing */}
            {/* Detection Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button onClick={handleCameraDetection} disabled={isLoading} size="lg">
                  {isLoadingCamera ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Detect via Camera
                </Button>
                <Button onClick={handleVoiceDetection} disabled={isLoading} size="lg">
                   {isLoadingVoice ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Detect via Mic
                </Button>
            </div>

             <div className="relative">
               <div className="absolute inset-0 flex items-center">
                 <span className="w-full border-t" />
               </div>
               <div className="relative flex justify-center text-xs uppercase">
                 <span className="bg-card px-2 text-muted-foreground">
                   Or select manually
                 </span>
               </div>
             </div>


            {/* Manual Selection */}
            <div>
              <p className="mb-3 text-sm font-medium text-muted-foreground">Trending emotions:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {trendingEmotions.map((emo) => (
                  <Button
                    key={emo}
                    variant={emotion === emo ? "default" : "outline"} // Highlight selected
                    // Applying dynamic background based on the emotionColorMap
                    className={`bg-[hsl(var(--${emotionColorMap[emo] || 'muted'}))] text-foreground border-[hsl(var(--${emotionColorMap[emo] || 'border'}))] hover:bg-[hsl(var(--${emotionColorMap[emo] || 'muted'}))/0.9] rounded-full px-4 py-2 transition-all`}
                    onClick={() => handleManualSelection(emo)}
                    disabled={isLoading}
                  >
                    {emo}
                  </Button>
                ))}
                 {/* Add "Not Sure" and "Browsing" separately for better control */}
                  <Button
                    key="unsure"
                    variant={emotion === "I'm not sure 🤔" ? "default" : "outline"}
                    className={`bg-[hsl(var(--muted))] text-muted-foreground border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))/0.9] rounded-full px-4 py-2 transition-all`}
                    onClick={() => handleManualSelection("I'm not sure 🤔")}
                    disabled={isLoading}
                  >
                    I'm not sure 🤔
                  </Button>
                  <Button
                    key="browsing"
                    variant={emotion === "Just Browsing 😌" ? "default" : "outline"}
                    className={`bg-[hsl(var(--secondary))] text-secondary-foreground border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary))/0.9] rounded-full px-4 py-2 transition-all`}
                    onClick={() => handleManualSelection("Just Browsing 😌")}
                     disabled={isLoading}
                  >
                    Just Browsing 😌
                  </Button>
                   {/* Add a button/link to see all emotions later if needed */}
              </div>
            </div>

            {/* Selected Emotion & Actions */}
            {emotion && !isLoading && (
              <div className="mt-6 p-4 border rounded-md bg-accent/50 text-accent-foreground">
                <p className="text-lg">
                  You’re feeling: <span className="font-bold">{emotion}</span>
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="default" // Changed to default for primary action
                    onClick={() => router.push("/circles")}
                    className="flex-1"
                  >
                    Join a Circle
                  </Button>
                  <Button
                    variant="outline" // Changed to outline for secondary action
                    onClick={() => router.push("/ask")}
                     className="flex-1"
                  >
                    Ask a Question
                  </Button>
                   <Button
                    variant="outline" // Changed to outline for secondary action
                    onClick={() => router.push("/journal")}
                     className="flex-1"
                  >
                    Write Journal Entry
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
