"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { YmitLogo } from "@/components/brand/logo";
import { FullscreenMenu } from "@/components/navigation/fullscreen-menu";
import { useAuth } from "@/contexts/auth-context";

export function HomeNavigation() {
    const { user, isLoading } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full glass-nav">
            <div className="container-rivo">
                <div className="flex h-14 sm:h-16 items-center justify-between">
                    {/* Logo - New minimal design */}
                    <Link href="/" className="flex items-center">
                        <YmitLogo variant="full" color="black" />
                    </Link>

                    {/* Center Navigation - hidden on mobile/tablet */}
                    <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                        <Link href="#about" className="font-body text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors">
                            Who We Are
                        </Link>
                        <Link href="#services" className="font-body text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors">
                            Services
                        </Link>
                        <Link href="#expertise" className="font-body text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors">
                            Expertise
                        </Link>
                        <Link href="#results" className="font-body text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors">
                            Results
                        </Link>
                        <Link href="#reviews" className="font-body text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors">
                            Reviews
                        </Link>
                        <Link href="/blog" className="font-body text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors">
                            Blog
                        </Link>
                        <Link href="#contact" className="font-body text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors">
                            Contact
                        </Link>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Mobile fullscreen menu - visible on < lg */}
                        <FullscreenMenu />
                        
                        {isLoading ? (
                            <div className="hidden sm:block w-20 h-6 bg-gray-200 animate-pulse rounded" />
                        ) : user ? (
                            <Link
                                href="/dashboard"
                                className="hidden sm:block font-body text-sm font-medium text-[#111111] hover:opacity-70 transition-opacity"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="hidden lg:block font-body text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="hidden sm:inline-flex group items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 bg-[#111111] text-white font-body text-sm font-medium rounded-full hover:bg-[#333] transition-colors"
                                >
                                    <span className="hidden xs:inline">Get Started</span>
                                    <span className="xs:hidden">Start</span>
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
