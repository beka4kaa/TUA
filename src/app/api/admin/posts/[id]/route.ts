import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateReadingTime, generateSlug, ensureUniqueSlug, getOrCreateTags } from "@/lib/blog";
import { z } from "zod";

// Schema for updating posts
const updatePostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200).optional(),
  slug: z.string().optional(),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(1, "Content is required").optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  coverImageUrl: z.string().url().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

// GET - Get single post for admin
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id } = await params;
    
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PUT - Update post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id } = await params;
    const body = await request.json();
    const validatedData = updatePostSchema.parse(body);
    
    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: { tags: true },
    });
    
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    // Handle slug update
    let slug = existingPost.slug;
    if (validatedData.slug && validatedData.slug !== existingPost.slug) {
      slug = await ensureUniqueSlug(validatedData.slug, id);
    } else if (validatedData.title && validatedData.title !== existingPost.title && !validatedData.slug) {
      // Auto-generate new slug if title changed and no custom slug provided
      const baseSlug = generateSlug(validatedData.title);
      slug = await ensureUniqueSlug(baseSlug, id);
    }
    
    // Calculate reading time if content changed
    const readingTimeMinutes = validatedData.content
      ? calculateReadingTime(validatedData.content)
      : existingPost.readingTimeMinutes;
    
    // Determine publishedAt
    let publishedAt = existingPost.publishedAt;
    if (validatedData.status === "PUBLISHED" && !existingPost.publishedAt) {
      publishedAt = new Date();
    } else if (validatedData.status === "DRAFT") {
      // Keep original publishedAt for drafts (in case of unpublish and re-publish)
    }
    
    // Handle tags update
    if (validatedData.tags !== undefined) {
      // Remove existing tags
      await prisma.postTag.deleteMany({
        where: { postId: id },
      });
      
      // Add new tags
      const tagIds = await getOrCreateTags(validatedData.tags);
      await prisma.postTag.createMany({
        data: tagIds.map((tagId) => ({
          postId: id,
          tagId,
        })),
      });
    }
    
    // Update post
    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(validatedData.title && { title: validatedData.title }),
        slug,
        ...(validatedData.excerpt !== undefined && { excerpt: validatedData.excerpt }),
        ...(validatedData.content && { content: validatedData.content }),
        ...(validatedData.status && { status: validatedData.status }),
        ...(validatedData.coverImageUrl !== undefined && { coverImageUrl: validatedData.coverImageUrl }),
        readingTimeMinutes,
        publishedAt,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id } = await params;
    
    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });
    
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    // Delete post (cascade will handle tags, comments, likes)
    await prisma.post.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
