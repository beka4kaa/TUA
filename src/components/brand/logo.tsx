/**
 * TUA – Top Universities Advisor
 * Logo Components
 */

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "full" | "mark";
  color?: "black" | "blue" | "white";
}

// Mark only – TUA crest SVG in a navy container
export function YmitMark({ className }: Omit<LogoProps, "variant" | "color">) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full",
        "bg-[#2F3B69] w-9 h-9",
        className
      )}
      aria-label="TUA – Top Universities Advisor"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/tua-logo.svg"
        alt="TUA crest"
        className="w-full h-full object-contain p-0.5"
      />
    </div>
  );
}

// Full logo – Mark + wordmark
export function YmitLogo({ className, variant = "full", color = "black" }: LogoProps) {
  const textColor =
    color === "white"
      ? "text-white"
      : color === "blue"
      ? "text-[#2F3B69]"
      : "text-[#111111]";

  if (variant === "mark") {
    return <YmitMark className={className} />;
  }

  return (
    <div
      className={cn("flex items-center gap-2.5", className)}
      aria-label="TUA – Top Universities Advisor"
    >
      <YmitMark />
      <div className={cn("flex flex-col leading-none", textColor)}>
        <span className="font-display text-[15px] font-bold tracking-wider uppercase">
          TUA
        </span>
        <span className="font-body text-[8.5px] tracking-widest uppercase opacity-55 mt-0.5">
          Top Universities Advisor
        </span>
      </div>
    </div>
  );
}

export default YmitLogo;
