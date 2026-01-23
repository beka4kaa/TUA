/**
 * Centralized Asset Mapping - Single Source of Truth
 * 
 * ALL images/vectors must be referenced through this file.
 * No hardcoded paths in components.
 * 
 * Brand Colors (LOCKED):
 * - Primary Blue: #28547C
 * - Primary Orange: #E67E22
 */

// === HERO SECTION ASSETS ===
export const heroAssets = {
  // Media pills integrated with headline
  pills: {
    video: "/vectors/hero-pill-video.svg",
    target: "/vectors/hero-pill-target.svg",
    photo: "/vectors/hero-pill-photo.svg",
  },
  // Background decorative elements
  decorative: {
    circleOutline: "/vectors/hero-circle.svg",
    dotsPattern: "/vectors/dots-pattern.svg",
  },
  // Scroll indicator
  scrollIndicator: "/main_page/Scroll to explore.svg",
  socialIcons: "/main_page/Social icons.svg",
} as const;

// === WHO WE ARE SECTION ===
export const whoWeAreAssets = {
  videoPoster: "/vectors/consultation-scene.svg",
  videoPosterAlt: "Team consultation session",
  backgroundPattern: "/vectors/who-we-are-bg.svg",
} as const;

// === SUCCESS STORIES COVERS ===
// Each story has a UNIQUE cover design
export const successStoriesAssets = {
  harvard: {
    cover: "/vectors/topographic-1.svg",
    icon: "/vectors/university-icon.svg",
  },
  stanford: {
    cover: "/vectors/topographic-2.svg",
    icon: "/vectors/graduation-cap.svg",
  },
  mit: {
    cover: "/vectors/topographic-3.svg",
    icon: "/vectors/scholarship-icon.svg",
  },
  oxford: {
    cover: "/vectors/topographic-4.svg",
    icon: "/vectors/university-icon.svg",
  },
  ivyLeague: {
    cover: "/vectors/topographic-5.svg",
    icon: "/vectors/graduation-cap.svg",
  },
  wharton: {
    cover: "/vectors/topographic-6.svg",
    icon: "/vectors/scholarship-icon.svg",
  },
} as const;

// === REVIEWS SECTION ===
export const reviewsAssets = {
  videoPoster: "/vectors/review-poster.svg",
  videoPosterAlt: "Student testimonial video",
} as const;

// === GALLERY (WE ARE YMIT ACADEMY) ===
// Each gallery item is unique
export const galleryAssets = {
  photos: [
    { src: "/vectors/team-1.svg", alt: "Team collaboration session" },
    { src: "/vectors/team-2.svg", alt: "Student consultation meeting" },
    { src: "/vectors/team-3.svg", alt: "Office workspace" },
    { src: "/vectors/team-4.svg", alt: "Digital learning platform" },
  ],
} as const;

// === FOOTER ===
export const footerAssets = {
  socialIcons: "/main_page/Social icons.svg",
} as const;

// === SUCCESS STORIES DATA ===
export type SuccessStory = {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  coverImage: string;
  accentColor: "blue" | "orange";
};

export const successStories: SuccessStory[] = [
  {
    id: "harvard-2024",
    title: "Harvard Acceptance",
    subtitle: "Full scholarship recipient",
    year: "2024",
    coverImage: successStoriesAssets.harvard.cover,
    accentColor: "blue",
  },
  {
    id: "stanford-2024",
    title: "Stanford Admit",
    subtitle: "Computer Science program",
    year: "2024",
    coverImage: successStoriesAssets.stanford.cover,
    accentColor: "orange",
  },
  {
    id: "mit-2024",
    title: "MIT Early Action",
    subtitle: "Engineering major",
    year: "2024",
    coverImage: successStoriesAssets.mit.cover,
    accentColor: "blue",
  },
  {
    id: "oxford-2023",
    title: "Oxford Scholar",
    subtitle: "Rhodes Scholarship",
    year: "2023",
    coverImage: successStoriesAssets.oxford.cover,
    accentColor: "orange",
  },
  {
    id: "ivy-sweep-2023",
    title: "Ivy League Sweep",
    subtitle: "8 acceptances",
    year: "2023",
    coverImage: successStoriesAssets.ivyLeague.cover,
    accentColor: "blue",
  },
  {
    id: "wharton-2023",
    title: "McKinsey Scholar",
    subtitle: "MBA at Wharton",
    year: "2023",
    coverImage: successStoriesAssets.wharton.cover,
    accentColor: "orange",
  },
];

// === STATS DATA ===
export const stats = [
  { value: "2019", label: "Founded" },
  { value: "500+", label: "Students" },
  { value: "95%", label: "Success Rate" },
  { value: "50+", label: "Countries" },
];

// === SERVICES DATA ===
export const services = [
  {
    number: "01",
    title: "University Shortlist & Strategy",
    description: "We analyze your profile, goals, and preferences to create a tailored list of universities where you have the best chances of admission and fit.",
  },
  {
    number: "02",
    title: "Essays & Personal Statement",
    description: "Our experts help you craft compelling narratives that showcase your unique story, achievements, and potential to admission committees.",
  },
  {
    number: "03",
    title: "Scholarships & Financial Aid",
    description: "We identify scholarship opportunities and guide you through applications to maximize your chances of receiving financial support.",
  },
  {
    number: "04",
    title: "Interview Prep & Documents",
    description: "Comprehensive preparation for admission interviews, plus review and polishing of all supporting documents and recommendations.",
  },
];

// === EXPERTISE AREAS ===
export const expertiseAreas = [
  { name: "USA & Canada", count: "150+" },
  { name: "United Kingdom", count: "80+" },
  { name: "Europe", count: "120+" },
  { name: "Asia & Australia", count: "60+" },
  { name: "Undergraduate Programs", count: "200+" },
  { name: "Graduate & MBA", count: "180+" },
  { name: "Scholarships", count: "$2M+" },
];
