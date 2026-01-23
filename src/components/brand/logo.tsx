/**
 * Ymit Academy Logo Components
 * 
 * New refined design - minimal geometric Y mark:
 * - Clean strokes forming a Y shape
 * - No dot/accent for cleaner editorial feel
 * - Works in monochrome (black/white) or brand blue
 * 
 * Variants:
 * - Full: Mark + Wordmark "Ymit Academy"
 * - Mark: Icon only (for mobile/favicon)
 */

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "full" | "mark";
  color?: "black" | "blue" | "white";
}

// Mark only - refined geometric Y (no accent dot, cleaner)
export function YmitMark({ className, color = "black" }: Omit<LogoProps, "variant">) {
  const colorClass = {
    black: "text-[#111111]",
    blue: "text-brand-blue",
    white: "text-white",
  }[color];

  return (
    <svg 
      width="28" 
      height="28" 
      viewBox="0 0 28 28" 
      fill="none" 
      className={cn(colorClass, className)}
      aria-label="Ymit Academy"
    >
      {/* Left diagonal stroke */}
      <path 
        d="M4 4L14 15" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      {/* Right diagonal stroke */}
      <path 
        d="M24 4L14 15" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      {/* Vertical stem */}
      <path 
        d="M14 15V24" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
    </svg>
  );
}

// Full logo - Mark + Wordmark
export function YmitLogo({ className, variant = "full", color = "black" }: LogoProps) {
  const colorClass = {
    black: "text-[#111111]",
    blue: "text-brand-blue",
    white: "text-white",
  }[color];

  if (variant === "mark") {
    return <YmitMark className={className} color={color} />;
  }

  return (
    <div className={cn("flex items-center gap-2.5", colorClass, className)} aria-label="Ymit Academy">
      {/* Mark - refined geometric Y */}
      <svg 
        width="22" 
        height="22" 
        viewBox="0 0 28 28" 
        fill="none"
        className="shrink-0"
      >
        {/* Left diagonal stroke */}
        <path 
          d="M4 4L14 15" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        {/* Right diagonal stroke */}
        <path 
          d="M24 4L14 15" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        {/* Vertical stem */}
        <path 
          d="M14 15V24" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round"
        />
      </svg>
      {/* Wordmark - using body font (Gilroy/DM Sans) */}
      <span className="font-body text-[15px] font-medium tracking-normal">
        Ymit Academy
      </span>
    </div>
  );
}

export default YmitLogo;
