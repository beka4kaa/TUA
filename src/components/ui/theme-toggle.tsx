"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className={cn("w-8 h-8 rounded-full", className)} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative inline-flex items-center justify-center",
        "w-8 h-8 rounded-full",
        "border transition-all duration-300",
        "hover:scale-110 active:scale-95",
        isDark
          ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
          : "border-[#EDEDED] bg-white/70 text-[#111111] hover:bg-white hover:border-[#D4D4D4]",
        className
      )}
    >
      <Sun
        className={cn(
          "absolute w-4 h-4 transition-all duration-300",
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"
        )}
      />
      <Moon
        className={cn(
          "absolute w-4 h-4 transition-all duration-300",
          isDark ? "opacity-0 -rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
        )}
      />
    </button>
  );
}
