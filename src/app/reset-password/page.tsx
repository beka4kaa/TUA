"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { useAuth } from "@/contexts/auth-context";
import { ApiClientError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, CheckCircle2, XCircle, Loader2 } from "lucide-react";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { resetPassword } = useAuth();
    
    const token = searchParams.get("token");
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        
        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        
        if (!token) {
            toast.error("Invalid reset link");
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword(token, password);
            setIsSuccess(true);
            toast.success("Password reset successfully!");
        } catch (err) {
            if (err instanceof ApiClientError) {
                toast.error(err.message);
            } else {
                toast.error("Failed to reset password");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // No token provided
    if (!token) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                    <CardTitle className="text-2xl font-bold">Invalid Link</CardTitle>
                    <CardDescription>
                        This password reset link is invalid or has expired.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-center">
                    <Link href="/forgot-password">
                        <Button variant="outline">Request New Link</Button>
                    </Link>
                </CardFooter>
            </Card>
        );
    }

    // Success state
    if (isSuccess) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <CardTitle className="text-2xl font-bold">Password Reset!</CardTitle>
                    <CardDescription>
                        Your password has been successfully reset.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-center">
                    <Button onClick={() => router.push("/login")}>
                        Go to Login
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <KeyRound className="h-10 w-10 mx-auto text-primary" />
                <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
                <CardDescription className="text-center">
                    Enter your new password below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                            Must be at least 8 characters with uppercase, lowercase, and number
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Suspense fallback={
                <Card className="w-full max-w-md">
                    <CardContent className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </CardContent>
                </Card>
            }>
                <ResetPasswordContent />
            </Suspense>
        </div>
    );
}
