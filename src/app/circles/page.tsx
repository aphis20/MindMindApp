"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function CircleRoomsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 text-center">
        <h1 className="text-4xl font-bold">Circle Rooms</h1>
        <p className="text-lg mt-3">Join a circle to share your thoughts.</p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <CircleRoomCard
            emotion="Lonely + Reflective"
            memberAvatars={[
              "https://picsum.photos/id/237/50/50",
              "https://picsum.photos/id/238/50/50",
              "https://picsum.photos/id/239/50/50",
            ]}
            liveStatus="Live"
          />
          <CircleRoomCard
            emotion="Anxious + Overwhelmed"
            memberAvatars={[
              "https://picsum.photos/id/240/50/50",
              "https://picsum.photos/id/241/50/50",
              "https://picsum.photos/id/242/50/50",
            ]}
            liveStatus="Async"
          />
          <CircleRoomCard
            emotion="Happy + Grateful"
            memberAvatars={[
              "https://picsum.photos/id/243/50/50",
              "https://picsum.photos/id/244/50/50",
              "https://picsum.photos/id/245/50/50",
            ]}
            liveStatus="Live"
          />
        </div>
      </main>
    </div>
  );
}

interface CircleRoomCardProps {
  emotion: string;
  memberAvatars: string[];
  liveStatus: string;
}

function CircleRoomCard({
  emotion,
  memberAvatars,
  liveStatus,
}: CircleRoomCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{emotion}</CardTitle>
        <CardDescription>Share your thoughts and seek support.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <div className="flex -space-x-2 overflow-hidden">
          {memberAvatars.map((avatar, index) => (
            <Avatar key={index}>
              <AvatarImage src={avatar} alt="Member Avatar" />
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <Button>Join</Button>
        <p className="text-sm text-muted-foreground">{liveStatus}</p>
      </CardContent>
    </Card>
  );
}
