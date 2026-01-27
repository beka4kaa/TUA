"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { PostEditor } from "../post-editor";

interface Tag {
    id: string;
    name: string;
    slug: string;
}

export default function NewBlogPostPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== "ADMIN")) {
            router.push("/dashboard");
            return;
        }

        async function fetchTags() {
            try {
                const res = await fetch("http://127.0.0.1:8000/api/blog/tags/");
                if (!res.ok) throw new Error("Failed to fetch tags");
                const data = await res.json();
                setTags(data.results?.map((tag: any) => ({
                    id: tag.id.toString(),
                    name: tag.name,
                    slug: tag.slug,
                })) ?? []);
            } catch (err) {
                console.error("Failed to load tags:", err);
            } finally {
                setIsLoading(false);
            }
        }

        if (user && user.role === "ADMIN") {
            fetchTags();
        }
    }, [user, authLoading, router]);

    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto">
            <PostEditor tags={tags} />
        </div>
    );
}
