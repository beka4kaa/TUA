import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { signUpSchema } from "@/lib/validations";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = signUpSchema.parse(body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(validatedData.password);

        // Create user
        const user = await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
            },
        });

        // Create verification token
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await prisma.verificationToken.create({
            data: {
                identifier: validatedData.email,
                token,
                expires,
            },
        });

        // Create default subscription
        await prisma.subscription.create({
            data: {
                userId: user.id,
                tier: "FREE",
                status: "ACTIVE",
            },
        });

        // TODO: Send verification email
        // In production, use a service like Resend, SendGrid, or AWS SES
        console.log(`Verification token for ${validatedData.email}: ${token}`);

        return NextResponse.json(
            {
                success: true,
                message: "Account created. Please check your email to verify your account.",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);

        if (error instanceof Error && error.name === "ZodError") {
            return NextResponse.json(
                { error: "Validation failed", details: error },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create account" },
            { status: 500 }
        );
    }
}
