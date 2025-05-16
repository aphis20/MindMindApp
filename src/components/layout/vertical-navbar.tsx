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
  BookOpen,
  LifeBuoy,
  Bell,
  Settings,
  Lock,
  Star,
  Users,
  History,
  Award,
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
import { useAuth } from "@/lib/firebase/auth-context";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const navItems = [
  { href: "/circles", icon: Circle, label: "Circles", badge: "3" },
  { href: "/ask", icon: MessageSquare, label: "Ask", badge: "New" },
  { href: "/journal", icon: FileText, label: "Journal" },
  { href: "/resources", icon: BookOpen, label: "Resources" },
  { href: "/support", icon: LifeBuoy, label: "Support" },
];

const loginBenefits = [
  {
    icon: Star,
    title: "Personalized Experience",
    description: "Get tailored content and recommendations based on your interests",
  },
  {
    icon: Users,
    title: "Join Support Circles",
    description: "Connect with others in similar situations and share experiences",
  },
  {
    icon: History,
    title: "Track Progress",
    description: "Monitor your emotional well-being journey over time",
  },
  {
    icon: Award,
    title: "Earn Achievements",
    description: "Unlock badges and rewards as you engage with the community",
  },
];

export function VerticalNavbar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
    }
    return Math.abs(hash) % 300;
  }

  const userAvatar = user?.photoURL || (user?.email ? `https://picsum.photos/id/${hashCode(user.email)}/50/50` : null);

  return (
    <TooltipProvider delayDuration={0}>
      <nav
        className={cn(
          "sticky top-0 h-screen flex flex-col justify-between bg-background/60 backdrop-blur-xl text-card-foreground p-4 rounded-r-lg shadow-lg transition-all duration-300 ease-in-out border-r border-border/10",
          isCollapsed ? "w-16 items-center" : "w-64"
        )}
      >
        <div>
          {/* Logo/Brand */}
          <div className="flex items-center justify-center mb-8 h-10">
            <Link href="/" className="flex items-center gap-2 group">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary transition-transform duration-300 group-hover:scale-110"
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
                <span className="text-xl font-bold transition-opacity duration-300">
                  <span className="text-primary">Mind</span>Bridge
                </span>
              )}
            </Link>
          </div>

          {!user && !isCollapsed && (
            <Card className="p-4 mb-6 bg-background/40 backdrop-blur-sm border-primary/20">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Lock className="h-5 w-5" />
                  <h3 className="font-semibold">Login to Unlock</h3>
                </div>
                <div className="space-y-3">
                  {loginBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <benefit.icon className="h-4 w-4 mt-1 text-primary/60" />
                      <div>
                        <p className="text-sm font-medium">{benefit.title}</p>
                        <p className="text-xs text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>
            </Card>
          )}

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
                          "w-full justify-start group relative overflow-hidden",
                          isCollapsed ? "px-0 justify-center" : "",
                          "hover:bg-primary/10 transition-all duration-300",
                          !user && "opacity-50 cursor-not-allowed"
                        )}
                        aria-label={item.label}
                        disabled={!user}
                      >
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <item.icon
                          className={cn(
                            "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                            isCollapsed ? "" : "mr-3",
                            pathname === item.href ? "text-primary" : ""
                          )}
                        />
                        {!isCollapsed && (
                          <span className="relative z-10">{item.label}</span>
                        )}
                        {item.badge && !isCollapsed && user && (
                          <Badge
                            variant="secondary"
                            className="ml-auto bg-primary/10 text-primary hover:bg-primary/20"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right" className="bg-background/80 backdrop-blur-sm">
                      <p>{item.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Section */}
        <div
          className={cn(
            "mt-auto flex flex-col items-center space-y-4",
            isCollapsed ? "" : "items-stretch"
          )}
        >
          {user ? (
            <>
              {/* Notifications */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start group",
                      isCollapsed ? "px-0 justify-center" : ""
                    )}
                    aria-label="Notifications"
                  >
                    <Bell className={cn(
                      "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                      isCollapsed ? "" : "mr-3"
                    )} />
                    {!isCollapsed && (
                      <>
                        <span>Notifications</span>
                        <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary">
                          2
                        </Badge>
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="bg-background/80 backdrop-blur-sm">
                    <p>Notifications</p>
                  </TooltipContent>
                )}
              </Tooltip>

              {/* Profile Link */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/profile" passHref>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start group",
                        isCollapsed ? "px-0 justify-center" : ""
                      )}
                      aria-label="Profile"
                    >
                      <Avatar
                        className={cn(
                          "h-6 w-6 transition-transform duration-300 group-hover:scale-110",
                          isCollapsed ? "" : "mr-3"
                        )}
                      >
                        {userAvatar ? (
                          <AvatarImage src={userAvatar} alt="User Avatar" />
                        ) : (
                          <AvatarFallback>
                            {user?.displayName?.[0] || user?.email?.[0] || "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {!isCollapsed && <span>Profile</span>}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="bg-background/80 backdrop-blur-sm">
                    <p>Profile</p>
                  </TooltipContent>
                )}
              </Tooltip>

              {/* Settings */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start group",
                      isCollapsed ? "px-0 justify-center" : ""
                    )}
                    aria-label="Settings"
                  >
                    <Settings className={cn(
                      "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                      isCollapsed ? "" : "mr-3"
                    )} />
                    {!isCollapsed && <span>Settings</span>}
                  </Button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="bg-background/80 backdrop-blur-sm">
                    <p>Settings</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </>
          ) : (
            !isCollapsed && (
              <div className="text-center text-sm text-muted-foreground">
                <p>Join our community of</p>
                <p className="font-semibold text-primary">10,000+ members</p>
              </div>
            )
          )}

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
                className={cn(
                  "w-full justify-start group",
                  isCollapsed ? "px-0 justify-center" : ""
                )}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <PanelRight className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                ) : (
                  <>
                    <PanelLeft className="h-5 w-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                    <span>Collapse</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="bg-background/80 backdrop-blur-sm">
                <p>Expand sidebar</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </nav>
    </TooltipProvider>
  );
}
