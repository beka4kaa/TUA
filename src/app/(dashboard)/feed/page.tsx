"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { FeedList } from "@/components/feed/feed-list";
import { DashboardShell, DashboardHeader } from "@/components/layout/dashboard-shell";

interface FeedPost {
    id: string;
    title: string;
    content: string;
    excerpt: string | null;
    slug: string;
    createdAt: string;
    updatedAt: string;
    author: {
        id: string;
        name: string | null;
        image: string | null;
    };
    _count: {
        likes: number;
        comments: number;
    };
    likes: { userId: string }[];
    comments: {
        id: string;
        content: string;
        createdAt: string;
        updatedAt: string;
        author: {
            id: string;
            name: string | null;
            image: string | null;
        };
    }[];
}

export default function FeedPage() {
    const [posts, setPosts] = useState<FeedPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch("http://127.0.0.1:8000/api/blog/posts/?published=true");
                if (!res.ok) throw new Error("Failed to fetch posts");
                const data = await res.json();
                
                // Transform Django API response
                const transformedPosts: FeedPost[] = data.results?.map((post: any) => ({
                    id: post.id.toString(),
                    title: post.title,
                    content: post.content,
                    excerpt: post.excerpt,
                    slug: post.slug,
                    createdAt: post.created_at,
                    updatedAt: post.updated_at,
                    author: {
                        id: post.author?.id?.toString() ?? "",
                        name: post.author?.display_name ?? null,
                        image: post.author?.avatar ?? null,
                    },
                    _count: {
                        likes: post.likes_count ?? 0,
                        comments: post.comments_count ?? 0,
                    },
                    likes: [],
                    comments: [],
                })) ?? [];
                
                setPosts(transformedPosts);
            } catch (err) {
                console.error("Failed to load feed:", err);
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchPosts();
    }, []);

    return (
        <DashboardShell narrow>
            <DashboardHeader 
                title="News Feed"
                description="Latest updates and announcements from Stockermans"
            />

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <FeedList initialPosts={posts} />
            )}
        </DashboardShell>
    );
}
