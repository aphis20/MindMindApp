"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Play, Pause, ArrowLeft } from 'lucide-react';
import { useState, useRef } from 'react';

export default function MeditatePage() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-teal-100 to-green-100 py-12 px-4">
      <Card className="w-full max-w-md glass-card backdrop-blur-md border-primary/20">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Guided Meditation
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Take a moment to relax and breathe. Press play to begin a short guided meditation.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <audio
            ref={audioRef}
            src="https://cdn.pixabay.com/audio/2022/10/16/audio_12b5fae3b2.mp3"
            onEnded={() => setIsPlaying(false)}
            preload="auto"
          />
          <Button
            onClick={handlePlayPause}
            className="w-32 h-12 flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-lg rounded-full shadow-lg"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <div className="mt-4 text-center text-muted-foreground text-sm">
            Find a comfortable position, close your eyes, and focus on your breath.
          </div>
          <Button
            variant="outline"
            className="mt-6 w-full flex items-center justify-center gap-2"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 