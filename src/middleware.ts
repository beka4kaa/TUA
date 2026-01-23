import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Admin routes protection
        if (path.startsWith("/admin")) {
            if (token?.role !== "ADMIN") {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
        }

        // Booking routes - require MEMBER or ADMIN role or active subscription
        if (path.startsWith("/bookings/new")) {
            if (token?.role === "USER") {
                return NextResponse.redirect(new URL("/pricing", req.url));
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const path = req.nextUrl.pathname;

                // Public routes (including blog)
                const publicRoutes = [
                    "/",
                    "/login",
                    "/signup",
                    "/verify-email",
                    "/pricing",
                    "/about",
                    "/contact",
                    "/privacy",
                    "/terms",
                    "/thank-you",
                ];

                // Check exact public routes
                if (publicRoutes.some((route) => path === route)) {
                    return true;
                }

                // Blog routes are public
                if (path.startsWith("/blog")) {
                    return true;
                }

                // API routes that don't require auth
                if (path.startsWith("/api/auth")) {
                    return true;
                }

                // Public API routes for blog
                if (path.startsWith("/api/blog") && req.method === "GET") {
                    return true;
                }

                // All other routes require authentication
                return !!token;
            },
        },
    }
);

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (auth endpoints)
         * - api/blog (public blog endpoints)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         * - public pages (login, signup, blog, etc.)
         */
        "/((?!api/auth|api/blog|_next/static|_next/image|favicon.ico|.*\\..*|public|login|signup|verify-email|pricing|about|blog|contact|privacy|terms|thank-you).*)",
    ],
};
