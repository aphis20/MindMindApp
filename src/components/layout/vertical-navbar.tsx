
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Circle,
  FileText,
  Heart,
  MessageSquare,
  User,
  PanelLeft,
  PanelRight,
  BookOpen, // Added for Resources
  LifeBuoy, // Added for Support
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: "/circles", icon: Circle, label: "Circles" },
  { href: "/ask", icon: MessageSquare, label: "Ask" },
  { href: "/journal", icon: FileText, label: "Journal" },
  { href: "/resources", icon: BookOpen, label: "Resources" }, // Added Resources
  { href: "/support", icon: LifeBuoy, label: "Support" }, // Updated Support Icon & Label
];

export function VerticalNavbar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const pathname = usePathname();
  const [userAvatar, setUserAvatar] = React.useState<string | null>(null);
    const supabase = createClient();

  React.useEffect(() => {
      const fetchUserAvatar = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user && user.email) {
              // Generate a consistent fallback avatar based on user's email
              const emailHash = hashCode(user.email);
              setUserAvatar(`https://picsum.photos/id/${emailHash}/50/50`); // Use hash for unique avatar
          }
      };
      fetchUserAvatar();
  }, [supabase.auth]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

    // Function to generate a hash code from a string (for avatar fallback)
    function hashCode(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
        }
        return Math.abs(hash) % 300; // To get a reasonable id for picsum
    }

  return (
    <TooltipProvider delayDuration={0}>
      <nav
        className={cn(
          "sticky top-0 h-screen flex flex-col justify-between bg-card text-card-foreground p-4 rounded-r-lg shadow-md transition-all duration-300 ease-in-out border-r",
          isCollapsed ? "w-16 items-center" : "w-64"
        )}
      >
        <div>
          {/* Logo/Brand */}
          <div className="flex items-center justify-center mb-8 h-10">
             <Link href="/" className="flex items-center gap-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary"
                >
                <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                    fill="currentColor"
                />
                <path
                    d="M12 6C9.24 6 7 8.24 7 11C7 13.76 9.24 16 12 16C14.76 16 17 13.76 17 11C17 8.24 14.76 6 12 6ZM12 14C10.34 14 9 12.66 9 11C9 9.34 10.34 8 12 8C13.66 8 15 9.34 15 11C15 12.66 13.66 14 12 14Z"
                    fill="currentColor"
                />
                <path
                    d="M18 11H20C20 14.31 17.31 17 14 17V19C18.42 19 22 15.42 22 11H18ZM4 11H6C6 7.69 8.69 5 12 5V3C7.58 3 4 6.58 4 11Z"
                    fill="currentColor"
                    opacity="0.6"
                 />
                </svg>
                {!isCollapsed && (
                  <span className="text-xl font-bold">
                     <span className="text-primary">Mind</span>Bridge
                  </span>
                )}
             </Link>
          </div>


          {/* Navigation Items */}
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={item.href} passHref>
                      <Button
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          isCollapsed ? "px-0 justify-center" : ""
                        )}
                        aria-label={item.label}
                      >
                        <item.icon
                          className={cn("h-5 w-5", isCollapsed ? "" : "mr-3")}
                        />
                        {!isCollapsed && <span>{item.label}</span>}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Section (Profile, Theme, Collapse) */}
        <div className={cn("mt-auto flex flex-col items-center space-y-4", isCollapsed ? "" : "items-stretch")}>
          {/* Profile Link */}
           <Tooltip>
            <TooltipTrigger asChild>
                <Link href="/profile" passHref>
                   <Button variant="ghost" className={cn("w-full justify-start", isCollapsed ? "px-0 justify-center" : "")} aria-label="Profile">
                     <Avatar className={cn("h-6 w-6", isCollapsed ? "" : "mr-3")}>
                                {userAvatar ? (
                                    <AvatarImage src={userAvatar} alt="User Avatar" />
                                ) : (
                                    <AvatarFallback>U</AvatarFallback>
                                )}
                     </Avatar>
                     {!isCollapsed && <span>Profile</span>}
                   </Button>
                </Link>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right"><p>Profile</p></TooltipContent>}
           </Tooltip>


          {/* Theme Toggle */}
          <div className={cn(isCollapsed ? "justify-center" : "")}>
             <ThemeToggle isCollapsed={isCollapsed} />
          </div>

          {/* Collapse Button */}
          <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    onClick={toggleCollapse}
                    className={cn("w-full justify-start", isCollapsed ? "px-0 justify-center" : "")}
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? (
                    <PanelRight className="h-5 w-5" />
                    ) : (
                    <>
                    <PanelLeft className="h-5 w-5 mr-3" />
                    <span>Collapse</span>
                    </>
                    )}
                </Button>
             </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right"><p>Expand</p></TooltipContent>}
              {!isCollapsed && <TooltipContent side="right"><p>Collapse</p></TooltipContent>}
           </Tooltip>
        </div>
      </nav>
    </TooltipProvider>
  );
}
