import { getServerSession } from "next-auth";
import { Users, FileText, Calendar, TrendingUp } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getStats() {
    const [
        totalUsers,
        totalMembers,
        totalPosts,
        totalBookings,
        upcomingConsultations,
        recentSignups,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
            where: { role: { in: ["MEMBER", "ADMIN"] } },
        }),
        prisma.post.count({ where: { published: true } }),
        prisma.booking.count(),
        prisma.booking.count({
            where: {
                scheduledAt: { gte: new Date() },
                status: { in: ["PENDING", "CONFIRMED"] },
            },
        }),
        prisma.user.count({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
                },
            },
        }),
    ]);

    return {
        totalUsers,
        totalMembers,
        totalPosts,
        totalBookings,
        upcomingConsultations,
        recentSignups,
    };
}

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);
    const stats = await getStats();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back, {session?.user?.name ?? "Admin"}!
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            +{stats.recentSignups} this week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalMembers}</div>
                        <p className="text-xs text-muted-foreground">
                            {((stats.totalMembers / stats.totalUsers) * 100).toFixed(1)}% of
                            users
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalPosts}</div>
                        <p className="text-xs text-muted-foreground">Published posts</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Consultations</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.upcomingConsultations}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Upcoming sessions ({stats.totalBookings} total)
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <a
                            href="/admin/posts/new"
                            className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors"
                        >
                            <FileText className="h-5 w-5 mr-3 text-primary" />
                            <div>
                                <p className="font-medium">Create New Post</p>
                                <p className="text-sm text-muted-foreground">
                                    Share updates with your community
                                </p>
                            </div>
                        </a>
                        <a
                            href="/admin/users"
                            className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors"
                        >
                            <Users className="h-5 w-5 mr-3 text-primary" />
                            <div>
                                <p className="font-medium">Manage Users</p>
                                <p className="text-sm text-muted-foreground">
                                    View and manage user accounts
                                </p>
                            </div>
                        </a>
                        <a
                            href="/admin/consultations"
                            className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors"
                        >
                            <Calendar className="h-5 w-5 mr-3 text-primary" />
                            <div>
                                <p className="font-medium">View Consultations</p>
                                <p className="text-sm text-muted-foreground">
                                    Manage upcoming sessions
                                </p>
                            </div>
                        </a>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Platform Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Free Users
                                </span>
                                <span className="font-medium">
                                    {stats.totalUsers - stats.totalMembers}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Paid Members
                                </span>
                                <span className="font-medium">{stats.totalMembers}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Total Bookings
                                </span>
                                <span className="font-medium">{stats.totalBookings}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Upcoming Sessions
                                </span>
                                <span className="font-medium text-secondary">
                                    {stats.upcomingConsultations}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
