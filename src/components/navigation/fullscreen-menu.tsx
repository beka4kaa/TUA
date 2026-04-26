"use client";

/**
 * Premium Mega Menu - Rivo Agency Style
 * 
 * Full-screen overlay mega menu with:
 * - 2-column layout (primary nav left + grouped sections right)
 * - Portal to document.body (escapes stacking contexts)
 * - Scroll lock while open
 * - Smooth Framer Motion animations
 * - Proper anchor navigation
 * - Gilroy/DM Sans typography
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { TuaLogo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";

// Primary navigation links (left column - large text)
const primaryLinkHrefs = [
  { key: "home" as const, href: "#top" },
  { key: "whoWeAre" as const, href: "#about" },
  { key: "services" as const, href: "#services" },
  { key: "results" as const, href: "#results" },
  { key: "reviews" as const, href: "#reviews" },
  { key: "contact" as const, href: "#contact" },
];

// Grouped sections (right column - like reference)
// Now built dynamically from translations in the component

// Footer contact info
const footerInfo = {
  tagline: "LET'S MAKE SOMETHING THAT MATTERS",
  address: "Almaty, Kazakhstan\nAl-Farabi Ave, 77",
  countries: [
    { name: "Kazakhstan", phone: "+7 777 777 7777" },
    { name: "International", phone: "+1 234 567 8900" },
  ],
  email: "topuniversitiesadvisors@gmail.com",
};

export function FullscreenMenu() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const scrollYRef = useRef(0);

  // Build dynamic link arrays from translations
  const primaryLinks = primaryLinkHrefs.map((item) => ({
    label: t.nav[item.key],
    href: item.href,
  }));

  const groupedSections = [
    {
      title: t.menu.services.title,
      links: [
        { label: t.menu.services.strategy, href: "#services" },
        { label: t.menu.services.essays, href: "#services" },
        { label: t.menu.services.interview, href: "#services" },
        { label: t.menu.services.scholarship, href: "#services" },
      ],
    },
    {
      title: t.menu.regions.title,
      links: [
        { label: t.menu.regions.usCanada, href: "#about" },
        { label: t.menu.regions.uk, href: "#about" },
        { label: t.menu.regions.europe, href: "#about" },
        { label: t.menu.regions.asia, href: "#about" },
      ],
    },
    {
      title: t.menu.getStarted.title,
      links: [
        { label: t.menu.getStarted.book, href: "/signup" },
        { label: t.menu.getStarted.studentDashboard, href: "/dashboard" },
      ],
    },
  ];

  // Client-side only mounting for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      scrollYRef.current = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollYRef.current);
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleTabKey);
    firstElement?.focus();
    return () => window.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

  // Handle anchor link clicks - close menu first, then smooth scroll
  const handleAnchorClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Real page links — just close menu and let browser navigate normally
    if (!href.startsWith("#")) {
      setIsOpen(false);
      return;
    }

    e.preventDefault();
    setIsOpen(false);

    setTimeout(() => {
      if (href === "#top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
        return;
      }

      const targetId = href.replace("#", "");
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
      window.history.pushState(null, "", href);
    }, 300);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Animation variants
  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  const contentVariants = {
    closed: { opacity: 0, y: -10 },
    open: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.05, duration: 0.3, ease: "easeOut" as const }
    },
  };

  const staggerContainer = {
    open: {
      transition: { staggerChildren: 0.04, delayChildren: 0.1 }
    }
  };

  const linkVariants = {
    closed: { opacity: 0, x: -15 },
    open: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.25, ease: "easeOut" as const }
    },
  };

  const sectionVariants = {
    closed: { opacity: 0, y: 15 },
    open: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" as const }
    },
  };

  // Menu overlay content
  const menuOverlay = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          id="fullscreen-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          initial="closed"
          animate="open"
          exit="closed"
          variants={overlayVariants}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex flex-col bg-[#F4F4F4] dark:bg-[#111111] overflow-y-auto font-body"
          style={{ pointerEvents: 'auto' }}
        >
          {/* ===== TOP BAR ===== */}
          <motion.header 
            variants={contentVariants}
            className="flex items-center justify-between px-6 md:px-10 lg:px-16 py-5 md:py-6 border-b border-[#E5E5E5] dark:border-[#2a2a2a]"
          >
            <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center">
              <TuaLogo variant="full" color="black" />
            </Link>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <ThemeToggle />
              <button
                onClick={handleClose}
                className="flex items-center gap-3 text-[#111] dark:text-white hover:text-[#666] dark:hover:text-[#aaa] transition-colors group"
                aria-label="Close navigation menu"
              >
                <span className="text-sm font-medium tracking-[0.1em] uppercase">{t.nav.close}</span>
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" strokeWidth={1.5} />
              </button>
            </div>
          </motion.header>

          {/* ===== MAIN CONTENT - 2 COLUMN LAYOUT ===== */}
          <div className="flex-1 px-6 md:px-10 lg:px-16 py-8 md:py-10 lg:py-12">
            <div className="max-w-[1400px] mx-auto h-full">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8 lg:gap-12 xl:gap-20">
                
                {/* ===== LEFT COLUMN - PRIMARY NAV ===== */}
                <motion.nav 
                  variants={staggerContainer}
                  className="space-y-0"
                >
                  {primaryLinks.map((link, index) => (
                    <motion.div key={link.href} variants={linkVariants} custom={index}>
                      <a
                        href={link.href}
                        onClick={(e) => handleAnchorClick(e, link.href)}
                        className={cn(
                          "block py-1.5 md:py-2",
                          "text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[2.75rem] xl:text-[3rem]",
                          "font-semibold text-[#111] dark:text-[#F0F0F0] leading-[1.15] tracking-[-0.02em]",
                          "hover:text-brand-blue transition-colors duration-200",
                          "relative group cursor-pointer inline-flex items-center gap-2"
                        )}
                      >
                        {link.label}
                      </a>
                    </motion.div>
                  ))}
                </motion.nav>

                {/* ===== RIGHT COLUMN - GROUPED SECTIONS ===== */}
                <motion.div 
                  variants={staggerContainer}
                  className="space-y-6 md:space-y-8 lg:pt-1"
                >
                  {groupedSections.map((section, sectionIndex) => (
                    <motion.div 
                      key={section.title} 
                      variants={sectionVariants}
                      custom={sectionIndex}
                      className="space-y-3"
                    >
                      {/* Section heading */}
                      <h3 className="text-xl md:text-2xl font-semibold text-[#111] dark:text-[#F0F0F0] tracking-tight">
                        {section.title}
                      </h3>
                      
                      {/* Links row - inline like reference */}
                      <div className="flex flex-wrap gap-x-5 gap-y-1">
                        {section.links.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            onClick={(e) => handleAnchorClick(e, link.href)}
                            className={cn(
                              "text-sm md:text-base text-[#777] dark:text-[#888] hover:text-[#111] dark:hover:text-[#F0F0F0]",
                              "transition-colors duration-200 cursor-pointer",
                              "hover:underline underline-offset-2"
                            )}
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>

          {/* ===== FOOTER CARD (like reference) ===== */}
          <motion.footer 
            variants={contentVariants}
            className="px-6 md:px-10 lg:px-16 pb-6 md:pb-8"
          >
            <div className="max-w-[1400px] mx-auto">
              <div className="border border-[#E0E0E0] dark:border-[#2a2a2a] rounded-xl overflow-hidden">
                {/* Tagline row */}
                <div className="px-6 py-5 border-b border-[#E0E0E0] dark:border-[#2a2a2a]">
                  <p className="text-sm md:text-base tracking-[0.1em] uppercase text-[#111] dark:text-[#F0F0F0] font-medium">
                    {footerInfo.tagline}
                  </p>
                </div>
                
                {/* Info row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E0E0E0] dark:divide-[#2a2a2a]">
                  {/* Address */}
                  <div className="px-6 py-5">
                    <p className="text-xs text-[#999] uppercase tracking-wider mb-2">Address</p>
                    <p className="text-sm text-[#111] dark:text-[#D0D0D0] whitespace-pre-line">{footerInfo.address}</p>
                  </div>
                  
                  {/* Social */}
                  <div className="px-6 py-5 flex items-center gap-3">
                    <a href="#" className="w-9 h-9 rounded-full border border-[#D0D0D0] flex items-center justify-center text-[#666] hover:border-[#111] hover:text-[#111] transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                    </a>
                    <a href="#" className="w-9 h-9 rounded-full border border-[#D0D0D0] flex items-center justify-center text-[#666] hover:border-[#111] hover:text-[#111] transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                    <a href="#" className="w-9 h-9 rounded-full border-2 border-[#2F3B69] flex items-center justify-center text-[#2F3B69] hover:bg-[#2F3B69] hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                  </div>
                  
                  {/* Phone 1 */}
                  <div className="px-6 py-5">
                    <p className="text-xs text-[#999] dark:text-[#666] uppercase tracking-wider mb-2">{footerInfo.countries[0].name}</p>
                    <a href={`tel:${footerInfo.countries[0].phone}`} className="text-sm text-[#111] dark:text-[#D0D0D0] hover:underline">
                      {footerInfo.countries[0].phone}
                    </a>
                  </div>
                  
                  {/* Phone 2 */}
                  <div className="px-6 py-5">
                    <p className="text-xs text-[#999] dark:text-[#666] uppercase tracking-wider mb-2">{footerInfo.countries[1].name}</p>
                    <a href={`tel:${footerInfo.countries[1].phone}`} className="text-sm text-[#111] dark:text-[#D0D0D0] hover:underline">
                      {footerInfo.countries[1].phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.footer>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full border border-[#EDEDED] dark:border-[#333] hover:bg-[#F5F5F5] dark:hover:bg-[#2a2a2a] transition-colors"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="fullscreen-menu"
      >
        <Menu className="w-5 h-5 text-[#111111]" />
      </button>

      {/* Portal: Render menu at document.body to escape stacking contexts */}
      {mounted && createPortal(menuOverlay, document.body)}
    </>
  );
}

export default FullscreenMenu;
