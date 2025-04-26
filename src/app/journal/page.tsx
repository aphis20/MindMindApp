
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { analyzeJournalEntrySentiment } from "@/ai/flows/analyze-journal-sentiment"; // Assume this exists
import { useToast } from "@/hooks/use-toast";

export default function JournalPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [entry, setEntry] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [sentiment, setSentiment] = useState<string | null>(null);

  const handleSave = async () => {
    if (!entry.trim()) {
      toast({
        variant: "destructive",
        title: "Entry is empty",
        description: "Please write something before saving.",
      });
      return;
    }

    setIsSaving(true);
    setSentiment(null); // Reset sentiment on new save

    try {
      // 1. Save the journal entry (e.g., to Firestore)
      // Replace with your actual saving logic
      console.log("Saving journal entry:", entry);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save delay

      // 2. Analyze sentiment using AI Flow
      const sentimentResult = await analyzeJournalEntrySentiment({ text: entry });
      setSentiment(sentimentResult.sentiment); // Assuming the flow returns { sentiment: string }

      toast({
        title: "Entry Saved",
        description: "Your journal entry has been saved.",
      });

      // Optional: Clear entry after save
      // setEntry("");

    } catch (error) {
      console.error("Error saving or analyzing journal entry:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save your journal entry. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <h1 className="text-4xl font-bold mb-6">Journal</h1>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>New Entry</CardTitle>
          <CardDescription>Reflect on your thoughts and feelings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Start writing..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            rows={10}
            disabled={isSaving}
            className="text-base" // Ensure good readability
          />
          {sentiment && (
            <p className="text-sm text-muted-foreground">
              Detected Sentiment: <span className="font-medium">{sentiment}</span>
            </p>
          )}
          <Button onClick={handleSave} disabled={isSaving || !entry.trim()}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Entry
          </Button>
        </CardContent>
      </Card>

      {/* Add sections for previous entries, streak display etc. later */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Past Entries</h2>
        {/* Placeholder for listing past entries */}
        <p className="text-muted-foreground">Your previous journal entries will appear here.</p>
      </div>
    </div>
  );
}
