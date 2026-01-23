import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PostEditor } from "../post-editor";

export const metadata = {
  title: "Редактирование статьи | Admin | Ymit Academy",
};

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  
  // Get the post with its tags
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
  
  if (!post) {
    notFound();
  }
  
  // Get all tags for the tag selector
  const allTags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
  });
  
  // Transform post tags to array of tag objects
  const postWithTags = {
    ...post,
    tags: post.tags.map((pt) => pt.tag),
  };
  
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <PostEditor post={postWithTags} tags={allTags} />
    </div>
  );
}
