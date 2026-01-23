import { prisma } from "@/lib/prisma";
import { FeedList, FeedListSkeleton } from "@/components/feed/feed-list";
import { Suspense } from "react";

export const metadata = {
    title: "News Feed",
    description: "Stay updated with the latest news and announcements from Ymit Academy",
};

async function getFeedPosts() {
    const posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
            _count: {
                select: {
                    likes: true,
                    comments: true,
                },
            },
            likes: {
                select: {
                    userId: true,
                },
            },
            comments: {
                orderBy: { createdAt: "desc" },
                take: 5,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
            },
        },
    });

    // Serialize dates for client component
    return posts.map((post: typeof posts[number]) => ({
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        comments: post.comments.map((comment: typeof post.comments[number]) => ({
            ...comment,
            createdAt: comment.createdAt.toISOString(),
            updatedAt: comment.updatedAt.toISOString(),
        })),
    }));
}

async function FeedContent() {
    const posts = await getFeedPosts();
    return <FeedList initialPosts={posts} />;
}

export default function FeedPage() {
    return (
        <div className="container max-w-2xl py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight">News Feed</h1>
                <p className="text-muted-foreground">
                    Latest updates and announcements from Ymit Academy
                </p>
            </div>

            <Suspense fallback={<FeedListSkeleton />}>
                <FeedContent />
            </Suspense>
        </div>
    );
}
