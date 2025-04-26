
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
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { slugify } from "@/lib/utils"; // Import slugify

export default function CircleRoomsPage() {
  const router = useRouter();

  const circleRooms = [
     {
        emotion: "Lonely + Reflective",
        memberAvatars: [
          "https://picsum.photos/id/237/50/50",
          "https://picsum.photos/id/238/50/50",
          "https://picsum.photos/id/239/50/50",
        ],
        liveStatus: "Live",
        description: "A space for quiet contemplation and connection.",
      },
      {
        emotion: "Anxious + Overwhelmed",
        memberAvatars: [
          "https://picsum.photos/id/240/50/50",
          "https://picsum.photos/id/241/50/50",
          "https://picsum.photos/id/242/50/50",
        ],
        liveStatus: "Async",
        description: "Share coping strategies and find understanding.",
      },
      {
        emotion: "Happy + Grateful",
        memberAvatars: [
          "https://picsum.photos/id/243/50/50",
          "https://picsum.photos/id/244/50/50",
          "https://picsum.photos/id/245/50/50",
        ],
        liveStatus: "Live",
        description: "Celebrate joys and express gratitude together.",
      },
       {
         emotion: "Healing + Vulnerable",
         memberAvatars: [
           "https://picsum.photos/id/246/50/50",
           "https://picsum.photos/id/247/50/50",
         ],
         liveStatus: "Async",
         description: "A supportive environment for the healing journey.",
       },
       {
         emotion: "Curious + Hopeful",
         memberAvatars: [
           "https://picsum.photos/id/248/50/50",
           "https://picsum.photos/id/249/50/50",
           "https://picsum.photos/id/250/50/50",
            "https://picsum.photos/id/251/50/50",
         ],
         liveStatus: "Live",
         description: "Explore possibilities and share optimism.",
       },
       {
         emotion: "Drained + Confused",
         memberAvatars: [
           "https://picsum.photos/id/252/50/50",
           "https://picsum.photos/id/253/50/50",
         ],
         liveStatus: "Async",
         description: "Find clarity and recharge with others who understand.",
       },
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <h1 className="text-4xl font-bold mb-2">Circle Rooms</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Join a circle to share your thoughts and connect with others.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {circleRooms.map((room) => (
          <CircleRoomCard key={room.emotion} {...room} />
        ))}
      </div>
    </div>
  );
}

interface CircleRoomCardProps {
  emotion: string;
  description: string;
  memberAvatars: string[];
  liveStatus: string;
}

function CircleRoomCard({
  emotion,
  description,
  memberAvatars,
  liveStatus,
}: CircleRoomCardProps) {
  const router = useRouter();
  const circleId = slugify(emotion); // Generate a URL-friendly ID

  const handleJoin = () => {
    router.push(`/circles/${circleId}`);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{emotion}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4 flex-grow">
        <div className="flex -space-x-2 overflow-hidden">
          {memberAvatars.slice(0, 5).map((avatar, index) => ( // Limit avatars shown
            <Avatar key={index}>
              <AvatarImage src={avatar} alt="Member Avatar" />
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
          ))}
          {memberAvatars.length > 5 && (
             <Avatar>
                <AvatarFallback>+{memberAvatars.length - 5}</AvatarFallback>
             </Avatar>
          )}
        </div>
        <div className="mt-auto pt-4 flex justify-between items-center">
           <span className={`text-xs font-semibold px-2 py-1 rounded-full ${liveStatus === 'Live' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
             {liveStatus}
           </span>
          <Button onClick={handleJoin}>Join</Button>
        </div>
      </CardContent>
    </Card>
  );
}
