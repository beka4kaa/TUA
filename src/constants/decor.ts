/**
 * Decoration System Configuration
 * Maps decorative elements to specific sections
 * Based on Rivo agency reference style
 */

export const decorConfig = {
  // Global decorations (fixed position)
  global: {
    rightCircle: {
      position: "fixed",
      placement: "right-[-200px] top-[20%]",
      size: "w-[500px] h-[500px]",
      opacity: 0.06,
      color: "gray" as const,
      type: "circleOutline",
    },
  },

  // Hero section decorations
  hero: {
    topLeftCircle: {
      placement: "absolute -top-32 -left-32",
      size: "w-[400px] h-[400px]",
      opacity: 0.08,
      color: "gray" as const,
      type: "circleOutline",
    },
    bottomRightDots: {
      placement: "absolute bottom-32 right-20",
      size: "w-32 h-32",
      opacity: 0.15,
      color: "blue" as const,
      type: "gridDots",
    },
    accentDots: {
      placement: "absolute top-1/3 left-8",
      size: "",
      opacity: 1,
      type: "accentDots",
    },
  },

  // Who We Are section
  whoWeAre: {
    topographic: {
      placement: "absolute top-10 right-0",
      size: "w-72 h-48",
      opacity: 0.08,
      color: "blue" as const,
      type: "topographic",
    },
    bottomLeftCircle: {
      placement: "absolute -bottom-20 -left-20",
      size: "w-48 h-48",
      opacity: 0.05,
      color: "gray" as const,
      type: "dottedCircle",
    },
  },

  // Services section
  services: {
    wavyLine: {
      placement: "absolute bottom-0 left-0 w-full",
      size: "h-24",
      opacity: 0.06,
      color: "gray" as const,
      type: "wavyLine",
    },
    rightDots: {
      placement: "absolute top-1/2 -right-10",
      size: "w-24 h-24",
      opacity: 0.1,
      color: "blue" as const,
      type: "gridDots",
    },
  },

  // Expertise section
  expertise: {
    topLeftGrid: {
      placement: "absolute top-10 left-10",
      size: "w-36 h-36",
      opacity: 0.12,
      color: "gray" as const,
      type: "gridDots",
    },
    bottomCircle: {
      placement: "absolute -bottom-24 right-1/4",
      size: "w-48 h-48",
      opacity: 0.05,
      color: "blue" as const,
      type: "circleOutline",
    },
  },

  // Success Stories / Projects section
  projects: {
    leftCircle: {
      placement: "absolute -left-40 top-1/2 -translate-y-1/2",
      size: "w-80 h-80",
      opacity: 0.06,
      color: "blue" as const,
      type: "circleOutline",
    },
    topRightDots: {
      placement: "absolute top-20 right-10",
      size: "w-20 h-20",
      opacity: 0.1,
      color: "gray" as const,
      type: "gridDots",
    },
  },

  // Reviews section
  reviews: {
    topographic: {
      placement: "absolute top-0 right-0",
      size: "w-64 h-40",
      opacity: 0.06,
      color: "orange" as const,
      type: "topographic",
    },
  },

  // Gallery/Team section
  gallery: {
    bottomTopographic: {
      placement: "absolute bottom-0 right-0",
      size: "w-96 h-48",
      opacity: 0.05,
      color: "orange" as const,
      type: "topographic",
    },
    leftDots: {
      placement: "absolute top-1/3 -left-10",
      size: "w-20 h-20",
      opacity: 0.08,
      color: "gray" as const,
      type: "gridDots",
    },
  },

  // Contact section
  contact: {
    topCircle: {
      placement: "absolute -top-20 left-1/4",
      size: "w-40 h-40",
      opacity: 0.05,
      color: "gray" as const,
      type: "dottedCircle",
    },
  },
} as const;

// Helper to get decoration opacity range
export const opacityRange = {
  verySubtle: 0.04,
  subtle: 0.06,
  light: 0.08,
  medium: 0.12,
  visible: 0.15,
  accent: 0.2,
} as const;
