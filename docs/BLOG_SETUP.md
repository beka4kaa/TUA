# Blog System Setup Guide

This guide explains how to set up the blog/news system for Ymit Academy.

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Environment variables configured

## 1. Install Dependencies

```bash
npm install react-markdown remark-gfm
```

## 2. Apply Database Migration

After the Prisma schema has been updated, run:

```bash
# Generate Prisma client with new types
npx prisma generate

# Create a new migration
npx prisma migrate dev --name add_blog_models

# Or if you want to push without migration (dev only)
npx prisma db push
```

## 3. Seed Blog Data (Optional)

To populate the blog with sample posts:

```bash
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-blog.ts
```

Or add to `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed-blog.ts"
  }
}
```

Then run:

```bash
npx prisma db seed
```

## Database Schema

### New Models Added

```prisma
enum PostStatus {
  DRAFT
  PUBLISHED
}

model Post {
  id                 String     @id @default(cuid())
  title              String
  slug               String     @unique
  excerpt            String?    @db.Text
  content            String     @db.Text
  status             PostStatus @default(DRAFT)
  publishedAt        DateTime?
  readingTimeMinutes Int        @default(5)
  coverImageUrl      String?
  authorId           String
  author             User       @relation(...)
  tags               PostTag[]
  comments           Comment[]
  likes              Like[]
  views              PostView[]
}

model Tag {
  id        String    @id @default(cuid())
  name      String    @unique
  slug      String    @unique
  posts     PostTag[]
}

model PostTag {
  id     String @id @default(cuid())
  postId String
  tagId  String
  // Unique constraint on postId + tagId
}

model PostView {
  id        String   @id @default(cuid())
  postId    String
  ipHash    String?
  userId    String?
  createdAt DateTime @default(now())
}
```

## Routes Overview

### Public Routes

| Route | Description |
|-------|-------------|
| `/blog` | Blog list with tag filtering and pagination |
| `/blog/[slug]` | Individual article page |

### Admin Routes

| Route | Description |
|-------|-------------|
| `/admin/blog` | Blog management dashboard |
| `/admin/blog/new` | Create new post |
| `/admin/blog/[id]` | Edit existing post |

### API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/blog` | GET | Get published posts (public) |
| `/api/blog/tags` | GET | Get all tags with counts |
| `/api/blog/[slug]` | GET | Get single published post |
| `/api/admin/posts` | GET | Get all posts (admin) |
| `/api/admin/posts` | POST | Create new post |
| `/api/admin/posts/[id]` | GET | Get single post (admin) |
| `/api/admin/posts/[id]` | PUT | Update post |
| `/api/admin/posts/[id]` | DELETE | Delete post |

## Features

### Public Blog
- ✅ Responsive grid layout
- ✅ Featured post highlight
- ✅ Tag filtering (URL-based state)
- ✅ Pagination
- ✅ SEO-optimized with generateMetadata
- ✅ Markdown content rendering
- ✅ Related posts
- ✅ Animated scroll effects (Framer Motion)

### Admin Dashboard
- ✅ Post list with status filter (All/Published/Draft)
- ✅ Quick actions (Publish/Unpublish/Delete)
- ✅ Create/Edit post with Markdown editor
- ✅ Live preview mode
- ✅ Tag management (create new or select existing)
- ✅ Cover image URL support
- ✅ Auto-generated slugs

## Styling

The blog follows the Rivo Agency design system:

- **Brand Blue:** `#28547C`
- **Brand Orange:** `#E67E22`
- **Typography:** Gilroy (display), DM Sans (body)

## Markdown Support

Posts support full Markdown with GFM extensions:

- Headers (`# H1`, `## H2`, etc.)
- Bold/Italic (`**bold**`, `*italic*`)
- Links (`[text](url)`)
- Images (`![alt](url)`)
- Code blocks (fenced with \`\`\`)
- Tables
- Lists (ordered and unordered)
- Blockquotes

## Environment Variables

Ensure these are set:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
```

## Troubleshooting

### "Cannot find module" errors
Run `npx prisma generate` to regenerate the Prisma client.

### Database relation errors
Ensure you've run the migration with `npx prisma migrate dev`.

### Type errors with Post model
Make sure TypeScript picks up the new Prisma types by restarting your IDE.
