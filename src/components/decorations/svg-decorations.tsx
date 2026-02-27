/**
 * Enhanced Decorative SVG Components
 * Reusable background decoration elements matching Rivo agency style
 * Brand colors: Blue #2F3B69, Red #8B3B3B
 * 
 * Key: These decorations should be MORE VISIBLE than before
 * - Use opacity 0.06-0.15 for most decorations
 * - Circles should be large and partially off-screen
 * - Dot clusters should be visible but not distracting
 */

import { cn } from "@/lib/utils";

interface DecorativeProps {
  className?: string;
  color?: "blue" | "orange" | "gray";
  opacity?: number;
}

const colorMap = {
  blue: "#2F3B69",
  orange: "#8B3B3B",
  gray: "#111111" // Using darker gray for better visibility
};

// Large dotted circle - prominent like reference
export function DottedCircle({ className, color = "gray", opacity = 0.1 }: DecorativeProps) {
  return (
    <svg 
      className={cn("pointer-events-none", className)} 
      viewBox="0 0 200 200" 
      fill="none"
      style={{ opacity }}
    >
      <circle 
        cx="100" 
        cy="100" 
        r="95" 
        stroke={colorMap[color]} 
        strokeWidth="1.5" 
        strokeDasharray="3 6" 
        fill="none"
      />
      <circle 
        cx="100" 
        cy="100" 
        r="70" 
        stroke={colorMap[color]} 
        strokeWidth="1" 
        strokeDasharray="2 8" 
        fill="none"
      />
    </svg>
  );
}

// Thin circle outline - prominent concentric circles
export function CircleOutline({ className, color = "gray", opacity = 0.08 }: DecorativeProps) {
  return (
    <svg 
      className={cn("pointer-events-none", className)} 
      viewBox="0 0 400 400" 
      fill="none"
      style={{ opacity }}
    >
      <circle cx="200" cy="200" r="195" stroke={colorMap[color]} strokeWidth="1.5" fill="none" />
      <circle cx="200" cy="200" r="150" stroke={colorMap[color]} strokeWidth="1" fill="none" />
      <circle cx="200" cy="200" r="105" stroke={colorMap[color]} strokeWidth="0.75" fill="none" />
      <circle cx="200" cy="200" r="60" stroke={colorMap[color]} strokeWidth="0.5" fill="none" />
    </svg>
  );
}

// Wavy line decoration - more visible
export function WavyLine({ className, color = "gray", opacity = 0.08 }: DecorativeProps) {
  return (
    <svg 
      className={cn("pointer-events-none w-full", className)} 
      viewBox="0 0 800 100" 
      fill="none"
      preserveAspectRatio="none"
      style={{ opacity }}
    >
      <path 
        d="M0 50 Q 100 20, 200 50 T 400 50 T 600 50 T 800 50" 
        stroke={colorMap[color]} 
        strokeWidth="1.5" 
        fill="none"
      />
      <path 
        d="M0 65 Q 100 35, 200 65 T 400 65 T 600 65 T 800 65" 
        stroke={colorMap[color]} 
        strokeWidth="1" 
        fill="none"
      />
      <path 
        d="M0 80 Q 100 50, 200 80 T 400 80 T 600 80 T 800 80" 
        stroke={colorMap[color]} 
        strokeWidth="0.75" 
        fill="none"
      />
    </svg>
  );
}

// Topographic contour pattern - more lines for visibility
export function TopographicLines({ className, color = "blue", opacity = 0.08 }: DecorativeProps) {
  return (
    <svg 
      className={cn("pointer-events-none", className)} 
      viewBox="0 0 300 200" 
      fill="none"
      style={{ opacity }}
    >
      <path d="M40 60 C 80 30, 140 50, 180 30 S 250 20, 290 50" stroke={colorMap[color]} strokeWidth="1.5" fill="none" />
      <path d="M30 90 C 70 60, 130 80, 170 60 S 240 50, 280 80" stroke={colorMap[color]} strokeWidth="1.2" fill="none" />
      <path d="M20 120 C 60 90, 120 110, 160 90 S 230 80, 270 110" stroke={colorMap[color]} strokeWidth="1" fill="none" />
      <path d="M10 150 C 50 120, 110 140, 150 120 S 220 110, 260 140" stroke={colorMap[color]} strokeWidth="0.8" fill="none" />
      <path d="M0 180 C 40 150, 100 170, 140 150 S 210 140, 250 170" stroke={colorMap[color]} strokeWidth="0.6" fill="none" />
    </svg>
  );
}

// Three accent dots like reference (yellow/blue/gray -> orange/blue/gray)
export function AccentDots({ className, opacity = 1 }: DecorativeProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)} style={{ opacity }}>
      <div className="w-3 h-3 rounded-full bg-[#8B3B3B]" />
      <div className="w-3 h-3 rounded-full bg-brand-blue" />
      <div className="w-3 h-3 rounded-full bg-[#D4D4D4]" />
    </div>
  );
}

// Thin stick/line
export function ThinStick({ className, color = "gray", opacity = 0.2, vertical = true }: DecorativeProps & { vertical?: boolean }) {
  return (
    <div 
      className={cn(
        "pointer-events-none",
        vertical ? "w-px" : "h-px",
        className
      )} 
      style={{ 
        opacity, 
        backgroundColor: colorMap[color] 
      }}
    />
  );
}

// Grid dots pattern - more visible
export function GridDots({ className, color = "gray", opacity = 0.12 }: DecorativeProps) {
  return (
    <svg 
      className={cn("pointer-events-none", className)} 
      viewBox="0 0 100 100" 
      fill={colorMap[color]}
      style={{ opacity }}
    >
      {[0, 1, 2, 3, 4].map(row => 
        [0, 1, 2, 3, 4].map(col => (
          <circle key={`${row}-${col}`} cx={10 + col * 20} cy={10 + row * 20} r="2" />
        ))
      )}
    </svg>
  );
}

// Corner decoration (L-shaped thin lines)
export function CornerDecoration({ className, color = "gray", opacity = 0.15 }: DecorativeProps) {
  return (
    <svg 
      className={cn("pointer-events-none", className)} 
      viewBox="0 0 60 60" 
      fill="none"
      style={{ opacity }}
    >
      <path d="M0 60 L0 0 L60 0" stroke={colorMap[color]} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// Small dot cluster (like reference floating elements)
export function DotCluster({ className, color = "gray", opacity = 0.15 }: DecorativeProps) {
  return (
    <svg 
      className={cn("pointer-events-none", className)} 
      viewBox="0 0 50 50" 
      fill={colorMap[color]}
      style={{ opacity }}
    >
      <circle cx="10" cy="10" r="2.5" />
      <circle cx="25" cy="8" r="2" />
      <circle cx="40" cy="12" r="1.5" />
      <circle cx="8" cy="25" r="1.5" />
      <circle cx="22" cy="22" r="3" />
      <circle cx="38" cy="28" r="2" />
      <circle cx="12" cy="40" r="2" />
      <circle cx="28" cy="38" r="1.5" />
      <circle cx="42" cy="42" r="2.5" />
    </svg>
  );
}

// Large single circle (like reference's prominent circle)
export function LargeCircle({ className, color = "gray", opacity = 0.06 }: DecorativeProps) {
  return (
    <svg 
      className={cn("pointer-events-none", className)} 
      viewBox="0 0 200 200" 
      fill="none"
      style={{ opacity }}
    >
      <circle cx="100" cy="100" r="98" stroke={colorMap[color]} strokeWidth="2" fill="none" />
    </svg>
  );
}
