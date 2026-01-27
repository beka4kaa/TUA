import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { ArticleClient } from "./article-client";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | Ymit Academy",
    };
  }

  return {
    title: `${post.title} | Ymit Academy Blog`,
    description: post.excerpt || `Read ${post.title} on Ymit Academy Blog`,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      authors: post.author.name ? [post.author.name] : undefined,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export const revalidate = 60;

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  // Get related posts
  const tagIds = post.tags.map((t) => t.tag.slug);
  const relatedPosts = await getRelatedPosts(post.id, tagIds, 3);

  return <ArticleClient post={post} relatedPosts={relatedPosts} />;
}
