"use client";

/**
 * Background Particles
 * 
 * Ultra-subtle floating dots in the background.
 * Drift slightly with cursor movement for depth.
 * 
 * Features:
 * - Canvas-based for performance
 * - Very few, very small particles
 * - Respects reduced motion
 * - Disabled on touch devices
 * - pointer-events: none (never blocks clicks)
 */

import { useRef, useEffect, useCallback } from "react";
import { useMotionPreferences } from "@/hooks/use-reduced-motion";
import { ENABLE_HERO_INTERACTIVITY, PARTICLES } from "@/constants/motion";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  size: number;
  opacity: number;
  color: string;
  vx: number;
  vy: number;
}

interface BackgroundParticlesProps {
  className?: string;
  /** Limit to hero section or full page */
  fullPage?: boolean;
}

export function BackgroundParticles({ className, fullPage = false }: BackgroundParticlesProps) {
  const { enableEffects, prefersReducedMotion, isTouchDevice } = useMotionPreferences();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number | undefined>(undefined);
  const isInitialized = useRef(false);

  // Initialize particles
  const initParticles = useCallback((width: number, height: number) => {
    const colors = [
      PARTICLES.colors.primary,
      PARTICLES.colors.secondary,
      PARTICLES.colors.neutral,
    ];

    particles.current = Array.from({ length: PARTICLES.count }, () => {
      const x = Math.random() * width;
      const y = Math.random() * height;
      return {
        x,
        y,
        originX: x,
        originY: y,
        size: PARTICLES.minSize + Math.random() * (PARTICLES.maxSize - PARTICLES.minSize),
        opacity: PARTICLES.baseOpacity * (0.5 + Math.random() * 0.5),
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * PARTICLES.drift.maxSpeed,
        vy: (Math.random() - 0.5) * PARTICLES.drift.maxSpeed,
      };
    });
    isInitialized.current = true;
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    const dpr = window.devicePixelRatio || 1;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    particles.current.forEach((particle) => {
      // Apply cursor influence
      const dx = mousePos.current.x * dpr - particle.x;
      const dy = mousePos.current.y * dpr - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 300 * dpr) {
        const influence = (1 - distance / (300 * dpr)) * PARTICLES.drift.cursorInfluence;
        particle.vx -= dx * influence;
        particle.vy -= dy * influence;
      }

      // Return to origin
      particle.vx += (particle.originX - particle.x) * PARTICLES.drift.returnSpeed;
      particle.vy += (particle.originY - particle.y) * PARTICLES.drift.returnSpeed;

      // Apply velocity with damping
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.95;
      particle.vy *= 0.95;

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * dpr, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.opacity;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    animationFrame.current = requestAnimationFrame(animate);
  }, []);

  // Setup canvas and start animation
  useEffect(() => {
    if (!enableEffects || !ENABLE_HERO_INTERACTIVITY || prefersReducedMotion || isTouchDevice) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      if (!isInitialized.current) {
        initParticles(canvas.width, canvas.height);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    
    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [enableEffects, prefersReducedMotion, isTouchDevice, initParticles, animate]);

  // Don't render on touch devices or with reduced motion
  if (!enableEffects || !ENABLE_HERO_INTERACTIVITY || prefersReducedMotion || isTouchDevice) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: fullPage ? "100%" : "100vh",
        pointerEvents: "none",
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}

export default BackgroundParticles;
