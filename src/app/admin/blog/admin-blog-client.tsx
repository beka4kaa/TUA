"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

type PostStatus = "DRAFT" | "PUBLISHED";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: PostStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  readingTimeMinutes: number | null;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  tags: {
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
}

interface AdminBlogClientProps {
  posts: Post[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

export function AdminBlogClient({ posts: initialPosts }: AdminBlogClientProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [statusFilter, setStatusFilter] = useState<"all" | PostStatus>("all");
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  const filteredPosts = useMemo(() => {
    if (statusFilter === "all") return posts;
    return posts.filter((post) => post.status === statusFilter);
  }, [posts, statusFilter]);
  
  const stats = useMemo(() => ({
    total: posts.length,
    published: posts.filter((p) => p.status === "PUBLISHED").length,
    draft: posts.filter((p) => p.status === "DRAFT").length,
  }), [posts]);
  
  const handleStatusChange = async (postId: string, newStatus: PostStatus) => {
    setIsLoading(postId);
    
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      
      const updatedPost = await response.json();
      
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, status: newStatus, publishedAt: updatedPost.publishedAt }
            : p
        )
      );
      
      toast.success(
        newStatus === "PUBLISHED"
          ? "Статья опубликована"
          : "Статья снята с публикации"
      );
    } catch {
      toast.error("Ошибка при обновлении статуса");
    } finally {
      setIsLoading(null);
    }
  };
  
  const handleDelete = async (postId: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту статью?")) return;
    
    setIsLoading(postId);
    
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
      
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success("Статья удалена");
    } catch {
      toast.error("Ошибка при удалении статьи");
    } finally {
      setIsLoading(null);
    }
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-[#111111]">
            Управление блогом
          </h1>
          <p className="text-gray-500 mt-1">
            {stats.total} статей · {stats.published} опубликовано · {stats.draft} черновиков
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-[#1B5FAA] hover:bg-[#1B5FAA]/90">
            <PlusIcon className="w-4 h-4 mr-2" />
            Новая статья
          </Button>
        </Link>
      </motion.div>
      
      {/* Status Filter Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as "all" | PostStatus)}
        >
          <TabsList className="bg-gray-100/70">
            <TabsTrigger value="all">
              Все
              <span className="ml-1.5 text-xs text-gray-500">({stats.total})</span>
            </TabsTrigger>
            <TabsTrigger value="PUBLISHED">
              Опубликовано
              <span className="ml-1.5 text-xs text-gray-500">({stats.published})</span>
            </TabsTrigger>
            <TabsTrigger value="DRAFT">
              Черновики
              <span className="ml-1.5 text-xs text-gray-500">({stats.draft})</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>
      
      {/* Posts Table */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
      >
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 px-4">
            <DocumentIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              {statusFilter === "all"
                ? "Пока нет статей"
                : statusFilter === "PUBLISHED"
                ? "Нет опубликованных статей"
                : "Нет черновиков"}
            </p>
            <Link href="/admin/blog/new">
              <Button variant="outline" className="mt-4">
                Создать первую статью
              </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead className="w-[40%]">Заголовок</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="hidden md:table-cell">Теги</TableHead>
                <TableHead className="hidden lg:table-cell">Дата публикации</TableHead>
                <TableHead className="hidden lg:table-cell">Обновлено</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow
                  key={post.id}
                  className={`group ${isLoading === post.id ? "opacity-50" : ""}`}
                >
                  <TableCell>
                    <div className="space-y-1">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="font-medium text-[#111111] hover:text-[#1B5FAA] transition-colors line-clamp-1"
                      >
                        {post.title}
                      </Link>
                      {post.excerpt && (
                        <p className="text-sm text-gray-500 line-clamp-1 hidden sm:block">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={post.status} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map(({ tag }) => (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-600"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                      {post.tags.length > 2 && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-500"
                        >
                          +{post.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-500 text-sm">
                    {post.publishedAt
                      ? format(new Date(post.publishedAt), "d MMM yyyy", { locale: ru })
                      : "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-500 text-sm">
                    {format(new Date(post.updatedAt), "d MMM yyyy", { locale: ru })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={isLoading === post.id}
                        >
                          <MoreVerticalIcon className="w-4 h-4" />
                          <span className="sr-only">Действия</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => router.push(`/admin/blog/${post.id}`)}
                        >
                          <EditIcon className="w-4 h-4 mr-2" />
                          Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                          disabled={post.status !== "PUBLISHED"}
                        >
                          <ExternalLinkIcon className="w-4 h-4 mr-2" />
                          Просмотреть
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {post.status === "DRAFT" ? (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(post.id, "PUBLISHED")}
                          >
                            <CheckCircleIcon className="w-4 h-4 mr-2 text-green-600" />
                            Опубликовать
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(post.id, "DRAFT")}
                          >
                            <XCircleIcon className="w-4 h-4 mr-2 text-[#1B5FAA]" />
                            Снять с публикации
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <TrashIcon className="w-4 h-4 mr-2" />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </motion.div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: PostStatus }) {
  if (status === "PUBLISHED") {
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
        <CheckCircleIcon className="w-3 h-3 mr-1" />
        Опубликовано
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="bg-[#F5EAEA] text-[#1B5FAA]">
      <DocumentIcon className="w-3 h-3 mr-1" />
      Черновик
    </Badge>
  );
}

// Icons
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function MoreVerticalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
      />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}
