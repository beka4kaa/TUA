"use client";

/**
 * Alumni Logo Wall
 * ─────────────────────────────────────────────────────────────────────────────
 * Displays university logos in a continuous auto-scrolling marquee.
 *
 * HOW TO ADD LOGOS
 * ----------------
 * Each entry has:
 *   - `name`   – display name (shown as text fallback until logo is added)
 *   - `logo`   – path to your SVG/PNG in /public  (set to null until ready)
 *   - `region` – used by the region filter tabs
 *
 * Once you drop the file into /public/logos/universities/, set the `logo`
 * field to e.g. `"/logos/universities/harvard.svg"` and the image will
 * replace the text pill automatically.
 *
 * The marquee row is duplicated so the loop is seamless no matter how many
 * logos you have.  CSS animation is used (no JS scroll loop required).
 */

import Image from "next/image";
import { AnimatedItem } from "@/components/motion/animations";
import { useLanguage } from "@/contexts/language-context";

// ─── Data ────────────────────────────────────────────────────────────────────

export type UniversityEntry = {
  name: string;
  /** Path under /public, e.g. "/logos/universities/harvard.svg". Set null until file is ready. */
  logo: string | null;
  region: "USA" | "Canada" | "UK" | "Europe" | "Asia" | "Australia";
};

export const universities: UniversityEntry[] = [
  // ── USA ──────────────────────────────────────────────────────────────────
  { name: "Harvard",       logo: null, region: "USA" },
  { name: "Yale",          logo: null, region: "USA" },
  { name: "Columbia",      logo: null, region: "USA" },
  { name: "UPenn",         logo: null, region: "USA" },
  { name: "Cornell",       logo: null, region: "USA" },
  { name: "Brown",         logo: null, region: "USA" },
  { name: "NYU",           logo: null, region: "USA" },
  { name: "Georgetown",    logo: null, region: "USA" },
  { name: "U Chicago",     logo: null, region: "USA" },
  { name: "Amherst",       logo: null, region: "USA" },
  { name: "Pomona",        logo: null, region: "USA" },
  { name: "Northwestern",  logo: null, region: "USA" },
  { name: "Northeastern",  logo: null, region: "USA" },
  { name: "Boston U",      logo: null, region: "USA" },
  { name: "Boulder",       logo: null, region: "USA" },
  { name: "UC Berkeley",   logo: null, region: "USA" },
  { name: "UC Irvine",     logo: null, region: "USA" },
  { name: "UCLA",          logo: null, region: "USA" },
  { name: "UCSD",          logo: null, region: "USA" },
  { name: "Stanford",      logo: null, region: "USA" },
  { name: "Caltech",       logo: null, region: "USA" },

  // ── Canada ───────────────────────────────────────────────────────────────
  { name: "U of T",        logo: null, region: "Canada" },
  { name: "UBC",           logo: null, region: "Canada" },
  { name: "McGill",        logo: null, region: "Canada" },

  // ── UK ───────────────────────────────────────────────────────────────────
  { name: "Oxford",        logo: null, region: "UK" },
  { name: "Cambridge",     logo: null, region: "UK" },
  { name: "Imperial",      logo: null, region: "UK" },
  { name: "UCL",           logo: null, region: "UK" },
  { name: "King's",        logo: null, region: "UK" },
  { name: "Warwick",       logo: null, region: "UK" },
  { name: "Bath",          logo: null, region: "UK" },
  { name: "Manchester",    logo: null, region: "UK" },
  { name: "St Andrews",    logo: null, region: "UK" },

  // ── Europe ───────────────────────────────────────────────────────────────
  { name: "TU Delft",           logo: null, region: "Europe" },
  { name: "Amsterdam",          logo: null, region: "Europe" },
  { name: "Sciences Po",        logo: null, region: "Europe" },
  { name: "École Polytechnique",logo: null, region: "Europe" },
  { name: "KU Leuven",          logo: null, region: "Europe" },
  { name: "Polimi",             logo: null, region: "Europe" },
  { name: "Bocconi",            logo: null, region: "Europe" },
  { name: "IE",                 logo: null, region: "Europe" },
  { name: "ESADE",              logo: null, region: "Europe" },
  { name: "Sapienza",           logo: null, region: "Europe" },

  // ── Asia ─────────────────────────────────────────────────────────────────
  { name: "HKUST",         logo: null, region: "Asia" },
  { name: "CUHK",          logo: null, region: "Asia" },
  { name: "HK Poly",       logo: null, region: "Asia" },
  { name: "KAIST",         logo: null, region: "Asia" },
  { name: "Yonsei",        logo: null, region: "Asia" },
  { name: "Waseda",        logo: null, region: "Asia" },
  { name: "Kyoto Tech",    logo: null, region: "Asia" },

  // ── Australia ────────────────────────────────────────────────────────────
  { name: "Melbourne",     logo: null, region: "Australia" },
  { name: "Sydney",        logo: null, region: "Australia" },
];

// ─── Region colour accents (border / badge) ──────────────────────────────────
const REGION_COLORS: Record<UniversityEntry["region"], string> = {
  USA:       "border-[#B3BAD4] text-[#1B5FAA] bg-[#ECEEF5]",
  Canada:    "border-[#D7ABAB] text-[#1B5FAA] bg-[#F5EAEA]",
  UK:        "border-[#8B94B8] text-[#1F2847] bg-[#DDE0ED]",
  Europe:    "border-[#C6CBDF] text-[#1B5FAA] bg-[#F2F3F8]",
  Asia:      "border-[#C38282] text-[#164C88] bg-[#F0E0E0]",
  Australia: "border-[#9BA4C4] text-[#1B5FAA] bg-[#E4E6F0]",
};

// ─── Single logo card ────────────────────────────────────────────────────────
function LogoCard({ uni }: { uni: UniversityEntry }) {
  const colorClass = REGION_COLORS[uni.region];

  return (
    <div
      className="flex-shrink-0 flex flex-col items-center justify-center gap-2
                 w-28 sm:w-32 h-20 sm:h-24
                 bg-white dark:bg-[#1e1e1e] rounded-xl border border-[#EDEDED] dark:border-[#333]
                 shadow-sm hover:shadow-md hover:-translate-y-0.5
                 transition-all duration-200 cursor-default px-3"
      title={`${uni.name} — ${uni.region}`}
    >
      {uni.logo ? (
        /* ── Real logo ── */
        <div className="relative w-16 h-10">
          <Image
            src={uni.logo}
            alt={uni.name}
            fill
            className="object-contain"
          />
        </div>
      ) : (
        /* ── Text fallback until logo file is provided ── */
        <span className="text-[11px] sm:text-xs font-semibold text-[#111111] dark:text-[#F0F0F0] text-center leading-tight">
          {uni.name}
        </span>
      )}

      {/* Region badge */}
      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${colorClass}`}>
        {uni.region}
      </span>
    </div>
  );
}

// ─── Marquee row ─────────────────────────────────────────────────────────────
function MarqueeRow({
  items,
  direction = "left",
  speed = 40,
}: {
  items: UniversityEntry[];
  direction?: "left" | "right";
  speed?: number;
}) {
  // Duplicate array so the loop is visually seamless
  const doubled = [...items, ...items];
  const duration = (items.length * speed) / 10; // seconds

  return (
    <div className="relative overflow-hidden w-full">
      {/* Fade masks on both sides */}
      <div className="pointer-events-none absolute inset-y-0 left-0  w-16 sm:w-24 z-10 bg-gradient-to-r from-white dark:from-[#1A1A1A] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 z-10 bg-gradient-to-l from-white dark:from-[#1A1A1A] to-transparent" />

      <div
        className={`flex gap-3 sm:gap-4 w-max ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((uni, i) => (
          <LogoCard key={`${uni.name}-${i}`} uni={uni} />
        ))}
      </div>
    </div>
  );
}

// ─── Exported section component ──────────────────────────────────────────────
export function AlumniLogoWall() {
  const { t } = useLanguage();
  const usa       = universities.filter((u) => u.region === "USA");
  const canada    = universities.filter((u) => u.region === "Canada");
  const uk        = universities.filter((u) => u.region === "UK");
  const europe    = universities.filter((u) => u.region === "Europe");
  const asia      = universities.filter((u) => u.region === "Asia");
  const australia = universities.filter((u) => u.region === "Australia");

  // Row 1: USA  Row 2: UK + Europe  Row 3: Canada + Asia + Australia
  const row1 = usa;
  const row2 = [...uk, ...europe];
  const row3 = [...canada, ...asia, ...australia];

  return (
    <section
      id="alumni"
      className="relative py-16 sm:py-20 md:py-24 lg:py-32 section-white overflow-hidden"
    >
      <div className="container-rivo relative z-10 mb-10 sm:mb-14">
        <AnimatedItem>
          <p className="text-[10px] sm:text-xs text-[#A3A3A3] uppercase tracking-widest mb-3 sm:mb-4">
            {t.alumni.sectionLabel}
          </p>
          <h2 className="section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#111111] dark:text-[#F0F0F0]">
            {t.alumni.heading.split("\n").map((line, i) => (
              <span key={i}>{line}{i === 0 && <br className="hidden sm:block" />}</span>
            ))}
          </h2>
        </AnimatedItem>
      </div>

      {/* Marquee rows */}
      <div className="flex flex-col gap-4 sm:gap-5">
        <MarqueeRow items={row1} direction="left"  speed={35} />
        <MarqueeRow items={row2} direction="right" speed={40} />
        <MarqueeRow items={row3} direction="left"  speed={38} />
      </div>

      {/* Legend */}
      <div className="container-rivo mt-8 sm:mt-10">
        <AnimatedItem>
          <div className="flex flex-wrap gap-2 justify-center">
            {(Object.keys(REGION_COLORS) as UniversityEntry["region"][]).map((region) => (
              <span
                key={region}
                className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${REGION_COLORS[region]}`}
              >
                {region}
              </span>
            ))}
          </div>
        </AnimatedItem>
      </div>
    </section>
  );
}
