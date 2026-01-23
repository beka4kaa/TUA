"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, MoreHorizontal, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface Author {
    id: string;
    name: string | null;
    image: string | null;
}

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author: Author;
}

interface Post {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: Author;
    _count: {
        likes: number;
        comments: number;
    };
    likes: { userId: string }[];
    comments: Comment[];
}

interface FeedListProps {
    initialPosts: Post[];
}

export function FeedList({ initialPosts }: FeedListProps) {
    const { data: session } = useSession();
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
    const [newComment, setNewComment] = useState<Record<string, string>>({});
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const isAdmin = session?.user?.role === "ADMIN";
    const currentUserId = session?.user?.id;

    const toggleComments = (postId: string) => {
        setExpandedComments((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            return newSet;
        });
    };

    const handleLike = async (postId: string) => {
        if (!session) {
            toast.error("Please sign in to like posts");
            return;
        }

        try {
            const response = await fetch("/api/likes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId }),
            });

            if (!response.ok) throw new Error("Failed to toggle like");

            const { liked } = await response.json();

            setPosts((prev) =>
                prev.map((post) => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            _count: {
                                ...post._count,
                                likes: liked ? post._count.likes + 1 : post._count.likes - 1,
                            },
                            likes: liked
                                ? [...post.likes, { userId: currentUserId! }]
                                : post.likes.filter((l) => l.userId !== currentUserId),
                        };
                    }
                    return post;
                })
            );
        } catch {
            toast.error("Failed to toggle like");
        }
    };

    const handleComment = async (postId: string) => {
        if (!session) {
            toast.error("Please sign in to comment");
            return;
        }

        const content = newComment[postId]?.trim();
        if (!content) return;

        try {
            const response = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId, content }),
            });

            if (!response.ok) throw new Error("Failed to add comment");

            const comment = await response.json();

            setPosts((prev) =>
                prev.map((post) => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            _count: {
                                ...post._count,
                                comments: post._count.comments + 1,
                            },
                            comments: [...post.comments, comment],
                        };
                    }
                    return post;
                })
            );

            setNewComment((prev) => ({ ...prev, [postId]: "" }));
            toast.success("Comment added");
        } catch {
            toast.error("Failed to add comment");
        }
    };

    const handleDeletePost = async () => {
        if (!postToDelete) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/posts/${postToDelete}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete post");

            setPosts((prev) => prev.filter((post) => post.id !== postToDelete));
            setDeleteDialogOpen(false);
            setPostToDelete(null);

            toast.success("Post deleted");
        } catch {
            toast.error("Failed to delete post");
        } finally {
            setIsLoading(false);
        }
    };

    const isLikedByUser = (post: Post) => {
        return post.likes.some((like) => like.userId === currentUserId);
    };

    const getInitials = (name: string | null) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    if (posts.length === 0) {
        return (
            <Card className="text-center py-12">
                <CardContent>
                    <p className="text-muted-foreground">No posts yet. Check back later!</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {posts.map((post) => (
                    <Card key={post.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={post.author.image ?? undefined} />
                                        <AvatarFallback className="bg-brand-blue text-white">
                                            {getInitials(post.author.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-sm">
                                                {post.author.name ?? "Anonymous"}
                                            </p>
                                            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                                                Admin
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(post.createdAt), {
                                                addSuffix: true,
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {isAdmin && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onClick={() => {
                                                    setPostToDelete(post.id);
                                                    setDeleteDialogOpen(true);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="pb-3">
                            <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {post.content}
                            </p>
                        </CardContent>

                        <CardFooter className="flex-col items-start gap-4 pt-0">
                            <div className="flex items-center gap-4 w-full">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`gap-2 ${isLikedByUser(post) ? "text-secondary" : ""
                                        }`}
                                    onClick={() => handleLike(post.id)}
                                >
                                    <Heart
                                        className={`h-4 w-4 ${isLikedByUser(post) ? "fill-current" : ""
                                            }`}
                                    />
                                    {post._count.likes}
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => toggleComments(post.id)}
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    {post._count.comments}
                                </Button>
                            </div>

                            {/* Comments Section */}
                            {expandedComments.has(post.id) && (
                                <div className="w-full border-t pt-4 space-y-4">
                                    {/* Comment Input */}
                                    {session && (
                                        <div className="flex gap-2">
                                            <Textarea
                                                placeholder="Write a comment..."
                                                value={newComment[post.id] ?? ""}
                                                onChange={(e) =>
                                                    setNewComment((prev) => ({
                                                        ...prev,
                                                        [post.id]: e.target.value,
                                                    }))
                                                }
                                                className="min-h-[60px] resize-none"
                                            />
                                            <Button
                                                size="sm"
                                                onClick={() => handleComment(post.id)}
                                                disabled={!newComment[post.id]?.trim()}
                                                className="bg-primary hover:bg-primary/90"
                                            >
                                                Post
                                            </Button>
                                        </div>
                                    )}

                                    {/* Comments List */}
                                    <div className="space-y-3">
                                        {post.comments.map((comment) => (
                                            <div key={comment.id} className="flex gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={comment.author.image ?? undefined} />
                                                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                                        {getInitials(comment.author.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 bg-muted rounded-lg px-3 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-sm">
                                                            {comment.author.name ?? "Anonymous"}
                                                        </p>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatDistanceToNow(new Date(comment.createdAt), {
                                                                addSuffix: true,
                                                            })}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm mt-1">{comment.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Post</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this post? This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeletePost}
                            disabled={isLoading}
                        >
                            {isLoading ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

// Loading skeleton for feed
export function FeedListSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <Card key={i}>
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3 mt-1" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-8 w-16 mr-4" />
                        <Skeleton className="h-8 w-16" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
