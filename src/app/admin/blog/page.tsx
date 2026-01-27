"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { AdminBlogClient } from "./admin-blog-client";

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    status: "DRAFT" | "PUBLISHED";
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    readingTimeMinutes: number | null;
    author: {
        id: string;
        name: string | null;
        image: string | null;
    };
    tags: {
        tag: {
            id: string;
            name: string;
            slug: string;
        };
    }[];
}

export default function AdminBlogPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== "ADMIN")) {
            router.push("/dashboard");
            return;
        }

        async function fetchPosts() {
            try {
                const res = await fetch("http://127.0.0.1:8000/api/blog/posts/");
                if (!res.ok) throw new Error("Failed to fetch posts");
                const data = await res.json();

                // Transform Django API response to match expected format
                const transformedPosts: Post[] = data.results?.map((post: any) => ({
                    id: post.id.toString(),
                    title: post.title,
                    slug: post.slug,
                    excerpt: post.excerpt,
                    status: post.is_published ? "PUBLISHED" : "DRAFT",
                    publishedAt: post.published_at ? new Date(post.published_at) : null,
                    createdAt: new Date(post.created_at),
                    updatedAt: new Date(post.updated_at),
                    readingTimeMinutes: post.reading_time_minutes,
                    author: {
                        id: post.author?.id?.toString() ?? "",
                        name: post.author?.display_name ?? null,
                        image: post.author?.avatar ?? null,
                    },
                    tags: post.tags?.map((tag: any) => ({
                        tag: {
                            id: tag.id?.toString() ?? "",
                            name: tag.name,
                            slug: tag.slug,
                        },
                    })) ?? [],
                })) ?? [];

                setPosts(transformedPosts);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load posts");
            } finally {
                setIsLoading(false);
            }
        }

        if (user && user.role === "ADMIN") {
            fetchPosts();
        }
    }, [user, authLoading, router]);

    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 md:p-8 max-w-7xl mx-auto">
                <p className="text-destructive">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <AdminBlogClient posts={posts} />
        </div>
    );
}
