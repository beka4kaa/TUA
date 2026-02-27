"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { CreditCard, Check, Loader2, Crown, Zap, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/contexts/auth-context";
import { billingApi, BillingInfo } from "@/lib/api";
import { DashboardShell, DashboardHeader } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PREMIUM_FEATURES = [
    "Unlimited booking sessions",
    "Priority support",
    "Access to exclusive content",
    "Early access to new features",
    "1-on-1 mentorship sessions",
    "Community access",
];

const FREE_FEATURES = [
    "1 booking per month",
    "Access to public content",
    "Email support",
];

export default function SubscriptionPage() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const [billing, setBilling] = useState<BillingInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [isManaging, setIsManaging] = useState(false);

    const fetchBilling = useCallback(async () => {
        try {
            const data = await billingApi.getMe();
            setBilling(data);
        } catch (err) {
            console.error("Failed to fetch billing:", err);
            toast.error("Failed to load subscription info");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBilling();
    }, [fetchBilling]);

    // Handle redirect params from Stripe
    useEffect(() => {
        const success = searchParams.get("success");
        const canceled = searchParams.get("canceled");

        if (success === "1") {
            toast.success("Payment successful! Your subscription is now active.", {
                description: "Thank you for subscribing to Premium!",
            });
            // Refetch billing info
            fetchBilling();
            // Clear URL params
            window.history.replaceState({}, "", "/subscription");
        } else if (canceled === "1") {
            toast.error("Payment canceled", {
                description: "Your subscription was not changed.",
            });
            window.history.replaceState({}, "", "/subscription");
        }
    }, [searchParams, fetchBilling]);

    const handleUpgrade = async () => {
        setIsUpgrading(true);
        try {
            const { url } = await billingApi.createCheckoutSession();
            window.location.href = url;
        } catch (err) {
            console.error("Failed to create checkout session:", err);
            toast.error("Failed to start checkout. Please try again.");
            setIsUpgrading(false);
        }
    };

    const handleManageSubscription = async () => {
        setIsManaging(true);
        try {
            const { url } = await billingApi.createPortalSession();
            window.location.href = url;
        } catch (err) {
            console.error("Failed to create portal session:", err);
            toast.error("Failed to open subscription management. Please try again.");
            setIsManaging(false);
        }
    };

    const getStatusBadge = () => {
        if (!billing) return null;

        const status = billing.subscriptionStatus;

        if (status === "active") {
            return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
        } else if (status === "past_due") {
            return <Badge variant="destructive">Past Due</Badge>;
        } else if (status === "canceled") {
            return <Badge variant="secondary">Canceled</Badge>;
        } else if (status === "trialing") {
            return <Badge className="bg-[#2F3B69] hover:bg-[#262F54]">Trial</Badge>;
        }
        return null;
    };

    if (isLoading) {
        return (
            <DashboardShell>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </DashboardShell>
        );
    }

    const isPremium = billing?.isPremium ?? false;
    const isActive = billing?.isActive ?? false;

    return (
        <DashboardShell>
            <DashboardHeader
                title="Subscription"
                description="Manage your subscription and billing"
            />

            {/* Current Plan Status */}
            {isPremium && billing && (
                <Card className="mb-8 border-[#8B3B3B]/30 bg-gradient-to-r from-[#8B3B3B]/5 to-transparent">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-[#8B3B3B]/10 flex items-center justify-center">
                                    <Crown className="h-5 w-5 text-[#8B3B3B]" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Premium Plan</CardTitle>
                                    <CardDescription>
                                        You have access to all premium features
                                    </CardDescription>
                                </div>
                            </div>
                            {getStatusBadge()}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            {billing.currentPeriodEnd && (
                                <p className="text-muted-foreground">
                                    {billing.cancelAtPeriodEnd ? (
                                        <>
                                            <AlertCircle className="inline h-4 w-4 mr-1 text-[#8B3B3B]" />
                                            Your subscription ends on{" "}
                                            <span className="font-medium text-foreground">
                                                {format(new Date(billing.currentPeriodEnd), "MMMM d, yyyy")}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            Next billing date:{" "}
                                            <span className="font-medium text-foreground">
                                                {format(new Date(billing.currentPeriodEnd), "MMMM d, yyyy")}
                                            </span>
                                        </>
                                    )}
                                </p>
                            )}
                            {billing.subscriptionStatus === "past_due" && (
                                <p className="text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    Your payment is past due. Please update your payment method.
                                </p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="outline"
                            onClick={handleManageSubscription}
                            disabled={isManaging}
                        >
                            {isManaging ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Manage Subscription
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Plans Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Free Plan */}
                <Card className={cn(
                    "relative",
                    !isPremium && "border-primary ring-1 ring-primary"
                )}>
                    {!isPremium && (
                        <div className="absolute -top-3 left-4">
                            <Badge className="bg-primary">Current Plan</Badge>
                        </div>
                    )}
                    <CardHeader className="pt-8">
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-muted-foreground" />
                            Free
                        </CardTitle>
                        <CardDescription>
                            Get started with basic features
                        </CardDescription>
                        <div className="mt-4">
                            <span className="text-4xl font-bold">$0</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {FREE_FEATURES.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm">
                                    <Check className="h-4 w-4 text-muted-foreground" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" disabled>
                            {!isPremium ? "Current Plan" : "Downgrade"}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Premium Plan */}
                <Card className={cn(
                    "relative border-[#8B3B3B]/50",
                    isPremium && "ring-1 ring-[#8B3B3B]"
                )}>
                    {isPremium && (
                        <div className="absolute -top-3 left-4">
                            <Badge className="bg-[#8B3B3B]">Current Plan</Badge>
                        </div>
                    )}
                    <div className="absolute -top-3 right-4">
                        <Badge variant="secondary">Most Popular</Badge>
                    </div>
                    <CardHeader className="pt-8">
                        <CardTitle className="flex items-center gap-2">
                            <Crown className="h-5 w-5 text-[#8B3B3B]" />
                            Premium
                        </CardTitle>
                        <CardDescription>
                            Unlock all features and priority support
                        </CardDescription>
                        <div className="mt-4">
                            <span className="text-4xl font-bold">$25</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {PREMIUM_FEATURES.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm">
                                    <Check className="h-4 w-4 text-[#8B3B3B]" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        {isPremium ? (
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleManageSubscription}
                                disabled={isManaging}
                            >
                                {isManaging ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    "Manage Subscription"
                                )}
                            </Button>
                        ) : (
                            <Button
                                className="w-full bg-[#8B3B3B] hover:bg-[#8B3B3B]/90"
                                onClick={handleUpgrade}
                                disabled={isUpgrading}
                            >
                                {isUpgrading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Redirecting to checkout...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Upgrade to Premium
                                    </>
                                )}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>

            {/* FAQ Section */}
            <div className="mt-12">
                <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Can I cancel anytime?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Yes! You can cancel your subscription at any time. You&apos;ll continue to have access until the end of your billing period.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">What payment methods do you accept?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment provider Stripe.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Is there a free trial?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                We offer a Free plan that lets you try our basic features. Upgrade to Premium when you&apos;re ready for more.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">How do I get support?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Premium members get priority support. You can reach us anytime through our contact form or during consultation sessions.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardShell>
    );
}
