"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ParallaxRing, DecorCrosses } from "@/components/decor/background-decorations";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const numberVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
      delay: 0.1,
    },
  },
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center">
      {/* Background decorations */}
      <ParallaxRing
        className="absolute -right-48 -top-48 w-150 h-150 z-0"
        color="#1B5FAA"
        opacity={0.03}
        speed={0.2}
      />
      <ParallaxRing
        className="absolute -left-32 bottom-0 w-100 h-100 z-0"
        color="#1B5FAA"
        opacity={0.03}
        speed={0.15}
      />
      <DecorCrosses
        className="absolute left-1/4 top-1/4 w-40 h-40 z-0"
        opacity={0.04}
      />

      <motion.main
        className="relative z-10 container mx-auto px-4 py-16 text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* 404 Number */}
        <motion.div
          variants={numberVariants}
          className="relative inline-block mb-8"
        >
          <span className="font-display text-[120px] md:text-[180px] lg:text-[220px] font-bold text-gray-100 select-none">
            404
          </span>
          <span className="absolute inset-0 font-display text-[120px] md:text-[180px] lg:text-[220px] font-bold bg-linear-to-br from-[#1B5FAA] to-[#1B5FAA] bg-clip-text text-transparent translate-x-1 translate-y-1 md:translate-x-2 md:translate-y-2">
            404
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
        >
          Kaput! Page not found
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-600 mb-8 max-w-md mx-auto"
        >
          The page you&apos;re looking for seems to have wandered off. 
          Let&apos;s get you back on track.
        </motion.p>

        {/* Illustration */}
        <motion.div
          variants={itemVariants}
          className="mb-10 flex justify-center"
        >
          <div className="relative w-64 h-48">
            {/* Broken robot illustration */}
            <svg
              viewBox="0 0 200 150"
              className="w-full h-full"
              fill="none"
            >
              {/* Robot body */}
              <rect
                x="65"
                y="50"
                width="70"
                height="60"
                rx="8"
                fill="#1B5FAA"
                opacity="0.1"
                stroke="#1B5FAA"
                strokeWidth="2"
              />
              
              {/* Robot head */}
              <rect
                x="75"
                y="20"
                width="50"
                height="40"
                rx="6"
                fill="#1B5FAA"
                opacity="0.15"
                stroke="#1B5FAA"
                strokeWidth="2"
              />
              
              {/* Eyes - X marks */}
              <g stroke="#1B5FAA" strokeWidth="3" strokeLinecap="round">
                <line x1="88" y1="35" x2="95" y2="42" />
                <line x1="95" y1="35" x2="88" y2="42" />
                <line x1="105" y1="35" x2="112" y2="42" />
                <line x1="112" y1="35" x2="105" y2="42" />
              </g>
              
              {/* Antenna */}
              <line
                x1="100"
                y1="20"
                x2="100"
                y2="8"
                stroke="#1B5FAA"
                strokeWidth="2"
              />
              <circle cx="100" cy="6" r="4" fill="#1B5FAA" />
              
              {/* Arms - disconnected */}
              <line
                x1="65"
                y1="70"
                x2="45"
                y2="85"
                stroke="#1B5FAA"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <line
                x1="135"
                y1="70"
                x2="155"
                y2="85"
                stroke="#1B5FAA"
                strokeWidth="3"
                strokeLinecap="round"
              />
              
              {/* Sparks */}
              <g stroke="#1B5FAA" strokeWidth="2" opacity="0.7">
                <line x1="40" y1="75" x2="35" y2="70" />
                <line x1="42" y1="80" x2="35" y2="82" />
                <line x1="160" y1="75" x2="165" y2="70" />
                <line x1="158" y1="80" x2="165" y2="82" />
              </g>
              
              {/* Legs */}
              <line
                x1="85"
                y1="110"
                x2="85"
                y2="135"
                stroke="#1B5FAA"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <line
                x1="115"
                y1="110"
                x2="115"
                y2="135"
                stroke="#1B5FAA"
                strokeWidth="3"
                strokeLinecap="round"
              />
              
              {/* Feet */}
              <ellipse cx="85" cy="140" rx="10" ry="5" fill="#1B5FAA" opacity="0.3" />
              <ellipse cx="115" cy="140" rx="10" ry="5" fill="#1B5FAA" opacity="0.3" />
            </svg>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div variants={itemVariants}>
          <Link
            href="/"
            className="inline-flex items-center justify-center h-14 px-10 bg-[#1B5FAA] hover:bg-[#164C88] text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-[#1B5FAA]/20 hover:shadow-xl hover:shadow-[#1B5FAA]/30 hover:-translate-y-1 group"
          >
            <svg
              className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </motion.div>

        {/* Helpful links */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-wrap justify-center gap-6 text-sm"
        >
          <Link
            href="/contact"
            className="text-gray-500 hover:text-[#1B5FAA] transition-colors"
          >
            Contact Support
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            href="/#services"
            className="text-gray-500 hover:text-[#1B5FAA] transition-colors"
          >
            Our Services
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            href="/#about"
            className="text-gray-500 hover:text-[#1B5FAA] transition-colors"
          >
            About Us
          </Link>
        </motion.div>
      </motion.main>
    </div>
  );
}
