"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TuaLogo } from "@/components/brand/logo";
import { FullscreenMenu } from "@/components/navigation/fullscreen-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";

export function HomeNavigation() {
    const { user, isLoading } = useAuth();
    const { resolvedTheme } = useTheme();
    const { t } = useLanguage();
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const isDark = mounted && resolvedTheme === "dark";

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${
                scrolled ? "border-b border-white/40 shadow-sm" : ""
            }`}
        >
            {/* Glassmorphism blur backdrop - separate layer */}
            <div
                className="absolute inset-0 z-0 transition-all duration-300"
                style={{
                    backdropFilter: scrolled ? "blur(18px) saturate(1.8)" : "blur(12px) saturate(1.2)",
                    WebkitBackdropFilter: scrolled ? "blur(18px) saturate(1.8)" : "blur(12px) saturate(1.2)",
                    backgroundColor: scrolled
                        ? isDark ? "rgba(17,17,17,0.75)" : "rgba(255,255,255,0.6)"
                        : isDark ? "rgba(17,17,17,0.55)" : "rgba(246,246,246,0.5)",
                }}
            />
            <div className="container-rivo relative z-10">
                <div className={`flex items-center justify-between transition-all duration-300 ease-in-out ${
                    scrolled ? "h-11 sm:h-12" : "h-14 sm:h-16"
                }`}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <TuaLogo variant="full" color={isDark ? "white" : "black"} />
                    </Link>

                    {/* Center Navigation - hidden on mobile/tablet */}
                    <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                        <Link href="#about" className="font-body text-sm text-[#6B6B6B] hover:text-foreground transition-colors">
                            {t.nav.whoWeAre}
                        </Link>
                        <Link href="#services" className="font-body text-sm text-[#6B6B6B] hover:text-foreground transition-colors">
                            {t.nav.services}
                        </Link>
                        <Link href="#results" className="font-body text-sm text-[#6B6B6B] hover:text-foreground transition-colors">
                            {t.nav.results}
                        </Link>
                        <Link href="#reviews" className="font-body text-sm text-[#6B6B6B] hover:text-foreground transition-colors">
                            {t.nav.reviews}
                        </Link>
                        <Link href="#contact" className="font-body text-sm text-[#6B6B6B] hover:text-foreground transition-colors">
                            {t.nav.contact}
                        </Link>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Language switcher */}
                        <LanguageSwitcher />
                        {/* Theme toggle */}
                        <ThemeToggle />
                        {/* Mobile fullscreen menu - visible on < lg */}
                        <FullscreenMenu />

                        {isLoading ? (
                            <div className="hidden sm:block w-20 h-6 bg-gray-200 animate-pulse rounded" />
                        ) : user ? (
                            <Link
                                href="/dashboard"
                                className="hidden sm:block font-body text-sm font-medium text-[#111111] hover:opacity-70 transition-opacity"
                            >
                                {t.nav.dashboard}
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="hidden lg:block font-body text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors"
                                >
                                    {t.nav.signIn}
                                </Link>
                                <Link
                                    href="/signup"
                                    className="hidden sm:inline-flex group items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 bg-[#111111] text-white font-body text-sm font-medium rounded-full hover:bg-[#333] transition-colors"
                                >
                                    <span className="hidden xs:inline">{t.nav.getStarted}</span>
                                    <span className="xs:hidden">{t.nav.getStarted}</span>
                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
