"use client";

/**
 * Hero Chips / Service Pills
 * 
 * Creative floating chips integrated into the hero area.
 * Reference-style: minimal, clean, subtle brand accents.
 * 
 * Features:
 * - Premium mini-illustrations (no emojis)
 * - Staggered entrance animation
 * - Subtle hover lift effect
 * - Responsive: wrap on mobile, horizontal on desktop
 * - Respects reduced motion preference
 */

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { heroChips, type HeroChipConfig } from "@/constants/illustrations";

interface HeroChipsProps {
  className?: string;
}

const chipVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.6 + i * 0.1,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const chipReducedMotion = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

export function HeroChips({ className }: HeroChipsProps) {
  const shouldReduceMotion = useReducedMotion();

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

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-2 sm:gap-3",
        className
      )}
    >
      {heroChips.map((chip, index) => (
        <motion.div
          key={chip.label}
          custom={index}
          variants={shouldReduceMotion ? chipReducedMotion : chipVariants}
          initial="hidden"
          animate="visible"
          whileHover={
            shouldReduceMotion
              ? {}
              : { y: -2, transition: { duration: 0.2 } }
          }
          className={cn(
            "inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2",
            "rounded-full border text-xs sm:text-sm font-medium",
            "cursor-default select-none transition-shadow duration-200",
            "hover:shadow-sm",
            getChipStyles(chip.variant)
          )}
        >
          <div className="relative w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
            <Image
              src={chip.illustration}
              alt=""
              fill
              className="object-contain"
            />
          </div>
          <span className="font-body">{chip.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Alternative: Floating chips positioned absolutely around the headline
 * Use this for a more dynamic, reference-like layout
 * Now uses premium mini-illustrations instead of emojis
 */
interface FloatingChipProps {
  label: string;
  illustration: string;
  variant?: "default" | "blue" | "orange";
  position: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  delay?: number;
  className?: string;
}

export function FloatingChip({
  label,
  illustration,
  variant = "default",
  position,
  delay = 0,
  className,
}: FloatingChipProps) {
  const shouldReduceMotion = useReducedMotion();

  const getStyles = () => {
    switch (variant) {
      case "blue":
        return "bg-white border-brand-blue/30 text-brand-blue shadow-sm";
      case "orange":
        return "bg-white border-brand-orange/30 text-brand-orange shadow-sm";
      default:
        return "bg-white border-[#EDEDED] text-[#111111] shadow-sm";
    }
  };

  return (
    <motion.div
      className={cn(
        "absolute z-20 hidden lg:flex items-center gap-2 px-4 py-2",
        "rounded-full border text-sm font-medium",
        "pointer-events-none",
        getStyles(),
        className
      )}
      style={position}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={
        shouldReduceMotion
          ? { opacity: 1 }
          : {
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                delay: 0.8 + delay,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              },
            }
      }
    >
      <div className="relative w-6 h-6 flex-shrink-0">
        <Image
          src={illustration}
          alt=""
          fill
          className="object-contain"
        />
      </div>
      <span className="font-body">{label}</span>
    </motion.div>
  );
}

export default HeroChips;
