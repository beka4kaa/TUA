import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare, hash } from "bcryptjs";
import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/types";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role: Role;
        };
    }

    interface User {
        role: Role;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: Role;
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        verifyRequest: "/verify-email",
        error: "/login",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials): Promise<User | null> {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    throw new Error("Invalid credentials");
                }

                const isValid = await compare(credentials.password, user.password);

                if (!isValid) {
                    throw new Error("Invalid credentials");
                }

                if (!user.emailVerified) {
                    throw new Error("Please verify your email first");
                }

                // Update last login
                await prisma.user.update({
                    where: { id: user.id },
                    data: { lastLoginAt: new Date() },
                });

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }

            // Handle session updates
            if (trigger === "update" && session) {
                token.name = session.name;
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
        async signIn({ user, account }) {
            // Update last login for OAuth users
            if (account?.provider === "google" && user.id) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { lastLoginAt: new Date() },
                });
            }
            return true;
        },
    },
    events: {
        async createUser({ user }) {
            // Create default free subscription for new users
            if (user.id) {
                await prisma.subscription.create({
                    data: {
                        userId: user.id,
                        tier: "FREE",
                        status: "ACTIVE",
                    },
                });
            }
        },
    },
};

export async function hashPassword(password: string): Promise<string> {
    return hash(password, 12);
}

export async function verifyPassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return compare(password, hashedPassword);
}
