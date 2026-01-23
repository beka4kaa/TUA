"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect user's reduced motion preference
 * Returns true if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window exists (SSR safety)
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to detect touch/mobile device
 * Returns true if device is touch-based
 */
export function useIsTouchDevice(): boolean {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkTouch = () => {
      const hasTouch = 
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore - for older browsers
        navigator.msMaxTouchPoints > 0;
      
      // Also check for small viewport (mobile)
      const isSmallViewport = window.innerWidth < 1024;
      
      setIsTouchDevice(hasTouch || isSmallViewport);
    };

    checkTouch();
    
    // Re-check on resize (tablet rotation, etc.)
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  return isTouchDevice;
}

/**
 * Combined hook for motion preferences
 */
export function useMotionPreferences() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isTouchDevice = useIsTouchDevice();

  return {
    prefersReducedMotion,
    isTouchDevice,
    // Should we enable fancy effects?
    enableEffects: !prefersReducedMotion && !isTouchDevice,
  };
}
