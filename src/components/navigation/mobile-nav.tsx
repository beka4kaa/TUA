"use client";

/**
 * Mobile Navigation Menu
 * 
 * Premium slide-out drawer for mobile navigation.
 * Uses shadcn Sheet component with Framer Motion enhancements.
 * 
 * Features:
 * - Smooth slide animation from right
 * - Background scroll lock when open
 * - Close on ESC and click outside (handled by Sheet)
 * - Accessibility: focus trap, aria-labels
 * - Big tap targets for mobile UX
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { YmitLogo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Who We Are", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Expertise", href: "#expertise" },
  { label: "Results", href: "#results" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

interface MobileNavProps {
  session?: { user?: { name?: string | null } } | null;
}

export function MobileNav({ session }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  // Close menu on ESC key (redundant with Sheet but ensures coverage)
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    
    if (open) {
      document.addEventListener("keydown", handleEsc);
      // Lock body scroll
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Handle link click - close menu after navigation
  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full border border-[#EDEDED] hover:bg-[#F5F5F5] transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5 text-[#111111]" />
        </button>
      </SheetTrigger>
      
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 border-l border-[#EDEDED] bg-white"
      >
        {/* Custom header with logo */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDEDED]">
          <Link href="/" onClick={handleLinkClick}>
            <YmitLogo variant="full" color="black" />
          </Link>
          <SheetClose asChild>
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full border border-[#EDEDED] hover:bg-[#F5F5F5] transition-colors"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5 text-[#111111]" />
            </button>
          </SheetClose>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col px-6 py-8">
          <AnimatePresence>
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: index * 0.05 + 0.1 }
                }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Link
                  href={link.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center justify-between py-4",
                    "font-body text-lg text-[#111111]",
                    "border-b border-[#EDEDED] last:border-b-0",
                    "hover:text-brand-blue transition-colors",
                    "group"
                  )}
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#D4D4D4] group-hover:text-brand-blue group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </nav>

        {/* Auth / CTA section at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-6 border-t border-[#EDEDED] bg-[#FAFAFA]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
            className="space-y-3"
          >
            {session ? (
              <Link
                href="/dashboard"
                onClick={handleLinkClick}
                className="flex items-center justify-center w-full px-6 py-3.5 bg-[#111111] text-white font-body text-sm font-medium rounded-full hover:bg-[#333] transition-colors"
              >
                Go to Dashboard
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  onClick={handleLinkClick}
                  className="flex items-center justify-center w-full px-6 py-3.5 bg-[#8B3B3B] text-white font-body text-sm font-medium rounded-full hover:shadow-lg hover:shadow-[#8B3B3B]/20 transition-all"
                >
                  Get Started
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  href="/login"
                  onClick={handleLinkClick}
                  className="flex items-center justify-center w-full px-6 py-3 text-[#6B6B6B] font-body text-sm hover:text-[#111111] transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </motion.div>
        </div>

        {/* Visually hidden title for accessibility */}
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
