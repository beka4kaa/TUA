import type { Metadata } from "next";
import { DM_Sans, Oswald } from "next/font/google";
// TODO: Uncomment when Gilroy font files are added to src/assets/fonts/
// import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ChatbotWidget } from "@/components/ui/chatbot-widget";

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
    default: "TUA – Top Universities Advisor",
    template: "%s | TUA",
  },
  description:
    "Expert admissions consulting for undergraduate programs at elite institutions worldwide. TUA – Top Universities Advisor.",
  keywords: [
    "university admission",
    "college consulting",
    "top universities",
    "admissions advisor",
    "application support",
    "essay review",
    "higher education",
  ],
  authors: [{ name: "TUA – Top Universities Advisor" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://topuniversitiesadvisor.com",
    siteName: "TUA – Top Universities Advisor",
    title: "TUA – Top Universities Advisor",
    description:
      "Expert admissions consulting for undergraduate programs at elite institutions worldwide.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TUA – Top Universities Advisor",
    description:
      "Expert admissions consulting for undergraduate programs at elite institutions worldwide.",
  },
  icons: {
    icon: [
      { url: "/brand/tua-favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/brand/tua-favicon.svg",
    apple: "/brand/tua-favicon.svg",
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
        <ChatbotWidget />
      </body>
    </html>
  );
}
