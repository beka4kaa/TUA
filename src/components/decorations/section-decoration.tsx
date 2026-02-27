"use client";

/**
 * Section Background Decorations
 * 
 * Reusable background decoration component with parallax effect.
 * Used to add visual interest to sections with SVG patterns.
 */

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SectionDecorationProps {
  /** Position from top (CSS value) */
  top?: string;
  /** Position from bottom (CSS value) */
  bottom?: string;
  /** Position from left (CSS value) */
  left?: string;
  /** Position from right (CSS value) */
  right?: string;
  /** Width of decoration (CSS value) */
  width?: string;
  /** Height of decoration (CSS value) */
  height?: string;
  /** Opacity 0-1 */
  opacity?: number;
  /** Parallax speed factor (0.1 = subtle, 0.3 = noticeable) */
  parallaxSpeed?: number;
  /** SVG path from public folder */
  src?: string;
  /** Type of built-in decoration */
  type?: "topographic" | "dots" | "circles" | "wave";
  /** Color variant */
  color?: "blue" | "orange" | "gray";
  /** Additional class names */
  className?: string;
  /** Show on mobile */
  showOnMobile?: boolean;
}

const colorMap = {
  blue: "#2F3B69",
  orange: "#8B3B3B",
  gray: "#111111",
};

// Built-in topographic SVG pattern
function TopographicPattern({ color = "gray", opacity = 0.06 }: { color?: string; opacity?: number }) {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 400 300"
      fill="none"
      style={{ opacity }}
      preserveAspectRatio="none"
    >
      <path
        d="M40 80 C 100 40, 180 70, 240 40 S 340 30, 400 60"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M0 120 C 60 80, 140 110, 200 80 S 300 70, 360 100"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M20 160 C 80 120, 160 150, 220 120 S 320 110, 380 140"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M-20 200 C 40 160, 120 190, 180 160 S 280 150, 340 180"
        stroke={color}
        strokeWidth="0.6"
        fill="none"
      />
      <path
        d="M0 240 C 60 200, 140 230, 200 200 S 300 190, 360 220"
        stroke={color}
        strokeWidth="0.5"
        fill="none"
      />
    </svg>
  );
}

// Built-in dots pattern
function DotsPattern({ color = "gray", opacity = 0.08 }: { color?: string; opacity?: number }) {
  const dots = [];
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      dots.push(
        <circle
          key={`${i}-${j}`}
          cx={20 + i * 32}
          cy={20 + j * 32}
          r="2"
          fill={color}
        />
      );
    }
  }
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 200 200"
      fill="none"
      style={{ opacity }}
    >
      {dots}
    </svg>
  );
}

// Built-in circles pattern
function CirclesPattern({ color = "gray", opacity = 0.05 }: { color?: string; opacity?: number }) {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 400 400"
      fill="none"
      style={{ opacity }}
    >
      <circle cx="200" cy="200" r="195" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="200" cy="200" r="150" stroke={color} strokeWidth="1" fill="none" />
      <circle cx="200" cy="200" r="105" stroke={color} strokeWidth="0.75" fill="none" />
      <circle cx="200" cy="200" r="60" stroke={color} strokeWidth="0.5" fill="none" />
    </svg>
  );
}

// Built-in wave pattern
function WavePattern({ color = "gray", opacity = 0.04 }: { color?: string; opacity?: number }) {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 800 100"
      fill="none"
      style={{ opacity }}
      preserveAspectRatio="none"
    >
      <path
        d="M0 50 Q 100 20, 200 50 T 400 50 T 600 50 T 800 50"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M0 65 Q 100 35, 200 65 T 400 65 T 600 65 T 800 65"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M0 80 Q 100 50, 200 80 T 400 80 T 600 80 T 800 80"
        stroke={color}
        strokeWidth="0.75"
        fill="none"
      />
    </svg>
  );
}

export function SectionDecoration({
  top,
  bottom,
  left,
  right,
  width = "200px",
  height = "200px",
  opacity = 0.06,
  parallaxSpeed = 0.15,
  src,
  type = "topographic",
  color = "gray",
  className,
  showOnMobile = false,
}: SectionDecorationProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [-50 * parallaxSpeed, 50 * parallaxSpeed]
  );

  const actualColor = colorMap[color as keyof typeof colorMap] || color;

  const positionStyle: React.CSSProperties = {
    position: "absolute",
    width,
    height,
    pointerEvents: "none",
    zIndex: 0,
    ...(top && { top }),
    ...(bottom && { bottom }),
    ...(left && { left }),
    ...(right && { right }),
  };

  const renderPattern = () => {
    if (src) {
      return (
        <Image
          src={src}
          alt=""
          fill
          className="object-contain"
          style={{ opacity }}
        />
      );
    }

    switch (type) {
      case "topographic":
        return <TopographicPattern color={actualColor} opacity={opacity} />;
      case "dots":
        return <DotsPattern color={actualColor} opacity={opacity} />;
      case "circles":
        return <CirclesPattern color={actualColor} opacity={opacity} />;
      case "wave":
        return <WavePattern color={actualColor} opacity={opacity} />;
      default:
        return <TopographicPattern color={actualColor} opacity={opacity} />;
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "select-none",
        !showOnMobile && "hidden md:block",
        className
      )}
      style={{
        ...positionStyle,
        y: shouldReduceMotion ? 0 : y,
      }}
    >
      {renderPattern()}
    </motion.div>
  );
}

// Large parallax circle decoration - prominently positioned
export function LargeParallaxCircle({
  position = "right",
  top = "10%",
  size = 600,
  opacity = 0.04,
  speedFactor = 0.25,
  color = "gray",
  className,
}: {
  position?: "left" | "right";
  top?: string;
  size?: number;
  opacity?: number;
  speedFactor?: number;
  color?: "blue" | "orange" | "gray";
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  
  const y = useTransform(
    scrollY,
    [0, 2000],
    [0, 600 * speedFactor]
  );

  const actualColor = colorMap[color];
  const positionStyle = position === "right" 
    ? { right: `-${size / 3}px`, top }
    : { left: `-${size / 3}px`, top };

  return (
    <motion.div
      className={cn("absolute pointer-events-none select-none hidden xl:block z-0", className)}
      style={{
        width: size,
        height: size,
        ...positionStyle,
        y: shouldReduceMotion ? 0 : y,
      }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 400 400"
        fill="none"
        style={{ opacity }}
      >
        <circle cx="200" cy="200" r="195" stroke={actualColor} strokeWidth="1.5" fill="none" />
        <circle cx="200" cy="200" r="160" stroke={actualColor} strokeWidth="1" fill="none" />
        <circle cx="200" cy="200" r="125" stroke={actualColor} strokeWidth="0.75" fill="none" />
        <circle cx="200" cy="200" r="90" stroke={actualColor} strokeWidth="0.5" fill="none" />
        <circle cx="200" cy="200" r="55" stroke={actualColor} strokeWidth="0.4" fill="none" />
      </svg>
    </motion.div>
  );
}

export default SectionDecoration;
