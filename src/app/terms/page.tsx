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
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

// Table of contents
const tocItems = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "services", title: "Our Services" },
  { id: "user-accounts", title: "User Accounts" },
  { id: "acceptable-use", title: "Acceptable Use" },
  { id: "intellectual-property", title: "Intellectual Property" },
  { id: "payment", title: "Payment Terms" },
  { id: "limitation", title: "Limitation of Liability" },
  { id: "termination", title: "Termination" },
  { id: "governing-law", title: "Governing Law" },
  { id: "contact", title: "Contact Us" },
];

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background decorations */}
      <ParallaxRing
        className="absolute -left-48 top-48 w-125 h-125 z-0"
        color="#28547C"
        opacity={0.02}
        speed={0.12}
      />
      <DecorDots
        className="absolute right-10 bottom-32 w-32 h-32 z-0"
        opacity={0.03}
      />

      <motion.main
        className="relative z-10 container mx-auto px-4 py-16 md:py-24"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="max-w-3xl mb-12">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-[#28547C] transition-colors mb-8"
          >
            <svg
              className="w-4 h-4 mr-2"
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
            Back to Home
          </Link>

          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-500">
            Last updated: January 2025
          </p>
        </motion.div>

        {/* Content with TOC */}
        <div className="flex gap-12 lg:gap-16">
          {/* Main content */}
          <motion.article
            variants={itemVariants}
            className="flex-1 max-w-3xl prose prose-gray prose-headings:font-display prose-headings:text-gray-900 prose-a:text-[#28547C] prose-a:no-underline hover:prose-a:underline"
          >
            <section id="acceptance">
              <h2>Acceptance of Terms</h2>
              <p>
                By accessing and using YmitAcademy&apos;s website and services, you agree 
                to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree 
                to these Terms, please do not use our services.
              </p>
              <p>
                These Terms apply to all visitors, users, and others who access or use 
                our services. By using our services, you represent that you are at least 
                18 years of age or have the consent of a parent or guardian.
              </p>
            </section>

            <section id="services">
              <h2>Our Services</h2>
              <p>
                YmitAcademy provides educational services, including but not limited to:
              </p>
              <ul>
                <li>Online courses and training programs</li>
                <li>Educational consulting services</li>
                <li>Learning management and tracking tools</li>
                <li>Community forums and discussion groups</li>
              </ul>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of our 
                services at any time without prior notice.
              </p>
            </section>

            <section id="user-accounts">
              <h2>User Accounts</h2>
              <p>
                When you create an account with us, you must provide accurate and complete 
                information. You are responsible for:
              </p>
              <ul>
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
              <p>
                We reserve the right to suspend or terminate accounts that violate these 
                Terms or for any other reason at our discretion.
              </p>
            </section>

            <section id="acceptable-use">
              <h2>Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use our services for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Transmit viruses, malware, or other harmful code</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Impersonate any person or entity</li>
                <li>Share, copy, or distribute course materials without permission</li>
                <li>Use automated systems to access our services without authorization</li>
                <li>Interfere with or disrupt our services</li>
              </ul>
            </section>

            <section id="intellectual-property">
              <h2>Intellectual Property</h2>
              <p>
                All content on our website, including text, graphics, logos, images, 
                videos, course materials, and software, is the property of YmitAcademy 
                or its licensors and is protected by copyright and other intellectual 
                property laws.
              </p>
              <p>
                You are granted a limited, non-exclusive, non-transferable license to 
                access and use the content for personal, non-commercial purposes only. 
                You may not:
              </p>
              <ul>
                <li>Reproduce, modify, or distribute our content</li>
                <li>Use our content for commercial purposes</li>
                <li>Remove any copyright or proprietary notices</li>
              </ul>
            </section>

            <section id="payment">
              <h2>Payment Terms</h2>
              <p>
                Certain services may require payment. By purchasing our services, you agree to:
              </p>
              <ul>
                <li>Provide accurate billing information</li>
                <li>Pay all fees and charges at the prices in effect at the time of purchase</li>
                <li>Authorize us to charge your payment method</li>
              </ul>
              <h3>Refund Policy</h3>
              <p>
                Refund requests are handled on a case-by-case basis. Generally, we offer 
                refunds within 14 days of purchase if you have not accessed more than 30% 
                of the course content. Please contact us to request a refund.
              </p>
            </section>

            <section id="limitation">
              <h2>Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, YMITACADEMY SHALL NOT BE LIABLE 
                FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, 
                INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL.
              </p>
              <p>
                Our total liability for any claims arising from your use of our services 
                shall not exceed the amount you paid to us in the preceding 12 months.
              </p>
              <p>
                Our services are provided &quot;as is&quot; without warranties of any kind, either 
                express or implied, including but not limited to warranties of merchantability, 
                fitness for a particular purpose, or non-infringement.
              </p>
            </section>

            <section id="termination">
              <h2>Termination</h2>
              <p>
                We may terminate or suspend your access to our services immediately, without 
                prior notice or liability, for any reason, including:
              </p>
              <ul>
                <li>Breach of these Terms</li>
                <li>Conduct that we believe is harmful to other users</li>
                <li>Fraudulent or illegal activity</li>
              </ul>
              <p>
                Upon termination, your right to use our services will cease immediately. 
                All provisions of these Terms that should reasonably survive termination 
                shall survive.
              </p>
            </section>

            <section id="governing-law">
              <h2>Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws 
                of the Republic of Kazakhstan, without regard to its conflict of law provisions.
              </p>
              <p>
                Any disputes arising from these Terms shall be resolved exclusively in the 
                courts of Almaty, Kazakhstan.
              </p>
            </section>

            <section id="contact">
              <h2>Contact Us</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <ul>
                <li>
                  Email:{" "}
                  <a href="mailto:legal@ymitacademy.com">legal@ymitacademy.com</a>
                </li>
                <li>Address: Al-Farabi Ave 77/7, Almaty, Kazakhstan</li>
              </ul>
            </section>
          </motion.article>

          {/* Sticky TOC (desktop) */}
          <motion.aside
            variants={itemVariants}
            className="hidden lg:block w-64 shrink-0"
          >
            <div className="sticky top-24">
              <h3 className="font-display text-sm font-semibold text-gray-900 mb-4">
                On this page
              </h3>
              <nav className="space-y-2">
                {tocItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-sm text-gray-500 hover:text-[#28547C] transition-colors py-1"
                  >
                    {item.title}
                  </a>
                ))}
              </nav>

              {/* Quick links */}
              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-3">
                  Related pages
                </p>
                <Link
                  href="/privacy"
                  className="block text-sm font-medium text-[#28547C] hover:underline mb-2"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center text-sm font-medium text-[#28547C] hover:underline"
                >
                  Contact us
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.aside>
        </div>
      </motion.main>
    </div>
  );
}
