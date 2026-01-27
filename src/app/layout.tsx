import type { Metadata } from "next";
import { DM_Sans, Oswald } from "next/font/google";
// TODO: Uncomment when Gilroy font files are added to src/assets/fonts/
// import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";

/**
 * TYPOGRAPHY SYSTEM
 * ==================
 * Body font: Gilroy (premium geometric sans-serif)
 *   → Use for: paragraphs, nav items, buttons, labels, form text,
 *     card descriptions, footer text, wordmarks
 *   → Class: .font-body (applied to body element by default)
 *   → Fallback: DM Sans (very similar, clean, geometric)
 * 
 * Display font: Oswald (RoadRadio alternative - bold, condensed)
 *   → Use for: ONLY hero headings & section titles
 *   → Class: .font-display, .hero-title, .section-title
 * 
 * TODO: To use Gilroy, place font files in src/assets/fonts/ and uncomment below
 */

// TODO: Uncomment when Gilroy font files are available
// const gilroy = localFont({
//   variable: "--font-gilroy",
//   src: [
//     { path: "../assets/fonts/Gilroy-Regular.woff2", weight: "400", style: "normal" },
//     { path: "../assets/fonts/Gilroy-Medium.woff2", weight: "500", style: "normal" },
//     { path: "../assets/fonts/Gilroy-SemiBold.woff2", weight: "600", style: "normal" },
//     { path: "../assets/fonts/Gilroy-Bold.woff2", weight: "700", style: "normal" },
//   ],
//   display: "swap",
// });

// Body font: DM Sans (Gilroy fallback - very similar geometric sans-serif)
const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Display font: Oswald for headings only
const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ymit Academy - University Admission Consulting",
    template: "%s | Ymit Academy",
  },
  description:
    "Expert guidance for your university admission journey. Get personalized consulting, essay reviews, and application support from Ymit Academy.",
  keywords: [
    "university admission",
    "college consulting",
    "application support",
    "essay review",
    "higher education",
  ],
  authors: [{ name: "Ymit Academy" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ymitacademy.com",
    siteName: "Ymit Academy",
    title: "Ymit Academy - University Admission Consulting",
    description:
      "Expert guidance for your university admission journey. Get personalized consulting and support.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ymit Academy - University Admission Consulting",
    description:
      "Expert guidance for your university admission journey.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${oswald.variable} font-body antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
