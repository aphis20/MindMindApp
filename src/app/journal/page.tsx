"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Calendar, Clock, Lock, Globe, Lightbulb, Heart, ChevronDown, ChevronUp, Edit2, Trash2, Filter, BarChart2, Search, Download, TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import { analyzeJournalEntrySentiment } from "@/ai/flows/analyze-journal-sentiment";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/firebase/auth-context";
import { journalService } from "@/lib/firebase/services";
import type { JournalEntry } from "@/lib/firebase/models";
import { format, differenceInDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function JournalPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [entry, setEntry] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [sentiment, setSentiment] = useState<{ sentiment: string; explanation?: string } | null>(null);
  const [pastEntries, setPastEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [filter, setFilter] = useState<"all" | "private" | "public">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "emotion" | "length">("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (user) {
      loadPastEntries();
    }
  }, [user]);

  const loadPastEntries = async () => {
    if (!user) return;
    try {
      const entries = await journalService.listByAuthor(user.uid);
      setPastEntries(entries);
    } catch (error) {
      console.error("Error loading past entries:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load past entries. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAiSuggestions = async (text: string, sentiment: string) => {
    try {
      const suggestions = [
        "Consider practicing mindfulness meditation to process these emotions.",
        "Try writing down three things you're grateful for today.",
        "Take a moment to breathe deeply and center yourself.",
        "Consider sharing your thoughts with a trusted friend or family member.",
        "Remember that it's okay to feel this way, and these feelings will pass.",
      ];
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not Signed In",
        description: "Please sign in to save journal entries.",
      });
      return;
    }

    if (!entry.trim()) {
      toast({
        variant: "destructive",
        title: "Entry is empty",
        description: "Please write something before saving.",
      });
      return;
    }

    setIsSaving(true);
    setSentiment(null);
    setAiSuggestions([]);

    try {
      const sentimentResult = await analyzeJournalEntrySentiment({ text: entry });
      setSentiment(sentimentResult);
      await generateAiSuggestions(entry, sentimentResult.sentiment);

      const newEntry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'> = {
        title: entry.slice(0, 50) + (entry.length > 50 ? '...' : ''),
        content: entry,
        authorId: user.uid,
        emotion: sentimentResult.sentiment,
        isPrivate,
      };

      await journalService.create(newEntry);
      await loadPastEntries();

      toast({
        title: "Entry Saved",
        description: "Your journal entry has been saved.",
      });

      setEntry("");
      setSentiment(null);

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

  const handleEdit = async (entry: JournalEntry) => {
    setEditingEntry(entry);
    setEntry(entry.content);
    setIsPrivate(entry.isPrivate);
  };

  const handleUpdate = async () => {
    if (!editingEntry || !user) return;

    setIsSaving(true);
    try {
      const sentimentResult = await analyzeJournalEntrySentiment({ text: entry });
      await generateAiSuggestions(entry, sentimentResult.sentiment);

      await journalService.update(editingEntry.id, {
        title: entry.slice(0, 50) + (entry.length > 50 ? '...' : ''),
        content: entry,
        emotion: sentimentResult.sentiment,
        isPrivate,
      });

      await loadPastEntries();
      setEditingEntry(null);
      setEntry("");
      setIsPrivate(false);

      toast({
        title: "Entry Updated",
        description: "Your journal entry has been updated.",
      });
    } catch (error) {
      console.error("Error updating entry:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update your journal entry. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      await journalService.delete(entryId);
      await loadPastEntries();
      toast({
        title: "Entry Deleted",
        description: "Your journal entry has been deleted.",
      });
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: "Could not delete your journal entry. Please try again.",
      });
    }
  };

  const toggleEntry = (entryId: string) => {
    setExpandedEntry(expandedEntry === entryId ? null : entryId);
  };

  const getFilteredAndSortedEntries = () => {
    let filtered = pastEntries;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.content.toLowerCase().includes(query) ||
        entry.title.toLowerCase().includes(query)
      );
    }
    
    // Apply privacy filter
    if (filter === "private") {
      filtered = filtered.filter(entry => entry.isPrivate);
    } else if (filter === "public") {
      filtered = filtered.filter(entry => entry.isPrivate === false);
    }

    // Apply sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "oldest":
          return a.createdAt.getTime() - b.createdAt.getTime();
        case "emotion":
          return (a.emotion || "").localeCompare(b.emotion || "");
        case "length":
          return b.content.length - a.content.length;
        default:
          return 0;
      }
    });
  };

  const getStats = () => {
    const totalEntries = pastEntries.length;
    const privateEntries = pastEntries.filter(entry => entry.isPrivate).length;
    const publicEntries = totalEntries - privateEntries;
    
    // Emotion distribution
    const emotions = pastEntries.reduce((acc, entry) => {
      if (entry.emotion) {
        acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Writing frequency
    const now = new Date();
    const lastWeek = pastEntries.filter(entry => 
      differenceInDays(now, entry.createdAt) <= 7
    ).length;
    const lastMonth = pastEntries.filter(entry => 
      differenceInDays(now, entry.createdAt) <= 30
    ).length;

    // Average entry length
    const totalLength = pastEntries.reduce((sum, entry) => sum + entry.content.length, 0);
    const avgLength = totalEntries > 0 ? Math.round(totalLength / totalEntries) : 0;

    // Weekly writing pattern
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const weeklyPattern = daysOfWeek.map(day => {
      const dayEntries = pastEntries.filter(entry => 
        format(entry.createdAt, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      ).length;
      return {
        day: format(day, 'EEE'),
        count: dayEntries
      };
    });

    return {
      totalEntries,
      privateEntries,
      publicEntries,
      emotions,
      lastWeek,
      lastMonth,
      avgLength,
      weeklyPattern
    };
  };

  const exportEntries = () => {
    const entries = getFilteredAndSortedEntries();
    const exportData = entries.map(entry => ({
      title: entry.title,
      content: entry.content,
      date: format(entry.createdAt, 'yyyy-MM-dd HH:mm:ss'),
      emotion: entry.emotion,
      isPrivate: entry.isPrivate
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-entries-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const stats = getStats();
  const filteredEntries = getFilteredAndSortedEntries();

  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <h1 className="text-4xl font-bold mb-6">Journal</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* New Entry Section */}
        <div className="space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{editingEntry ? "Edit Entry" : "New Entry"}</CardTitle>
              <CardDescription>
                {editingEntry ? "Edit your journal entry" : "Reflect on your thoughts and feelings."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Start writing..."
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                rows={10}
                disabled={isSaving}
                className="text-base"
              />
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={isPrivate ? "bg-primary/10" : ""}
                >
                  {isPrivate ? <Lock className="h-4 w-4 mr-2" /> : <Globe className="h-4 w-4 mr-2" />}
                  {isPrivate ? "Private" : "Public"}
                </Button>
                {editingEntry && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingEntry(null);
                      setEntry("");
                      setIsPrivate(false);
                    }}
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
              {sentiment && (
                <div className="text-sm text-muted-foreground p-3 rounded-lg bg-muted">
                  <div className="font-medium mb-1">Detected Sentiment: {sentiment.sentiment}</div>
                  {sentiment.explanation && (
                    <div className="text-xs">{sentiment.explanation}</div>
                  )}
                </div>
              )}
              <Button 
                onClick={editingEntry ? handleUpdate : handleSave} 
                disabled={isSaving || !entry.trim()}
                className="w-full"
              >
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {editingEntry ? "Update Entry" : "Save Entry"}
              </Button>
            </CardContent>
          </Card>

          {/* AI Suggestions Section */}
          {aiSuggestions.length > 0 && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  AI Suggestions
                </CardTitle>
                <CardDescription>Personalized suggestions based on your entry</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {aiSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Heart className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Past Entries Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Past Entries</h2>
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <BarChart2 className="h-4 w-4 mr-2" />
                    Stats
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Journal Statistics</DialogTitle>
                    <DialogDescription>Overview of your journaling activity</DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="emotions">Emotions</TabsTrigger>
                      <TabsTrigger value="frequency">Frequency</TabsTrigger>
                      <TabsTrigger value="patterns">Patterns</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{stats.totalEntries}</div>
                            <p className="text-sm text-muted-foreground">Total Entries</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{stats.privateEntries}</div>
                            <p className="text-sm text-muted-foreground">Private Entries</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{stats.lastWeek}</div>
                            <p className="text-sm text-muted-foreground">Entries This Week</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{stats.avgLength}</div>
                            <p className="text-sm text-muted-foreground">Avg. Entry Length</p>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    <TabsContent value="emotions" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Emotion Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {Object.entries(stats.emotions).map(([emotion, count]) => (
                              <div key={emotion} className="flex items-center justify-between">
                                <span className="text-sm">{emotion}</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-primary" 
                                      style={{ width: `${(count / stats.totalEntries) * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium">{count}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="frequency" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Writing Frequency</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Last 7 Days</span>
                              <span className="text-sm font-medium">{stats.lastWeek} entries</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Last 30 Days</span>
                              <span className="text-sm font-medium">{stats.lastMonth} entries</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Average per Week</span>
                              <span className="text-sm font-medium">
                                {Math.round((stats.lastMonth / 4) * 10) / 10} entries
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="patterns" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Weekly Writing Pattern</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {stats.weeklyPattern.map(({ day, count }) => (
                              <div key={day} className="flex items-center justify-between">
                                <span className="text-sm">{day}</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-primary" 
                                      style={{ width: `${(count / Math.max(...stats.weeklyPattern.map(p => p.count))) * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium">{count}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="sm"
                onClick={exportEntries}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Select value={filter} onValueChange={(value: "all" | "private" | "public") => setFilter(value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entries</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value: "newest" | "oldest" | "emotion" | "length") => setSortBy(value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="emotion">By Emotion</SelectItem>
                  <SelectItem value="length">By Length</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredEntries.length === 0 ? (
            <p className="text-muted-foreground">No entries found. Start writing your first journal entry!</p>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <Card key={entry.id} className="w-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{entry.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        {entry.isPrivate && <Lock className="h-4 w-4 text-muted-foreground" />}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(entry)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleEntry(entry.id)}
                          className="h-8 w-8 p-0"
                        >
                          {expandedEntry === entry.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(entry.createdAt, 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {format(entry.createdAt, 'h:mm a')}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className={`text-sm text-muted-foreground ${expandedEntry === entry.id ? '' : 'line-clamp-3'}`}>
                        {entry.content}
                      </p>
                      {entry.emotion && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">Emotion:</span>
                          <span className="text-muted-foreground">{entry.emotion}</span>
                        </div>
                      )}
                      {expandedEntry === entry.id && (
                        <div className="pt-4 border-t">
                          <h4 className="text-sm font-medium mb-2">AI Suggestions</h4>
                          <ul className="space-y-2">
                            {aiSuggestions.map((suggestion, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Heart className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
