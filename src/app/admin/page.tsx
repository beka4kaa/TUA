"use client";

import { useEffect, useState } from "react";
import { Users, FileText, Calendar, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/contexts/auth-context";
import { usersApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stats {
    totalUsers: number;
    totalMembers: number;
    totalPosts: number;
    totalBookings: number;
    upcomingConsultations: number;
    recentSignups: number;
}

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalMembers: 0,
        totalPosts: 0,
        totalBookings: 0,
        upcomingConsultations: 0,
        recentSignups: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const usersData = await usersApi.list({ page: 1 });
                setStats({
                    totalUsers: usersData.count,
                    totalMembers: 0, // TODO: filter by role from API
                    totalPosts: 0, // TODO: fetch from blog API
                    totalBookings: 0, // TODO: fetch from bookings API
                    upcomingConsultations: 0,
                    recentSignups: 0,
                });
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back, {user?.displayName ?? "Admin"}!
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
                            Registered accounts
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
                            Premium members
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
