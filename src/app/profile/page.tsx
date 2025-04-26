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
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const data = [
  { name: "Day 1", uv: 400, pv: 2400, amt: 2400 },
  { name: "Day 2", uv: 300, pv: 1398, amt: 2210 },
  { name: "Day 3", uv: 200, pv: 9800, amt: 2290 },
  { name: "Day 4", uv: 278, pv: 3908, amt: 2000 },
  { name: "Day 5", uv: 189, pv: 4800, amt: 2181 },
  { name: "Day 6", uv: 239, pv: 3800, amt: 2500 },
  { name: "Day 7", uv: 349, pv: 4300, amt: 2100 },
];

export default function UserProfilePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 text-center">
        <h1 className="text-4xl font-bold">Your Profile</h1>

        <Card className="w-full max-w-3xl mt-10">
          <CardHeader>
            <CardTitle>User Summary</CardTitle>
            <CardDescription>
              View your emotional timeline and impact.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="https://picsum.photos/id/88/50/50" alt="User Avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold">User894732</p>
              </div>
            </div>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="pv" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <p className="text-lg">
              You’ve helped 57 people feel seen.
            </p>
          </CardContent>
        </Card>

        <Card className="w-full max-w-3xl mt-10">
          <CardContent>
            <Tabs defaultvalue="reflections" className="w-full">
              <TabsList>
                <TabsTrigger value="reflections">Reflections</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="circles">Circles</TabsTrigger>
                <TabsTrigger value="streak">Streak</TabsTrigger>
              </TabsList>
              <TabsContent value="reflections">
                <p>Your reflections will appear here.</p>
              </TabsContent>
              <TabsContent value="questions">
                <p>Your questions will appear here.</p>
              </TabsContent>
              <TabsContent value="circles">
                <p>Your circle activity will appear here.</p>
              </TabsContent>
              <TabsContent value="streak">
                <p>Your journal streak will appear here.</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
