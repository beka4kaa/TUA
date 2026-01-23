import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/users - Fetch all users (Admin only)
export async function GET(request: Request) {
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

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") ?? "1");
        const pageSize = parseInt(searchParams.get("pageSize") ?? "20");
        const search = searchParams.get("search") ?? "";
        const role = searchParams.get("role");
        const tier = searchParams.get("tier");

        const skip = (page - 1) * pageSize;

        // Build where clause
        const whereClause: Record<string, unknown> = {};

        if (search) {
            whereClause.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ];
        }

        if (role && role !== "all") {
            whereClause.role = role;
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where: whereClause,
                orderBy: { createdAt: "desc" },
                skip,
                take: pageSize,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    lastLoginAt: true,
                    createdAt: true,
                    subscription: {
                        select: {
                            tier: true,
                            status: true,
                        },
                    },
                },
            }),
            prisma.user.count({ where: whereClause }),
        ]);

        // Filter by subscription tier if provided
        let filteredUsers = users;
        if (tier && tier !== "all") {
            filteredUsers = users.filter(
                (user: typeof users[number]) => user.subscription?.tier === tier
            );
        }

        return NextResponse.json({
            items: filteredUsers,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}
