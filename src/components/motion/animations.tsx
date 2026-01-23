"use client";

import { motion, useReducedMotion, useScroll, useTransform, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";
import { ENABLE_SCROLL_MOTION, SCROLL_MOTION, MOTION } from "@/constants/motion";

// Animation variants - enhanced for scroll
export const fadeInUp = {
  hidden: { opacity: 0, y: SCROLL_MOTION.section.y },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: SCROLL_MOTION.section.duration, 
      ease: MOTION.easing.smooth 
    }
  }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: SCROLL_MOTION.section.stagger,
      delayChildren: 0.1
    }
  }
};

export const heroLineVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: MOTION.easing.smooth
    }
  })
};

// Card animation with stagger
export const cardVariant = {
  hidden: { opacity: 0, y: SCROLL_MOTION.card.y },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * SCROLL_MOTION.card.stagger,
      duration: SCROLL_MOTION.card.duration,
      ease: MOTION.easing.smooth
    }
  })
};

// Line draw animation
export const lineDrawVariant = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: SCROLL_MOTION.line.duration,
      ease: MOTION.easing.smooth
    }
  }
};

// Animated section wrapper with enhanced scroll reveal
interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}

export function AnimatedSection({ children, className = "", id, delay = 0 }: AnimatedSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  if (prefersReducedMotion || !ENABLE_SCROLL_MOTION) {
    return <section id={id} className={className}>{children}</section>;
  }

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delay,
            staggerChildren: SCROLL_MOTION.section.stagger,
            delayChildren: delay
          }
        }
      }}
    >
      {children}
    </motion.section>
  );
}

// Animated item (for children inside AnimatedSection)
interface AnimatedItemProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

export function AnimatedItem({ children, className = "", index = 0 }: AnimatedItemProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion || !ENABLE_SCROLL_MOTION) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={fadeInUp}
      custom={index}
    >
      {children}
    </motion.div>
  );
}

// Animated card with index-based stagger
interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

export function AnimatedCard({ children, className = "", index = 0 }: AnimatedCardProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion || !ENABLE_SCROLL_MOTION) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={cardVariant}
      custom={index}
    >
      {children}
    </motion.div>
  );
}

// Parallax wrapper - element moves slower than scroll
interface ParallaxItemProps {
  children: ReactNode;
  className?: string;
  speed?: number; // 0-1, how much slower (0.1 = subtle, 0.3 = noticeable)
  direction?: "up" | "down";
}

export function ParallaxItem({ 
  children, 
  className = "", 
  speed = SCROLL_MOTION.parallax.speed,
  direction = "up" 
}: ParallaxItemProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const multiplier = direction === "up" ? -1 : 1;
  const y = useTransform(
    scrollYProgress, 
    [0, 1], 
    [multiplier * SCROLL_MOTION.parallax.maxOffset, multiplier * -SCROLL_MOTION.parallax.maxOffset]
  );

  if (prefersReducedMotion || !ENABLE_SCROLL_MOTION) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}

// Line draw animation (for dividers)
interface AnimatedLineProps {
  className?: string;
}

export function AnimatedLine({ className = "" }: AnimatedLineProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  if (prefersReducedMotion || !ENABLE_SCROLL_MOTION) {
    return <div className={`h-px bg-[#EDEDED] ${className}`} />;
  }

  return (
    <motion.div
      ref={ref}
      className={`h-px bg-[#EDEDED] ${className}`}
      initial={{ scaleX: 0, originX: 0 }}
      animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
      transition={{ duration: SCROLL_MOTION.line.duration, ease: MOTION.easing.smooth }}
    />
  );
}

// Hero line animation
interface HeroLineProps {
  children: ReactNode;
  index: number;
  className?: string;
}

export function HeroLine({ children, index, className = "" }: HeroLineProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span
      className={className}
      custom={index}
      initial="hidden"
      animate="visible"
      variants={heroLineVariant}
    >
      {children}
    </motion.span>
  );
}

// Hover scale effect
interface HoverScaleProps {
  children: ReactNode;
  className?: string;
  scale?: number;
}

export function HoverScale({ children, className = "", scale = 1.02 }: HoverScaleProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

// Count-up animation for stats
interface CountUpProps {
  value: string;
  className?: string;
}

export function CountUp({ value, className = "" }: CountUpProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  // Extract number and suffix (e.g., "500+" -> 500, "+")
  const match = value.match(/^(\d+)(.*)$/);
  const numericValue = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";

  if (prefersReducedMotion || !ENABLE_SCROLL_MOTION) {
    return <span className={className}>{value}</span>;
  }

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      {isInView ? (
        <CountUpNumber target={numericValue} suffix={suffix} />
      ) : (
        "0" + suffix
      )}
    </motion.span>
  );
}

// Internal counter component
function CountUpNumber({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  
  // Simple count-up using CSS counter animation
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {target}
      </motion.span>
      {suffix}
    </motion.span>
  );
}
