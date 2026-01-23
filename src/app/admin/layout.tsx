import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import {
    Users,
    FileText,
    Calendar,
    LayoutDashboard,
    LogOut,
    Settings,
} from "lucide-react";

import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { YmitMark } from "@/components/brand/logo";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

const adminNavItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Blog",
        href: "/admin/blog",
        icon: FileText,
    },
    {
        title: "Consultations",
        href: "/admin/consultations",
        icon: Calendar,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    // Redirect non-admins
    if (!session || session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const getInitials = (name: string | null | undefined) => {
        if (!name) return "A";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                {/* Sidebar */}
                <Sidebar className="border-r border-border">
                    <SidebarHeader className="p-4">
                        <Link href="/admin" className="flex items-center gap-2.5">
                            <YmitMark color="blue" className="w-6 h-6" />
                            <span className="font-body font-semibold text-base">Ymit Admin</span>
                        </Link>
                    </SidebarHeader>

                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {adminNavItems.map((item) => (
                                        <SidebarMenuItem key={item.href}>
                                            <SidebarMenuButton asChild>
                                                <Link href={item.href}>
                                                    <item.icon className="h-4 w-4" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>

                    <SidebarFooter className="p-4">
                        <Separator className="mb-4" />
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={session.user.image ?? undefined} />
                                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                                    {getInitials(session.user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {session.user.name ?? "Admin"}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {session.user.email}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start mt-2 text-muted-foreground"
                            asChild
                        >
                            <Link href="/api/auth/signout">
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out
                            </Link>
                        </Button>
                    </SidebarFooter>
                </Sidebar>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
                        <SidebarTrigger />
                        <div className="flex-1" />
                    </header>
                    <div className="p-4 lg:p-6">{children}</div>
                </main>
            </div>
        </SidebarProvider>
    );
}
