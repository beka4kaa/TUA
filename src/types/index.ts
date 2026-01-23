// Define types locally to avoid Prisma client import issues
export type Role = "USER" | "MEMBER" | "ADMIN";
export type SubscriptionTier = "FREE" | "BASIC" | "STANDARD" | "PREMIUM";
export type SubscriptionStatus = "ACTIVE" | "CANCELLED" | "EXPIRED" | "PENDING";
export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

// ============================================
// User Types
// ============================================

export interface UserBasic {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: Role;
}

export interface UserWithSubscription extends UserBasic {
    lastLoginAt: Date | null;
    createdAt: Date;
    subscription: {
        tier: SubscriptionTier;
        status: SubscriptionStatus;
    } | null;
}

export interface UserSession {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: Role;
}

// ============================================
// Post Types
// ============================================

export interface PostAuthor {
    id: string;
    name: string | null;
    image: string | null;
}

export interface PostComment {
    id: string;
    content: string;
    createdAt: Date;
    author: PostAuthor;
}

export interface PostLike {
    userId: string;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
    author: PostAuthor;
    _count: {
        likes: number;
        comments: number;
    };
}

export interface PostWithDetails extends Post {
    likes: PostLike[];
    comments: PostComment[];
}

// ============================================
// Booking Types
// ============================================

export interface Booking {
    id: string;
    title: string;
    description: string | null;
    scheduledAt: Date;
    duration: number;
    status: BookingStatus;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    user: UserBasic;
}

export interface BookingWithUser extends Booking {
    user: UserBasic;
}

// ============================================
// Subscription Types
// ============================================

export interface SubscriptionPlan {
    tier: SubscriptionTier;
    name: string;
    price: number;
    features: string[];
    popular?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
        tier: "FREE",
        name: "Free",
        price: 0,
        features: [
            "Access to news feed",
            "View posts and comments",
            "Basic profile",
        ],
    },
    {
        tier: "BASIC",
        name: "Basic",
        price: 3,
        features: [
            "Everything in Free",
            "Book 1 consultation/month",
            "Email support",
        ],
        popular: true,
    },
    {
        tier: "STANDARD",
        name: "Standard",
        price: 10,
        features: [
            "Everything in Basic",
            "Book 3 consultations/month",
            "Priority support",
            "University matching",
        ],
    },
    {
        tier: "PREMIUM",
        name: "Premium",
        price: 25,
        features: [
            "Everything in Standard",
            "Unlimited consultations",
            "1-on-1 mentorship",
            "Essay review",
            "Application tracking",
        ],
    },
];

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ============================================
// Dashboard Stats Types
// ============================================

export interface DashboardStats {
    totalUsers: number;
    totalMembers: number;
    totalBookings: number;
    totalPosts: number;
    recentSignups: number;
    upcomingConsultations: number;
}
