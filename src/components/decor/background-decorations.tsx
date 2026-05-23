"use client";

/**
 * Background Decoration Components
 * 
 * Subtle SVG decorations with optional parallax
 */

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Concentric rings decoration
export function DecorRings({
  className = "",
  color = "#1B5FAA",
  opacity = 0.03,
}: {
  className?: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      className={`pointer-events-none ${className}`}
      viewBox="0 0 400 400"
      fill="none"
      style={{ opacity }}
    >
      <circle cx="200" cy="200" r="190" stroke={color} strokeWidth="0.5" />
      <circle cx="200" cy="200" r="150" stroke={color} strokeWidth="0.5" />
      <circle cx="200" cy="200" r="110" stroke={color} strokeWidth="0.5" />
      <circle cx="200" cy="200" r="70" stroke={color} strokeWidth="0.5" />
    </svg>
  );
}

// Dotted grid decoration
export function DecorDots({
  className = "",
  color = "#1B5FAA",
  opacity = 0.04,
  rows = 8,
  cols = 8,
}: {
  className?: string;
  color?: string;
  opacity?: number;
  rows?: number;
  cols?: number;
}) {
  const spacing = 20;
  const size = spacing * (cols + 1);
  
  return (
    <svg
      className={`pointer-events-none ${className}`}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      style={{ opacity }}
    >
      {Array.from({ length: rows }).map((_, i) =>
        Array.from({ length: cols }).map((_, j) => (
          <circle
            key={`${i}-${j}`}
            cx={spacing + j * spacing}
            cy={spacing + i * spacing}
            r="2"
            fill={color}
          />
        ))
      )}
    </svg>
  );
}

// Wavy line decoration
export function DecorWave({
  className = "",
  color = "#1B5FAA",
  opacity = 0.05,
}: {
  className?: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      className={`pointer-events-none ${className}`}
      viewBox="0 0 400 100"
      fill="none"
      style={{ opacity }}
    >
      <path
        d="M0 50 Q100 0 200 50 T400 50"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M0 70 Q100 20 200 70 T400 70"
        stroke={color}
        strokeWidth="0.5"
        fill="none"
      />
    </svg>
  );
}

// Parallax ring that moves slower than scroll
export function ParallaxRing({
  className = "",
  color = "#1B5FAA",
  opacity = 0.04,
  speed = 0.3, // 0-1, lower = slower parallax
}: {
  className?: string;
  color?: string;
  opacity?: number;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200 * speed]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={`pointer-events-none ${className}`}
    >
      <svg viewBox="0 0 500 500" fill="none" style={{ opacity }}>
        <circle cx="250" cy="250" r="240" stroke={color} strokeWidth="1" />
        <circle cx="250" cy="250" r="200" stroke={color} strokeWidth="0.5" />
        <circle cx="250" cy="250" r="160" stroke={color} strokeWidth="0.5" />
        <circle cx="250" cy="250" r="120" stroke={color} strokeWidth="0.5" />
        <circle cx="250" cy="250" r="80" stroke={color} strokeWidth="1" />
      </svg>
    </motion.div>
  );
}

// Cross/plus pattern
export function DecorCrosses({
  className = "",
  color = "#1B5FAA",
  opacity = 0.03,
}: {
  className?: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      className={`pointer-events-none ${className}`}
      viewBox="0 0 200 200"
      fill="none"
      style={{ opacity }}
    >
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <g key={`${row}-${col}`} transform={`translate(${25 + col * 50}, ${25 + row * 50})`}>
            <line x1="-8" y1="0" x2="8" y2="0" stroke={color} strokeWidth="1" />
            <line x1="0" y1="-8" x2="0" y2="8" stroke={color} strokeWidth="1" />
          </g>
        ))
      )}
    </svg>
  );
}
