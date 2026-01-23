"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ScrollIndicatorProps {
  targetId?: string;
  className?: string;
}

export function ScrollIndicator({ targetId, className = "" }: ScrollIndicatorProps) {
  const handleClick = () => {
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`flex flex-col items-center gap-2 text-[#6B6B6B] hover:text-brand-blue transition-colors cursor-pointer ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      aria-label="Scroll down"
    >
      {/* Mouse scroll indicator */}
      <div className="scroll-indicator" />
      
      {/* Bouncing arrow */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </motion.button>
  );
}

// Alternative: Simple animated chevrons
export function ScrollChevrons({ targetId, className = "" }: ScrollIndicatorProps) {
  const handleClick = () => {
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`flex flex-col items-center gap-0 text-[#6B6B6B]/50 hover:text-brand-blue/70 transition-colors cursor-pointer ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      aria-label="Scroll down"
    >
      <motion.div
        animate={{ y: [0, 4, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 4, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
        className="-mt-3"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </motion.button>
  );
}
