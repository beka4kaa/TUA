import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PostEditor } from "../post-editor";

export const metadata = {
  title: "Новая статья | Admin | Ymit Academy",
};

export default async function NewBlogPostPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  
  // Get all tags for the tag selector
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
  });
  
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <PostEditor tags={tags} />
    </div>
  );
}
