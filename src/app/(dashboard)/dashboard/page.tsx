import { getServerSession } from "next-auth";
import Link from "next/link";
import { Calendar, MessageSquare, CreditCard, ArrowRight } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
    title: "Dashboard",
    description: "Your Ymit Academy dashboard",
};

async function getUserData(userId: string) {
    const [subscription, upcomingBookings, recentPosts] = await Promise.all([
        prisma.subscription.findUnique({
            where: { userId },
        }),
        prisma.booking.findMany({
            where: {
                userId,
                scheduledAt: { gte: new Date() },
                status: { in: ["PENDING", "CONFIRMED"] },
            },
            orderBy: { scheduledAt: "asc" },
            take: 3,
        }),
        prisma.post.findMany({
            where: { published: true },
            orderBy: { createdAt: "desc" },
            take: 3,
            include: {
                author: {
                    select: { name: true },
                },
            },
        }),
    ]);

    return { subscription, upcomingBookings, recentPosts };
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return null;
    }

    const { subscription, upcomingBookings, recentPosts } = await getUserData(
        session.user.id
    );

    const tierLabels: Record<string, string> = {
        FREE: "Free",
        BASIC: "Basic",
        STANDARD: "Standard",
        PREMIUM: "Premium",
    };

    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight">
                    Welcome back, {session.user.name?.split(" ")[0] ?? "there"}!
                </h1>
                <p className="text-muted-foreground">
                    Here&apos;s an overview of your Ymit Academy journey
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Subscription Status */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Subscription</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl font-bold">
                                {tierLabels[subscription?.tier ?? "FREE"]}
                            </span>
                            <Badge
                                variant={subscription?.status === "ACTIVE" ? "default" : "secondary"}
                                className={
                                    subscription?.status === "ACTIVE"
                                        ? "bg-green-100 text-green-800"
                                        : ""
                                }
                            >
                                {subscription?.status ?? "ACTIVE"}
                            </Badge>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/subscription">
                                {subscription?.tier === "FREE" ? "Upgrade Plan" : "Manage"}
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Upcoming Consultations */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Upcoming Consultations
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold mb-2">
                            {upcomingBookings.length}
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/bookings">View Bookings</Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="md:col-span-2 lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button className="w-full justify-between" variant="outline" asChild>
                            <Link href="/bookings/new">
                                Book Consultation
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button className="w-full justify-between" variant="outline" asChild>
                            <Link href="/feed">
                                View News Feed
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Posts */}
            <Card className="mt-6">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Latest Updates</CardTitle>
                        <CardDescription>Recent posts from our team</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/feed">
                            View All
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {recentPosts.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                            No posts yet. Check back later!
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {recentPosts.map((post: typeof recentPosts[number]) => (
                                <div
                                    key={post.id}
                                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                                >
                                    <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium truncate">{post.title}</h4>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {post.content}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            By {post.author.name ?? "Admin"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
