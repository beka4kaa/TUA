"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { usersApi } from "@/lib/api";
import { UsersTable } from "@/components/admin/users-table";

interface UserData {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: "USER" | "MEMBER" | "ADMIN";
    lastLoginAt: Date | null;
    createdAt: Date;
    subscription: {
        tier: "FREE" | "BASIC" | "STANDARD" | "PREMIUM";
        status: string;
    } | null;
}

export default function AdminUsersPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== "ADMIN")) {
            router.push("/dashboard");
            return;
        }

        async function fetchUsers() {
            try {
                const data = await usersApi.list({ page: 1 });

                // Transform Django API response
                const transformedUsers: UserData[] = data.results.map((u: any) => ({
                    id: u.id.toString(),
                    name: u.display_name,
                    email: u.email,
                    image: u.avatar,
                    role: u.role?.toUpperCase() ?? "USER",
                    lastLoginAt: u.last_login ? new Date(u.last_login) : null,
                    createdAt: new Date(u.date_joined),
                    subscription: null,
                }));

                setUsers(transformedUsers);
            } catch (err) {
                console.error("Failed to load users:", err);
            } finally {
                setIsLoading(false);
            }
        }

        if (user && user.role === "ADMIN") {
            fetchUsers();
        }
    }, [user, authLoading, router]);

    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Users</h1>
                <p className="text-muted-foreground">
                    Manage user accounts and subscriptions
                </p>
            </div>

            <UsersTable users={users} />
        </div>
    );
}
