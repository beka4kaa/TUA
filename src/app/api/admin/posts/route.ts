import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateReadingTime, generateSlug, ensureUniqueSlug, getOrCreateTags } from "@/lib/blog";
import { z } from "zod";

// Schema for creating/updating posts
const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  coverImageUrl: z.string().url().optional().nullable(),
  tags: z.array(z.string()).default([]),
});

// GET - List all posts for admin
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") as "DRAFT" | "PUBLISHED" | null;
    
    const skip = (page - 1) * limit;
    
    const where = status ? { status } : {};
    
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
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
        orderBy: {
          updatedAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);
    
    return NextResponse.json({
      posts,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST - Create new post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const validatedData = postSchema.parse(body);
    
    // Generate slug if not provided
    const baseSlug = validatedData.slug || generateSlug(validatedData.title);
    const slug = await ensureUniqueSlug(baseSlug);
    
    // Calculate reading time
    const readingTimeMinutes = calculateReadingTime(validatedData.content);
    
    // Get or create tags
    const tagIds = await getOrCreateTags(validatedData.tags);
    
    // Create post
    const post = await prisma.post.create({
      data: {
        title: validatedData.title,
        slug,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        status: validatedData.status,
        coverImageUrl: validatedData.coverImageUrl,
        readingTimeMinutes,
        publishedAt: validatedData.status === "PUBLISHED" ? new Date() : null,
        authorId: session.user.id,
        tags: {
          create: tagIds.map((tagId) => ({
            tagId,
          })),
        },
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
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
