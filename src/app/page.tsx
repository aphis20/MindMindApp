"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import { detectEmotion as detectFaceEmotion } from "@/services/affectiva"; // Renamed for clarity
import { detectVoiceEmotion } from "@/services/deepgram";
import { analyzeTextEmotion } from "@/ai/flows/analyze-text-emotion"; // Import new AI flow
import { useRouter } from "next/navigation";
import { Loader2, Type, Camera, Mic, Pencil, X } from "lucide-react"; // Added Pencil icon and X icon
import { toast } from "@/hooks/use-toast"; // For user feedback
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components
import AuthButton from "@/components/auth/auth-button"; // Import AuthButton
import { cn } from "@/lib/utils"; // Assuming this is imported from lib/utils

const emotionColorMap = {
  "Happy 😊": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  "Sad 😢": "bg-blue-100 text-blue-800 hover:bg-blue-200",
  "Angry 😠": "bg-red-100 text-red-800 hover:bg-red-200",
  "Anxious 😰": "bg-purple-100 text-purple-800 hover:bg-purple-200",
  "Excited 🎉": "bg-green-100 text-green-800 hover:bg-green-200",
  "Tired 😴": "bg-gray-100 text-gray-800 hover:bg-gray-200",
  "Stressed 😫": "bg-orange-100 text-orange-800 hover:bg-orange-200",
  "Calm 😌": "bg-teal-100 text-teal-800 hover:bg-teal-200",
  "I'm not sure 🤔": "bg-slate-100 text-slate-800 hover:bg-slate-200",
}

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
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Enhanced camera permission check
  const checkCameraPermission = async () => {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || !navigator.mediaDevices) {
        console.log('MediaDevices not supported');
        return false;
      }

      // Try to get camera permissions
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Stop the stream immediately after getting permission
      stream.getTracks().forEach(track => track.stop());
      
      return true;
    } catch (error) {
      console.error('Camera permission error:', error);
      return false;
    }
  };

  // Enhanced camera detection
  const handleCameraDetection = async () => {
    try {
      setIsLoadingCamera(true);
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || !navigator.mediaDevices) {
        toast({
          variant: "destructive",
          title: "Camera Not Supported",
          description: "Your browser doesn't support camera access. Please try a different browser.",
        });
        return;
      }

      // Check camera permission
      const hasPermission = await checkCameraPermission();
      if (!hasPermission) {
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please allow camera access in your browser settings to use this feature.",
        });
        setHasCameraPermission(false);
        return;
      }

      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        }
      });

      // Create video element
      const video = document.createElement('video');
      video.srcObject = stream;
      video.setAttribute('playsinline', ''); // Required for iOS
      video.setAttribute('autoplay', '');
      
      // Wait for video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve(null);
        };
      });

      // Create canvas for capturing frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Could not get canvas context');
      }

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/jpeg', 0.8);
      });

      // Clean up
      stream.getTracks().forEach(track => track.stop());
      video.remove();
      canvas.remove();

      // Simulate emotion detection (replace with actual API call)
      const emotions = {
        joy: Math.random(),
        sadness: Math.random(),
        anger: Math.random(),
      };

      const maxEmotion = Object.entries(emotions).reduce((a, b) => 
        a[1] > b[1] ? a : b
      );

      const detectedEmotion = maxEmotion[1] > 0.5 
        ? trendingEmotions[Math.floor(Math.random() * trendingEmotions.length)]
        : "I'm not sure 🤔";

      setEmotion(detectedEmotion);
      toast({
        title: "Emotion Detected",
        description: `Detected via Camera: ${detectedEmotion}`,
      });

    } catch (error) {
      console.error('Camera detection error:', error);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Could not access camera. Please check your browser settings and try again.",
      });
    } finally {
      setIsLoadingCamera(false);
    }
  };

  // Check camera permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      const hasPermission = await checkCameraPermission();
      setHasCameraPermission(hasPermission);
    };
    checkPermission();
  }, []);

  // Voice recording functions
  const startRecording = async () => {
    try {
      // Ensure we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('This feature is only available in the browser');
      }

      // Check if mediaDevices is supported
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Your browser does not support audio recording');
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      // Check if MediaRecorder is supported
      if (!window.MediaRecorder) {
        throw new Error('Your browser does not support MediaRecorder');
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudioData(audioBlob);
        
        // Cleanup
        stream.getTracks().forEach(track => track.stop());
        audioChunksRef.current = [];
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        variant: "destructive",
        title: "Microphone Error",
        description: error instanceof Error 
          ? error.message 
          : "Could not access microphone. Please check your browser settings.",
      });
      setIsRecording(false);
    }
  };

  // Add useEffect for checking media device support
  useEffect(() => {
    const checkMediaSupport = () => {
      if (typeof window !== 'undefined') {
        const hasMediaDevices = !!navigator.mediaDevices?.getUserMedia;
        const hasMediaRecorder = !!window.MediaRecorder;
        return hasMediaDevices && hasMediaRecorder;
      }
      return false;
    };

    const isSupported = checkMediaSupport();
    if (!isSupported) {
      toast({
        variant: "destructive",
        title: "Browser Not Supported",
        description: "Your browser does not support audio recording. Please try a different browser.",
      });
    }
  }, []);

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudioData = async (audioBlob: Blob) => {
    try {
      setIsLoadingVoice(true);
      
      // Convert Blob to ArrayBuffer
      const arrayBuffer = await audioBlob.arrayBuffer();
      
      // Ensure we have valid audio data
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error('No audio data recorded');
      }
      
      // Call Deepgram API for emotion detection
      const emotionData = await detectVoiceEmotion(arrayBuffer);
      
      // Map the emotion data to our emotion categories
      let detectedEmotion = "I'm not sure 🤔";
      
      if (emotionData.joy > 0.5) detectedEmotion = "Joyful 😊";
      else if (emotionData.sadness > 0.5) detectedEmotion = "Sad 😔";
      else if (emotionData.anger > 0.5) detectedEmotion = "Angry 😠";
      else if (emotionData.fear > 0.5) detectedEmotion = "Anxious 😰";
      else if (emotionData.surprise > 0.5) detectedEmotion = "Excited 🤩";
      
      setEmotion(detectedEmotion);
      toast({
        title: "Emotion Detected",
        description: `Detected via Voice: ${detectedEmotion}`,
      });
    } catch (error) {
      console.error("Voice processing error:", error);
      toast({
        variant: "destructive",
        title: "Processing Failed",
        description: error instanceof Error 
          ? error.message 
          : "Could not process voice data. Please try again.",
      });
      setEmotion("I'm not sure 🤔");
    } finally {
      setIsLoadingVoice(false);
    }
  };

  const handleVoiceDetection = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
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
    <div className="modern-bg min-h-screen">
      <main className="relative flex flex-col items-center justify-center w-full flex-1 px-4 py-8 text-center">
        {/* Logo and Auth Button Row */}
        <div className="w-full max-w-lg flex justify-between items-center mb-8">
          {/* Logo */}
          <div className="logo-container flex items-center gap-2 text-4xl font-bold logo-float">
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
          {/* Auth Button */}
          <AuthButton />
        </div>

        <p className="text-lg mt-3 text-muted-foreground max-w-prose backdrop-blur-sm bg-background/30 px-6 py-3 rounded-full border border-border/10">
          A safe, AI-powered emotional support network. How are you feeling today?
        </p>

        <Card className="glass-card w-full max-w-lg mt-10 backdrop-blur-sm border-primary/20">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Check In
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              How are you feeling? Use camera, mic, text, or select manually.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-6">
            {/* Detection Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="button-modern flex flex-col items-center justify-center gap-2 h-24 hover-lift bg-background/50 border-primary/20 hover:border-primary/40"
                onClick={handleCameraDetection}
                disabled={isLoadingCamera}
              >
                {isLoadingCamera ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Camera className="h-6 w-6" />
                )}
                <span className="text-sm">
                  {hasCameraPermission === false
                    ? "Camera Not Available"
                    : isLoadingCamera
                    ? "Detecting..."
                    : "Detect via Camera"}
                </span>
              </Button>
              <Button
                variant="outline"
                className="button-modern flex flex-col items-center justify-center gap-2 h-24 hover-lift bg-background/50 border-primary/20 hover:border-primary/40"
                onClick={handleVoiceDetection}
                disabled={isLoadingVoice}
              >
                {isLoadingVoice ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Mic className={cn("h-6 w-6", isRecording && "text-red-500 animate-pulse")} />
                )}
                <span className="text-sm">
                  {isLoadingVoice 
                    ? "Processing..." 
                    : isRecording 
                    ? "Stop Recording" 
                    : "Detect via Voice"}
                </span>
              </Button>
              <Button
                variant="outline"
                className="button-modern flex flex-col items-center justify-center gap-2 h-24 hover-lift bg-background/50 border-primary/20 hover:border-primary/40"
                onClick={() => setShowTextInput(true)}
                disabled={isLoadingText}
              >
                {isLoadingText ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Type className="h-6 w-6" />
                )}
                <span className="text-sm">Type How You Feel</span>
              </Button>
            </div>

            {showTextInput && (
              <div className="space-y-4">
                <Textarea
                  placeholder="How are you feeling? What's on your mind?"
                  value={textToCheckIn}
                  onChange={(e) => setTextToCheckIn(e.target.value)}
                  className="modern-input min-h-[100px] bg-background/50 border-primary/20 focus:border-primary/40"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className="button-modern bg-background/50 border-primary/20 hover:border-primary/40"
                    onClick={() => {
                      setShowTextInput(false);
                      setTextToCheckIn("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="button-modern bg-primary hover:bg-primary/90"
                    onClick={handleTextAnalysis}
                    disabled={isLoadingText || !textToCheckIn.trim()}
                  >
                    {isLoadingText ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze"
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background/40 backdrop-blur-sm px-2 text-muted-foreground">
                  Or select manually
                </span>
              </div>
            </div>

            {/* Manual Selection */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(emotionColorMap).map(([emotion, colorClass]) => (
                <Button
                  key={emotion}
                  variant="outline"
                  className={cn(
                    "button-modern h-auto py-3 px-4 text-sm transition-all duration-200",
                    emotion === emotion ? "ring-2 ring-primary scale-105" : "",
                    colorClass
                  )}
                  onClick={() => handleManualSelection(emotion)}
                >
                  {emotion}
                </Button>
              ))}
            </div>

            {/* Selected Emotion Display */}
            {emotion && (
              <div className="mt-6 p-4 rounded-lg bg-background/50 border border-primary/20 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-primary">Current Emotion</h3>
                    <p className="text-sm text-muted-foreground">
                      {emotion}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEmotion(null)}
                    className="text-muted-foreground hover:text-foreground hover:bg-background/50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Call to Action Section */}
        {emotion && (
          <Card className="glass-card w-full max-w-lg mt-6 backdrop-blur-sm border-primary/20">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                What would you like to do?
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Here are some suggestions based on how you're feeling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="button-modern flex flex-col items-center justify-center gap-2 h-24 hover-lift bg-background/50 border-primary/20 hover:border-primary/40"
                  onClick={() => router.push('/journal')}
                >
                  <Pencil className="h-6 w-6" />
                  <span className="text-sm">Write in Journal</span>
                </Button>
                <Button
                  variant="outline"
                  className="button-modern flex flex-col items-center justify-center gap-2 h-24 hover-lift bg-background/50 border-primary/20 hover:border-primary/40"
                  onClick={() => router.push('/meditate')}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                      fill="currentColor"
                    />
                    <path
                      d="M12 6C9.24 6 7 8.24 7 11C7 13.76 9.24 16 12 16C14.76 16 17 13.76 17 11C17 8.24 14.76 6 12 6ZM12 14C10.34 14 9 12.66 9 11C9 9.34 10.34 8 12 8C13.66 8 15 9.34 15 11C15 12.66 13.66 14 12 14Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="text-sm">Start Meditation</span>
                </Button>
              </div>

              {/* Emotion-specific suggestions */}
              <div className="mt-4 p-4 rounded-lg bg-background/50 border border-primary/20">
                <h3 className="font-medium text-primary mb-2">Suggested Activities</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {emotion.includes("Happy") || emotion.includes("Excited") ? (
                    <>
                      <li>• Share your joy with others</li>
                      <li>• Plan something fun for later</li>
                      <li>• Document this moment in your journal</li>
                    </>
                  ) : emotion.includes("Sad") || emotion.includes("Anxious") ? (
                    <>
                      <li>• Try a guided meditation</li>
                      <li>• Practice deep breathing exercises</li>
                      <li>• Write about your feelings</li>
                    </>
                  ) : emotion.includes("Angry") || emotion.includes("Stressed") ? (
                    <>
                      <li>• Take a short walk</li>
                      <li>• Try progressive muscle relaxation</li>
                      <li>• Listen to calming music</li>
                    </>
                  ) : emotion.includes("Tired") ? (
                    <>
                      <li>• Take a short rest</li>
                      <li>• Do some gentle stretching</li>
                      <li>• Stay hydrated</li>
                    </>
                  ) : (
                    <>
                      <li>• Take a moment to breathe</li>
                      <li>• Check in with yourself</li>
                      <li>• Try a quick mindfulness exercise</li>
                    </>
                  )}
                </ul>
              </div>

              <Button
                variant="outline"
                className="w-full button-modern bg-background/50 border-primary/20 hover:border-primary/40"
                onClick={() => router.push('/resources')}
              >
                View More Resources
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

// Add these styles to your globals.css or create a new CSS module
const styles = `
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.bg-grid-white {
  background-image: linear-gradient(to right, rgb(255 255 255 / 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(255 255 255 / 0.1) 1px, transparent 1px);
}
`;
