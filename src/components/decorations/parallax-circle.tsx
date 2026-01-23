"use client";

/**
 * Parallax Circle Decoration
 * 
 * A reusable scroll-driven parallax decoration component.
 * - Uses absolute positioning (NOT fixed)
 * - Moves slower than scroll (holographic/parallax effect)
 * - Respects prefers-reduced-motion
 * - Includes subtle holographic gradient overlay
 */

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxCircleProps {
  /** CSS positioning from top (e.g., "10%", "200px") */
  top?: string;
  /** CSS positioning from right (e.g., "-150px", "5%") */
  right?: string;
  /** CSS positioning from left (e.g., "-150px", "5%") */
  left?: string;
  /** CSS positioning from bottom (e.g., "10%", "200px") */
  bottom?: string;
  /** Circle size in pixels */
  size?: number;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Parallax speed factor (0.1 = very slow, 1 = normal scroll speed) */
  speedFactor?: number;
  /** Color variant */
  color?: "blue" | "gray" | "orange";
  /** Additional className */
  className?: string;
  /** Whether to show holographic gradient overlay */
  holographic?: boolean;
}

const colorMap = {
  blue: "#28547C",
  orange: "#E67E22",
  gray: "#111111",
};

export function ParallaxCircle({
  top,
  right,
  left,
  bottom,
  size = 500,
  opacity = 0.06,
  speedFactor = 0.35,
  color = "gray",
  className,
  holographic = true,
}: ParallaxCircleProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [initialScrollY, setInitialScrollY] = useState(0);

  // Get scroll progress for the entire page
  const { scrollY } = useScroll();

  // Initialize from current scroll position to prevent jump
  useEffect(() => {
    setInitialScrollY(window.scrollY);
  }, []);

  // Transform scroll position to translateY with speed factor
  // If reduced motion, don't transform
  const y = useTransform(
    scrollY,
    [0, 3000],
    shouldReduceMotion 
      ? [0, 0] 
      : [initialScrollY * speedFactor, 3000 * speedFactor]
  );

  // Style object for positioning
  const positionStyle: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    pointerEvents: "none",
    ...(top && { top }),
    ...(right && { right }),
    ...(left && { left }),
    ...(bottom && { bottom }),
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn("z-0", className)}
      style={{
        ...positionStyle,
        y: shouldReduceMotion ? 0 : y,
      }}
    >
      {/* Main circle SVG */}
      <svg
        className="w-full h-full pointer-events-none"
        viewBox="0 0 400 400"
        fill="none"
        style={{ opacity }}
      >
        {/* Outer circle */}
        <circle
          cx="200"
          cy="200"
          r="195"
          stroke={colorMap[color]}
          strokeWidth="1.5"
          fill="none"
        />
        {/* Middle circle */}
        <circle
          cx="200"
          cy="200"
          r="150"
          stroke={colorMap[color]}
          strokeWidth="1"
          fill="none"
        />
        {/* Inner circles */}
        <circle
          cx="200"
          cy="200"
          r="105"
          stroke={colorMap[color]}
          strokeWidth="0.75"
          fill="none"
        />
        <circle
          cx="200"
          cy="200"
          r="60"
          stroke={colorMap[color]}
          strokeWidth="0.5"
          fill="none"
        />
      </svg>

      {/* Holographic gradient overlay (very subtle) */}
      {holographic && !shouldReduceMotion && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `
              radial-gradient(
                ellipse at 30% 30%,
                rgba(40, 84, 124, 0.03) 0%,
                transparent 50%
              ),
              radial-gradient(
                ellipse at 70% 70%,
                rgba(230, 126, 34, 0.02) 0%,
                transparent 50%
              )
            `,
            opacity: 0.8,
          }}
        />
      )}
    </motion.div>
  );
}

export default ParallaxCircle;
