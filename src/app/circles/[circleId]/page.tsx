'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';
import {ArrowLeft, MoreVertical, Flag} from 'lucide-react';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import {useState} from 'react';
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from '@/components/ui/alert-dialog';
import {toast} from '@/hooks/use-toast';

export default function CircleRoomPage({params}: { params: { circleId: string } }) {
  const router = useRouter();
  const circleId = params.circleId;
  const [isModerator, setIsModerator] = useState(true); // Placeholder for checking if user is a moderator

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4"/>
        Back
      </Button>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 text-center">
        <h1 className="text-4xl font-bold">Circle Room: {circleId}</h1>
        <p className="text-lg mt-3">Share your thoughts and seek support.</p>

        <Card className="w-full max-w-md mt-10">
          <CardHeader>
            <CardTitle>Emotion Theme: {circleId}</CardTitle>
            <CardDescription>Share your thoughts and seek support.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <div className="flex -space-x-2 overflow-hidden">
              <Avatar>
                <AvatarImage src="https://picsum.photos/id/237/50/50" alt="Member Avatar"/>
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="https://picsum.photos/id/238/50/50" alt="Member Avatar"/>
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="https://picsum.photos/id/239/50/50" alt="Member Avatar"/>
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
            </div>
            <Button>Join</Button>
            <p className="text-sm text-muted-foreground">Live</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="ml-auto">
                  <MoreVertical className="h-4 w-4"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isModerator && (
                  <DropdownMenuItem>
                    Moderate Circle
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => {
                  // Implement reporting logic here
                  toast({
                    title: "Reported",
                    description: "You have reported this circle.",
                  });
                }}>
                  <Flag className="mr-2 h-4 w-4"/>
                  Report Circle
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
