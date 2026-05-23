/**
 * Stockermans Education Advisors
 * Logo Components
 */

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "full" | "mark";
  color?: "black" | "blue" | "white";
}

// Mark only – Stockermans crest SVG in a navy container
export function StockermansMark({ className }: Omit<LogoProps, "variant" | "color">) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full",
        "bg-[#1B5FAA] w-9 h-9",
        className
      )}
      aria-label="Stockermans Education Advisors"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/stockermans-logo.svg"
        alt="Stockermans crest"
        className="w-full h-full object-contain p-0.5"
      />
    </div>
  );
}

// Full logo – Mark + wordmark
export function StockermansLogo({ className, variant = "full", color = "black" }: LogoProps) {
  const textColor =
    color === "white"
      ? "text-white"
      : color === "blue"
      ? "text-[#1B5FAA]"
      : "text-[#111111]";

  if (variant === "mark") {
    return <StockermansMark className={className} />;
  }

  return (
    <div
      className={cn("flex items-center gap-2.5", className)}
      aria-label="Stockermans Education Advisors"
    >
      <StockermansMark />
      <div className={cn("flex flex-col leading-none", textColor)}>
        <span className="font-display text-[15px] font-bold tracking-wider uppercase">
          Stockermans
        </span>
        <span className="font-body text-[8.5px] tracking-widest uppercase opacity-55 mt-0.5">
          Stockermans Education Advisors
        </span>
      </div>
    </div>
  );
}

export default StockermansLogo;
