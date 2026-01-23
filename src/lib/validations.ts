import { z } from "zod";

// ============================================
// Auth Validations
// ============================================

export const signUpSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain uppercase, lowercase, and number"
        ),
});

export const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain uppercase, lowercase, and number"
        ),
});

// ============================================
// Post Validations
// ============================================

export const createPostSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(200, "Title must be less than 200 characters"),
    content: z
        .string()
        .min(10, "Content must be at least 10 characters")
        .max(10000, "Content must be less than 10000 characters"),
    published: z.boolean().default(true),
});

export const updatePostSchema = createPostSchema.partial();

// ============================================
// Comment Validations
// ============================================

export const createCommentSchema = z.object({
    postId: z.string().cuid("Invalid post ID"),
    content: z
        .string()
        .min(1, "Comment cannot be empty")
        .max(2000, "Comment must be less than 2000 characters"),
});

// ============================================
// Booking Validations
// ============================================

export const createBookingSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(200, "Title must be less than 200 characters"),
    description: z
        .string()
        .max(2000, "Description must be less than 2000 characters")
        .optional(),
    scheduledAt: z.string().datetime("Invalid date format"),
    duration: z.number().min(15).max(180).default(60),
});

export const updateBookingSchema = z.object({
    status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]).optional(),
    notes: z.string().max(2000, "Notes must be less than 2000 characters").optional(),
    scheduledAt: z.string().datetime("Invalid date format").optional(),
});

// ============================================
// User Validations
// ============================================

export const updateUserRoleSchema = z.object({
    role: z.enum(["USER", "MEMBER", "ADMIN"]),
});

export const updateProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    image: z.string().url("Invalid image URL").optional(),
});

// ============================================
// Type Exports
// ============================================

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
