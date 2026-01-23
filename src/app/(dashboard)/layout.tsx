import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Home, Newspaper, Calendar, CreditCard, Settings, LogOut } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { YmitLogo, YmitMark } from "@/components/brand/logo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/feed", label: "News Feed", icon: Newspaper },
    { href: "/bookings", label: "My Bookings", icon: Calendar },
    { href: "/subscription", label: "Subscription", icon: CreditCard },
];

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const getInitials = (name: string | null | undefined) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="flex items-center">
                            <YmitLogo color="black" />
                        </Link>

                        <nav className="hidden md:flex items-center gap-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-2 font-body text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {session.user.role === "ADMIN" && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/admin">Admin Panel</Link>
                            </Button>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={session.user.image ?? undefined} />
                                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                            {getInitials(session.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {session.user.name}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {session.user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/settings">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/api/auth/signout" className="text-destructive">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Sign out
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation */}
            <nav className="md:hidden flex items-center justify-around border-b py-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* Main Content */}
            <main className="flex-1">{children}</main>
        </div>
    );
}
