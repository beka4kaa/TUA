"use client";

/**
 * Typing Effect Hook
 * 
 * Premium typing animation for headlines.
 * Lightweight, no dependencies.
 * Respects reduced motion.
 */

import { useState, useEffect, useCallback } from "react";
import { usePrefersReducedMotion } from "./use-reduced-motion";

interface UseTypingEffectOptions {
  /** Text to type */
  text: string;
  /** Typing speed in ms per character */
  speed?: number;
  /** Delay before starting in ms */
  startDelay?: number;
  /** Whether to show cursor */
  showCursor?: boolean;
  /** Cursor blink duration before fade */
  cursorDuration?: number;
  /** Callback when typing completes */
  onComplete?: () => void;
}

interface UseTypingEffectReturn {
  /** Current displayed text */
  displayText: string;
  /** Whether typing is in progress */
  isTyping: boolean;
  /** Whether cursor should be visible */
  showCursor: boolean;
  /** Whether typing is complete */
  isComplete: boolean;
}

export function useTypingEffect({
  text,
  speed = 50,
  startDelay = 300,
  showCursor: showCursorOption = true,
  cursorDuration = 1500,
  onComplete,
}: UseTypingEffectOptions): UseTypingEffectReturn {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    // If reduced motion, show full text immediately
    if (prefersReducedMotion) {
      setDisplayText(text);
      setIsComplete(true);
      setShowCursor(false);
      onComplete?.();
      return;
    }

    // Reset state
    setDisplayText("");
    setIsTyping(false);
    setIsComplete(false);
    setShowCursor(showCursorOption);

    let currentIndex = 0;
    let typingTimeout: NodeJS.Timeout;
    let cursorTimeout: NodeJS.Timeout;

    // Start typing after delay
    const startTimeout = setTimeout(() => {
      setIsTyping(true);

      const typeNextChar = () => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          currentIndex++;
          
          // Variable speed for more natural feel
          const variation = Math.random() * 30 - 15;
          const nextSpeed = Math.max(20, speed + variation);
          
          typingTimeout = setTimeout(typeNextChar, nextSpeed);
        } else {
          setIsTyping(false);
          setIsComplete(true);
          onComplete?.();

          // Fade out cursor after typing completes
          cursorTimeout = setTimeout(() => {
            setShowCursor(false);
          }, cursorDuration);
        }
      };

      typeNextChar();
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(typingTimeout);
      clearTimeout(cursorTimeout);
    };
  }, [text, speed, startDelay, showCursorOption, cursorDuration, prefersReducedMotion, onComplete]);

  return {
    displayText,
    isTyping,
    showCursor,
    isComplete,
  };
}

/**
 * Multi-line typing effect - types lines sequentially
 */
interface UseMultiLineTypingOptions {
  lines: string[];
  speed?: number;
  lineDelay?: number;
  startDelay?: number;
}

interface MultiLineState {
  currentLine: number;
  displayLines: string[];
  isComplete: boolean;
  showCursor: boolean;
}

export function useMultiLineTyping({
  lines,
  speed = 45,
  lineDelay = 200,
  startDelay = 400,
}: UseMultiLineTypingOptions): MultiLineState {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [state, setState] = useState<MultiLineState>({
    currentLine: 0,
    displayLines: lines.map(() => ""),
    isComplete: false,
    showCursor: true,
  });

  useEffect(() => {
    if (prefersReducedMotion) {
      setState({
        currentLine: lines.length - 1,
        displayLines: [...lines],
        isComplete: true,
        showCursor: false,
      });
      return;
    }

    setState({
      currentLine: 0,
      displayLines: lines.map(() => ""),
      isComplete: false,
      showCursor: true,
    });

    let currentLineIndex = 0;
    let currentCharIndex = 0;
    let timeout: NodeJS.Timeout;

    const startTimeout = setTimeout(() => {
      const typeNext = () => {
        if (currentLineIndex >= lines.length) {
          setState(prev => ({ ...prev, isComplete: true }));
          // Hide cursor after completion
          setTimeout(() => {
            setState(prev => ({ ...prev, showCursor: false }));
          }, 1500);
          return;
        }

        const currentText = lines[currentLineIndex];

        if (currentCharIndex < currentText.length) {
          setState(prev => {
            const newDisplayLines = [...prev.displayLines];
            newDisplayLines[currentLineIndex] = currentText.slice(0, currentCharIndex + 1);
            return {
              ...prev,
              currentLine: currentLineIndex,
              displayLines: newDisplayLines,
            };
          });
          currentCharIndex++;
          const variation = Math.random() * 25 - 12;
          timeout = setTimeout(typeNext, Math.max(20, speed + variation));
        } else {
          // Move to next line
          currentLineIndex++;
          currentCharIndex = 0;
          timeout = setTimeout(typeNext, lineDelay);
        }
      };

      typeNext();
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(timeout);
    };
  }, [lines, speed, lineDelay, startDelay, prefersReducedMotion]);

  return state;
}
