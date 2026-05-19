import Link from "next/link";
import { MessageCircle, Sparkles, Users, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const WHATSAPP_NUMBER = "77760071040";
const WHATSAPP_MESSAGE = encodeURIComponent("Hello! I'm interested in Stockermans's Human Intelligence services.");

export function SignupForm() {
    return (
        <Card className="w-full max-w-lg">
            <CardHeader className="space-y-1 pb-2">
                <div className="flex items-center justify-center mb-2">
                    <div className="rounded-full bg-primary/10 p-3">
                        <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center">Welcome to Stockermans</CardTitle>
                <CardDescription className="text-center text-sm leading-relaxed">
                    Connecting you with real human expertise and intelligence.
                    Get in touch to learn how we can help you.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 pt-4">
                {/* Feature highlights */}
                <div className="space-y-3">
                    <div className="flex items-start gap-3 rounded-lg border p-3">
                        <Users className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-medium">Human Intelligence</p>
                            <p className="text-xs text-muted-foreground">Real experts providing genuine insights and tailored analysis.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg border p-3">
                        <Zap className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-medium">Fast & Reliable</p>
                            <p className="text-xs text-muted-foreground">Quick turnaround times with high-quality, accurate results.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg border p-3">
                        <MessageCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-medium">Direct Communication</p>
                            <p className="text-xs text-muted-foreground">Reach us instantly via WhatsApp for a personalised experience.</p>
                        </div>
                    </div>
                </div>

                {/* WhatsApp CTA */}
                <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                >
                    <Button
                        className="w-full gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold"
                        size="lg"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5 shrink-0"
                            aria-hidden="true"
                        >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Contact us via WhatsApp for Human Intelligence
                    </Button>
                </a>
            </CardContent>

            <CardFooter className="flex flex-col space-y-2 pt-0">
                <p className="text-xs text-center text-muted-foreground">
                    By contacting us, you agree to our{" "}
                    <Link href="/terms" className="underline hover:text-foreground transition-colors">Terms of Service</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</Link>
                </p>
            </CardFooter>
        </Card>
    );
}
