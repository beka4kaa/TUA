"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { generateSlug } from "@/lib/blog";

type PostStatus = "DRAFT" | "PUBLISHED";

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: PostStatus;
  coverImageUrl: string | null;
  publishedAt: Date | null;
  tags: Tag[];
}

interface PostEditorProps {
  post?: Post;
  tags: Tag[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

export function PostEditor({ post, tags: availableTags }: PostEditorProps) {
  const router = useRouter();
  const isEditing = !!post;
  
  // Form state
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(post?.coverImageUrl ?? "");
  const [selectedTags, setSelectedTags] = useState<Tag[]>(post?.tags ?? []);
  const [newTagInput, setNewTagInput] = useState("");
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [previewTab, setPreviewTab] = useState<string>("edit");
  
  // Auto-generate slug from title (unless manually edited)
  useEffect(() => {
    if (!slugManuallyEdited && title) {
      setSlug(generateSlug(title));
    }
  }, [title, slugManuallyEdited]);
  
  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);
    setSlug(value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"));
  };
  
  const handleTagSelect = (tag: Tag) => {
    if (selectedTags.some((t) => t.id === tag.id)) {
      setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const handleAddNewTag = () => {
    const trimmed = newTagInput.trim();
    if (!trimmed) return;
    
    // Check if tag already exists
    const existing = availableTags.find(
      (t) => t.name.toLowerCase() === trimmed.toLowerCase()
    );
    
    if (existing) {
      if (!selectedTags.some((t) => t.id === existing.id)) {
        setSelectedTags([...selectedTags, existing]);
      }
    } else {
      // Create a temporary tag (will be created on save)
      const tempTag: Tag = {
        id: `new-${Date.now()}`,
        name: trimmed,
        slug: generateSlug(trimmed),
      };
      setSelectedTags([...selectedTags, tempTag]);
    }
    
    setNewTagInput("");
  };
  
  const handleSubmit = useCallback(
    async (status: PostStatus) => {
      if (!title.trim()) {
        toast.error("Введите заголовок статьи");
        return;
      }
      
      if (!content.trim()) {
        toast.error("Введите содержимое статьи");
        return;
      }
      
      setIsSubmitting(true);
      
      try {
        const tagNames = selectedTags.map((t) => t.name);
        
        const payload = {
          title: title.trim(),
          slug: slug.trim() || generateSlug(title.trim()),
          excerpt: excerpt.trim() || null,
          content: content.trim(),
          coverImageUrl: coverImageUrl.trim() || null,
          status,
          tags: tagNames,
        };
        
        const url = isEditing
          ? `/api/admin/posts/${post.id}`
          : "/api/admin/posts";
        
        const response = await fetch(url, {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to save post");
        }
        
        toast.success(
          status === "PUBLISHED"
            ? isEditing
              ? "Статья обновлена и опубликована"
              : "Статья опубликована"
            : isEditing
            ? "Черновик сохранён"
            : "Черновик создан"
        );
        
        router.push("/admin/blog");
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Ошибка при сохранении"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [title, slug, excerpt, content, coverImageUrl, selectedTags, isEditing, post?.id, router]
  );
  
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
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold text-[#111111]">
              {isEditing ? "Редактирование статьи" : "Новая статья"}
            </h1>
            {isEditing && post.status === "PUBLISHED" && (
              <p className="text-sm text-gray-500">
                Опубликована ·{" "}
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="text-[#1B5FAA] hover:underline"
                >
                  Просмотреть
                </Link>
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleSubmit("DRAFT")}
            disabled={isSubmitting}
          >
            <SaveIcon className="w-4 h-4 mr-2" />
            Сохранить черновик
          </Button>
          <Button
            className="bg-[#1B5FAA] hover:bg-[#1B5FAA]/90"
            onClick={() => handleSubmit("PUBLISHED")}
            disabled={isSubmitting}
          >
            <SendIcon className="w-4 h-4 mr-2" />
            Опубликовать
          </Button>
        </div>
      </motion.div>
      
      {/* Main Form */}
      <div className="grid lg:grid-cols-[1fr,320px] gap-6">
        {/* Content Area */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Заголовок</Label>
            <Input
              id="title"
              placeholder="Введите заголовок статьи..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg h-12"
            />
          </div>
          
          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">URL (slug)</Label>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">/blog/</span>
              <Input
                id="slug"
                placeholder="url-slug"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
          </div>
          
          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Краткое описание</Label>
            <Textarea
              id="excerpt"
              placeholder="Краткое описание для карточки статьи (1-2 предложения)..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
            />
          </div>
          
          {/* Content with Preview */}
          <div className="space-y-2">
            <Label>Содержимое (Markdown)</Label>
            <Tabs value={previewTab} onValueChange={setPreviewTab}>
              <TabsList className="bg-gray-100/70">
                <TabsTrigger value="edit">
                  <EditIcon className="w-4 h-4 mr-1.5" />
                  Редактор
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <EyeIcon className="w-4 h-4 mr-1.5" />
                  Предпросмотр
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="edit" className="mt-3">
                <Textarea
                  placeholder="Напишите содержимое статьи в формате Markdown..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={20}
                  className="font-mono text-sm resize-y"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Поддерживается Markdown: **жирный**, *курсив*, # заголовки, [ссылки](url), 
                  `код`, списки, таблицы
                </p>
              </TabsContent>
              
              <TabsContent value="preview" className="mt-3">
                <div className="min-h-[400px] p-6 bg-white rounded-lg border border-gray-200">
                  {content ? (
                    <div className="prose prose-gray max-w-none prose-headings:font-display prose-headings:text-[#111111] prose-a:text-[#1B5FAA]">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-16">
                      Введите текст для предпросмотра
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
        
        {/* Sidebar */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Cover Image */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
            <Label htmlFor="cover">Обложка (URL)</Label>
            <Input
              id="cover"
              placeholder="https://example.com/image.jpg"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
            />
            {coverImageUrl && (
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImageUrl}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
          
          {/* Tags */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
            <Label>Теги</Label>
            
            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="bg-[#1B5FAA]/10 text-[#1B5FAA] cursor-pointer hover:bg-[#1B5FAA]/20"
                    onClick={() => handleTagSelect(tag)}
                  >
                    {tag.name}
                    <XIcon className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Add New Tag */}
            <div className="flex gap-2">
              <Input
                placeholder="Новый тег..."
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddNewTag();
                  }
                }}
                className="text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddNewTag}
                disabled={!newTagInput.trim()}
              >
                <PlusIcon className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Available Tags */}
            {availableTags.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Существующие теги:</p>
                <div className="flex flex-wrap gap-1.5">
                  {availableTags
                    .filter((t) => !selectedTags.some((st) => st.id === t.id))
                    .map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => handleTagSelect(tag)}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Markdown Help */}
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">Markdown справка</p>
            <div className="text-xs text-gray-500 space-y-1 font-mono">
              <p># Заголовок 1</p>
              <p>## Заголовок 2</p>
              <p>**жирный текст**</p>
              <p>*курсив*</p>
              <p>[текст ссылки](url)</p>
              <p>![alt](image-url)</p>
              <p>`inline код`</p>
              <p>```code block```</p>
              <p>- список</p>
              <p>1. нумерованный</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Icons
function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function SaveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
      />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
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

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}
