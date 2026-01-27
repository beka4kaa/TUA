/**
 * Blog utilities and helpers
 * 
 * This module provides functions to interact with the Django blog API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types
export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface ApiAuthor {
  id: string;
  displayName: string;
  image: string | null;
}

export interface Author {
  id: string;
  name: string | null;
  image: string | null;
}

export interface ApiPostTag {
  id: number;
  name: string;
  slug: string;
}

export interface PostTag {
  tag: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ApiPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content?: string;
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt: string | null;
  readingTimeMinutes: number;
  coverImageUrl: string | null;
  author: ApiAuthor;
  tags: ApiPostTag[];
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content?: string;
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt: string | null;
  readingTimeMinutes: number;
  coverImageUrl: string | null;
  author: Author;
  tags: PostTag[];
  createdAt: string;
  updatedAt: string;
}

export interface PostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt: string | null;
  readingTimeMinutes: number;
  coverImageUrl: string | null;
  author: Author;
  tags: PostTag[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

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

// Transform API post to frontend format
function transformPost(apiPost: ApiPost): Post {
  return {
    id: String(apiPost.id),
    title: apiPost.title,
    slug: apiPost.slug,
    excerpt: apiPost.excerpt,
    content: apiPost.content,
    status: apiPost.status,
    publishedAt: apiPost.publishedAt,
    readingTimeMinutes: apiPost.readingTimeMinutes,
    coverImageUrl: apiPost.coverImageUrl,
    createdAt: apiPost.createdAt,
    updatedAt: apiPost.updatedAt,
    author: {
      id: apiPost.author.id,
      name: apiPost.author.displayName,
      image: apiPost.author.image,
    },
    tags: apiPost.tags.map(tag => ({
      tag: {
        id: String(tag.id),
        name: tag.name,
        slug: tag.slug,
      }
    })),
  };
}

function transformPostListItem(apiPost: ApiPost): PostListItem {
  return {
    id: String(apiPost.id),
    title: apiPost.title,
    slug: apiPost.slug,
    excerpt: apiPost.excerpt,
    status: apiPost.status,
    publishedAt: apiPost.publishedAt,
    readingTimeMinutes: apiPost.readingTimeMinutes,
    coverImageUrl: apiPost.coverImageUrl,
    author: {
      id: apiPost.author.id,
      name: apiPost.author.displayName,
      image: apiPost.author.image,
    },
    tags: apiPost.tags.map(tag => ({
      tag: {
        id: String(tag.id),
        name: tag.name,
        slug: tag.slug,
      }
    })),
  };
}

// API Fetch helper
async function apiFetch<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    next: { revalidate: 60 }, // Cache for 60 seconds
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
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
} = {}): Promise<{
  posts: PostListItem[];
  total: number;
  pages: number;
  currentPage: number;
}> {
  try {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(limit),
    });
    
    if (tagSlug) {
      params.set('tag', tagSlug);
    }
    
    // Use /blog/ endpoint for public posts
    const data = await apiFetch<PaginatedResponse<ApiPost>>(`/blog/?${params}`);
    
    return {
      posts: data.results.map(transformPostListItem),
      total: data.count,
      pages: Math.ceil(data.count / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return {
      posts: [],
      total: 0,
      pages: 0,
      currentPage: page,
    };
  }
}

// Get single post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const apiPost = await apiFetch<ApiPost>(`/blog/${slug}/`);
    return transformPost(apiPost);
  } catch {
    return null;
  }
}

// Get all tags
export async function getAllTags(): Promise<(Tag & { postCount: number })[]> {
  try {
    const tags = await apiFetch<(Tag & { post_count?: number })[]>('/blog/tags/');
    return tags.map(tag => ({ 
      ...tag, 
      id: Number(tag.id),
      postCount: tag.post_count || 0 
    }));
  } catch {
    return [];
  }
}

// Get related posts (by tag)
export async function getRelatedPosts(
  currentSlug: string, 
  tagSlugs: string[], 
  limit = 3
): Promise<PostListItem[]> {
  try {
    // If no tags, just get recent posts
    if (tagSlugs.length === 0) {
      const data = await apiFetch<PaginatedResponse<ApiPost>>(
        `/blog/?page_size=${limit + 1}`
      );
      return data.results
        .filter(p => p.slug !== currentSlug)
        .slice(0, limit)
        .map(transformPostListItem);
    }
    
    // Get posts with first tag
    const data = await apiFetch<PaginatedResponse<ApiPost>>(
      `/blog/?tag=${tagSlugs[0]}&page_size=${limit + 1}`
    );
    
    return data.results
      .filter(p => p.slug !== currentSlug)
      .slice(0, limit)
      .map(transformPostListItem);
  } catch {
    return [];
  }
}
