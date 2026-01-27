# YMIT Academy - Django + Next.js Setup Guide

This document describes the updated authentication system that uses Django REST Framework with JWT tokens instead of NextAuth.

## Architecture Overview

```
┌─────────────────────┐     ┌─────────────────────┐
│   Next.js 14+       │────▶│   Django Backend    │
│   (Frontend)        │     │   (REST API)        │
│                     │     │                     │
│ - React Components  │     │ - DRF + SimpleJWT   │
│ - Auth Context      │     │ - PostgreSQL        │
│ - API Client        │     │ - User Management   │
└─────────────────────┘     └─────────────────────┘
```

## Quick Start

### 1. Backend Setup (Django)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/ymitacademy" > .env
echo "SECRET_KEY=your-secret-key-here" >> .env
echo "DEBUG=True" >> .env
echo "FRONTEND_URL=http://localhost:3000" >> .env

# Run migrations
python manage.py migrate

# Seed database with test users
python manage.py seed

# Start server
python manage.py runserver
```

### 2. Frontend Setup (Next.js)

```bash
# From project root

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

# Install dependencies
npm install

# Start dev server
npm run dev
```

## Test Accounts

After running `python manage.py seed`, the following accounts are available:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ymit.kz | Admin123! |
| Member | member@ymit.kz | Test123! |
| Student | student@ymit.kz | Test123! |
| Unverified | new@ymit.kz | Test123! |

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup/` | Register new user |
| POST | `/api/auth/login/` | Login (returns JWT) |
| POST | `/api/auth/logout/` | Logout (blacklist token) |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| POST | `/api/auth/verify-email/` | Verify email with token |
| POST | `/api/auth/resend-verification/` | Resend verification email |
| POST | `/api/auth/forgot-password/` | Request password reset |
| POST | `/api/auth/reset-password/` | Reset password with token |
| GET | `/api/auth/me/` | Get current user |
| PATCH | `/api/auth/me/` | Update current user profile |

### Users (Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/` | List all users |
| GET | `/api/users/{id}/` | Get user by ID |
| DELETE | `/api/users/{id}/` | Delete user |
| PATCH | `/api/users/{id}/role/` | Update user role |
| PATCH | `/api/users/{id}/status/` | Update user status |

### Blog (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blog/` | List published posts |
| GET | `/api/blog/{slug}/` | Get post by slug |
| GET | `/api/blog/tags/` | List all tags |

## Authentication Flow

### Sign Up

1. User submits email + password
2. Backend creates user with `status=NEW`, generates verification token
3. Token is printed to console (dev mode) or sent via email (production)
4. User clicks verification link
5. Backend verifies token, sets `status=ACTIVE`, `email_verified=now()`

### Login

1. User submits email + password
2. Backend validates credentials
3. Backend checks if email is verified and user is not suspended
4. Returns JWT access + refresh tokens with user info

### Token Refresh

1. Access tokens expire after 1 hour
2. Frontend automatically refreshes using refresh token (7 days)
3. Refresh tokens are rotated and blacklisted after use

## Frontend Usage

### Using Auth Context

```tsx
import { useAuth } from "@/contexts/auth-context";

function MyComponent() {
    const { user, isAuthenticated, login, logout } = useAuth();
    
    if (!isAuthenticated) {
        return <LoginForm />;
    }
    
    return <div>Welcome, {user.displayName}!</div>;
}
```

### Making API Calls

```tsx
import { api } from "@/lib/api";

// Get blog posts
const posts = await api.blog.listPosts({ page: 1 });

// Admin: list users
const users = await api.users.list({ search: "john" });
```

### Protected Routes

```tsx
import { useRequireAuth, useRequireRole } from "@/contexts/auth-context";

// Require login
function DashboardPage() {
    const auth = useRequireAuth("/login");
    if (auth.isLoading) return <Loading />;
    return <Dashboard />;
}

// Require admin role
function AdminPage() {
    const auth = useRequireRole(["ADMIN"], "/dashboard");
    if (auth.isLoading) return <Loading />;
    return <AdminPanel />;
}
```

## User Roles & Status

### Roles
- `USER` - Regular student
- `MEMBER` - Premium member
- `ADMIN` - Administrator

### Status
- `NEW` - Just registered, email not verified
- `ACTIVE` - Email verified, can login
- `SUSPENDED` - Account suspended, cannot login

## Development Notes

### Email Verification (Dev Mode)

In development (`DEBUG=True`), verification and reset tokens are printed to the Django console instead of sent via email. Look for output like:

```
==================================================
EMAIL VERIFICATION (DEV MODE)
Email: user@example.com
Token: abc123...
URL: http://localhost:3000/auth/verify?token=abc123...
==================================================
```

### CORS

The backend allows requests from `localhost:3000` by default. For production, update `CORS_ALLOWED_ORIGINS` in `settings.py`.

## Migration Notes

### From NextAuth/Prisma

- NextAuth session provider replaced with custom `AuthProvider`
- Prisma calls replaced with Django API calls
- `signIn()` replaced with `login()` from auth context
- Google OAuth temporarily disabled

### Database

- Old Prisma schema still exists but is not used
- Django uses its own migrations in each app's `migrations/` folder
- Run `python manage.py makemigrations` after model changes
