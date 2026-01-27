"use client";

/**
 * Article Client Component
 * 
 * Full article view with:
 * - Hero header
 * - Markdown content
 * - Related posts
 * - Scroll animations
 */

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/components/blog/blog-card";
import { formatDate } from "@/lib/blog";
import { DecorRings, DecorDots } from "@/components/decor/background-decorations";

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

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content?: string;
  coverImageUrl: string | null;
  publishedAt: string | null;
  readingTimeMinutes: number;
  tags: PostTag[];
  author: Author;
}

interface ArticleClientProps {
  post: Post;
  relatedPosts: Post[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
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

export function ArticleClient({ post, relatedPosts }: ArticleClientProps) {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white border-b border-gray-100">
        {/* Background decorations */}
        <DecorRings
          className="absolute right-0 top-0 w-96 h-96 opacity-[0.02]"
          color="#28547C"
        />

        <div className="container mx-auto px-4 py-12 md:py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            {/* Back link */}
            <motion.div variants={itemVariants}>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#28547C] transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </motion.div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-6">
                {post.tags.map(({ tag }) => (
                  <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
                    <Badge
                      variant="outline"
                      className="text-xs font-medium bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-600 cursor-pointer"
                    >
                      {tag.name}
                    </Badge>
                  </Link>
                ))}
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] mb-6 leading-tight"
            >
              {post.title}
            </motion.h1>

            {/* Meta */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-500 text-sm"
            >
              {post.publishedAt && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.publishedAt)}
                </span>
              )}

              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readingTimeMinutes} min read
              </span>

              {post.author.name && (
                <span className="inline-flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {post.author.name}
                </span>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Cover Image */}
      {post.coverImageUrl && (
        <section className="relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-5xl mx-auto -mt-4 md:-mt-8"
            >
              <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/50">
                <Image
                  src={post.coverImageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="relative py-12 md:py-20">
        <DecorDots
          className="absolute left-0 top-1/4 w-24 h-24 opacity-[0.03]"
          color="#28547C"
        />

        <div className="container mx-auto px-4">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed font-medium">
                {post.excerpt}
              </p>
            )}

            {/* Markdown content */}
            <div className="prose prose-lg prose-gray max-w-none prose-headings:font-display prose-headings:text-[#111111] prose-a:text-[#28547C] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-pre:bg-gray-900 prose-code:text-[#E67E22]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content || ""}
              </ReactMarkdown>
            </div>
          </motion.article>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-16 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              You are subscribed
            </div>
            <p className="text-gray-500 text-sm">
              Thank you for reading! Stay tuned for more insights.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#111111] mb-10">
                OTHER ARTICLES
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost, index) => (
                  <BlogCard
                    key={relatedPost.id}
                    post={relatedPost}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </main>
  );
}
