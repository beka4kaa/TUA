/**
 * Motion Constants - Centralized animation values
 * 
 * All interactive motion parameters in one place.
 * Easy to tweak or disable globally.
 */

// === FEATURE FLAGS ===
export const ENABLE_HERO_INTERACTIVITY = true;
export const ENABLE_SCROLL_MOTION = true;
export const ENABLE_HERO_TYPING = true;

// === TIMING & EASING ===
export const MOTION = {
  // Easing curves
  easing: {
    smooth: [0.22, 1, 0.36, 1] as const,
    bounce: [0.34, 1.56, 0.64, 1] as const,
    gentle: [0.4, 0, 0.2, 1] as const,
    out: [0, 0, 0.2, 1] as const,
  },
  
  // Durations (seconds)
  duration: {
    instant: 0.1,
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    reveal: 0.6,
    shimmer: 8, // Headline shimmer loop
  },
} as const;

// === SCROLL ANIMATIONS ===
export const SCROLL_MOTION = {
  // Section reveal
  section: {
    y: 24, // Initial translate
    duration: 0.6,
    stagger: 0.08,
  },
  
  // Card animations
  card: {
    y: 20,
    duration: 0.5,
    stagger: 0.1,
  },
  
  // Parallax
  parallax: {
    speed: 0.15, // 0-1, how much slower element moves
    maxOffset: 50, // Max px offset
  },
  
  // Line draw
  line: {
    duration: 0.8,
  },
  
  // Stats count-up
  countUp: {
    duration: 2000, // ms
    delay: 200,
  },
} as const;

// === TYPING EFFECT ===
export const TYPING_CONFIG = {
  speed: 40, // ms per character
  lineDelay: 150, // ms between lines
  startDelay: 500, // ms before typing starts
  cursorDuration: 1500, // ms cursor blinks after completion
} as const;

// === HERO CHIPS ===
export const CHIP_MOTION = {
  // Hover "escape" movement
  hover: {
    maxTranslate: 4, // px - max distance chip moves away from cursor
    magnetStrength: 0.15, // 0-1, subtle magnetic pull before escape
    shadowOpacity: 0.08, // Shadow on hover
    duration: 0.25,
  },
  
  // Click expand
  expand: {
    height: 80, // px - expanded popover height
    duration: 0.3,
  },
} as const;

// === HERO HEADLINE ===
export const HEADLINE_MOTION = {
  // Parallax (cursor-based movement)
  parallax: {
    maxOffset: 4, // px - max headline movement
    smoothing: 0.08, // Lower = smoother/slower response
  },
  
  // Shimmer effect on accent text
  shimmer: {
    enabled: true,
    duration: 8, // seconds for full cycle
    intensity: 0.15, // How visible the shimmer is (0-1)
  },
} as const;

// === BACKGROUND PARTICLES ===
export const PARTICLES = {
  count: 35, // Number of particles (keep low)
  minSize: 1.5, // px
  maxSize: 3, // px
  baseOpacity: 0.06, // Very subtle
  
  // Movement
  drift: {
    maxSpeed: 0.3, // Base drift speed
    cursorInfluence: 0.02, // How much cursor affects position
    returnSpeed: 0.03, // How fast particles return to origin
  },
  
  // Colors (use brand colors at low opacity)
  colors: {
    primary: "rgba(40, 84, 124, 0.12)", // Brand blue
    secondary: "rgba(230, 126, 34, 0.08)", // Brand orange
    neutral: "rgba(107, 107, 107, 0.06)", // Gray
  },
} as const;

// === CHIP CONTENT (for expandable popovers) ===
export const CHIP_EXPAND_CONTENT: Record<string, { title: string; description: string }> = {
  "Essay Review": {
    title: "Essay & Statement Writing",
    description: "Structure, voice refinement, iterative edits, and final polish to make your story shine.",
  },
  "Strategy": {
    title: "Application Strategy",
    description: "Personalized university shortlist, timeline planning, and positioning for success.",
  },
  "Scholarships": {
    title: "Scholarship Guidance",
    description: "Aid strategy, documentation prep, and deadline management for maximum funding.",
  },
  "Interview Prep": {
    title: "Interview Preparation",
    description: "Mock interviews, feedback sessions, and confidence building for admissions day.",
  },
  "UG / Grad": {
    title: "All Levels",
    description: "Expert guidance for undergraduate, graduate, MBA, and PhD applications.",
  },
};
