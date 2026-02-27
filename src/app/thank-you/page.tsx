"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ParallaxRing, DecorDots } from "@/components/decor/background-decorations";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const checkmarkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 15,
      delay: 0.3,
    },
  },
};

export default function ThankYouPage() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center">
      {/* Background decorations */}
      <ParallaxRing
        className="absolute -left-64 -top-32 w-125 h-125 z-0"
        color="#2F3B69"
        opacity={0.03}
        speed={0.15}
      />
      <ParallaxRing
        className="absolute -right-32 -bottom-48 w-100 h-100 z-0"
        color="#8B3B3B"
        opacity={0.02}
        speed={0.25}
      />
      <DecorDots
        className="absolute right-20 top-20 w-32 h-32 z-0"
        opacity={0.04}
      />

      <motion.main
        className="relative z-10 container mx-auto px-4 py-16 text-center max-w-2xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Success checkmark */}
        <motion.div
          variants={checkmarkVariants}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-linear-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-200"
        >
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
        >
          Thank You!
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-600 mb-8 max-w-md mx-auto"
        >
          Your message has been received. We&apos;ll get back to you within 24 hours.
        </motion.p>

        {/* Decorative divider */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <span className="w-12 h-0.5 bg-gray-200 rounded-full" />
          <span className="w-2 h-2 bg-[#8B3B3B] rounded-full" />
          <span className="w-12 h-0.5 bg-gray-200 rounded-full" />
        </motion.div>

        {/* What happens next */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-10"
        >
          <h2 className="font-display text-lg font-semibold text-gray-800 mb-4">
            What happens next?
          </h2>
          <ul className="text-left space-y-3 text-gray-600">
            {[
              "Our team will review your message",
              "We'll reach out via email or phone",
              "Let's schedule a call to discuss your project",
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="w-6 h-6 rounded-full bg-[#2F3B69]/10 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                  <span className="text-sm font-medium text-[#2F3B69]">
                    {index + 1}
                  </span>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center h-12 px-8 bg-[#2F3B69] hover:bg-[#262F54] text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-[#2F3B69]/20 hover:shadow-xl hover:shadow-[#2F3B69]/30 hover:-translate-y-0.5"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go to Home
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center h-12 px-8 bg-white border border-gray-200 hover:border-[#2F3B69] text-gray-700 hover:text-[#2F3B69] font-medium rounded-lg transition-all duration-300"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Contact
          </Link>
        </motion.div>
      </motion.main>
    </div>
  );
}
