import type { Metadata } from "next";
import { DM_Sans, Oswald } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

/**
 * TYPOGRAPHY SYSTEM
 * ==================
 * Body font: DM Sans (Gilroy alternative - clean, geometric, premium)
 *   → Use for: paragraphs, nav items, buttons, labels, form text,
 *     card descriptions, footer text, wordmarks
 *   → Class: .font-body (applied to body element by default)
 * 
 * Display font: Oswald (RoadRadio alternative - bold, condensed)
 *   → Use for: ONLY hero headings & section titles
 *   → Class: .font-display, .hero-title, .section-title
 */

// Body font: DM Sans for all normal text
const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Display font: Oswald for headings only
const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
