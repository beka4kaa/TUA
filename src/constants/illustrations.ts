/**
 * Centralized Illustration Mapping - Single Source of Truth
 * 
 * ALL mini-illustrations must be referenced through this file.
 * No hardcoded paths in components. No emojis.
 * 
 * Style: Minimal, editorial, subtle outlines with brand accents
 * Brand Colors:
 * - Primary Blue: #2F3B69
 * - Primary Red: #8B3B3B
 */

// === ILLUSTRATION PATHS ===
export const illustrationPaths = {
  strategyRoadmap: "/illustrations/strategy-roadmap.svg",
  essayWriting: "/illustrations/essay-writing.svg",
  scholarships: "/illustrations/scholarships.svg",
  interviewPrep: "/illustrations/interview-prep.svg",
  universitySearch: "/illustrations/university-search.svg",
  successResults: "/illustrations/success-results.svg",
  documentsReview: "/illustrations/documents-review.svg",
  globalReach: "/illustrations/global-reach.svg",
  graduation: "/illustrations/graduation.svg",
  mentorship: "/illustrations/mentorship.svg",
} as const;

// === HERO CHIPS ILLUSTRATIONS ===
export type HeroChipConfig = {
  label: string;
  illustration: string;
  variant: "default" | "blue" | "orange" | "outline";
};

export const heroChips: HeroChipConfig[] = [
  {
    label: "Essay Review",
    illustration: illustrationPaths.essayWriting,
    variant: "blue",
  },
  {
    label: "Strategy",
    illustration: illustrationPaths.strategyRoadmap,
    variant: "default",
  },
  {
    label: "Scholarships",
    illustration: illustrationPaths.scholarships,
    variant: "orange",
  },
  {
    label: "UG / Grad",
    illustration: illustrationPaths.graduation,
    variant: "outline",
  },
];

// === FLOATING CHIPS (Desktop hero) ===
export type FloatingChipConfig = {
  label: string;
  illustration: string;
  variant: "default" | "blue" | "orange";
  position: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  delay: number;
};

export const floatingChips: FloatingChipConfig[] = [
  {
    label: "Essay Review",
    illustration: illustrationPaths.essayWriting,
    variant: "blue",
    position: { top: "18%", right: "12%" },
    delay: 0,
  },
  {
    label: "Scholarships",
    illustration: illustrationPaths.scholarships,
    variant: "orange",
    position: { bottom: "28%", left: "8%" },
    delay: 0.15,
  },
  {
    label: "Interview Prep",
    illustration: illustrationPaths.interviewPrep,
    variant: "default",
    position: { top: "35%", left: "5%" },
    delay: 0.3,
  },
];

// === SERVICES ICONS ===
export type ServiceIconConfig = {
  serviceNumber: string;
  illustration: string;
  alt: string;
};

export const servicesIcons: ServiceIconConfig[] = [
  {
    serviceNumber: "01",
    illustration: illustrationPaths.universitySearch,
    alt: "University shortlist and strategy planning",
  },
  {
    serviceNumber: "02",
    illustration: illustrationPaths.essayWriting,
    alt: "Essay and personal statement review",
  },
  {
    serviceNumber: "03",
    illustration: illustrationPaths.scholarships,
    alt: "Scholarship and financial aid guidance",
  },
  {
    serviceNumber: "04",
    illustration: illustrationPaths.interviewPrep,
    alt: "Interview preparation and documents",
  },
];

// === SUCCESS STORIES COVERS ===
// Each story has a unique cover illustration/pattern
export type SuccessStoryCoverConfig = {
  storyId: string;
  coverPattern: string;
  accentIllustration: string;
  patternOpacity: number;
};

export const successStoriesCovers: SuccessStoryCoverConfig[] = [
  {
    storyId: "harvard-2024",
    coverPattern: "/illustrations/patterns/topo-blue.svg",
    accentIllustration: illustrationPaths.graduation,
    patternOpacity: 0.08,
  },
  {
    storyId: "stanford-2024",
    coverPattern: "/illustrations/patterns/topo-orange.svg",
    accentIllustration: illustrationPaths.successResults,
    patternOpacity: 0.08,
  },
  {
    storyId: "mit-2024",
    coverPattern: "/illustrations/patterns/dots-blue.svg",
    accentIllustration: illustrationPaths.strategyRoadmap,
    patternOpacity: 0.1,
  },
  {
    storyId: "oxford-2023",
    coverPattern: "/illustrations/patterns/topo-orange.svg",
    accentIllustration: illustrationPaths.globalReach,
    patternOpacity: 0.08,
  },
  {
    storyId: "ivy-sweep-2023",
    coverPattern: "/illustrations/patterns/dots-blue.svg",
    accentIllustration: illustrationPaths.successResults,
    patternOpacity: 0.1,
  },
  {
    storyId: "wharton-2023",
    coverPattern: "/illustrations/patterns/topo-blue.svg",
    accentIllustration: illustrationPaths.mentorship,
    patternOpacity: 0.08,
  },
];

// Helper to get cover config by story ID
export function getSuccessStoryCover(storyId: string): SuccessStoryCoverConfig | undefined {
  return successStoriesCovers.find(cover => cover.storyId === storyId);
}

// Helper to get service icon by number
export function getServiceIcon(serviceNumber: string): ServiceIconConfig | undefined {
  return servicesIcons.find(icon => icon.serviceNumber === serviceNumber);
}
