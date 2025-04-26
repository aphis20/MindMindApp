
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import { detectEmotion as detectFaceEmotion } from "@/services/affectiva"; // Renamed for clarity
import { detectEmotion as detectVoiceEmotion } from "@/services/deepgram";
import { analyzeTextEmotion } from "@/ai/flows/analyze-text-emotion"; // Import new AI flow
import { useRouter } from "next/navigation";
import { Loader2, Type, Camera, Mic, Pencil } from "lucide-react"; // Added Pencil icon
import { toast } from "@/hooks/use-toast"; // For user feedback
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components

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
  const [textToCheckIn, setTextToCheckIn] = useState(""); // State for text input
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);
  const [isLoadingText, setIsLoadingText] = useState(false); // Loading state for text analysis
  const [showTextInput, setShowTextInput] = useState(false); // State to show/hide text input area
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        // Try to get camera stream to check permission without starting it immediately
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        // Immediately stop the tracks to release the camera
        stream.getTracks().forEach(track => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null; // Ensure video element doesn't hold the stream
        }

      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        // Only show toast if permission is explicitly denied, not on initial load check fail silently
         if ((error as Error).name === 'NotAllowedError') {
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions in your browser settings to use camera detection.',
           });
         }
      }
    };

    getCameraPermission();
  }, []);


  const handleCameraDetection = async () => {
    if (!hasCameraPermission) {
        toast({
            variant: "destructive",
            title: "Camera Permission Required",
            description: "Please grant camera access in your browser settings.",
        });
        return;
    }
    setIsLoadingCamera(true);
    setEmotion(null);
    setShowTextInput(false);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
         if (videoRef.current) {
           videoRef.current.srcObject = stream;
           await new Promise(resolve => videoRef.current!.onloadedmetadata = resolve); // Wait for metadata
           videoRef.current.play();

           // Capture a frame after a short delay to ensure the video is playing
           await new Promise(resolve => setTimeout(resolve, 500));

           const canvas = document.createElement('canvas');
           canvas.width = videoRef.current.videoWidth;
           canvas.height = videoRef.current.videoHeight;
           const ctx = canvas.getContext('2d');
           if (!ctx) throw new Error('Could not get canvas context');
           ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
           const dataUrl = canvas.toDataURL('image/png');
           // Stop video stream
           stream.getTracks().forEach(track => track.stop());
           videoRef.current.srcObject = null;


          // Extract base64 data
          const base64Data = dataUrl.split(',')[1];
          if (!base64Data) throw new Error('Could not extract base64 data from image');
          const imageBuffer = Buffer.from(base64Data, 'base64');


        const emotionData = await detectFaceEmotion(imageBuffer);
        let detectedEmotion = "I'm not sure 🤔";
        if (emotionData.joy > 0.5) detectedEmotion = "Joyful 😊";
        else if (emotionData.sadness > 0.5) detectedEmotion = "Sad 😔";
        else if (emotionData.anger > 0.5) detectedEmotion = "Angry 😠";
        // Add more sophisticated mapping logic here based on your API's output

        setEmotion(detectedEmotion);
        toast({
          title: "Emotion Detected",
          description: `Detected via Camera: ${detectedEmotion}`,
        });
        } else {
             throw new Error("Video ref not available");
        }

    } catch (error) {
      console.error("Camera detection error:", error);
      toast({
        variant: "destructive",
        title: "Detection Failed",
        description: "Could not detect emotion from camera. Please try again or select manually.",
      });
       setEmotion("I'm not sure 🤔");
    } finally {
      setIsLoadingCamera(false);
    }
  };

  const handleVoiceDetection = async () => {
    setIsLoadingVoice(true);
    setEmotion(null);
     setShowTextInput(false);
    try {
      // Placeholder for actual microphone recording and processing
      const audioBuffer = Buffer.from(""); // Replace with actual audio buffer

      if (!audioBuffer || audioBuffer.length === 0) {
         toast({
             variant: "destructive",
             title: "Microphone Error",
             description: "Could not record audio from microphone. (Feature not fully implemented)",
         });
         setIsLoadingVoice(false);
         return;
      }

      const emotionData = await detectVoiceEmotion(audioBuffer);
      let detectedEmotion = "I'm not sure 🤔";
       if (emotionData.joy > 0.5) detectedEmotion = "Joyful 😊";
       else if (emotionData.sadness > 0.5) detectedEmotion = "Sad 😔";
       // Add more mapping logic
      setEmotion(detectedEmotion);
       toast({
        title: "Emotion Detected",
        description: `Detected via Mic: ${detectedEmotion}`,
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

   const handleTextAnalysis = async () => {
     if (!textToCheckIn.trim()) {
       toast({
         variant: "destructive",
         title: "Input Required",
         description: "Please type how you are feeling before analyzing.",
       });
       return;
     }
     setIsLoadingText(true);
     setEmotion(null);
     try {
       const result = await analyzeTextEmotion({ text: textToCheckIn });
       // Map the result.emotion to one of the predefined keys in emotionColorMap
       // This requires the AI flow to return an emotion string that *matches* one of the keys
       const detectedEmotionKey = Object.keys(emotionColorMap).find(key => key.startsWith(result.emotion)) || "I'm not sure 🤔";
       setEmotion(detectedEmotionKey);
       toast({
         title: "Emotion Analyzed",
         description: `Detected via Text: ${detectedEmotionKey}`,
       });
     } catch (error) {
       console.error("Text analysis error:", error);
       toast({
         variant: "destructive",
         title: "Analysis Failed",
         description: "Could not analyze emotion from text. Please try again or select manually.",
       });
       setEmotion("I'm not sure 🤔");
     } finally {
       setIsLoadingText(false);
     }
   };

  const handleManualSelection = (selectedEmotion: string) => {
    setEmotion(selectedEmotion);
    setShowTextInput(false); // Hide text input on manual selection
     toast({
       title: "Emotion Selected",
       description: `You selected: ${selectedEmotion}`,
     });
  };

  const isLoading = isLoadingCamera || isLoadingVoice || isLoadingText;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 text-center">
         {/* Logo */}
          <div className="flex items-center gap-2 mb-4 text-4xl font-bold">
             <svg
               width="32"
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
             <span>Bridge</span>
         </div>
        <p className="text-lg mt-3 text-muted-foreground max-w-prose">
          A safe, AI-powered emotional support network. How are you feeling today?
        </p>

        <Card className="w-full max-w-lg mt-10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Check In</CardTitle>
            <CardDescription>
              How are you feeling? Use camera, mic, text, or select manually.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-6">
            {/* Detection Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button onClick={handleCameraDetection} disabled={isLoading || hasCameraPermission === false} size="lg">
                  {isLoadingCamera ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                  Camera
                </Button>
                <Button onClick={handleVoiceDetection} disabled={isLoading} size="lg">
                   {isLoadingVoice ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mic className="mr-2 h-4 w-4" />}
                  Mic
                </Button>
                 <Button onClick={() => setShowTextInput(prev => !prev)} disabled={isLoading} size="lg" variant={showTextInput ? "secondary" : "outline"}>
                    <Type className="mr-2 h-4 w-4" />
                    Text
                 </Button>
            </div>

             {/* Hidden Video Element for Camera Capture */}
             <video ref={videoRef} className="w-0 h-0 absolute" autoPlay muted playsInline />

             {/* Camera Permission Alert */}
             { hasCameraPermission === false && (
                <Alert variant="destructive">
                  <Camera className="h-4 w-4" />
                  <AlertTitle>Camera Access Denied</AlertTitle>
                  <AlertDescription>
                    Please allow camera access in your browser settings to use the camera detection feature.
                  </AlertDescription>
                </Alert>
              )}


             {/* Text Input Area */}
             {showTextInput && (
              <div className="flex flex-col space-y-2">
                 <Textarea
                   placeholder="Describe how you're feeling..."
                   value={textToCheckIn}
                   onChange={(e) => setTextToCheckIn(e.target.value)}
                   disabled={isLoadingText}
                   rows={3}
                 />
                 <Button onClick={handleTextAnalysis} disabled={isLoading || !textToCheckIn.trim()}>
                    {isLoadingText ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                   Analyze Text
                 </Button>
              </div>
             )}


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
                    variant={emotion === emo ? "default" : "outline"}
                    className={cn(
                        `text-foreground border border-[hsl(var(--border))] hover:opacity-90 rounded-full px-4 py-2 transition-all`,
                        emotion === emo ? `bg-[hsl(var(--${emotionColorMap[emo] || 'primary'}))] text-primary-foreground border-transparent`
                                        : `bg-[hsl(var(--${emotionColorMap[emo] || 'muted'}))] hover:bg-[hsl(var(--${emotionColorMap[emo] || 'muted'}))/0.9]`
                    )}
                    onClick={() => handleManualSelection(emo)}
                    disabled={isLoading}
                  >
                    {emo}
                  </Button>
                ))}
                  <Button
                    key="unsure"
                    variant={emotion === "I'm not sure 🤔" ? "default" : "outline"}
                    className={cn(
                        `text-muted-foreground border border-[hsl(var(--border))] hover:opacity-90 rounded-full px-4 py-2 transition-all`,
                         emotion === "I'm not sure 🤔" ? `bg-[hsl(var(--muted))] text-primary-foreground border-transparent`
                                                      : `bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted))/0.9]`
                    )}
                    onClick={() => handleManualSelection("I'm not sure 🤔")}
                    disabled={isLoading}
                  >
                    I'm not sure 🤔
                  </Button>
                  <Button
                    key="browsing"
                    variant={emotion === "Just Browsing 😌" ? "default" : "outline"}
                     className={cn(
                        `text-secondary-foreground border border-[hsl(var(--border))] hover:opacity-90 rounded-full px-4 py-2 transition-all`,
                         emotion === "Just Browsing 😌" ? `bg-[hsl(var(--secondary))] text-primary-foreground border-transparent`
                                                       : `bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))/0.9]`
                    )}
                    onClick={() => handleManualSelection("Just Browsing 😌")}
                     disabled={isLoading}
                  >
                    Just Browsing 😌
                  </Button>
              </div>
            </div>

            {/* Selected Emotion & Actions */}
            {emotion && !isLoading && (
              <div className="mt-6 p-4 border rounded-md bg-accent/50 text-accent-foreground">
                <p className="text-lg">
                  You’re feeling: <span className="font-bold">{emotion}</span>
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    variant="default"
                    onClick={() => router.push("/circles")}
                    className="flex-1"
                  >
                    Join a Circle
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/ask")}
                     className="flex-1"
                  >
                    Ask a Question
                  </Button>
                   <Button
                    variant="outline"
                    onClick={() => router.push("/journal")}
                     className="flex-1"
                  >
                    <Pencil className="mr-2 h-4 w-4" /> Write Journal Entry
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

// Helper function to cn (classnames) - assuming it's in lib/utils
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
