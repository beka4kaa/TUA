import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Only return published posts via public API
    if (post.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Get related posts
    const tagIds = post.tags.map((t) => t.tag.slug);
    const relatedPosts = await getRelatedPosts(post.id, tagIds, 3);

    return NextResponse.json({
      post,
      relatedPosts,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
