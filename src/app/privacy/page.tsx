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
  { id: "introduction", title: "Introduction" },
  { id: "information-we-collect", title: "Information We Collect" },
  { id: "how-we-use", title: "How We Use Your Information" },
  { id: "sharing", title: "Sharing Your Information" },
  { id: "cookies", title: "Cookies & Tracking" },
  { id: "security", title: "Data Security" },
  { id: "rights", title: "Your Rights" },
  { id: "changes", title: "Changes to This Policy" },
  { id: "contact", title: "Contact Us" },
];

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background decorations */}
      <ParallaxRing
        className="absolute -right-64 top-32 w-125 h-125 z-0"
        color="#28547C"
        opacity={0.02}
        speed={0.1}
      />
      <DecorDots
        className="absolute left-10 bottom-40 w-32 h-32 z-0"
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
            Privacy Policy
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
            <section id="introduction">
              <h2>Introduction</h2>
              <p>
                Welcome to YmitAcademy. We respect your privacy and are committed to 
                protecting your personal data. This privacy policy will inform you about 
                how we look after your personal data when you visit our website and tell 
                you about your privacy rights and how the law protects you.
              </p>
              <p>
                This privacy policy applies to information we collect when you use our 
                website, services, or otherwise interact with us.
              </p>
            </section>

            <section id="information-we-collect">
              <h2>Information We Collect</h2>
              <p>We may collect and process the following types of information:</p>
              <h3>Information you provide to us:</h3>
              <ul>
                <li>
                  <strong>Contact information:</strong> Name, email address, phone number, 
                  and any other information you provide when contacting us
                </li>
                <li>
                  <strong>Account information:</strong> If you create an account, we collect 
                  your username, password, and profile information
                </li>
                <li>
                  <strong>Communications:</strong> Any messages, feedback, or other 
                  communications you send to us
                </li>
              </ul>
              <h3>Information collected automatically:</h3>
              <ul>
                <li>
                  <strong>Usage data:</strong> Information about how you use our website, 
                  including pages visited, time spent, and navigation patterns
                </li>
                <li>
                  <strong>Device information:</strong> Browser type, operating system, 
                  device type, and IP address
                </li>
                <li>
                  <strong>Cookies:</strong> We use cookies and similar technologies to 
                  enhance your experience
                </li>
              </ul>
            </section>

            <section id="how-we-use">
              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send you updates, newsletters, and marketing communications (with your consent)</li>
                <li>Analyze usage patterns to improve user experience</li>
                <li>Detect and prevent fraud or security issues</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section id="sharing">
              <h2>Sharing Your Information</h2>
              <p>
                We do not sell your personal information. We may share your information 
                in the following circumstances:
              </p>
              <ul>
                <li>
                  <strong>Service providers:</strong> With third-party vendors who assist 
                  us in operating our website and services
                </li>
                <li>
                  <strong>Legal requirements:</strong> When required by law or to protect 
                  our rights and safety
                </li>
                <li>
                  <strong>Business transfers:</strong> In connection with a merger, 
                  acquisition, or sale of assets
                </li>
              </ul>
            </section>

            <section id="cookies">
              <h2>Cookies & Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to collect and store 
                information about your preferences and browsing activity.
              </p>
              <p>Types of cookies we use:</p>
              <ul>
                <li>
                  <strong>Essential cookies:</strong> Required for the website to function 
                  properly
                </li>
                <li>
                  <strong>Analytics cookies:</strong> Help us understand how visitors 
                  interact with our website
                </li>
                <li>
                  <strong>Preference cookies:</strong> Remember your settings and preferences
                </li>
              </ul>
              <p>
                You can control cookies through your browser settings. However, disabling 
                certain cookies may affect website functionality.
              </p>
            </section>

            <section id="security">
              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect 
                your personal data against unauthorized access, alteration, disclosure, 
                or destruction. However, no method of transmission over the Internet is 
                100% secure.
              </p>
            </section>

            <section id="rights">
              <h2>Your Rights</h2>
              <p>Depending on your location, you may have the following rights:</p>
              <ul>
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us using the information 
                provided below.
              </p>
            </section>

            <section id="changes">
              <h2>Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you 
                of any changes by posting the new policy on this page and updating the 
                &quot;Last updated&quot; date.
              </p>
            </section>

            <section id="contact">
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our practices, 
                please contact us at:
              </p>
              <ul>
                <li>
                  Email:{" "}
                  <a href="mailto:privacy@ymitacademy.com">privacy@ymitacademy.com</a>
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

              {/* Quick contact */}
              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-3">
                  Questions about privacy?
                </p>
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
