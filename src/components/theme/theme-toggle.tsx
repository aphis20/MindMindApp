"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  isCollapsed?: boolean;
}

export function ThemeToggle({ isCollapsed = false }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <TooltipProvider>
       <Tooltip>
        <TooltipTrigger asChild>
             <Button
                 variant="ghost"
                 size="icon"
                 onClick={toggleTheme}
                 className={cn(isCollapsed ? "h-9 w-9" : "h-9 w-full justify-start px-3")}
                 aria-label="Toggle theme"
             >
                 <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                 <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  {!isCollapsed && <span className="ml-2">Toggle Theme</span>}
             </Button>
        </TooltipTrigger>
         {isCollapsed && <TooltipContent side="right"><p>Toggle Theme</p></TooltipContent>}
       </Tooltip>
    </TooltipProvider>
  );
}
