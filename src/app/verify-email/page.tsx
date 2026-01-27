"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2, Mail, AlertCircle } from "lucide-react";

const isDev = process.env.NODE_ENV === "development";

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { verifyEmail, resendVerification } = useAuth();
    
    const [status, setStatus] = useState<"loading" | "success" | "error" | "waiting">("waiting");
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const handleVerify = async (verifyToken: string) => {
        setStatus("loading");
        try {
            await verifyEmail(verifyToken);
            setStatus("success");
            toast.success("Email verified successfully!");
        } catch (err: unknown) {
            setStatus("error");
            setError(err instanceof Error ? err.message : "Verification failed");
        }
    };

    useEffect(() => {
        // Auto-verify if token is in URL and status is waiting
        if (token && status === "waiting") {
            handleVerify(token);
        }
    }, [token]);

    const handleResend = async () => {
        if (!email) {
            toast.error("Email not provided");
            return;
        }
        
        setIsResending(true);
        try {
            await resendVerification(email);
            toast.success("Verification email sent!");
        } catch (err) {
            toast.error("Failed to resend email");
        } finally {
            setIsResending(false);
        }
    };

    // If we have a token, show verification result
    if (token) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">
                        {status === "loading" && "Verifying..."}
                        {status === "success" && "Email Verified!"}
                        {status === "error" && "Verification Failed"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                    {status === "loading" && (
                        <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    )}
                    {status === "success" && (
                        <>
                            <CheckCircle2 className="h-16 w-16 text-green-500" />
                            <p className="text-center text-muted-foreground">
                                Your email has been verified. You can now log in to your account.
                            </p>
                        </>
                    )}
                    {status === "error" && (
                        <>
                            <XCircle className="h-16 w-16 text-red-500" />
                            <p className="text-center text-muted-foreground">
                                {error || "The verification link is invalid or has expired."}
                            </p>
                        </>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    {status === "success" && (
                        <Button onClick={() => router.push("/login")}>
                            Go to Login
                        </Button>
                    )}
                    {status === "error" && (
                        <Button variant="outline" onClick={() => router.push("/signup")}>
                            Try Again
                        </Button>
                    )}
                </CardFooter>
            </Card>
        );
    }

    // If no token, show "check your email" message
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
                <CardDescription>
                    We've sent a verification link to {email || "your email"}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-center text-muted-foreground">
                    Click the link in the email to verify your account.
                    If you don't see it, check your spam folder.
                </p>
                
                {/* Dev mode: show verify button if token is in URL */}
                {isDev && token && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg space-y-3">
                        <div className="flex items-center gap-2 text-yellow-800">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Development Mode</span>
                        </div>
                        <p className="text-xs text-yellow-700">
                            Email sending is disabled. Click below to verify:
                        </p>
                        <Button 
                            className="w-full"
                            onClick={() => handleVerify(token)}
                        >
                            Verify Email Now
                        </Button>
                    </div>
                )}
                
                {email && (
                    <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleResend}
                        disabled={isResending}
                    >
                        {isResending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            "Resend verification email"
                        )}
                    </Button>
                )}
            </CardContent>
            <CardFooter className="flex justify-center">
                <Link href="/login" className="text-sm text-primary hover:underline">
                    Back to login
                </Link>
            </CardFooter>
        </Card>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Suspense fallback={
                <Card className="w-full max-w-md">
                    <CardContent className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </CardContent>
                </Card>
            }>
                <VerifyEmailContent />
            </Suspense>
        </div>
    );
}
