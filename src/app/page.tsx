import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, ArrowUpRight, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SocialLinks } from "@/components/ui/social-icons";
import { YmitLogo, YmitMark } from "@/components/brand/logo";
import { FullscreenMenu } from "@/components/navigation/fullscreen-menu";
import {
  whoWeAreAssets,
  reviewsAssets,
  galleryAssets,
  successStories,
  services,
  expertiseAreas,
  stats,
} from "@/constants/assets";
import { servicesIcons, getServiceIcon } from "@/constants/illustrations";
import { HeroSection } from "@/components/home/hero-section";
import { AnimatedSection, AnimatedItem, AnimatedLine } from "@/components/motion/animations";
import { SectionDecoration, LargeParallaxCircle } from "@/components/decorations/section-decoration";
import { HomeNavigation } from "@/components/home/home-navigation";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F6F6F6] overflow-x-hidden relative">

      {/* ===== NAVIGATION ===== */}
      <HomeNavigation />

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
            {/* Left - Video/Image */}
            <AnimatedItem className="w-full lg:w-1/2">
              <div className="relative aspect-[4/3] bg-[#F5F5F5] rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer">
                <Image
                  src={whoWeAreAssets.videoPoster}
                  alt={whoWeAreAssets.videoPosterAlt}
                  fill
                  className="object-cover"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/15 transition-colors">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 text-brand-blue fill-brand-blue ml-1" />
                  </div>
                </div>
              </div>
            </AnimatedItem>

            {/* Right - Content */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <AnimatedItem>
                <p className="text-[10px] sm:text-xs text-[#A3A3A3] uppercase tracking-widest mb-3 sm:mb-4">
                  We are a team of professionals
                </p>
              </AnimatedItem>

              <AnimatedItem>
                <h2 className="section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#111111] mb-4 sm:mb-6">
                  WHO WE ARE
                </h2>
              </AnimatedItem>

              <AnimatedItem>
                <div className="space-y-3 sm:space-y-4 text-[#6B6B6B] text-sm leading-relaxed mb-6 sm:mb-8">
                  <p className="text-sm sm:text-base text-[#111111] font-medium">
                    A dedicated team helping students achieve their dreams of studying at top universities worldwide.
                  </p>
                  <p>
                    <strong className="text-[#111111]">OUR APPROACH</strong><br />
                    Personalized guidance based on your unique profile, strengths, and aspirations.
                  </p>
                  <p>
                    With years of experience and deep knowledge of admission processes, we provide strategic support at every step of your journey.
                  </p>
                </div>
              </AnimatedItem>

              <AnimatedItem>
                {/* Rating badge like reference's Clutch badge - enhanced glassmorphism */}
                <div className="glass-card inline-flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl w-fit hover-lift">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-brand-blue to-brand-blue-600 flex items-center justify-center shadow-lg shadow-brand-blue/20">
                    <span className="text-white text-xs sm:text-sm font-bold">5.0</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-[#111111]">Student Rating</p>
                    <p className="text-[10px] sm:text-xs text-[#A3A3A3]">Based on 200+ reviews</p>
                  </div>
                </div>
              </AnimatedItem>
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
            {/* Left - Title */}
            <div className="w-full lg:w-1/3">
              <AnimatedItem>
                <h2 className="section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#111111]">
                  SERVICES &<br />APPROACH
                </h2>
              </AnimatedItem>
            </div>

            {/* Right - Services List */}
            <div className="w-full lg:w-2/3">
              {/* Animated line at top */}
              <AnimatedLine className="mb-0" />
              {services.map((service, index) => {
                const serviceIcon = getServiceIcon(service.number);
                return (
                  <AnimatedItem key={service.number} index={index}>
                    <div className="group py-4 sm:py-6 border-b border-[#EDEDED]/60 cursor-pointer hover:bg-white/50 -mx-3 sm:-mx-4 px-3 sm:px-4 rounded-xl transition-all duration-300 hover-lift">
                      <div className="flex items-start gap-4 sm:gap-6">
                        {/* Service illustration */}
                        {serviceIcon && (
                          <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-lg overflow-hidden bg-[#F8F9FA]">
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
                            <span className="text-[10px] sm:text-xs text-[#A3A3A3] font-medium">{service.number}</span>
                            <h3 className="font-display text-base sm:text-lg md:text-xl text-[#111111] group-hover:text-brand-blue transition-colors">
                              {service.title}
                            </h3>
                          </div>
                          <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed max-w-lg">
                            {service.description}
                          </p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4D4D4] group-hover:text-brand-orange group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                      </div>
                    </div>
                  </AnimatedItem>
                );
              })}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ===== INDUSTRY EXPERTISE SECTION - White background ===== */}
      <AnimatedSection id="expertise" className="relative py-16 sm:py-20 md:py-24 lg:py-32 section-white">
        {/* Decorative elements with parallax */}
        <SectionDecoration 
          type="dots"
          color="gray"
          top="48px"
          left="32px"
          width="120px"
          height="120px"
          opacity={0.08}
          parallaxSpeed={0.15}
        />
        <SectionDecoration 
          type="circles"
          color="blue"
          bottom="80px"
          right="25%"
          width="180px"
          height="180px"
          opacity={0.03}
          parallaxSpeed={0.2}
        />

        <div className="container-rivo relative z-10">
          <AnimatedItem>
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#111111] mb-8 sm:mb-12">
              AREAS OF EXPERTISE
            </h2>
          </AnimatedItem>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-t border-[#EDEDED]/60">
            {expertiseAreas.map((area) => (
              <AnimatedItem key={area.name}>
                <div className="flex items-center justify-between py-4 sm:py-5 px-3 sm:px-4 border-b border-[#EDEDED]/60 hover:bg-[#F6F6F6] transition-colors cursor-pointer group rounded-lg">
                  <span className="text-xs sm:text-sm text-[#111111] group-hover:text-brand-blue transition-colors">
                    {area.name}
                  </span>
                  <span className="text-[10px] sm:text-xs text-[#A3A3A3]">{area.count}</span>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </AnimatedSection>

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
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#111111] mb-8 sm:mb-12">
              SUCCESS STORIES
            </h2>
          </AnimatedItem>

          {/* Projects Grid - 1 col mobile, 2 col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {successStories.map((story, index) => (
              <AnimatedItem key={story.id} index={index}>
                <div className="group cursor-pointer glass-card p-3 sm:p-4 rounded-xl sm:rounded-2xl hover-lift">
                  <div className="relative aspect-[16/10] rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4 bg-[#F5F5F5]">
                    <Image
                      src={story.coverImage}
                      alt={story.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className={`absolute top-3 sm:top-4 right-3 sm:right-4 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium text-white ${
                        story.accentColor === "orange" ? "bg-brand-orange" : "bg-brand-blue"
                      }`}
                    >
                      {story.year}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-medium text-sm sm:text-base text-[#111111] group-hover:text-brand-blue transition-colors truncate">
                        {story.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-[#6B6B6B] mt-0.5">{story.subtitle}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#D4D4D4] group-hover:text-brand-orange transition-colors shrink-0 mt-0.5 sm:mt-1" />
                  </div>
                </div>
              </AnimatedItem>
            ))}
          </div>

          <AnimatedItem className="mt-8 sm:mt-12 text-center">
            <button className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors group uppercase tracking-wider">
              Show more cases
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
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#111111] mb-8 sm:mb-12">
              REVIEWS
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
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-brand-blue fill-brand-blue ml-1" />
                  </div>
                </div>
              </div>
            </AnimatedItem>

            {/* Right - Quote */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <AnimatedItem>
                <blockquote className="text-lg sm:text-xl md:text-2xl text-[#111111] leading-relaxed mb-6 sm:mb-8">
                  &ldquo;Ymit Academy transformed my application journey. Their strategic guidance helped me secure admission to my dream school with a full scholarship. The personalized attention made all the difference.&rdquo;
                </blockquote>
              </AnimatedItem>

              <AnimatedItem>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm sm:text-base text-[#111111]">Sarah Chen</p>
                    <p className="text-xs sm:text-sm text-[#6B6B6B]">Harvard University &apos;24</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-orange rounded-lg flex items-center justify-center hover:scale-105 hover:shadow-lg hover:shadow-brand-orange/20 transition-all cursor-pointer">
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </div>
              </AnimatedItem>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ===== WE ARE YMIT ACADEMY / TEAM SECTION - Gray background ===== */}
      <AnimatedSection className="relative py-16 sm:py-20 md:py-24 lg:py-32 section-gray">
        {/* Decorative elements with parallax */}
        <SectionDecoration 
          type="topographic"
          color="orange"
          bottom="0"
          right="0"
          width="380px"
          height="220px"
          opacity={0.04}
          parallaxSpeed={0.12}
        />
        <SectionDecoration 
          type="dots"
          color="gray"
          top="33%"
          left="-30px"
          width="80px"
          height="80px"
          opacity={0.06}
          parallaxSpeed={0.15}
        />

        <div className="container-rivo relative z-10">
          <AnimatedItem>
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#111111] mb-8 sm:mb-12">
              WE ARE YMIT ACADEMY
            </h2>
          </AnimatedItem>

          {/* Photo grid - 2 cols mobile, 4 cols desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-12 sm:mb-16">
            {galleryAssets.photos.map((photo, index) => (
              <AnimatedItem key={index}>
                <div className="aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-[#F5F5F5] hover:scale-[1.02] hover:shadow-xl transition-all cursor-pointer hover-lift">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              </AnimatedItem>
            ))}
          </div>

          {/* Stats - 2 cols mobile, 4 cols desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pt-6 sm:pt-8 border-t border-[#EDEDED]/60">
            {stats.map((stat) => (
              <AnimatedItem key={stat.label}>
                <div>
                  <p className="stat-number text-[#111111] mb-1">{stat.value}</p>
                  <p className="stat-label text-[10px] sm:text-xs">{stat.label}</p>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </AnimatedSection>

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
                <h2 className="section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#111111] mb-6 sm:mb-8">
                  CONTACTS
                </h2>
              </AnimatedItem>

              <AnimatedItem>
                <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-[#EDEDED]/60">
                  <div>
                    <p className="text-[9px] sm:text-[10px] text-[#A3A3A3] uppercase tracking-wider mb-1">Your Representative</p>
                    <p className="text-xs sm:text-sm text-[#111111]">General Inquiry</p>
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] text-[#A3A3A3] uppercase tracking-wider mb-1">Sales Representative</p>
                    <p className="text-xs sm:text-sm text-[#111111]">Admissions Team</p>
                  </div>
                </div>
              </AnimatedItem>

              <AnimatedItem>
                <form className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-[9px] sm:text-[10px] text-[#A3A3A3] uppercase tracking-wider mb-1.5 sm:mb-2">Name</label>
                      <input
                        type="text"
                        placeholder="Your name"
                        className="w-full px-0 py-2 bg-transparent border-b border-[#EDEDED] focus:border-brand-blue outline-none text-sm transition-colors placeholder:text-[#D4D4D4]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] sm:text-[10px] text-[#A3A3A3] uppercase tracking-wider mb-1.5 sm:mb-2">Email</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full px-0 py-2 bg-transparent border-b border-[#EDEDED] focus:border-brand-blue outline-none text-sm transition-colors placeholder:text-[#D4D4D4]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] sm:text-[10px] text-[#A3A3A3] uppercase tracking-wider mb-1.5 sm:mb-2">Phone</label>
                    <input
                      type="tel"
                      placeholder="+1 (___) ___-____"
                      className="w-full px-0 py-2 bg-transparent border-b border-[#EDEDED] focus:border-brand-blue outline-none text-sm transition-colors placeholder:text-[#D4D4D4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] sm:text-[10px] text-[#A3A3A3] uppercase tracking-wider mb-1.5 sm:mb-2">Message</label>
                    <textarea
                      placeholder="Tell us about your goals..."
                      rows={3}
                      className="w-full px-0 py-2 bg-transparent border-b border-[#EDEDED] focus:border-brand-blue outline-none text-sm resize-none transition-colors placeholder:text-[#D4D4D4]"
                    />
                  </div>

                  <Button className="w-full bg-[#111111] hover:bg-[#333] text-white rounded-full py-4 sm:py-5 mt-2 sm:mt-4 group text-sm">
                    Send message
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </AnimatedItem>
            </div>

            {/* Right - Info */}
            <div className="w-full lg:w-1/2 lg:pl-12 xl:pl-16 lg:border-l border-[#EDEDED]/60">
              <AnimatedItem>
                <div className="mb-8 sm:mb-12">
                  <h3 className="font-display text-lg sm:text-xl md:text-2xl text-[#111111] mb-3 sm:mb-4 leading-tight">
                    LET&apos;S MAKE SOMETHING<br />THAT MATTERS
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
                    Every student deserves expert guidance on their journey to higher education. Let&apos;s discuss how we can help you achieve your dreams.
                  </p>
                </div>
              </AnimatedItem>

              <AnimatedItem>
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <p className="text-[9px] sm:text-[10px] text-[#A3A3A3] uppercase tracking-wider mb-1">Address</p>
                    <p className="text-xs sm:text-sm text-[#111111]">
                      Global consultations available<br />
                      Online & In-person sessions
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] sm:text-[10px] text-[#A3A3A3] uppercase tracking-wider mb-1">Email</p>
                    <a href="mailto:hello@ymitacademy.com" className="text-xs sm:text-sm text-[#111111] hover:text-brand-blue transition-colors">
                      hello@ymitacademy.com
                    </a>
                  </div>

                  <div>
                    <p className="text-[9px] sm:text-[10px] text-[#A3A3A3] uppercase tracking-wider mb-1">Phone</p>
                    <a href="tel:+18001234567" className="text-xs sm:text-sm text-[#111111] hover:text-brand-blue transition-colors">
                      +1 (800) 123-4567
                    </a>
                  </div>

                  {/* Social icons */}
                  <div className="pt-2 sm:pt-4">
                    <p className="text-[9px] sm:text-[10px] text-[#A3A3A3] uppercase tracking-wider mb-2 sm:mb-3">Follow us</p>
                    <SocialLinks iconSize={18} />
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
                <YmitLogo color="black" />
              </Link>
              <p className="font-body text-xs sm:text-sm text-[#6B6B6B] max-w-[200px]">
                Guiding students toward their academic dreams.
              </p>
            </div>

            {/* Right - Links columns */}
            <div className="w-full lg:w-3/4 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              <nav className="space-y-2 sm:space-y-3">
                <p className="font-body text-[10px] sm:text-xs text-[#A3A3A3] uppercase tracking-wider mb-2 sm:mb-4">Navigation</p>
                <Link href="/" className="block font-body text-xs sm:text-sm text-[#111111] hover:text-brand-blue transition-colors">Home</Link>
                <Link href="#about" className="block font-body text-xs sm:text-sm text-[#111111] hover:text-brand-blue transition-colors">Who We Are</Link>
                <Link href="#reviews" className="block font-body text-xs sm:text-sm text-[#111111] hover:text-brand-blue transition-colors">Reviews</Link>
                <Link href="#contact" className="block font-body text-xs sm:text-sm text-[#111111] hover:text-brand-blue transition-colors">Contact</Link>
              </nav>

              <nav className="space-y-2 sm:space-y-3">
                <p className="font-body text-[10px] sm:text-xs text-[#A3A3A3] uppercase tracking-wider mb-2 sm:mb-4">Results</p>
                <Link href="#results" className="block font-body text-xs sm:text-sm text-[#111111] hover:text-brand-blue transition-colors">Success Stories</Link>
                <Link href="/feed" className="block font-body text-xs sm:text-sm text-[#111111] hover:text-brand-blue transition-colors">News</Link>
                <Link href="/signup" className="block font-body text-xs sm:text-sm text-[#111111] hover:text-brand-blue transition-colors">Get Started</Link>
              </nav>

              <nav className="space-y-2 sm:space-y-3">
                <p className="font-body text-[10px] sm:text-xs text-[#A3A3A3] uppercase tracking-wider mb-2 sm:mb-4">Services</p>
                <Link href="#services" className="block font-body text-xs sm:text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors">Strategy</Link>
                <Link href="#services" className="block font-body text-xs sm:text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors">Essays</Link>
                <Link href="#services" className="block font-body text-xs sm:text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors">Scholarships</Link>
                <Link href="#services" className="block font-body text-xs sm:text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors">Interviews</Link>
              </nav>

              <nav className="space-y-2 sm:space-y-3">
                <p className="font-body text-[10px] sm:text-xs text-[#A3A3A3] uppercase tracking-wider mb-2 sm:mb-4">Regions</p>
                <Link href="#" className="block font-body text-xs sm:text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors">USA & Canada</Link>
                <Link href="#" className="block font-body text-xs sm:text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors">UK & Europe</Link>
                <Link href="#" className="block font-body text-xs sm:text-sm text-[#6B6B6B] hover:text-[#111111] transition-colors">Asia & Pacific</Link>
              </nav>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-6 sm:pt-8 border-t border-[#EDEDED]/60 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <p className="font-body text-[10px] sm:text-xs text-[#A3A3A3] order-2 sm:order-1">
              © {new Date().getFullYear()} Ymit Academy. All rights reserved.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 order-1 sm:order-2">
              <SocialLinks iconSize={16} />
              <div className="flex items-center gap-4 sm:gap-6">
                <Link href="#" className="font-body text-[10px] sm:text-xs text-[#A3A3A3] hover:text-[#111111] transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="font-body text-[10px] sm:text-xs text-[#A3A3A3] hover:text-[#111111] transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
