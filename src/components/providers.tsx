"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/auth-context";
import { LanguageProvider } from "@/contexts/language-context";
import { Toaster } from "@/components/ui/sonner";

interface ProvidersProps {
    children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
            <LanguageProvider>
                <AuthProvider>
                    {children}
                    <Toaster position="top-right" richColors duration={4000} closeButton />
                </AuthProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}
