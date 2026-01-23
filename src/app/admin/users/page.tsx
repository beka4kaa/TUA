import { prisma } from "@/lib/prisma";
import { UsersTable } from "@/components/admin/users-table";

async function getUsers() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
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
    });

    return users;
}

export default async function AdminUsersPage() {
    const users = await getUsers();

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
