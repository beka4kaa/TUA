import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCommentSchema } from "@/lib/validations";

// POST /api/comments - Create a comment
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const validatedData = createCommentSchema.parse(body);

        // Check if post exists
        const post = await prisma.post.findUnique({
            where: { id: validatedData.postId },
        });

        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        const comment = await prisma.comment.create({
            data: {
                content: validatedData.content,
                postId: validatedData.postId,
                authorId: session.user.id,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error("Error creating comment:", error);

        if (error instanceof Error && error.name === "ZodError") {
            return NextResponse.json(
                { error: "Validation failed", details: error },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create comment" },
            { status: 500 }
        );
    }
}

// DELETE /api/comments - Delete a comment (author or admin only)
export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { commentId } = await request.json();

        if (!commentId) {
            return NextResponse.json(
                { error: "Comment ID is required" },
                { status: 400 }
            );
        }

        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!comment) {
            return NextResponse.json(
                { error: "Comment not found" },
                { status: 404 }
            );
        }

        // Check if user is author or admin
        if (comment.authorId !== session.user.id && session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        await prisma.comment.delete({
            where: { id: commentId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return NextResponse.json(
            { error: "Failed to delete comment" },
            { status: 500 }
        );
    }
}
