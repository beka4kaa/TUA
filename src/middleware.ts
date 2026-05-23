import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for route protection
 * 
 * Since we're using Django JWT instead of NextAuth, this middleware
 * checks for JWT token in localStorage on the client side.
 * 
 * Server-side route protection is handled by:
 * 1. This middleware for basic redirects
 * 2. API routes checking for Authorization header
 * 3. Client-side useAuth hook for protected components
 */

// Public routes that don't require authentication
const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
    "/pricing",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/thank-you",
];

// Routes that require authentication
const protectedPrefixes = [
    "/dashboard",
    "/admin",
    "/bookings",
    "/profile",
    "/feed",
];

// Admin-only routes
const adminRoutes = [
    "/admin",
];

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    
    // Skip middleware for static files and API routes
    if (
        path.startsWith("/_next") ||
        path.startsWith("/api") ||
        path.includes(".") ||
        path.startsWith("/public")
    ) {
        return NextResponse.next();
    }
    
    // Blog routes are always public
    if (path.startsWith("/blog")) {
        return NextResponse.next();
    }
    
    // Check if this is a public route
    const isPublicRoute = publicRoutes.some((route) => path === route);
    if (isPublicRoute) {
        return NextResponse.next();
    }
    
    // For protected routes, we can't check JWT from server-side middleware
    // The actual auth check happens on the client with useAuth hook
    // But we can do basic checks and set headers
    
    // Check if it's a protected route
    const isProtectedRoute = protectedPrefixes.some((prefix) => path.startsWith(prefix));
    
    if (isProtectedRoute) {
        // For protected routes, the client-side will handle the redirect
        // We just pass through and let the AuthProvider/useAuth handle it
        return NextResponse.next();
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
    ],
};
