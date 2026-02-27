"use client";

/**
 * Section Divider Components
 * 
 * Subtle visual dividers between sections for better visual rhythm.
 */

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DividerProps {
  className?: string;
  variant?: "line" | "wave" | "gradient" | "dots";
  color?: "gray" | "white" | "blue" | "orange";
}

// Simple thin line divider
export function LineDivider({ className, color = "gray" }: DividerProps) {
  const colorClasses = {
    gray: "bg-[#EDEDED]",
    white: "bg-white/50",
    blue: "bg-brand-blue/10",
    orange: "bg-[#8B3B3B]/10",
  };

  return (
    <div 
      className={cn(
        "w-full h-px",
        colorClasses[color],
        className
      )} 
    />
  );
}

// Gradient fade divider
export function GradientDivider({ className, color = "gray" }: DividerProps) {
  const gradients = {
    gray: "from-transparent via-[#EDEDED] to-transparent",
    white: "from-transparent via-white/60 to-transparent",
    blue: "from-transparent via-brand-blue/10 to-transparent",
    orange: "from-transparent via-[#8B3B3B]/10 to-transparent",
  };

  return (
    <div 
      className={cn(
        "w-full h-px bg-gradient-to-r",
        gradients[color],
        className
      )} 
    />
  );
}

// Wave SVG divider
export function WaveDivider({ className, color = "gray" }: DividerProps) {
  const colors = {
    gray: "#F6F6F6",
    white: "#FFFFFF",
    blue: "#2F3B69",
    orange: "#8B3B3B",
  };

  return (
    <div className={cn("w-full overflow-hidden leading-[0]", className)}>
      <svg
        className="relative block w-full h-[30px] sm:h-[40px]"
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 20 Q 150 0, 300 20 T 600 20 T 900 20 T 1200 20 V40 H0 Z"
          fill={colors[color]}
          opacity={0.3}
        />
        <path
          d="M0 25 Q 150 10, 300 25 T 600 25 T 900 25 T 1200 25 V40 H0 Z"
          fill={colors[color]}
          opacity={0.2}
        />
      </svg>
    </div>
  );
}

// Dots pattern divider
export function DotsDivider({ className, color = "gray" }: DividerProps) {
  const colors = {
    gray: "#D4D4D4",
    white: "#FFFFFF",
    blue: "#2F3B69",
    orange: "#8B3B3B",
  };

  return (
    <div className={cn("w-full flex justify-center gap-2 py-4", className)}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ 
            backgroundColor: colors[color],
            opacity: 0.3 + (i === 2 ? 0.3 : i === 1 || i === 3 ? 0.15 : 0)
          }}
        />
      ))}
    </div>
  );
}

// Animated section divider with entrance
export function AnimatedDivider({ className }: DividerProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn("w-full overflow-hidden", className)}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ 
        duration: shouldReduceMotion ? 0 : 0.8, 
        ease: [0.22, 1, 0.36, 1] 
      }}
    >
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4D4D4]/50 to-transparent" />
    </motion.div>
  );
}

export default LineDivider;
