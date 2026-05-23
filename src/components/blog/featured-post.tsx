"use client";

/**
 * Blog Featured Card Component
 * 
 * Large featured post card for the hero section
 */

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatShortDate } from "@/lib/blog";

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface PostTag {
  tag: Tag;
}

interface Author {
  id: string;
  name: string | null;
  image: string | null;
}

interface FeaturedPostProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImageUrl: string | null;
    publishedAt: Date | string | null;
    readingTimeMinutes: number;
    tags: PostTag[];
    author: Author;
  };
}

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <motion.article
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="group relative bg-[#111111] rounded-3xl overflow-hidden"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[21/9] md:aspect-[3/1]">
          {/* Background image or gradient */}
          {post.coverImageUrl ? (
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-[#1B5FAA]/80 via-[#164C88] to-[#111111]">
              {/* Decorative elements */}
              <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#1B5FAA]/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#1B5FAA]/20 rounded-full blur-3xl" />
              
              {/* Grid pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 100 100" preserveAspectRatio="none">
                <pattern id="featured-grid" width="5" height="5" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.3" fill="white" />
                </pattern>
                <rect width="100" height="100" fill="url(#featured-grid)" />
              </svg>
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Content overlay */}
          <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
            {/* Meta info */}
            <div className="flex items-center gap-4 mb-4">
              {post.publishedAt && (
                <span className="inline-flex items-center gap-1.5 text-white/80 text-sm">
                  <Calendar className="w-4 h-4" />
                  {formatShortDate(post.publishedAt)}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-white/80 text-sm">
                <Clock className="w-4 h-4" />
                {post.readingTimeMinutes} minutes
              </span>
            </div>
            
            {/* Title */}
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 max-w-3xl group-hover:text-white/90 transition-colors">
              {post.title}
            </h2>
            
            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-white/70 text-base md:text-lg mb-6 max-w-2xl line-clamp-2">
                {post.excerpt}
              </p>
            )}
            
            {/* Tags and Read more */}
            <div className="flex flex-wrap items-center gap-3">
              {post.tags.slice(0, 3).map(({ tag }) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white text-xs hover:bg-white/20"
                >
                  {tag.name}
                </Badge>
              ))}
              
              <span className="ml-auto inline-flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all">
                Read more
                <ArrowUpRight className="w-5 h-5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
