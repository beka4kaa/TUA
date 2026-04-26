"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { useAuth } from "@/contexts/auth-context";
import { ApiClientError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function SignupForm() {
    const router = useRouter();
    const { signUp } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setIsLoading(true);

        try {
            const result = await signUp({ email, password, firstName, lastName });
            toast.success("Account created! Please verify your email.");
            
            // В dev режиме показываем ссылку для верификации
            if (result.verificationUrl) {
                const token = new URL(result.verificationUrl).searchParams.get('token');
                router.push("/verify-email?email=" + encodeURIComponent(email) + "&token=" + token);
            } else {
                router.push("/verify-email?email=" + encodeURIComponent(email));
            }
        } catch (err) {
            if (err instanceof ApiClientError) {
                // Показываем понятные ошибки для каждого поля
                if (err.details) {
                    const messages: string[] = [];
                    if (err.details.email) {
                        messages.push(`Email: ${err.details.email[0]}`);
                    }
                    if (err.details.password) {
                        messages.push(`Password: ${err.details.password[0]}`);
                    }
                    if (err.details.first_name) {
                        messages.push(`First name: ${err.details.first_name[0]}`);
                    }
                    if (err.details.last_name) {
                        messages.push(`Last name: ${err.details.last_name[0]}`);
                    }
                    if (messages.length > 0) {
                        toast.error(messages.join('\n'));
                    } else {
                        toast.error(err.message);
                    }
                } else {
                    toast.error(err.message);
                }
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
<Card className="w-full max-w-lg">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                <CardDescription className="text-center">
                    Join TUA and start your journey
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Signup Form */}
                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                type="text"
                                placeholder="John"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                type="text"
                                placeholder="Doe"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
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
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <p className="text-xs text-center text-muted-foreground">
                    By creating an account, you agree to our{" "}
                    <Link href="/terms" className="underline">Terms of Service</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="underline">Privacy Policy</Link>
                </p>
                <div className="text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                        Sign in
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
