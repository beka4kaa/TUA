"use client";

/**
 * Page Wrapper with Animations
 * 
 * Wraps pages with:
 * - Fade in animation on mount
 * - Background decorations
 * - Consistent padding/margins
 */

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  withDecorations?: boolean;
}

export function PageWrapper({ 
  children, 
  className = "",
  withDecorations = true 
}: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`min-h-screen ${className}`}
    >
      {withDecorations && (
        <>
          {/* Background decorations */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
            {/* Top right ring */}
            <svg
              className="absolute -top-32 -right-32 w-[500px] h-[500px] opacity-[0.03]"
              viewBox="0 0 400 400"
              fill="none"
            >
              <circle cx="200" cy="200" r="180" stroke="#2F3B69" strokeWidth="1" />
              <circle cx="200" cy="200" r="140" stroke="#2F3B69" strokeWidth="1" />
              <circle cx="200" cy="200" r="100" stroke="#2F3B69" strokeWidth="1" />
            </svg>
            
            {/* Bottom left dots */}
            <svg
              className="absolute -bottom-20 -left-20 w-[300px] h-[300px] opacity-[0.04]"
              viewBox="0 0 200 200"
            >
              {Array.from({ length: 10 }).map((_, i) =>
                Array.from({ length: 10 }).map((_, j) => (
                  <circle
                    key={`${i}-${j}`}
                    cx={20 + i * 20}
                    cy={20 + j * 20}
                    r="2"
                    fill="#2F3B69"
                  />
                ))
              )}
            </svg>
          </div>
        </>
      )}
      {children}
    </motion.div>
  );
}

export default PageWrapper;
