import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPostSchema } from "@/lib/validations";

// GET /api/posts - Fetch all posts
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") ?? "1");
        const pageSize = parseInt(searchParams.get("pageSize") ?? "10");
        const skip = (page - 1) * pageSize;

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where: { published: true },
                orderBy: { createdAt: "desc" },
                skip,
                take: pageSize,
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
            }),
            prisma.post.count({ where: { published: true } }),
        ]);

        return NextResponse.json({
            items: posts,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}

// POST /api/posts - Create a new post (Admin only)
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        if (session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Forbidden - Admin access required" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const validatedData = createPostSchema.parse(body);

        const post = await prisma.post.create({
            data: {
                ...validatedData,
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
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error("Error creating post:", error);

        if (error instanceof Error && error.name === "ZodError") {
            return NextResponse.json(
                { error: "Validation failed", details: error },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create post" },
            { status: 500 }
        );
    }
}
