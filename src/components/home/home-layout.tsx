"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Circle,
  FileText,
  Heart,
  LayoutDashboard,
  MessageSquare,
  Quote,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const emotions = [
  "Joy",
  "Sadness",
  "Grief",
  "Hope",
  "Anxiety",
  "Gratitude",
  "Reflection",
  "Excitement",
];

export function HomeLayout({ emotion }: { emotion: string }) {
  return (
    <div className="container mx-auto py-10">
      <HeroBox emotion={emotion} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <CirclesYouMightLike />
        <RecentQAThreads emotion={emotion} />
        <PersonalJournalStats />
      </div>
    </div>
  );
}

function HeroBox({ emotion }: { emotion: string }) {
  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader>
        <CardTitle>You’re feeling: {emotion}</CardTitle>
      </CardHeader>
      <CardContent className="flex space-x-4">
        <Button variant="secondary">Join a Circle</Button>
        <Button variant="secondary">Ask a Support Question</Button>
        <Button variant="secondary">Write a Journal Entry</Button>
      </CardContent>
    </Card>
  );
}

function CirclesYouMightLike() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Circles You Might Like</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {emotions.slice(0, 3).map((emotion) => (
            <li key={emotion} className="flex items-center space-x-3">
              <Circle className="h-4 w-4" />
              <span>{emotion} Circle</span>
              <Button size="sm" className="ml-auto">
                Join
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function RecentQAThreads({ emotion }: { emotion: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Q&amp;A Threads in Your Emotion Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li className="flex items-start space-x-3">
            <MessageSquare className="h-4 w-4 mt-1" />
            <div>
              <p className="text-sm font-medium">
                How do I cope with feeling overwhelmed?
              </p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <MessageSquare className="h-4 w-4 mt-1" />
            <div>
              <p className="text-sm font-medium">
                Tips for managing anxiety during stressful times?
              </p>
              <p className="text-xs text-muted-foreground">5 hours ago</p>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

function PersonalJournalStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Journal Streak Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <FileText className="h-6 w-6" />
          <div>
            <p className="text-2xl font-bold">7 Days</p>
            <p className="text-sm text-muted-foreground">Current Streak</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
