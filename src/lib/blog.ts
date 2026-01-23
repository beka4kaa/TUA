/**
 * Blog utilities and helpers
 */

import { prisma } from "@/lib/prisma";

// Calculate reading time from content
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes);
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .substring(0, 100); // Limit length
}

// Check if slug exists and make unique if needed
export async function ensureUniqueSlug(slug: string, excludeId?: string): Promise<string> {
  let uniqueSlug = slug;
  let counter = 1;
  
  while (true) {
    const existing = await prisma.post.findFirst({
      where: {
        slug: uniqueSlug,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    
    if (!existing) {
      return uniqueSlug;
    }
    
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
}

// Format date for display
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Format short date
export function formatShortDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Get published posts with pagination
export async function getPublishedPosts({
  page = 1,
  limit = 9,
  tagSlug,
}: {
  page?: number;
  limit?: number;
  tagSlug?: string;
} = {}) {
  const skip = (page - 1) * limit;
  
  const where = {
    status: "PUBLISHED" as const,
    ...(tagSlug && {
      tags: {
        some: {
          tag: {
            slug: tagSlug,
          },
        },
      },
    }),
  };
  
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
        publishedAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);
  
  return {
    posts,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  };
}

// Get single post by slug
export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
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
}

// Get all tags with post counts
export async function getAllTags() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: {
          posts: {
            where: {
              post: {
                status: "PUBLISHED",
              },
            },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
  
  return tags.map((tag) => ({
    ...tag,
    postCount: tag._count.posts,
  }));
}

// Get related posts (same tags, excluding current)
export async function getRelatedPosts(postId: string, tagIds: string[], limit = 3) {
  if (tagIds.length === 0) {
    return prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        id: { not: postId },
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
      orderBy: {
        publishedAt: "desc",
      },
      take: limit,
    });
  }
  
  return prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: postId },
      tags: {
        some: {
          tagId: { in: tagIds },
        },
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
    orderBy: {
      publishedAt: "desc",
    },
    take: limit,
  });
}

// Get or create tags by names
export async function getOrCreateTags(tagNames: string[]): Promise<string[]> {
  const tagIds: string[] = [];
  
  for (const name of tagNames) {
    const slug = generateSlug(name);
    
    const tag = await prisma.tag.upsert({
      where: { slug },
      create: { name: name.trim(), slug },
      update: {},
    });
    
    tagIds.push(tag.id);
  }
  
  return tagIds;
}
