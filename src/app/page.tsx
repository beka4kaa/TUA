"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StockermansLogo, StockermansMark } from "@/components/brand/logo";
import { FullscreenMenu } from "@/components/navigation/fullscreen-menu";
import {
  whoWeAreAssets,
  reviewsAssets,
} from "@/constants/assets";
import { servicesIcons, getServiceIcon } from "@/constants/illustrations";
import { HeroSection } from "@/components/home/hero-section";
import { AlumniLogoWall } from "@/components/home/alumni-logo-wall";
import { StoryMasonryGrid } from "@/components/home/story-cards";
import { AnimatedSection, AnimatedItem, AnimatedLine } from "@/components/motion/animations";
import { SectionDecoration, LargeParallaxCircle } from "@/components/decorations/section-decoration";
import { HomeNavigation } from "@/components/home/home-navigation";
import { useLanguage } from "@/contexts/language-context";

export default function HomePage() {
  const { t } = useLanguage();
  const services = t.services.items;
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-x-hidden">

      {/* ===== NAVIGATION ===== */}
      <HomeNavigation />
      {/* Spacer for fixed header */}
      <div className="h-14 sm:h-16 shrink-0" aria-hidden="true" />

      {/* ===== HERO SECTION ===== */}
      <HeroSection />

      {/* ===== WHO WE ARE SECTION - White background ===== */}
      <AnimatedSection id="about" className="relative py-16 sm:py-20 md:py-24 lg:py-32 section-white">
        {/* Decorative elements with parallax */}
        <SectionDecoration 
          type="topographic"
          color="blue"
          top="40px"
          right="0"
          width="320px"
          height="200px"
          opacity={0.06}
          parallaxSpeed={0.2}
        />
        <SectionDecoration 
          type="circles"
          color="gray"
          bottom="-60px"
          left="-60px"
          width="160px"
          height="160px"
          opacity={0.04}
          parallaxSpeed={0.15}
        />

        <div className="container-rivo relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-20">
            {/* Left - Intro Video Placeholder */}
            <AnimatedItem className="w-full lg:w-1/2">
              {/* TODO: Replace with acstockermansl video embed (YouTube / Vimeo / <video> tag) */}
              <div className="relative aspect-video bg-[#0D1B2A] rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer shadow-lg">
                {/* Thumbnail / poster layer */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
                  {/* Decorative waveform lines */}
                  <div className="flex items-end gap-1 h-10 mb-2" aria-hidden="true">
                    {[3,5,8,6,10,7,4,9,5,6,8,4,7,10,5].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 rounded-full bg-white/20"
                        style={{ height: `${h * 4}px` }}
                      />
                    ))}
                  </div>
                  {/* Play button */}
                  <button
                    aria-label="Play introductory video"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center group-hover:bg-white/20 group-hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                  >
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white ml-1" />
                  </button>
                  {/* Caption */}
                  <p className="text-white/50 text-xs uppercase tracking-widest mt-2">
                    {t.about.videoCaption}
                  </p>
                </div>
                {/* Corner label */}
                <span className="absolute top-3 left-3 bg-[#8B3B3B] text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  {t.about.videoLabel}
                </span>
              </div>
            </AnimatedItem>

            {/* Right - Content */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <AnimatedItem>
                <p className="text-[10px] sm:text-xs text-[#A3A3A3] uppercase tracking-widest mb-3 sm:mb-4">
                  {t.about.sectionLabel}
                </p>
              </AnimatedItem>

              <AnimatedItem>
                <h2 className="section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#111111] dark:text-[#F0F0F0] mb-4 sm:mb-6">
                  {t.about.heading}
                </h2>
              </AnimatedItem>

              <AnimatedItem>
                <div className="space-y-3 sm:space-y-4 text-[#6B6B6B] dark:text-[#9B9B9B] text-sm leading-relaxed mb-6 sm:mb-8">
                  {/* Paragraph 1 */}
                  <p className="text-sm sm:text-base text-[#111111] dark:text-[#F0F0F0] font-medium">
                    {t.about.intro}
                  </p>

                  {/* University reference list */}
                  <div className="text-xs text-[#6B6B6B] dark:text-[#888888] leading-relaxed space-y-1 pl-3 border-l-2 border-brand-blue/20">
                    <p><span className="font-semibold text-[#111111] dark:text-[#F0F0F0]">USA:</span> {t.about.usa}</p>
                    <p><span className="font-semibold text-[#111111] dark:text-[#F0F0F0]">Canada:</span> {t.about.canada}</p>
                    <p><span className="font-semibold text-[#111111] dark:text-[#F0F0F0]">UK:</span> {t.about.uk}</p>
                    <p><span className="font-semibold text-[#111111] dark:text-[#F0F0F0]">Europe:</span> {t.about.europe}</p>
                  </div>

                  {/* Paragraph 2 — OUR APPROACH */}
                  <p>
                    <strong className="text-[#111111] dark:text-[#F0F0F0]">{t.about.approachLabel}</strong><br />
                    {t.about.approachText}
                  </p>

                  {/* Paragraph 3 */}
                  <p>
                    {t.about.teamText}
                  </p>
                </div>
              </AnimatedItem>

              {/* Rating badge — hidden per design update */}
              {/* <AnimatedItem>
                <div className="glass-card inline-flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl w-fit hover-lift">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-brand-blue to-brand-blue-600 flex items-center justify-center shadow-lg shadow-brand-blue/20">
                    <span className="text-white text-xs sm:text-sm font-bold">5.0</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-[#111111]">Student Rating</p>
                    <p className="text-[10px] sm:text-xs text-[#A3A3A3]">Based on 200+ reviews</p>
                  </div>
                </div>
              </AnimatedItem> */}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ===== SERVICES & TECH STACK SECTION - Gray background ===== */}
      <AnimatedSection id="services" className="relative py-16 sm:py-20 md:py-24 lg:py-32 section-gray">
        {/* Decorative elements with parallax */}
        <SectionDecoration 
          type="wave"
          color="gray"
          bottom="0"
          left="0"
          width="100%"
          height="80px"
          opacity={0.04}
          parallaxSpeed={0.1}
        />
        <SectionDecoration 
          type="dots"
          color="blue"
          top="50%"
          right="-30px"
          width="100px"
          height="100px"
          opacity={0.08}
          parallaxSpeed={0.2}
        />

        <div className="container-rivo relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-24">
            {/* Left - Title only */}
            <div className="w-full lg:w-1/3">
              <AnimatedItem>
                <h2 className="section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#111111] dark:text-[#F0F0F0]">
                  {t.services.heading.split("\n").map((line, i) => (
                    <span key={i}>{line}{i === 0 && <br />}</span>
                  ))}
                </h2>
              </AnimatedItem>
            </div>

            {/* Right - Services List */}
            <div className="w-full lg:w-2/3">
              {/* Animated line at top */}
              {/* removed AnimatedLine — white strip was too distracting */}
              {services.map((service, index) => {
                const serviceIcon = getServiceIcon(service.number);
                return (
                  <AnimatedItem key={service.number} index={index}>
                    <div className="group py-4 sm:py-6 border-b border-[#EDEDED]/60 dark:border-[#333]/60 cursor-pointer hover:bg-black/[0.03] dark:hover:bg-white/[0.04] -mx-3 sm:-mx-4 px-3 sm:px-4 rounded-xl transition-all duration-300 hover-lift">
                      <div className="flex items-start gap-4 sm:gap-6">
                        {/* Service illustration */}
                        {serviceIcon && (
                          <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-lg overflow-hidden bg-[#F8F9FA] dark:bg-[#2a2a2a]">
                            <Image
                              src={serviceIcon.illustration}
                              alt={serviceIcon.alt}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 sm:mb-2">
                            <span className="text-[10px] sm:text-xs text-[#A3A3A3] dark:text-[#666] font-medium">{service.number}</span>
                            <h3 className="font-display text-base sm:text-lg md:text-xl text-[#111111] dark:text-[#F0F0F0] group-hover:text-brand-blue transition-colors">
                              {service.title}
                            </h3>
                          </div>
                          <p className="text-xs sm:text-sm text-[#6B6B6B] dark:text-[#888888] leading-relaxed max-w-lg">
                            {service.description}
                          </p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4D4D4] group-hover:text-[#8B3B3B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                      </div>
                    </div>
                  </AnimatedItem>
                );
              })}

              {/* ── Profile Pillars (appended after service list) ── */}
              <AnimatedItem>
                <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border-l-2 border-[#8B3B3B] pl-4 py-1">
                    <p className="text-xs sm:text-sm font-semibold text-[#111111] dark:text-[#F0F0F0] mb-1">
                      {t.services.pillars.academic.title}
                    </p>
                    <p className="text-xs text-[#6B6B6B] dark:text-[#888888] leading-relaxed">
                      {t.services.pillars.academic.desc}
                    </p>
                  </div>
                  <div className="border-l-2 border-brand-blue pl-4 py-1">
                    <p className="text-xs sm:text-sm font-semibold text-[#111111] dark:text-[#F0F0F0] mb-1">
                      {t.services.pillars.activity.title}
                    </p>
                    <p className="text-xs text-[#6B6B6B] dark:text-[#888888] leading-relaxed">
                      {t.services.pillars.activity.desc}
                    </p>
                  </div>
                </div>
              </AnimatedItem>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ===== ALUMNI LOGO WALL - White background ===== */}
      <AlumniLogoWall />

      {/* ===== PROJECTS / SUCCESS STORIES SECTION - Gray background ===== */}
      <AnimatedSection id="results" className="relative py-16 sm:py-20 md:py-24 lg:py-32 section-gray">
        {/* Large circle with parallax - left side */}
        <LargeParallaxCircle 
          position="left" 
          top="20%" 
          size={500} 
          opacity={0.04}
          speedFactor={0.15}
          color="blue"
        />
        <SectionDecoration 
          type="dots"
          color="gray"
          top="64px"
          right="48px"
          width="80px"
          height="80px"
          opacity={0.06}
          parallaxSpeed={0.2}
        />

        <div className="container-rivo relative z-10">
          <AnimatedItem>
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#111111] dark:text-[#F0F0F0] mb-8 sm:mb-12">
              {t.results.heading}
            </h2>
          </AnimatedItem>

          {/* Mixed-media masonry grid (photo / video / quote cards) */}
          <StoryMasonryGrid />

          <AnimatedItem className="mt-8 sm:mt-12 text-center">
            <button className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#6B6B6B] dark:text-[#888] hover:text-[#111111] dark:hover:text-[#F0F0F0] transition-colors group uppercase tracking-wider">
              {t.results.showMore}
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </AnimatedItem>
        </div>
      </AnimatedSection>

      {/* ===== REVIEWS SECTION - White background ===== */}
      <AnimatedSection id="reviews" className="relative py-16 sm:py-20 md:py-24 lg:py-32 section-white">
        {/* Decorative elements with parallax */}
        <SectionDecoration 
          type="topographic"
          color="orange"
          top="0"
          right="0"
          width="280px"
          height="180px"
          opacity={0.05}
          parallaxSpeed={0.18}
        />

        <div className="container-rivo relative z-10">
          <AnimatedItem>
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#111111] dark:text-[#F0F0F0] mb-8 sm:mb-12">
              {t.reviews.heading}
            </h2>
          </AnimatedItem>

          <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-16">
            {/* Left - Video */}
            <AnimatedItem className="w-full lg:w-1/2">
              <div className="relative aspect-[4/3] bg-[#111111] rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer">
                <Image
                  src={reviewsAssets.videoPoster}
                  alt={reviewsAssets.videoPosterAlt}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white dark:bg-[#222222] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-brand-blue fill-brand-blue ml-1" />
                  </div>
                </div>
              </div>
            </AnimatedItem>

            {/* Right - Quote */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <AnimatedItem>
                <blockquote className="text-lg sm:text-xl md:text-2xl text-[#111111] dark:text-[#F0F0F0] leading-relaxed mb-6 sm:mb-8">
                  &ldquo;{t.reviews.quote}&rdquo;
                </blockquote>
              </AnimatedItem>

              <AnimatedItem>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm sm:text-base text-[#111111] dark:text-[#F0F0F0]">{t.reviews.author}</p>
                    <p className="text-xs sm:text-sm text-[#6B6B6B] dark:text-[#888888]">{t.reviews.school}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#8B3B3B] rounded-lg flex items-center justify-center hover:scale-105 hover:shadow-lg hover:shadow-[#8B3B3B]/20 transition-all cursor-pointer">
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </div>
              </AnimatedItem>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ===== WE ARE Stockermans / TEAM SECTION - Gray background ===== */}
      {/* ===== CONTACTS SECTION - White background ===== */}
      <AnimatedSection id="contact" className="relative py-16 sm:py-20 md:py-24 lg:py-32 section-white">
        {/* Decorative elements with parallax */}
        <SectionDecoration 
          type="circles"
          color="gray"
          top="-60px"
          left="25%"
          width="140px"
          height="140px"
          opacity={0.04}
          parallaxSpeed={0.18}
        />

        <div className="container-rivo relative z-10">
          <div className="flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-20">
            {/* Left - Form */}
            <div className="w-full lg:w-1/2">
              <AnimatedItem>
                <h2 className="section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#111111] dark:text-[#F0F0F0] mb-6 sm:mb-8">
                  {t.contact.heading}
                </h2>
              </AnimatedItem>

              <AnimatedItem>
                <form className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-[9px] sm:text-[10px] text-[#A3A3A3] dark:text-[#666] uppercase tracking-wider mb-1.5 sm:mb-2">{t.contact.nameLabel}</label>
                      <input
                        type="text"
                        placeholder={t.contact.namePlaceholder}
                        className="w-full px-0 py-2 bg-transparent border-b border-[#EDEDED] dark:border-[#333] focus:border-brand-blue outline-none text-sm dark:text-[#F0F0F0] transition-colors placeholder:text-[#D4D4D4] dark:placeholder:text-[#555]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] sm:text-[10px] text-[#A3A3A3] dark:text-[#666] uppercase tracking-wider mb-1.5 sm:mb-2">{t.contact.emailLabel}</label>
                      <input
                        type="email"
                        placeholder={t.contact.emailPlaceholder}
                        className="w-full px-0 py-2 bg-transparent border-b border-[#EDEDED] dark:border-[#333] focus:border-brand-blue outline-none text-sm dark:text-[#F0F0F0] transition-colors placeholder:text-[#D4D4D4] dark:placeholder:text-[#555]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] sm:text-[10px] text-[#A3A3A3] dark:text-[#666] uppercase tracking-wider mb-1.5 sm:mb-2">{t.contact.phoneLabel}</label>
                    <input
                      type="tel"
                      placeholder={t.contact.phonePlaceholder}
                      className="w-full px-0 py-2 bg-transparent border-b border-[#EDEDED] dark:border-[#333] focus:border-brand-blue outline-none text-sm dark:text-[#F0F0F0] transition-colors placeholder:text-[#D4D4D4] dark:placeholder:text-[#555]"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] sm:text-[10px] text-[#A3A3A3] dark:text-[#666] uppercase tracking-wider mb-1.5 sm:mb-2">{t.contact.messageLabel}</label>
                    <textarea
                      placeholder={t.contact.messagePlaceholder}
                      rows={3}
                      className="w-full px-0 py-2 bg-transparent border-b border-[#EDEDED] dark:border-[#333] focus:border-brand-blue outline-none text-sm dark:text-[#F0F0F0] resize-none transition-colors placeholder:text-[#D4D4D4] dark:placeholder:text-[#555]"
                    />
                  </div>

                  <Button className="w-full bg-[#111111] hover:bg-[#333] text-white rounded-full py-4 sm:py-5 mt-2 sm:mt-4 group text-sm">
                    {t.contact.sendButton}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </AnimatedItem>
            </div>

            {/* Right - Info */}
            <div className="w-full lg:w-1/2 lg:pl-12 xl:pl-16 lg:border-l border-[#EDEDED]/60 dark:border-[#333]/60">
              <AnimatedItem>
                <div className="mb-8 sm:mb-12">
                  <h3 className="font-display text-lg sm:text-xl md:text-2xl text-[#111111] dark:text-[#F0F0F0] mb-3 sm:mb-4 leading-tight">
                    {t.contact.rightHeading.split("\n").map((line, i) => (
                      <span key={i}>{line}{i === 0 && <br />}</span>
                    ))}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B6B6B] dark:text-[#888888] leading-relaxed">
                    {t.contact.rightSubtext}
                  </p>
                </div>
              </AnimatedItem>

              <AnimatedItem>
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <p className="text-[9px] sm:text-[10px] text-[#A3A3A3] dark:text-[#666] uppercase tracking-wider mb-1">{t.contact.emailContact}</p>
                    <a href="mailto:topuniversitiesadvisors@gmail.com" className="text-xs sm:text-sm text-[#111111] dark:text-[#D0D0D0] hover:text-brand-blue transition-colors">
                      topuniversitiesadvisors@gmail.com
                    </a>
                  </div>

                  <div>
                    <p className="text-[9px] sm:text-[10px] text-[#A3A3A3] dark:text-[#666] uppercase tracking-wider mb-1">{t.contact.whatsapp}</p>
                    <a href="https://wa.me/77013092147" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-[#111111] dark:text-[#D0D0D0] hover:text-brand-blue transition-colors">
                      +7 701 309 2147
                    </a>
                  </div>

                  <div>
                    <p className="text-[9px] sm:text-[10px] text-[#A3A3A3] dark:text-[#666] uppercase tracking-wider mb-1">{t.contact.instagram}</p>
                    <a
                      href="https://instagram.com/top_universities_advisors"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-[#111111] dark:text-[#D0D0D0] hover:text-brand-blue transition-colors"
                    >
                      @top_universities_advisors
                    </a>
                  </div>
                </div>
              </AnimatedItem>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ===== FOOTER - Gray background ===== */}
      <footer className="py-10 sm:py-12 md:py-16 section-gray">
        <div className="container-rivo">
          <div className="flex flex-col lg:flex-row justify-between gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-12 lg:mb-16">
            {/* Left - Logo and tagline */}
            <div className="w-full lg:w-1/4">
              <Link href="/" className="inline-flex items-center mb-4 sm:mb-6">
                <StockermansLogo color="black" className="dark:hidden" />
                <StockermansLogo color="white" className="hidden dark:block" />
              </Link>
              <p className="font-body text-xs sm:text-sm text-[#6B6B6B] dark:text-[#888888] max-w-[200px]">
                {t.footer.tagline}
              </p>
            </div>

            {/* Right - Links columns */}
            <div className="w-full lg:w-3/4 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              <nav className="space-y-2 sm:space-y-3">
                <p className="font-body text-[10px] sm:text-xs text-[#A3A3A3] uppercase tracking-wider mb-2 sm:mb-4">{t.footer.nav.title}</p>
                <Link href="/" className="block font-body text-xs sm:text-sm text-[#111111] dark:text-[#D0D0D0] hover:text-brand-blue transition-colors">{t.footer.nav.home}</Link>
                <Link href="#about" className="block font-body text-xs sm:text-sm text-[#111111] dark:text-[#D0D0D0] hover:text-brand-blue transition-colors">{t.footer.nav.whoWeAre}</Link>
                <Link href="#reviews" className="block font-body text-xs sm:text-sm text-[#111111] dark:text-[#D0D0D0] hover:text-brand-blue transition-colors">{t.footer.nav.reviews}</Link>
                <Link href="#contact" className="block font-body text-xs sm:text-sm text-[#111111] dark:text-[#D0D0D0] hover:text-brand-blue transition-colors">{t.footer.nav.contact}</Link>
              </nav>

              <nav className="space-y-2 sm:space-y-3">
                <p className="font-body text-[10px] sm:text-xs text-[#A3A3A3] uppercase tracking-wider mb-2 sm:mb-4">{t.footer.results.title}</p>
                <Link href="#results" className="block font-body text-xs sm:text-sm text-[#111111] dark:text-[#D0D0D0] hover:text-brand-blue transition-colors">{t.footer.results.successStories}</Link>
                <Link href="/feed" className="block font-body text-xs sm:text-sm text-[#111111] dark:text-[#D0D0D0] hover:text-brand-blue transition-colors">{t.footer.results.news}</Link>
                <Link href="/signup" className="block font-body text-xs sm:text-sm text-[#111111] dark:text-[#D0D0D0] hover:text-brand-blue transition-colors">{t.footer.results.getStarted}</Link>
              </nav>

              <nav className="space-y-2 sm:space-y-3">
                <p className="font-body text-[10px] sm:text-xs text-[#A3A3A3] uppercase tracking-wider mb-2 sm:mb-4">{t.footer.servicesCol.title}</p>
                <Link href="#services" className="block font-body text-xs sm:text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors">{t.footer.servicesCol.strategy}</Link>
                <Link href="#services" className="block font-body text-xs sm:text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors">{t.footer.servicesCol.essays}</Link>
                <Link href="#services" className="block font-body text-xs sm:text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors">{t.footer.servicesCol.scholarships}</Link>
                <Link href="#services" className="block font-body text-xs sm:text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors">{t.footer.servicesCol.interviews}</Link>
              </nav>

              <nav className="space-y-2 sm:space-y-3">
                <p className="font-body text-[10px] sm:text-xs text-[#A3A3A3] uppercase tracking-wider mb-2 sm:mb-4">{t.footer.regions.title}</p>
                <Link href="#" className="block font-body text-xs sm:text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors">{t.footer.regions.usCanada}</Link>
                <Link href="#" className="block font-body text-xs sm:text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors">{t.footer.regions.ukEurope}</Link>
                <Link href="#" className="block font-body text-xs sm:text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors">{t.footer.regions.asiaPacific}</Link>
              </nav>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-6 sm:pt-8 border-t border-[#EDEDED]/60 dark:border-[#333]/60 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <p className="font-body text-[10px] sm:text-xs text-[#A3A3A3] order-2 sm:order-1">
              © {new Date().getFullYear()} Stockermans Education Advisors. {t.footer.copyright}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 order-1 sm:order-2">
              <a
                href="https://instagram.com/top_universities_advisors"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[10px] sm:text-xs text-[#A3A3A3] hover:text-[#111111] transition-colors"
              >
                @top_universities_advisors
              </a>
              <div className="flex items-center gap-4 sm:gap-6">
                <Link href="#" className="font-body text-[10px] sm:text-xs text-[#A3A3A3] hover:text-[#111111] transition-colors">
                  {t.footer.privacy}
                </Link>
                <Link href="#" className="font-body text-[10px] sm:text-xs text-[#A3A3A3] hover:text-[#111111] transition-colors">
                  {t.footer.terms}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
