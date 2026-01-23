"use client";

/**
 * Blog Card Component - Rivo Style
 * 
 * Features:
 * - Premium hover effects
 * - Placeholder gradient when no image
 * - Tag badges
 * - Read more link
 */

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatShortDate } from "@/lib/blog";
import { cn } from "@/lib/utils";

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

interface BlogCardProps {
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
  featured?: boolean;
  index?: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

export function BlogCard({ post, featured = false, index = 0 }: BlogCardProps) {
  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      custom={index}
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden",
        "border border-gray-100 hover:border-gray-200",
        "transition-all duration-300",
        "hover:shadow-lg hover:shadow-gray-100/50",
        featured && "md:col-span-2 lg:col-span-3"
      )}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Image / Placeholder */}
        <div
          className={cn(
            "relative overflow-hidden",
            featured ? "aspect-[21/9]" : "aspect-[16/9]"
          )}
        >
          {post.coverImageUrl ? (
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-gray-50 via-gray-100 to-gray-50">
              {/* Decorative pattern */}
              <svg
                className="absolute inset-0 w-full h-full opacity-[0.03]"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <pattern id={`grid-${post.id}`} width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.5" fill="currentColor" />
                </pattern>
                <rect width="100" height="100" fill={`url(#grid-${post.id})`} />
              </svg>
              {/* Accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-[#28547C] via-[#E67E22] to-[#28547C] opacity-20" />
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          
          {/* Date badge */}
          {post.publishedAt && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                <Calendar className="w-3 h-3" />
                {formatShortDate(post.publishedAt)}
              </span>
            </div>
          )}
          
          {/* Reading time */}
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
              <Clock className="w-3 h-3" />
              {post.readingTimeMinutes} min
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 md:p-6">
          {/* Title */}
          <h3
            className={cn(
              "font-display font-semibold text-gray-900 mb-2",
              "group-hover:text-[#28547C] transition-colors duration-300",
              featured ? "text-xl md:text-2xl" : "text-lg"
            )}
          >
            {post.title}
          </h3>
          
          {/* Excerpt */}
          {post.excerpt && (
            <p className={cn(
              "text-gray-600 mb-4 line-clamp-2",
              featured ? "text-base" : "text-sm"
            )}>
              {post.excerpt}
            </p>
          )}
          
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map(({ tag }) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="text-xs font-medium bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-600"
                >
                  {tag.name}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs font-medium bg-gray-50 border-gray-200 text-gray-500">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          {/* Read more */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-sm font-medium text-gray-900 group-hover:text-[#28547C] transition-colors flex items-center gap-1">
              Read more
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
