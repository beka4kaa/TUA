"use client";

/**
 * Hero Interactive Title
 * 
 * Adds subtle premium effects to the hero headline:
 * - Shimmer effect on accent (blue) text
 * - Optional cursor-based parallax
 * 
 * Respects reduced motion and touch devices.
 */

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionPreferences } from "@/hooks/use-reduced-motion";
import { ENABLE_HERO_INTERACTIVITY, HEADLINE_MOTION, MOTION } from "@/constants/motion";

interface HeroInteractiveTitleProps {
  children: React.ReactNode;
  className?: string;
  /** Enable parallax movement on cursor */
  enableParallax?: boolean;
  /** Enable shimmer on this element */
  enableShimmer?: boolean;
  /** Is this the accent/highlighted text? */
  isAccent?: boolean;
}

export function HeroInteractiveTitle({
  children,
  className,
  enableParallax = false,
  enableShimmer = false,
  isAccent = false,
}: HeroInteractiveTitleProps) {
  const { enableEffects, prefersReducedMotion } = useMotionPreferences();
  const elementRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const targetOffset = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number | undefined>(undefined);

  // Smooth parallax animation loop
  useEffect(() => {
    if (!enableEffects || !enableParallax || !ENABLE_HERO_INTERACTIVITY) return;

    const animate = () => {
      setOffset(prev => ({
        x: prev.x + (targetOffset.current.x - prev.x) * HEADLINE_MOTION.parallax.smoothing,
        y: prev.y + (targetOffset.current.y - prev.y) * HEADLINE_MOTION.parallax.smoothing,
      }));
      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [enableEffects, enableParallax]);

  // Handle mouse move for parallax
  useEffect(() => {
    if (!enableEffects || !enableParallax || !ENABLE_HERO_INTERACTIVITY) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
      
      targetOffset.current = {
        x: x * HEADLINE_MOTION.parallax.maxOffset,
        y: y * HEADLINE_MOTION.parallax.maxOffset,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [enableEffects, enableParallax]);

  // Shimmer styles for accent text
  const shimmerStyles = enableShimmer && enableEffects && HEADLINE_MOTION.shimmer.enabled && !prefersReducedMotion
    ? {
        backgroundImage: `linear-gradient(
          110deg,
          currentColor 0%,
          currentColor 40%,
          rgba(40, 84, 124, 0.7) 50%,
          currentColor 60%,
          currentColor 100%
        )`,
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: `shimmer ${HEADLINE_MOTION.shimmer.duration}s ease-in-out infinite`,
      }
    : undefined;

  // If no effects, render simple element
  if (!ENABLE_HERO_INTERACTIVITY || prefersReducedMotion) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={elementRef}
      className={cn(className, enableShimmer && isAccent && "shimmer-text")}
      style={{
        x: enableParallax ? offset.x : 0,
        y: enableParallax ? offset.y : 0,
        ...shimmerStyles,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Wrapper for the entire headline group with parallax
 */
interface HeroTitleGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function HeroTitleGroup({ children, className }: HeroTitleGroupProps) {
  const { enableEffects, prefersReducedMotion } = useMotionPreferences();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const targetOffset = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number | undefined>(undefined);

  // Smooth parallax animation loop
  useEffect(() => {
    if (!enableEffects || !ENABLE_HERO_INTERACTIVITY || prefersReducedMotion) return;

    const animate = () => {
      setOffset(prev => ({
        x: prev.x + (targetOffset.current.x - prev.x) * HEADLINE_MOTION.parallax.smoothing,
        y: prev.y + (targetOffset.current.y - prev.y) * HEADLINE_MOTION.parallax.smoothing,
      }));
      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [enableEffects, prefersReducedMotion]);

  // Handle mouse move for parallax
  useEffect(() => {
    if (!enableEffects || !ENABLE_HERO_INTERACTIVITY || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      
      targetOffset.current = {
        x: x * HEADLINE_MOTION.parallax.maxOffset,
        y: y * HEADLINE_MOTION.parallax.maxOffset * 0.5, // Less vertical movement
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [enableEffects, prefersReducedMotion]);

  if (!ENABLE_HERO_INTERACTIVITY || prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      style={{
        x: offset.x,
        y: offset.y,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Shimmer text component for accent words
 */
interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
}

export function ShimmerText({ children, className }: ShimmerTextProps) {
  const { enableEffects, prefersReducedMotion } = useMotionPreferences();
  
  const shouldShimmer = enableEffects && 
    ENABLE_HERO_INTERACTIVITY && 
    HEADLINE_MOTION.shimmer.enabled && 
    !prefersReducedMotion;

  return (
    <span className={cn(className, shouldShimmer && "shimmer-text")}>
      {children}
    </span>
  );
}

export default HeroInteractiveTitle;
