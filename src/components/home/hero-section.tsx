"use client";

/**
 * Hero Section - Clean & Premium
 * 
 * Features:
 * - Typing effect on headline (desktop only, respects reduced motion)
 * - Clean mobile layout (no chips/badges)
 * - Subtle background decorations with parallax
 * - Enhanced glassmorphism effects
 * - Smooth entrance animations
 * - Scroll indicator
 * - Social icons (desktop only)
 */

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Instagram } from "lucide-react";
import { useMultiLineTyping } from "@/hooks/use-typing-effect";
import { useIsMobile } from "@/hooks/use-media-query";
import { usePrefersReducedMotion, useIsTouchDevice } from "@/hooks/use-reduced-motion";
import { useMemo } from "react";
import { BackgroundParticles } from "@/components/interactive/background-particles";
import { ScrollChevrons } from "@/components/ui/scroll-indicator";
import { 
  ENABLE_HERO_INTERACTIVITY, 
  ENABLE_HERO_TYPING,
  TYPING_CONFIG,
  MOTION 
} from "@/constants/motion";
import { 
  GridDots,
  DottedCircle 
} from "@/components/decorations/svg-decorations";
import { LargeParallaxCircle } from "@/components/decorations/section-decoration";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";

// Hero headline lines — now driven by language context (see HeroTitle)
// const HERO_LINES = ["WE HELP", "STUDENTS REACH", "TOP UNIVERSITIES"];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: MOTION.easing.smooth,
    },
  },
};

const decorVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      delay: 0.8,
      duration: 0.8,
      ease: MOTION.easing.smooth,
    },
  },
};

// Typing cursor component
function TypingCursor({ visible }: { visible: boolean }) {
  if (!visible) return null;
  
  return (
    <motion.span
      className="inline-block w-[3px] h-[0.9em] bg-brand-blue ml-1 align-middle"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
    />
  );
}

// Hero title with typing effect
function HeroTitle() {
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isTouchDevice = useIsTouchDevice();
  const { t, language } = useLanguage();
  
  const HERO_LINES = useMemo(() => [...t.hero.lines] as string[], [language]);

  // Disable typing on mobile, touch devices, or if user prefers reduced motion
  const shouldType = ENABLE_HERO_TYPING && !isMobile && !prefersReducedMotion && !isTouchDevice;
  
  const { displayLines, currentLine, showCursor, isComplete } = useMultiLineTyping({
    lines: HERO_LINES,
    speed: TYPING_CONFIG.speed,
    lineDelay: TYPING_CONFIG.lineDelay,
    startDelay: TYPING_CONFIG.startDelay,
  });

  // If no typing, show static text with fade animation
  if (!shouldType) {
    return (
      <div className="space-y-0.5 sm:space-y-1 mb-6 sm:mb-8">
        {HERO_LINES.map((line, index) => (
          <motion.h1
            key={index}
            className={`hero-title ${index === 2 ? "text-brand-blue" : "text-[#111111] dark:text-[#F0F0F0]"}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3 + index * 0.1,
              duration: 0.6,
              ease: MOTION.easing.smooth,
            }}
          >
            {line}
          </motion.h1>
        ))}
      </div>
    );
  }

  // Typing effect
  return (
    <div className="space-y-0.5 sm:space-y-1 mb-6 sm:mb-8 min-h-[200px] sm:min-h-[280px] md:min-h-[320px]">
      {HERO_LINES.map((line, index) => {
        const isCurrentLine = index === currentLine && !isComplete;
        const isLastLine = index === 2;
        const displayText = displayLines[index] || "";
        
        return (
          <h1
            key={index}
            className={`hero-title ${isLastLine ? "text-brand-blue" : "text-[#111111] dark:text-[#F0F0F0]"}`}
            style={{ 
              minHeight: "1.1em",
              visibility: index <= currentLine || displayText ? "visible" : "hidden"
            }}
          >
            {displayText}
            {isCurrentLine && <TypingCursor visible={showCursor} />}
            {/* Show cursor at end of last line when complete */}
            {isLastLine && isComplete && showCursor && <TypingCursor visible={true} />}
          </h1>
        );
      })}
    </div>
  );
}

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  // Parallax effect for decorations
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -80]);
  const y2 = useTransform(scrollY, [0, 500], [0, -120]);
  const y3 = useTransform(scrollY, [0, 500], [0, 60]);
  const bgY = useTransform(scrollY, [0, 800], [0, 150]);

  // Simplified variants for reduced motion
  const getVariants = (variant: typeof fadeInUp) => 
    shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : variant;

  return (
    <section className="relative min-h-[75vh] sm:min-h-[85vh] flex flex-col justify-center py-16 sm:py-20 md:py-28 overflow-hidden bg-gradient-to-b from-white to-[#F6F6F6] dark:from-[#111111] dark:to-[#111111]">
      {/* Background particles - desktop only */}
      {ENABLE_HERO_INTERACTIVITY && !isMobile && <BackgroundParticles />}

      {/* Large parallax circle - right side */}
      <LargeParallaxCircle 
        position="right" 
        top="5%" 
        size={650} 
        opacity={0.05}
        speedFactor={0.2}
        color="gray"
      />

      {/* Background topographic pattern - subtle with parallax */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ y: shouldReduceMotion ? 0 : bgY }}
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.015]">
          <Image
            src="/vectors/topographic-1.svg"
            alt=""
            fill
            className="object-cover"
            priority={false}
          />
        </div>
      </motion.div>

      {/* Background decorations - hidden on mobile */}
      {!isMobile && (
        <>
          <motion.div 
            className="absolute -bottom-16 sm:-bottom-20 -right-16 sm:-right-20 w-[250px] sm:w-[300px] md:w-[350px] hidden sm:block"
            variants={decorVariants}
            initial="hidden"
            animate="visible"
            style={{ y: shouldReduceMotion ? 0 : y2 }}
          >
            <DottedCircle className="w-full h-full" color="gray" opacity={0.08} />
          </motion.div>

          <motion.div 
            className="absolute top-1/3 right-6 sm:right-10 w-20 sm:w-28 h-20 sm:h-28 hidden md:block"
            variants={decorVariants}
            initial="hidden"
            animate="visible"
            style={{ y: shouldReduceMotion ? 0 : y3 }}
          >
            <GridDots className="w-full h-full" color="blue" opacity={0.15} />
          </motion.div>

          <motion.div 
            className="absolute bottom-16 sm:bottom-20 left-8 sm:left-16 w-16 sm:w-20 h-16 sm:h-20 hidden lg:block"
            variants={decorVariants}
            initial="hidden"
            animate="visible"
            style={{ y: shouldReduceMotion ? 0 : y1 }}
          >
            <GridDots className="w-full h-full" color="gray" opacity={0.12} />
          </motion.div>
        </>
      )}

      {/* Hero Content */}
      <div className="container-rivo relative z-10">
        <motion.div
          className="flex flex-col items-center text-center max-w-5xl mx-auto px-4 sm:px-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Small tagline - Enhanced Glassmorphism pill */}
          <motion.div variants={getVariants(fadeInUp)} className="mb-6 sm:mb-8">
              <span className="glass-pill inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-medium text-[#525252] dark:text-[#AAAAAA] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1B5FAA] animate-pulse" />
              {t.hero.tagline}
            </span>
          </motion.div>

          {/* Main Headline with Typing Effect */}
          <HeroTitle />

          {/* Subheadline */}
          <motion.p 
            className="text-[#6B6B6B] dark:text-[#999999] text-sm sm:text-base md:text-lg max-w-md sm:max-w-lg mb-8 sm:mb-10 leading-relaxed"
            variants={getVariants(fadeInUp)}
          >
            {t.hero.subheadline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto"
            variants={getVariants(fadeInUp)}
          >
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#1B5FAA] text-white text-sm font-medium rounded-full hover:shadow-lg hover:shadow-[#1B5FAA]/25 hover:-translate-y-0.5 transition-all duration-300 btn-hover"
            >
              {t.hero.bookConsultation}
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <Link
              href="#results"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 glass-pill text-[#111111] dark:text-[#F0F0F0] text-sm font-medium rounded-full hover:bg-white/90 dark:hover:bg-white/10 transition-all duration-300"
            >
              {t.hero.viewStories}
            </Link>
          </motion.div>
        </motion.div>

        {/* Social Icons - desktop only, left side */}
        {!isMobile && (
          <motion.div 
            className="absolute left-0 bottom-0 hidden lg:flex flex-col gap-4 items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <div className="flex flex-col gap-3">
              <a 
                href="https://instagram.com/stockermans_education" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-[#6B6B6B] hover:text-brand-blue transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            <div className="w-px h-12 bg-[#D4D4D4]/50" />
          </motion.div>
        )}
      </div>

      {/* Scroll Indicator - desktop only */}
      {!isMobile && (
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <ScrollChevrons targetId="about" />
        </motion.div>
      )}
    </section>
  );
}
