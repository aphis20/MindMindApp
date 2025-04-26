"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default function AskQuestionPage() {
  const [question, setQuestion] = useState("");
  const [postAnonymously, setPostAnonymously] = useState(false);

  const handleSubmit = () => {
    // Show empathy guidelines and submit the question
    alert("Please remember to be empathetic and respectful in your questions.");
    console.log("Question submitted:", {
      question,
      postAnonymously,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 text-center">
        <h1 className="text-4xl font-bold">Ask a Question</h1>
        <p className="text-lg mt-3">Share your thoughts and seek support.</p>

        <Card className="w-full max-w-md mt-10">
          <CardHeader>
            <CardTitle>Compose Your Question</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Textarea
              placeholder="Type your question or prompt here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={postAnonymously}
                onCheckedChange={(checked) => setPostAnonymously(!!checked)}
              />
              <label htmlFor="anonymous" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Post Anonymously
              </label>
            </div>
            <Button onClick={handleSubmit}>Submit Question</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
