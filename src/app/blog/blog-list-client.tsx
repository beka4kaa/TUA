"use client";

/**
 * Blog List Client Component
 * 
 * Handles client-side filtering and pagination
 */

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BlogCard } from "@/components/blog/blog-card";
import { FeaturedPost } from "@/components/blog/featured-post";
import { TagFilter } from "@/components/blog/tag-filter";
import { BlogPagination } from "@/components/blog/blog-pagination";
import { DecorRings, DecorDots } from "@/components/decor/background-decorations";

interface Tag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

interface PostTag {
  tag: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Author {
  id: string;
  name: string | null;
  image: string | null;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: Date | string | null;
  readingTimeMinutes: number;
  tags: PostTag[];
  author: Author;
}

interface BlogListClientProps {
  initialPosts: Post[];
  initialTotal: number;
  initialPages: number;
  initialPage: number;
  tags: Tag[];
  initialTag: string | null;
}

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export function BlogListClient({
  initialPosts,
  initialTotal,
  initialPages,
  initialPage,
  tags,
  initialTag,
}: BlogListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [posts] = useState(initialPosts);
  const [currentPage] = useState(initialPage);
  const [activeTag, setActiveTag] = useState(initialTag);
  const [totalPages] = useState(initialPages);
  
  // Handle tag change
  const handleTagChange = useCallback(
    (tagSlug: string | null) => {
      setActiveTag(tagSlug);
      const params = new URLSearchParams(searchParams.toString());
      
      if (tagSlug) {
        params.set("tag", tagSlug);
      } else {
        params.delete("tag");
      }
      params.delete("page"); // Reset to page 1
      
      router.push(`/blog?${params.toString()}`);
    },
    [router, searchParams]
  );
  
  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push(`/blog?${params.toString()}`);
    },
    [router, searchParams]
  );
  
  // Separate featured post (first post) from the rest
  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);
  
  return (
    <div className="relative">
      {/* Background decorations */}
      <DecorRings
        className="absolute -right-32 top-0 w-96 h-96 opacity-[0.02]"
        color="#28547C"
      />
      <DecorDots
        className="absolute left-0 bottom-1/4 w-32 h-32 opacity-[0.03]"
        color="#28547C"
      />
      
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="mb-10"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#28547C] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-[#111111] tracking-tight">
          BLOG
        </h1>
      </motion.div>
      
      {/* Tag filters */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="mb-10"
      >
        <TagFilter
          tags={tags}
          activeTag={activeTag}
          onTagChange={handleTagChange}
        />
      </motion.div>
      
      {/* Posts */}
      {posts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-gray-50 rounded-3xl"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#28547C]/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#28547C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-xl font-display font-bold text-[#111111] mb-2">
            {activeTag ? "Нет статей с этим тегом" : "Скоро здесь появятся статьи"}
          </h3>
          <p className="text-gray-500 mb-6">
            {activeTag 
              ? "Попробуйте выбрать другой тег или сбросить фильтр" 
              : "Мы работаем над интересным контентом для вас"}
          </p>
          {activeTag && (
            <button
              onClick={() => handleTagChange(null)}
              className="px-6 py-2 bg-[#28547C] text-white rounded-full hover:bg-[#28547C]/90 transition-colors"
            >
              Показать все статьи
            </button>
          )}
        </motion.div>
      ) : (
        <>
          {/* Featured post */}
          {featuredPost && <FeaturedPost post={featuredPost} />}
          
          {/* Grid */}
          {gridPosts.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {gridPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16">
              <BlogPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
