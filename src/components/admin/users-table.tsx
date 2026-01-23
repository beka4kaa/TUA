"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Search } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Role = "USER" | "MEMBER" | "ADMIN";
type SubscriptionTier = "FREE" | "BASIC" | "STANDARD" | "PREMIUM";

interface UserWithSubscription {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: Role;
    lastLoginAt: Date | string | null;
    createdAt: Date | string;
    subscription: {
        tier: SubscriptionTier;
        status: string;
    } | null;
}

interface UsersTableProps {
    users: UserWithSubscription[];
}

const tierColors: Record<SubscriptionTier, string> = {
    FREE: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    BASIC: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    STANDARD: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    PREMIUM: "bg-secondary/20 text-secondary dark:bg-secondary/20",
};

const roleColors: Record<Role, string> = {
    USER: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    MEMBER: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    ADMIN: "bg-primary/20 text-primary dark:bg-primary/20",
};

export function UsersTable({ users: initialUsers }: UsersTableProps) {
    const [users] = useState(initialUsers);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [tierFilter, setTierFilter] = useState<string>("all");

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = roleFilter === "all" || user.role === roleFilter;

        const matchesTier =
            tierFilter === "all" ||
            user.subscription?.tier === tierFilter;

        return matchesSearch && matchesRole && matchesTier;
    });

    const getInitials = (name: string | null) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle>Users ({filteredUsers.length})</CardTitle>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                className="pl-8 w-full sm:w-[200px]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full sm:w-[130px]">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="USER">User</SelectItem>
                                <SelectItem value="MEMBER">Member</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={tierFilter} onValueChange={setTierFilter}>
                            <SelectTrigger className="w-full sm:w-[130px]">
                                <SelectValue placeholder="Tier" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Tiers</SelectItem>
                                <SelectItem value="FREE">Free</SelectItem>
                                <SelectItem value="BASIC">Basic</SelectItem>
                                <SelectItem value="STANDARD">Standard</SelectItem>
                                <SelectItem value="PREMIUM">Premium</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Subscription</TableHead>
                                <TableHead>Last Login</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        <p className="text-muted-foreground">No users found</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user.image ?? undefined} />
                                                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {user.name ?? "No name"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className={roleColors[user.role]}
                                            >
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className={
                                                    tierColors[user.subscription?.tier ?? "FREE"]
                                                }
                                            >
                                                {user.subscription?.tier ?? "FREE"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {user.lastLoginAt
                                                ? formatDistanceToNow(new Date(user.lastLoginAt), {
                                                    addSuffix: true,
                                                })
                                                : "Never"}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                    <DropdownMenuItem>Edit Role</DropdownMenuItem>
                                                    <DropdownMenuItem>Manage Subscription</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive">
                                                        Delete User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
