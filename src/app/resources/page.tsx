
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";

// Example resource data (replace with actual data source)
const resources = [
  {
    category: "Understanding Emotions",
    items: [
      { title: "What is Emotional Intelligence?", url: "#", description: "Learn about recognizing and managing emotions." },
      { title: "Dealing with Anxiety: Practical Tips", url: "#", description: "Strategies to cope with anxious feelings." },
      { title: "The Science of Happiness", url: "#", description: "Exploring what contributes to well-being." },
    ],
  },
  {
    category: "Mindfulness & Meditation",
    items: [
      { title: "Beginner's Guide to Mindfulness", url: "#", description: "Simple practices to stay present." },
      { title: "Guided Meditation for Stress Relief (5 min)", url: "#", description: "A short audio meditation." },
    ],
  },
  {
    category: "Seeking Professional Help",
    items: [
      { title: "Finding a Therapist: What to Look For", url: "#", description: "Tips on selecting the right mental health professional." },
      { title: "National Suicide Prevention Lifeline", url: "https://988lifeline.org/", description: "Immediate support available 24/7.", external: true },
      { title: "Crisis Text Line", url: "https://www.crisistextline.org/", description: "Text HOME to 741741 for crisis support.", external: true },
    ],
  },
];

export default function ResourcesPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold">Resources</h1>
      </div>
      <p className="text-lg text-muted-foreground mb-8">
        Explore articles, tools, and external links for mental wellness and emotional support.
      </p>

      <div className="space-y-8">
        {resources.map((categoryData) => (
          <Card key={categoryData.category}>
            <CardHeader>
              <CardTitle>{categoryData.category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryData.items.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  target={item.external ? "_blank" : "_self"}
                  rel={item.external ? "noopener noreferrer" : ""}
                  className="block p-4 rounded-md border hover:bg-accent transition-colors group"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    {item.external && (
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </Link>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
