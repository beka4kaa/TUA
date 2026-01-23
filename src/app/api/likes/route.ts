import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/likes - Toggle like on a post
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { postId } = await request.json();

        if (!postId) {
            return NextResponse.json(
                { error: "Post ID is required" },
                { status: 400 }
            );
        }

        // Check if post exists
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        // Check if already liked
        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId: session.user.id,
                },
            },
        });

        if (existingLike) {
            // Unlike
            await prisma.like.delete({
                where: { id: existingLike.id },
            });

            return NextResponse.json({ liked: false });
        } else {
            // Like
            await prisma.like.create({
                data: {
                    postId,
                    userId: session.user.id,
                },
            });

            return NextResponse.json({ liked: true });
        }
    } catch (error) {
        console.error("Error toggling like:", error);
        return NextResponse.json(
            { error: "Failed to toggle like" },
            { status: 500 }
        );
    }
}
