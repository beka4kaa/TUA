"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { PostEditor } from "../post-editor";

interface Tag {
    id: string;
    name: string;
    slug: string;
}

interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    status: "DRAFT" | "PUBLISHED";
    coverImageUrl: string | null;
    publishedAt: Date | null;
    metaTitle: string | null;
    metaDescription: string | null;
    tags: Tag[];
}

export default function EditBlogPostPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [post, setPost] = useState<Post | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== "ADMIN")) {
            router.push("/dashboard");
            return;
        }

        async function fetchData() {
            try {
                // Fetch post and tags in parallel
                const [postRes, tagsRes] = await Promise.all([
                    fetch(`http://127.0.0.1:8000/api/blog/posts/${id}/`),
                    fetch("http://127.0.0.1:8000/api/blog/tags/"),
                ]);

                if (postRes.status === 404) {
                    setNotFound(true);
                    return;
                }

                if (!postRes.ok) throw new Error("Failed to fetch post");

                const postData = await postRes.json();
                const tagsData = await tagsRes.json();

                setPost({
                    id: postData.id.toString(),
                    title: postData.title,
                    slug: postData.slug,
                    content: postData.content,
                    excerpt: postData.excerpt,
                    status: postData.is_published ? "PUBLISHED" : "DRAFT",
                    coverImageUrl: postData.cover_image,
                    publishedAt: postData.published_at ? new Date(postData.published_at) : null,
                    metaTitle: postData.meta_title,
                    metaDescription: postData.meta_description,
                    tags: postData.tags?.map((tag: any) => ({
                        id: tag.id.toString(),
                        name: tag.name,
                        slug: tag.slug,
                    })) ?? [],
                });

                setTags(tagsData.results?.map((tag: any) => ({
                    id: tag.id.toString(),
                    name: tag.name,
                    slug: tag.slug,
                })) ?? []);
            } catch (err) {
                console.error("Failed to load data:", err);
            } finally {
                setIsLoading(false);
            }
        }

        if (user && user.role === "ADMIN" && id) {
            fetchData();
        }
    }, [user, authLoading, router, id]);

    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="p-6 md:p-8 max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold">Post not found</h1>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto">
            <PostEditor post={post ?? undefined} tags={tags} />
        </div>
    );
}
