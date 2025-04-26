
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, MoreVertical, Flag, Send } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { unslugify } from '@/lib/utils';

// Placeholder message type
interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: Date;
}

// Placeholder user data (replace with actual auth context)
const currentUser = {
  id: 'user_123',
  name: 'You',
  avatar: 'https://picsum.photos/id/99/50/50',
};

export default function CircleRoomPage({ params }: { params: { circleId: string } }) {
  const router = useRouter();
  const circleId = params.circleId;
  const emotionTheme = unslugify(circleId); // Convert slug back to readable theme
  const [isModerator, setIsModerator] = useState(false); // Placeholder
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Simulate loading initial messages
  useEffect(() => {
    // Replace with actual data fetching
    const initialMessages: Message[] = [
      { id: '1', sender: { id: 'user_abc', name: 'Alex', avatar: 'https://picsum.photos/id/237/50/50' }, text: `Feeling quite ${emotionTheme.toLowerCase()} today too. Glad this space exists.`, timestamp: new Date(Date.now() - 1000 * 60 * 5) },
      { id: '2', sender: { id: 'user_def', name: 'Maria', avatar: 'https://picsum.photos/id/238/50/50' }, text: `It's helpful to know others feel this way sometimes.`, timestamp: new Date(Date.now() - 1000 * 60 * 2) },
       { id: '3', sender: currentUser, text: `Just joined. Trying to navigate these feelings.`, timestamp: new Date(Date.now() - 1000 * 30) },
    ];
    setMessages(initialMessages);

    // Fetch moderator status (placeholder)
    // setIsModerator(checkIfUserIsModerator(currentUser.id, circleId));
    setIsModerator(Math.random() > 0.8); // Randomly assign for demo

  }, [emotionTheme]);


   // Scroll to bottom when new messages arrive
   useEffect(() => {
     if (scrollAreaRef.current) {
        const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollElement) {
            scrollElement.scrollTop = scrollElement.scrollHeight;
        }
     }
   }, [messages]);


  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messageToSend: Message = {
      id: String(Date.now()), // Simple unique ID for demo
      sender: currentUser,
      text: newMessage,
      timestamp: new Date(),
    };

    // Simulate sending message (replace with actual API call)
    setMessages(prevMessages => [...prevMessages, messageToSend]);
    setNewMessage('');

     // Scroll to bottom after sending
     setTimeout(() => {
         if (scrollAreaRef.current) {
             const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
             if (scrollElement) {
                 scrollElement.scrollTop = scrollElement.scrollHeight;
             }
         }
     }, 0);
  };

   const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent newline on Enter
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <h1 className="text-xl font-semibold">{emotionTheme} Circle</h1>
          <p className="text-sm text-muted-foreground">Connect & Share</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isModerator && (
              <DropdownMenuItem>
                Moderate Circle
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => {
              toast({
                title: "Reported",
                description: "This circle has been reported for review.",
              });
            }}>
              <Flag className="mr-2 h-4 w-4" />
              Report Circle
            </DropdownMenuItem>
             <DropdownMenuItem onClick={() => {
                  // Add leave logic here
                  toast({ title: "Left Circle", description: `You have left the ${emotionTheme} circle.` });
                  router.push('/circles'); // Redirect back to the list
              }}>
                 Leave Circle
             </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Message Feed */}
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender.id === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender.id !== currentUser.id && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={msg.sender.avatar} alt={msg.sender.name} />
                  <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.sender.id === currentUser.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                 {msg.sender.id !== currentUser.id && (
                    <p className="text-xs font-semibold mb-1">{msg.sender.name}</p>
                 )}
                <p className="text-sm">{msg.text}</p>
                 <p className="text-xs text-right opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </p>
              </div>
               {msg.sender.id === currentUser.id && (
                 <Avatar className="h-8 w-8">
                   <AvatarImage src={msg.sender.avatar} alt={msg.sender.name} />
                   <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
                 </Avatar>
               )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input Area */}
      <footer className="p-4 border-t sticky bottom-0 bg-background">
        <div className="flex items-center gap-2">
          <Textarea
            placeholder="Share your thoughts... (Shift+Enter for newline)"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
            className="flex-grow resize-none min-h-[40px]" // Adjust styling
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
          {/* Add buttons for voice/image input later */}
        </div>
      </footer>
    </div>
  );
}
