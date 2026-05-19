/**
 * Centralized media asset map for all site images.
 * Single source of truth — no hardcoded paths in components.
 * 
 * NOTE: Only SVG assets are available; no real photos yet.
 * All images are intentionally assigned to minimize repetition.
 */

// === DECORATIVE ELEMENTS ===

export const decorativeAssets = {
  // Large decorative ellipses for background elements
  ellipsesLarge: "/main_page/Elements big.svg",
  ellipsesSmall: "/main_page/Elements big-1.svg",

  // Interactive circle buttons
  contactButton: "/main_page/Contact us button.svg",
  scrollIndicator: "/main_page/Scroll to explore.svg",

  // Social icons (vertical group)
  socialIcons: "/main_page/Social icons.svg",
} as const;

// === ICONS FROM PUBLIC ROOT ===

export const icons = {
  globe: "/globe.svg",      // International / global context
  file: "/file.svg",        // Documents / essays
  window: "/window.svg",    // Online / platform
} as const;

// === HERO SECTION ===

export const heroMedia = {
  // Floating pill next to "STUDENTS" — uses inline Play icon in component
  storyPill: null,

  // Circle next to "GET INTO" — decorative scroll indicator
  decorativeCircle: decorativeAssets.scrollIndicator,

  // Left sidebar — social icons
  socialIcons: decorativeAssets.socialIcons,

  // Scroll indicator (bottom-right) — same element reused in the UI
  scrollIndicator: decorativeAssets.scrollIndicator,
} as const;

// === WHO WE ARE SECTION ===

export const whoWeAreMedia = {
  // Video poster / main section image
  // CTA button as a symbol of "start your journey with us"
  // ellipsesLarge is reserved for Success Stories
  videoPoster: decorativeAssets.contactButton,
  videoPosterAlt: "Start your journey with Stockermans",
} as const;

// === SUCCESS STORIES ===
// Each card must have a UNIQUE visual!
// Asset distribution strategy to minimize repetition:
// - 2 cards with ellipsesLarge (different bgStyle)
// - 1 card with ellipsesSmall
// - 3 cards with distinct icons (window, globe, file)

export type SuccessStory = {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  // Card visual styling
  visual: {
    type: "pattern" | "icon" | "gradient";
    // For pattern — which SVG to use as background
    patternSrc?: string;
    // For icon — which icon to display
    iconSrc?: string;
    // Accent color
    accent: "blue" | "orange" | "neutral";
    // Background style
    bgStyle: "light" | "outline" | "gradient";
  };
};

export const successStories: SuccessStory[] = [
  {
    id: "harvard-2024",
    title: "Harvard Acceptance",
    subtitle: "Full scholarship recipient",
    year: "2024",
    visual: {
      type: "pattern",
      patternSrc: decorativeAssets.ellipsesLarge, // First use of ellipsesLarge
      accent: "blue",
      bgStyle: "light",
    },
  },
  {
    id: "stanford-2024",
    title: "Stanford Admit",
    subtitle: "Computer Science program",
    year: "2024",
    visual: {
      type: "icon",
      iconSrc: icons.window, // Tech/CS context
      accent: "orange",
      bgStyle: "outline",
    },
  },
  {
    id: "mit-2024",
    title: "MIT Early Action",
    subtitle: "Engineering major",
    year: "2024",
    visual: {
      type: "pattern",
      patternSrc: decorativeAssets.ellipsesSmall, // Single use of ellipsesSmall in Success Stories
      accent: "blue",
      bgStyle: "gradient",
    },
  },
  {
    id: "oxford-2023",
    title: "Oxford Scholar",
    subtitle: "Rhodes Scholarship",
    year: "2023",
    visual: {
      type: "icon",
      iconSrc: icons.globe, // International / UK
      accent: "orange",
      bgStyle: "light",
    },
  },
  {
    id: "ivy-sweep-2023",
    title: "Ivy League Sweep",
    subtitle: "8 acceptances",
    year: "2023",
    visual: {
      type: "pattern",
      patternSrc: decorativeAssets.ellipsesLarge, // Second use of ellipsesLarge (different bgStyle)
      accent: "blue",
      bgStyle: "gradient",
    },
  },
  {
    id: "wharton-2023",
    title: "McKinsey Scholar",
    subtitle: "MBA at Wharton",
    year: "2023",
    visual: {
      type: "icon",
      iconSrc: icons.file, // Business / Documents / Essays
      accent: "neutral",
      bgStyle: "outline",
    },
  },
];

// === REVIEWS SECTION ===

export const reviewsMedia = {
  // Video testimonial poster
  // Social icons as a symbol of communication / reviews (unique to this section)
  videoPoster: decorativeAssets.socialIcons,
  videoPosterAlt: "Student testimonial and success story",
} as const;

// === GALLERY "WE ARE Stockermans" ===
// 4 unique visuals for the gallery — no duplicates!
// Strategy: all available icons + ellipsesSmall (less used in other sections)

export type GalleryItem = {
  id: string;
  alt: string;
  visual: {
    type: "pattern" | "icon";
    patternSrc?: string;
    iconSrc?: string;
    accent: "blue" | "orange" | "neutral";
  };
};

export const galleryItems: GalleryItem[] = [
  {
    id: "gallery-1",
    alt: "Team collaboration session",
    visual: {
      type: "pattern",
      patternSrc: decorativeAssets.ellipsesSmall, // Second use of ellipsesSmall (first — MIT)
      accent: "blue",
    },
  },
  {
    id: "gallery-2",
    alt: "Student consultation meeting",
    visual: {
      type: "icon",
      iconSrc: icons.globe, // Global reach — second use of globe (first — Oxford)
      accent: "orange",
    },
  },
  {
    id: "gallery-3",
    alt: "Office workspace and documents",
    visual: {
      type: "icon",
      iconSrc: icons.file, // Documents — second use of file (first — Wharton)
      accent: "neutral",
    },
  },
  {
    id: "gallery-4",
    alt: "Digital learning platform",
    visual: {
      type: "icon",
      iconSrc: icons.window, // Online platform — second use of window (first — Stanford)
      accent: "blue",
    },
  },
];

// === CONTACT SECTION ===

export const contactMedia = {
  // Decorative element for the contact section
  decorative: decorativeAssets.contactButton,
} as const;

// === FOOTER ===

export const footerMedia = {
  socialIcons: decorativeAssets.socialIcons,
} as const;
