"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, MessageSquare, CreditCard, ArrowRight, Loader2 } from "lucide-react";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardShell, DashboardHeader } from "@/components/layout/dashboard-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardPage() {
    const router = useRouter();
    const { user, isLoading, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    const getTierColor = (tier: string) => {
        switch (tier) {
            case "PREMIUM": return "bg-purple-500";
            case "STANDARD": return "bg-blue-500";
            default: return "bg-gray-500";
        }
    };

    const getInitials = (name: string | null | undefined) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const subscriptionTier = user.subscription?.tier || "FREE";
    const displayName = user.displayName || user.email?.split("@")[0] || "User";

    return (
        <DashboardShell>
            {/* Welcome Section */}
            <DashboardHeader
                title={`Welcome back, ${displayName}! 👋`}
                description="Here's what's happening with your account today."
            />

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {/* Subscription Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Subscription</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Badge className={getTierColor(subscriptionTier)}>
                                {subscriptionTier}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {subscriptionTier === "FREE"
                                ? "Upgrade to unlock premium features"
                                : "Active subscription"}
                        </p>
                    </CardContent>
                </Card>

                {/* Account Status */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Badge variant={user.status === "ACTIVE" ? "default" : "secondary"}>
                                {user.status}
                            </Badge>
                            <Badge variant="outline">{user.role?.toUpperCase()}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {user.email}
                        </p>
                    </CardContent>
                </Card>

                {/* Bookings */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground mt-2">
                            No upcoming bookings
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common tasks and features
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Link href="/bookings">
                            <Button variant="outline" className="w-full justify-between">
                                Book a Consultation
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/blog">
                            <Button variant="outline" className="w-full justify-between">
                                Read Latest Articles
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/feed">
                            <Button variant="outline" className="w-full justify-between">
                                Browse Feed
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Profile</CardTitle>
                        <CardDescription>
                            Manage your account settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={user.image ?? undefined} />
                                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                                    {getInitials(displayName)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{displayName}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardShell>
    );
}
