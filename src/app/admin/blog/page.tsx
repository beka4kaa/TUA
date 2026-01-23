import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminBlogClient } from "./admin-blog-client";

export const metadata = {
  title: "Manage Blog | Admin | Ymit Academy",
};

async function BlogPostsData() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  
  const posts = await prisma.post.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  
  return <AdminBlogClient posts={posts} />;
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-gray-100 rounded w-48" />
      <div className="h-12 bg-gray-100 rounded" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded" />
      ))}
    </div>
  );
}

export default function AdminBlogPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <Suspense fallback={<LoadingSkeleton />}>
        <BlogPostsData />
      </Suspense>
    </div>
  );
}
