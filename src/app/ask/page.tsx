"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { rephraseToxicContent } from "@/ai/flows/rephrase-toxic-content";

export default function AskQuestionPage() {
  const [question, setQuestion] = useState("");
  const [postAnonymously, setPostAnonymously] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    // AI Moderation Layer: Rephrase toxic or harmful content
    const rephrasedQuestion = await rephraseToxicContent({ text: question });
    if (rephrasedQuestion?.rephrasedText) {
      // Use the rephrased question for posting
      alert(
        "Please remember to be empathetic and respectful in your questions."
      );
      console.log("Question submitted:", {
        question: rephrasedQuestion.rephrasedText,
        postAnonymously,
      });
    } else {
      // Handle the case where rephrasing fails or returns empty
      alert(
        "Question could not be submitted. Please try again with different wording."
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
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
              <label
                htmlFor="anonymous"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
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
