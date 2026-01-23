import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createBookingSchema } from "@/lib/validations";

// GET /api/bookings - Fetch user's bookings (or all for admin)
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") ?? "1");
        const pageSize = parseInt(searchParams.get("pageSize") ?? "10");
        const skip = (page - 1) * pageSize;

        // Admin can see all bookings, users see only their own
        const whereClause =
            session.user.role === "ADMIN" ? {} : { userId: session.user.id };

        const [bookings, total] = await Promise.all([
            prisma.booking.findMany({
                where: whereClause,
                orderBy: { scheduledAt: "desc" },
                skip,
                take: pageSize,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        },
                    },
                },
            }),
            prisma.booking.count({ where: whereClause }),
        ]);

        return NextResponse.json({
            items: bookings,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json(
            { error: "Failed to fetch bookings" },
            { status: 500 }
        );
    }
}

// POST /api/bookings - Create a new booking (Members only)
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if user has an active paid subscription
        const subscription = await prisma.subscription.findUnique({
            where: { userId: session.user.id },
        });

        if (
            !subscription ||
            subscription.tier === "FREE" ||
            subscription.status !== "ACTIVE"
        ) {
            return NextResponse.json(
                { error: "Active membership required to book consultations" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const validatedData = createBookingSchema.parse(body);

        // Check for booking limits based on subscription tier
        const currentMonth = new Date();
        currentMonth.setDate(1);
        currentMonth.setHours(0, 0, 0, 0);

        const bookingsThisMonth = await prisma.booking.count({
            where: {
                userId: session.user.id,
                createdAt: { gte: currentMonth },
                status: { not: "CANCELLED" },
            },
        });

        const bookingLimits: Record<string, number> = {
            BASIC: 1,
            STANDARD: 3,
            PREMIUM: 999, // Unlimited
        };

        const limit = bookingLimits[subscription.tier] ?? 0;

        if (bookingsThisMonth >= limit) {
            return NextResponse.json(
                { error: `You have reached your monthly booking limit (${limit})` },
                { status: 403 }
            );
        }

        const booking = await prisma.booking.create({
            data: {
                title: validatedData.title,
                description: validatedData.description,
                scheduledAt: new Date(validatedData.scheduledAt),
                duration: validatedData.duration,
                userId: session.user.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json(booking, { status: 201 });
    } catch (error) {
        console.error("Error creating booking:", error);

        if (error instanceof Error && error.name === "ZodError") {
            return NextResponse.json(
                { error: "Validation failed", details: error },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create booking" },
            { status: 500 }
        );
    }
}
