"use client";

import {
  Monitor,
  Moon,
  Sun,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const {
    theme,
    setTheme,
    mounted,
  } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="
          inline-flex
          h-9
          w-9
          items-center
          justify-center
          rounded-md
          text-muted-foreground
          transition-colors
          duration-200
          hover:bg-muted
          hover:text-foreground
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-ring
        "
        aria-label="Change theme"
      >
        {!mounted ? (
          <Sun className="h-5 w-5" />
        ) : theme === "light" ? (
          <Sun className="h-5 w-5" />
        ) : theme === "dark" ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Monitor className="h-5 w-5" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-36"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
        >
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
        >
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
        >
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}