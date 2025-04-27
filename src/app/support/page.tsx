
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, LifeBuoy, Mail, HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Force dynamic rendering for this page to avoid static export issues during build
export const dynamic = 'force-dynamic';

// Example FAQ data
const faqs = [
  {
    question: "How does the emotion detection work?",
    answer: "We use advanced AI models to analyze facial expressions, voice tone, and text input to suggest an emotional state. This is an estimation and you can always select your emotion manually.",
  },
  {
    question: "Is my data private?",
    answer: "Yes, protecting your privacy is our top priority. All personal data and journal entries are encrypted. We adhere to strict data privacy policies. Please review our Privacy Policy for full details.",
  },
  {
    question: "What are Circles?",
    answer: "Circles are small, moderated group chats based on shared emotions or experiences. They can be live (real-time) or asynchronous (post when you can). They offer a space for peer support.",
  },
  {
    question: "How can I report inappropriate content?",
    answer: "In Circles or Q&A threads, look for a 'Report' option (often under a menu or three-dot icon). For general concerns, please use the contact methods listed on this page.",
  },
];

export default function SupportPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <div className="flex items-center gap-2 mb-6">
        <LifeBuoy className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold">Support</h1>
      </div>
      <p className="text-lg text-muted-foreground mb-8">
        Find answers to common questions or get in touch with our support team.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" /> Contact Us
            </CardTitle>
            <CardDescription>Reach out for help or feedback.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>If you need assistance or have suggestions, please email us:</p>
            <a
              href="mailto:support@mindbridge.app" // Replace with actual support email
              className="text-primary font-medium hover:underline"
            >
              support@mindbridge.app
            </a>
            <p className="text-sm text-muted-foreground">
              We aim to respond within 24-48 hours during business days.
            </p>
          </CardContent>
        </Card>

        {/* FAQ Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" /> Frequently Asked Questions
            </CardTitle>
            <CardDescription>Find quick answers below.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
