import { Suspense } from "react";
import { getPublishedPosts, getAllTags } from "@/lib/blog";
import { BlogListClient } from "./blog-list-client";

export const metadata = {
  title: "Blog | Stockermans",
  description: "Insights, tips, and guides on university admissions, scholarships, and studying abroad.",
};

export const revalidate = 60; // Revalidate every minute

async function BlogData({ searchParams }: { searchParams: Promise<{ tag?: string; page?: string }> }) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const tagSlug = params.tag || undefined;
  
  try {
    const [postsData, tags] = await Promise.all([
      getPublishedPosts({ page, limit: 9, tagSlug }),
      getAllTags(),
    ]);
    
    return (
      <BlogListClient
        initialPosts={postsData.posts}
        initialTotal={postsData.total}
        initialPages={postsData.pages}
        initialPage={page}
        tags={tags}
        initialTag={tagSlug || null}
      />
    );
  } catch (error) {
    console.error("Failed to fetch blog data:", error);
    // Return empty state if database is unavailable
    return (
      <BlogListClient
        initialPosts={[]}
        initialTotal={0}
        initialPages={0}
        initialPage={1}
        tags={[]}
        initialTag={null}
      />
    );
  }
}

function BlogSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="h-12 bg-gray-100 rounded w-48 mb-8" />
      
      {/* Tags skeleton */}
      <div className="flex gap-2 mb-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded-full w-24" />
        ))}
      </div>
      
      {/* Featured skeleton */}
      <div className="h-64 bg-gray-100 rounded-3xl mb-10" />
      
      {/* Grid skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-2xl h-80" />
        ))}
      </div>
    </div>
  );
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <Suspense fallback={<BlogSkeleton />}>
          <BlogData searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
