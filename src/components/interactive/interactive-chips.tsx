"use client";

/**
 * Interactive Hero Chips
 * 
 * Premium micro-interactions for hero service chips:
 * - Hover: subtle "escape" movement away from cursor
 * - Click: expand to show description
 * - Accessibility: keyboard support, reduced motion respect
 * 
 * Only active on desktop with mouse; touch devices get tap feedback only.
 */

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionPreferences } from "@/hooks/use-reduced-motion";
import { 
  ENABLE_HERO_INTERACTIVITY, 
  MOTION, 
  CHIP_MOTION, 
  CHIP_EXPAND_CONTENT 
} from "@/constants/motion";
import { heroChips, type HeroChipConfig } from "@/constants/illustrations";

interface InteractiveChipsProps {
  className?: string;
}

export function InteractiveChips({ className }: InteractiveChipsProps) {
  const { enableEffects, prefersReducedMotion } = useMotionPreferences();
  const [expandedChip, setExpandedChip] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close expanded chip when clicking outside
  const handleClickOutside = useCallback((e: React.MouseEvent) => {
    if (expandedChip && containerRef.current) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-chip]")) {
        setExpandedChip(null);
      }
    }
  }, [expandedChip]);

  // Toggle chip expansion
  const toggleChip = (label: string) => {
    setExpandedChip(prev => prev === label ? null : label);
  };

  const getChipStyles = (variant: HeroChipConfig["variant"]) => {
    switch (variant) {
      case "blue":
        return "bg-brand-blue/5 border-brand-blue/20 text-brand-blue";
      case "orange":
        return "bg-brand-orange/5 border-brand-orange/20 text-brand-orange";
      case "outline":
        return "bg-transparent border-[#D4D4D4] text-[#6B6B6B]";
      default:
        return "bg-[#F5F5F5] border-[#EDEDED] text-[#111111]";
    }
  };

  // Animation variants
  const chipVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: 0.6 + i * 0.1,
        duration: 0.5,
        ease: MOTION.easing.smooth,
      },
    }),
  };

  const expandVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      marginTop: 0,
    },
    visible: { 
      opacity: 1, 
      height: "auto",
      marginTop: 8,
      transition: {
        duration: CHIP_MOTION.expand.duration,
        ease: MOTION.easing.smooth,
      },
    },
    exit: { 
      opacity: 0, 
      height: 0,
      marginTop: 0,
      transition: {
        duration: 0.2,
        ease: MOTION.easing.gentle,
      },
    },
  };

  if (!ENABLE_HERO_INTERACTIVITY) {
    // Fallback to static chips
    return (
      <div className={cn("flex flex-wrap items-center justify-center gap-2 sm:gap-3", className)}>
        {heroChips.map((chip) => (
          <div
            key={chip.label}
            className={cn(
              "inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2",
              "rounded-full border text-xs sm:text-sm font-medium",
              getChipStyles(chip.variant)
            )}
          >
            <div className="relative w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
              <Image src={chip.illustration} alt="" fill className="object-contain" />
            </div>
            <span className="font-body">{chip.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={cn("flex flex-wrap items-center justify-center gap-2 sm:gap-3", className)}
      onClick={handleClickOutside}
    >
      {heroChips.map((chip, index) => (
        <InteractiveChip
          key={chip.label}
          chip={chip}
          index={index}
          isExpanded={expandedChip === chip.label}
          onToggle={() => toggleChip(chip.label)}
          enableEffects={enableEffects}
          prefersReducedMotion={prefersReducedMotion}
          chipVariants={chipVariants}
          expandVariants={expandVariants}
          getChipStyles={getChipStyles}
        />
      ))}
    </div>
  );
}

interface InteractiveChipProps {
  chip: HeroChipConfig;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  enableEffects: boolean;
  prefersReducedMotion: boolean;
  chipVariants: any;
  expandVariants: any;
  getChipStyles: (variant: HeroChipConfig["variant"]) => string;
}

function InteractiveChip({
  chip,
  index,
  isExpanded,
  onToggle,
  enableEffects,
  prefersReducedMotion,
  chipVariants,
  expandVariants,
  getChipStyles,
}: InteractiveChipProps) {
  const chipRef = useRef<HTMLButtonElement>(null);
  const [hoverOffset, setHoverOffset] = useState({ x: 0, y: 0 });

  // Handle mouse move for "escape" effect
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!enableEffects || !chipRef.current) return;

    const rect = chipRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from cursor to chip center
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    // Normalize and invert (escape away from cursor)
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDist = 100; // Influence radius
    
    if (distance < maxDist) {
      const strength = 1 - (distance / maxDist);
      const maxTranslate = CHIP_MOTION.hover.maxTranslate;
      
      // Move away from cursor
      setHoverOffset({
        x: -(deltaX / distance) * maxTranslate * strength,
        y: -(deltaY / distance) * maxTranslate * strength,
      });
    }
  }, [enableEffects]);

  const handleMouseLeave = useCallback(() => {
    setHoverOffset({ x: 0, y: 0 });
  }, []);

  const content = CHIP_EXPAND_CONTENT[chip.label];

  return (
    <div className="flex flex-col items-center" data-chip>
      <motion.button
        ref={chipRef}
        custom={index}
        variants={prefersReducedMotion ? undefined : chipVariants}
        initial="hidden"
        animate="visible"
        onClick={onToggle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          x: hoverOffset.x,
          y: hoverOffset.y,
        }}
        whileHover={
          enableEffects
            ? { 
                scale: 1.02,
                boxShadow: `0 4px 12px rgba(0,0,0,${CHIP_MOTION.hover.shadowOpacity})`,
              }
            : undefined
        }
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2",
          "rounded-full border text-xs sm:text-sm font-medium",
          "cursor-pointer select-none transition-colors duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/50",
          isExpanded && "ring-2 ring-brand-blue/30",
          getChipStyles(chip.variant)
        )}
        aria-expanded={isExpanded}
        aria-controls={`chip-content-${chip.label}`}
      >
        <div className="relative w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
          <Image src={chip.illustration} alt="" fill className="object-contain" />
        </div>
        <span className="font-body">{chip.label}</span>
        
        {/* Expand indicator */}
        <motion.svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className="ml-0.5 opacity-40"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </motion.svg>
      </motion.button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && content && (
          <motion.div
            id={`chip-content-${chip.label}`}
            variants={expandVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="px-4 py-3 bg-white border border-[#EDEDED] rounded-xl shadow-sm max-w-[220px] text-center">
              <p className="font-display text-xs text-[#111111] mb-1">
                {content.title}
              </p>
              <p className="font-body text-[11px] text-[#6B6B6B] leading-relaxed">
                {content.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default InteractiveChips;
