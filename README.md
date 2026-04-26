<p align="center">
  <strong>TUA – Top Universities Advisor</strong><br/>
  <a href="https://www.topuniversitiesadvisors.com">www.topuniversitiesadvisors.com</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Django-5-092E20?logo=django" alt="Django 5" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Tailwind CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql" alt="PostgreSQL" />
</p>

---

# TUA – Top Universities Advisor

> Expert admissions consulting platform for undergraduate programs at elite institutions worldwide.

**TUA** helps students navigate the complex university admissions process with personalized consulting, essay reviews, scholarship guidance, and interview preparation. The platform combines a modern, animated marketing website with a full-featured authenticated dashboard for students, consultants, and administrators.

🌐 **Live:** [www.topuniversitiesadvisors.com](https://www.topuniversitiesadvisors.com)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [License](#license)

---

## Features

### Public Website
- **Animated landing page** with Framer Motion scroll-triggered animations, parallax decorations, and glassmorphism navigation
- **Bilingual support** (English / Russian) with dynamic language switching
- **Dark mode** via `next-themes` with smooth transitions
- **Blog** powered by the Django backend with server-side rendering, tag filtering, and related posts
- **Contact form** with Zod validation and thank-you redirect
- **SEO-optimized** metadata, Open Graph, and Twitter cards
- **AI chatbot widget** for instant admissions Q&A

### Authenticated Dashboard
- **JWT authentication** (signup → email verification → login) with automatic token refresh
- **Student dashboard** with booking management, news feed, and subscription status
- **Admin panel** for user management, blog CRUD, and booking approvals
- **Stripe integration** for subscription billing (Free → Standard → Premium tiers)
- **Consultation booking** system with date/time slot availability

### Backend API
- RESTful API built with **Django REST Framework**
- **Simple JWT** for stateless authentication with token blacklisting
- Custom user model with roles (USER, MEMBER, ADMIN)
- Blog with posts, tags, slugs, and reading time calculation
- Booking system with status workflow (PENDING → CONFIRMED → COMPLETED)
- Subscription management via Stripe webhooks
- Email verification and password reset flows

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 16 | React framework (App Router, RSC) |
| [React](https://react.dev) | 19 | UI library |
| [TypeScript](https://typescriptlang.org) | 5 | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com) | latest | Radix-based component library |
| [Framer Motion](https://motion.dev) | 12 | Animations and transitions |
| [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) | 7 / 4 | Form handling and validation |
| [Lucide React](https://lucide.dev) | latest | Icon library |
| [next-themes](https://github.com/pacocoursey/next-themes) | 0.4 | Dark mode support |
| [Sonner](https://sonner.emilkowal.dev) | 2 | Toast notifications |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| [Django](https://djangoproject.com) | 5+ | Web framework |
| [Django REST Framework](https://django-rest-framework.org) | 3.14+ | REST API |
| [Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io) | 5.3+ | JWT authentication |
| [PostgreSQL](https://postgresql.org) | 15+ | Production database |
| [Stripe](https://stripe.com/docs/api) | 7+ | Payment processing |
| [Gunicorn](https://gunicorn.org) | 21+ | WSGI HTTP server |
| [WhiteNoise](http://whitenoise.evans.io) | 6+ | Static file serving |

### Infrastructure

| Service | Purpose |
|---|---|
| [Railway](https://railway.app) | Backend + DB hosting |
| [Vercel](https://vercel.com) | Frontend hosting (alternative) |

---

## Project Structure

```
TUA/
├── src/                          # Next.js frontend source
│   ├── app/                      # App Router pages and layouts
│   │   ├── (auth)/               # Auth pages (login, signup)
│   │   ├── (dashboard)/          # Authenticated dashboard pages
│   │   ├── admin/                # Admin panel
│   │   ├── blog/                 # Public blog
│   │   ├── contact/              # Contact form page
│   │   ├── privacy/              # Privacy policy
│   │   ├── terms/                # Terms of service
│   │   ├── globals.css           # Global styles + design tokens
│   │   ├── layout.tsx            # Root layout (fonts, metadata, providers)
│   │   └── page.tsx              # Landing page
│   ├── components/               # React components
│   │   ├── admin/                # Admin panel components
│   │   ├── auth/                 # Auth forms
│   │   ├── brand/                # Logo components
│   │   ├── home/                 # Landing page sections
│   │   ├── layout/               # Layout elements
│   │   ├── navigation/           # Navigation components
│   │   ├── motion/               # Animation wrappers
│   │   ├── decorations/          # Decorative backgrounds
│   │   └── ui/                   # shadcn/ui primitives
│   ├── contexts/                 # React contexts
│   │   ├── auth-context.tsx      # Authentication state management
│   │   └── language-context.tsx  # i18n translations (EN/RU)
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utility libraries
│   │   ├── api.ts                # Type-safe Django API client
│   │   ├── blog.ts               # Blog data fetching utilities
│   │   ├── media.ts              # Centralized media asset registry
│   │   └── utils.ts              # General utilities (cn, etc.)
│   ├── constants/                # Static data and config
│   ├── types/                    # TypeScript type definitions
│   └── middleware.ts             # Route protection middleware
├── backend/                      # Django REST API
│   ├── apps/
│   │   ├── users/                # User model, auth views, management commands
│   │   ├── blog/                 # Blog posts, tags, CRUD
│   │   ├── bookings/             # Consultation booking system
│   │   └── subscriptions/        # Stripe subscription management
│   ├── config/                   # Django project settings and URL routing
│   ├── core/                     # Shared utilities (email, pagination, permissions)
│   ├── manage.py
│   ├── requirements.txt
│   └── Procfile                  # Railway deployment config
├── public/                       # Static assets (SVGs, brand files)
├── .env.example                  # Environment variable template
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Node.js dependencies
└── railway.json                  # Railway deployment config (frontend)
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.10
- **PostgreSQL** ≥ 15 (or use SQLite for local development)

### 1. Clone the Repository

```bash
git clone https://github.com/beka4kaa/TUA.git
cd TUA
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your configuration
# At minimum, set NEXT_PUBLIC_API_URL to your Django backend URL

# Start the development server
npm run dev
```

The frontend will run at **http://localhost:3000**.

### 3. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate      # macOS/Linux
# venv\Scripts\activate       # Windows

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment variables
# Set SECRET_KEY, DATABASE_URL, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD, etc.

# Run migrations
python manage.py migrate

# (Optional) Seed sample data
python manage.py seed

# Start the development server
python manage.py runserver
```

The backend will run at **http://localhost:8000**.

---

## Environment Variables

### Frontend (`.env.local`)

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Django API base URL | `http://localhost:8000/api` |
| `NEXT_PUBLIC_APP_URL` | Next.js app URL | `http://localhost:3000` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | – |

### Backend

| Variable | Description | Default |
|---|---|---|
| `SECRET_KEY` | Django secret key | (insecure dev default) |
| `DEBUG` | Debug mode | `True` |
| `DATABASE_URL` | PostgreSQL connection string | SQLite fallback |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts | `localhost,127.0.0.1` |
| `FRONTEND_URL` | Frontend URL (for email links) | `http://localhost:3000` |
| `EMAIL_HOST_USER` | SMTP email username | – |
| `EMAIL_HOST_PASSWORD` | SMTP email password | – |
| `STRIPE_SECRET_KEY` | Stripe secret key | – |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | – |

---

## Available Scripts

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |

### Backend

| Command | Description |
|---|---|
| `python manage.py runserver` | Start Django development server |
| `python manage.py migrate` | Apply database migrations |
| `python manage.py seed` | Populate database with sample data |
| `python manage.py createsuperuser` | Create an admin user |

---

## API Endpoints

### Authentication (`/api/auth/`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup/` | Register new user |
| POST | `/auth/login/` | Login (returns JWT tokens) |
| POST | `/auth/logout/` | Logout (blacklist refresh token) |
| POST | `/auth/verify-email/` | Verify email with token |
| POST | `/auth/resend-verification/` | Resend verification email |
| POST | `/auth/forgot-password/` | Send password reset email |
| POST | `/auth/reset-password/` | Reset password with token |
| GET | `/auth/me/` | Get current user profile |
| PATCH | `/auth/me/` | Update current user profile |
| POST | `/auth/token/refresh/` | Refresh access token |

### Users (`/api/users/`) – Admin Only

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users/` | List all users (paginated) |
| GET | `/users/:id/` | Get user details |
| DELETE | `/users/:id/` | Delete user |
| PATCH | `/users/:id/role/` | Update user role |
| PATCH | `/users/:id/status/` | Update user status |

### Blog (`/api/blog/`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/blog/` | List published posts |
| GET | `/blog/:slug/` | Get post by slug |
| GET | `/blog/tags/` | List all tags |
| POST | `/posts/` | Create post (admin) |
| PATCH | `/posts/:slug/` | Update post (admin) |
| DELETE | `/posts/:slug/` | Delete post (admin) |

### Bookings (`/api/bookings/`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/bookings/` | Create booking |
| GET | `/bookings/` | List user's bookings |
| GET | `/bookings/slots/` | Get booked time slots |
| PATCH | `/bookings/:id/` | Update booking status |

### Billing (`/api/billing/`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/billing/me/` | Get billing info |
| POST | `/billing/create-checkout-session/` | Create Stripe checkout |
| POST | `/billing/create-portal-session/` | Create Stripe portal |

---

## Deployment

### Frontend (Railway / Vercel)

The frontend is configured for **standalone output** via `next.config.ts`:

```bash
# Build and deploy
npm run build
npm run start
```

Railway configuration is provided in `railway.json`.

### Backend (Railway)

The backend uses **Gunicorn** with automatic migrations on deploy:

```
# Procfile
web: gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
release: python manage.py migrate --noinput
```

Railway configuration is provided in `backend/railway.json`.

---

## License

This project is proprietary. All rights reserved.

© 2026 TUA – Top Universities Advisor. [www.topuniversitiesadvisors.com](https://www.topuniversitiesadvisors.com)
