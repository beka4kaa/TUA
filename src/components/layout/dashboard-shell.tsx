"use client";

import { cn } from "@/lib/utils";

interface DashboardShellProps {
    children: React.ReactNode;
    className?: string;
    /** Use narrow width for feed-like content */
    narrow?: boolean;
}

/**
 * DashboardShell - Consistent container for all dashboard pages
 * Provides uniform padding, max-width, and spacing
 */
export function DashboardShell({ children, className, narrow = false }: DashboardShellProps) {
    return (
        <div className={cn(
            "w-full mx-auto px-6 md:px-8 py-8",
            narrow ? "max-w-3xl" : "max-w-7xl",
            className
        )}>
            {children}
        </div>
    );
}

interface DashboardHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
}

/**
 * DashboardHeader - Consistent header for dashboard pages
 */
export function DashboardHeader({ title, description, children }: DashboardHeaderProps) {
    return (
        <div className="flex flex-col gap-1 mb-8 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
                {description && (
                    <p className="text-muted-foreground mt-1">{description}</p>
                )}
            </div>
            {children && <div className="mt-4 md:mt-0">{children}</div>}
        </div>
    );
}
