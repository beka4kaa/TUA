"use client";

/**
 * Mixed-media Story Cards — masonry grid
 * ─────────────────────────────────────────────────────────────────────────────
 * Supports three card types that can be mixed freely:
 *
 *  "photo"  – image + title + subtitle (swap coverImage path when ready)
 *  "video"  – embedded video player (set videoUrl to a YouTube/Vimeo embed URL;
 *             while null → styled placeholder with play button)
 *  "quote"  – pull-quote with author attribution, no image required
 *
 * HOW TO ADD / CHANGE CARDS
 * --------------------------
 * Edit the `storyCards` array below.  The masonry layout reflows automatically.
 * Tall quote cards and banner-sized photo cards are controlled with `size`:
 *   "default"  → normal card height
 *   "tall"     → 2× row span (photo / video only, good for hero shots)
 */

import { Play, Quote } from "lucide-react";
import Image from "next/image";
import { AnimatedItem } from "@/components/motion/animations";

// ─── Types ───────────────────────────────────────────────────────────────────

export type StoryCardType = "photo" | "video" | "quote";

export type StoryCardData = {
  id: string;
  type: StoryCardType;

  // shared
  accentColor?: "blue" | "orange";

  // photo / video
  title?: string;
  subtitle?: string;
  year?: string;
  coverImage?: string | null; // null = placeholder
  size?: "default" | "tall";  // "tall" stretches the card in the masonry column

  // video
  videoUrl?: string | null;   // YouTube/Vimeo embed src; null = placeholder

  // quote
  quote?: string;
  author?: string;
  school?: string;
};

// ─── Story card data  ─────────────────────────────────────────────────────────
// TODO: replace coverImage/videoUrl null values with real paths/URLs

export const storyCards: StoryCardData[] = [
  // ── Photo cards ─────────────────────────────────────────────────────────
  {
    id: "harvard-2024",
    type: "photo",
    title: "Harvard Acceptance",
    subtitle: "Full scholarship recipient",
    year: "2024",
    accentColor: "blue",
    coverImage: null,
    size: "tall",
  },
  {
    id: "stanford-2024",
    type: "photo",
    title: "Stanford Admit",
    subtitle: "Computer Science program",
    year: "2024",
    accentColor: "orange",
    coverImage: null,
  },
  {
    id: "oxford-2023",
    type: "photo",
    title: "Oxford Scholar",
    subtitle: "Rhodes Scholarship",
    year: "2023",
    accentColor: "orange",
    coverImage: null,
  },
  {
    id: "mit-2024",
    type: "photo",
    title: "MIT Early Action",
    subtitle: "Engineering major",
    year: "2024",
    accentColor: "blue",
    coverImage: null,
    size: "tall",
  },

  // ── Video cards ─────────────────────────────────────────────────────────
  {
    id: "video-ivy-2024",
    type: "video",
    title: "Ivy League Sweep — Student Story",
    subtitle: "8 acceptances · Class of 2024",
    year: "2024",
    accentColor: "blue",
    videoUrl: null, // TODO: set to YouTube embed URL e.g. "https://www.youtube.com/embed/XXXX"
    coverImage: null,
  },
  {
    id: "video-oxford-2023",
    type: "video",
    title: "From Dubai to Oxford",
    subtitle: "PPE · Class of 2023",
    year: "2023",
    accentColor: "orange",
    videoUrl: null, // TODO: set to YouTube embed URL
    coverImage: null,
    size: "tall",
  },

  // ── Quote cards ─────────────────────────────────────────────────────────
  {
    id: "quote-sarah",
    type: "quote",
    quote:
      "Ymit Academy transformed my application journey. Their strategic guidance helped me secure admission to my dream school with a full scholarship.",
    author: "Sarah Chen",
    school: "Harvard University '24",
    accentColor: "blue",
  },
  {
    id: "quote-alex",
    type: "quote",
    quote:
      "I was rejected from every school I applied to on my own. With Ymit, I got into Stanford, MIT, and Cornell — and chose where I actually wanted to go.",
    author: "Alex Petrov",
    school: "Stanford University '25",
    accentColor: "orange",
  },
  {
    id: "quote-mia",
    type: "quote",
    quote:
      "The essay coaching alone was worth every penny. My personal statement went from generic to genuinely compelling. Oxford said so themselves.",
    author: "Mia Lawson",
    school: "University of Oxford '24",
    accentColor: "blue",
  },
];

// ─── Individual card renderers ────────────────────────────────────────────────

function PhotoCard({ card }: { card: StoryCardData }) {
  const isTall = card.size === "tall";
  const accentBg = card.accentColor === "orange" ? "bg-[#8B3B3B]" : "bg-[#2F3B69]";

  return (
    <div
      className={`group cursor-pointer glass-card p-3 sm:p-4 rounded-xl sm:rounded-2xl hover-lift break-inside-avoid mb-4 sm:mb-5 ${
        isTall ? "row-span-2" : ""
      }`}
    >
      {/* Image / placeholder */}
      <div
        className={`relative ${isTall ? "aspect-[3/4]" : "aspect-[16/10]"} rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4 bg-[#E8EEF3]`}
      >
        {card.coverImage ? (
          <Image
            src={card.coverImage}
            alt={card.title ?? ""}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          /* placeholder */
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#B0BEC5] text-xs font-medium uppercase tracking-wider">
              Photo coming soon
            </span>
          </div>
        )}

        {/* Year badge */}
        {card.year && (
          <div
            className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-medium text-white ${accentBg}`}
          >
            {card.year}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Text */}
      <h3 className="font-medium text-sm sm:text-base text-[#111111] group-hover:text-brand-blue transition-colors">
        {card.title}
      </h3>
      {card.subtitle && (
        <p className="text-[10px] sm:text-xs text-[#6B6B6B] mt-0.5">{card.subtitle}</p>
      )}
    </div>
  );
}

function VideoCard({ card }: { card: StoryCardData }) {
  const isTall = card.size === "tall";
  const accentBg = card.accentColor === "orange" ? "bg-[#8B3B3B]" : "bg-[#2F3B69]";

  return (
    <div
      className={`group cursor-pointer glass-card p-3 sm:p-4 rounded-xl sm:rounded-2xl hover-lift break-inside-avoid mb-4 sm:mb-5 ${
        isTall ? "row-span-2" : ""
      }`}
    >
      {/* Embed or placeholder */}
      <div
        className={`relative ${isTall ? "aspect-[9/16]" : "aspect-video"} rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4 bg-[#0D1B2A]`}
      >
        {card.videoUrl ? (
          <iframe
            src={card.videoUrl}
            title={card.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          /* placeholder while URL is not set */
          <>
            {card.coverImage && (
              <Image
                src={card.coverImage}
                alt={card.title ?? ""}
                fill
                className="object-cover opacity-40"
              />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center group-hover:bg-white/20 group-hover:scale-105 transition-all duration-300">
                <Play className="w-6 h-6 text-white fill-white ml-0.5" />
              </div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">
                Video coming soon
              </p>
            </div>
          </>
        )}

        {/* Year badge */}
        {card.year && (
          <div
            className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-medium text-white z-10 ${accentBg}`}
          >
            {card.year}
          </div>
        )}
      </div>

      <h3 className="font-medium text-sm sm:text-base text-[#111111] group-hover:text-brand-blue transition-colors">
        {card.title}
      </h3>
      {card.subtitle && (
        <p className="text-[10px] sm:text-xs text-[#6B6B6B] mt-0.5">{card.subtitle}</p>
      )}
    </div>
  );
}

function QuoteCard({ card }: { card: StoryCardData }) {
  const isOrange = card.accentColor === "orange";

  return (
    <div
      className={`relative glass-card p-5 sm:p-6 rounded-xl sm:rounded-2xl hover-lift break-inside-avoid mb-4 sm:mb-5 overflow-hidden border ${
        isOrange ? "border-[#8B3B3B]/20" : "border-[#2F3B69]/20"
      }`}
    >
      {/* Background accent */}
      <div
        className={`absolute top-0 left-0 w-1 h-full ${
          isOrange ? "bg-[#8B3B3B]" : "bg-[#2F3B69]"
        }`}
      />

      {/* Quote icon */}
      <Quote
        className={`w-7 h-7 mb-3 ${isOrange ? "text-[#8B3B3B]/30" : "text-[#2F3B69]/30"}`}
      />

      <blockquote className="text-sm sm:text-base text-[#111111] leading-relaxed mb-4 italic">
        &ldquo;{card.quote}&rdquo;
      </blockquote>

      <div className="flex items-center gap-2">
        {/* Avatar placeholder */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
            isOrange ? "bg-[#8B3B3B]" : "bg-[#2F3B69]"
          }`}
        >
          {card.author?.charAt(0) ?? "?"}
        </div>
        <div>
          <p className="text-xs font-semibold text-[#111111]">{card.author}</p>
          <p className="text-[10px] text-[#A3A3A3]">{card.school}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Masonry grid ─────────────────────────────────────────────────────────────

function StoryCard({ card }: { card: StoryCardData }) {
  if (card.type === "video") return <VideoCard card={card} />;
  if (card.type === "quote") return <QuoteCard card={card} />;
  return <PhotoCard card={card} />;
}

export function StoryMasonryGrid() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5">
      {storyCards.map((card, index) => (
        <AnimatedItem key={card.id} index={index}>
          <StoryCard card={card} />
        </AnimatedItem>
      ))}
    </div>
  );
}
