from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.db.models import Count

from .models import Post, Tag, PostTag, PostView, Comment, Like
from .serializers import (
    PostListSerializer, PostDetailSerializer, CreatePostSerializer, UpdatePostSerializer,
    TagSerializer, CommentSerializer, CreateCommentSerializer, LikeToggleSerializer
)
from core.permissions import IsAdmin, IsAdminOrReadOnly, IsOwnerOrAdmin
from core.pagination import StandardPagination, BlogPagination
from core.utils import generate_slug, calculate_reading_time


# ============================================
# Post Views
# ============================================

class PostListView(generics.ListCreateAPIView):
    """List all posts or create a new post"""
    
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = StandardPagination
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreatePostSerializer
        return PostListSerializer
    
    def get_queryset(self):
        # Public users see only published posts
        if not self.request.user.is_authenticated or self.request.user.role != 'ADMIN':
            return Post.objects.filter(status='PUBLISHED').select_related('author')
        return Post.objects.all().select_related('author')
    
    def create(self, request, *args, **kwargs):
        serializer = CreatePostSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Validation failed', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        data = serializer.validated_data
        
        # Generate slug
        slug = data.get('slug') or generate_slug(data['title'])
        
        # Ensure unique slug
        counter = 1
        original_slug = slug
        while Post.objects.filter(slug=slug).exists():
            slug = f"{original_slug}-{counter}"
            counter += 1
        
        # Create post
        post = Post.objects.create(
            title=data['title'],
            slug=slug,
            excerpt=data.get('excerpt', ''),
            content=data['content'],
            status=data.get('status', 'DRAFT'),
            cover_image_url=data.get('coverImageUrl'),
            reading_time_minutes=calculate_reading_time(data['content']),
            published_at=timezone.now() if data.get('status') == 'PUBLISHED' else None,
            author=request.user,
        )
        
        # Handle tags
        for tag_name in data.get('tags', []):
            tag_slug = generate_slug(tag_name)
            tag, _ = Tag.objects.get_or_create(
                slug=tag_slug,
                defaults={'name': tag_name.strip()}
            )
            PostTag.objects.create(post=post, tag=tag)
        
        return Response(PostDetailSerializer(post).data, status=status.HTTP_201_CREATED)


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a specific post"""
    
    queryset = Post.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UpdatePostSerializer
        return PostDetailSerializer
    
    def update(self, request, *args, **kwargs):
        post = self.get_object()
        serializer = UpdatePostSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Validation failed', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        data = serializer.validated_data
        
        # Update fields
        if 'title' in data:
            post.title = data['title']
        if 'slug' in data:
            post.slug = data['slug']
        if 'excerpt' in data:
            post.excerpt = data['excerpt']
        if 'content' in data:
            post.content = data['content']
            post.reading_time_minutes = calculate_reading_time(data['content'])
        if 'status' in data:
            post.status = data['status']
            if data['status'] == 'PUBLISHED' and not post.published_at:
                post.published_at = timezone.now()
        if 'coverImageUrl' in data:
            post.cover_image_url = data['coverImageUrl']
        
        post.save()
        
        # Update tags if provided
        if 'tags' in data:
            PostTag.objects.filter(post=post).delete()
            for tag_name in data['tags']:
                tag_slug = generate_slug(tag_name)
                tag, _ = Tag.objects.get_or_create(
                    slug=tag_slug,
                    defaults={'name': tag_name.strip()}
                )
                PostTag.objects.create(post=post, tag=tag)
        
        return Response(PostDetailSerializer(post).data)


# ============================================
# Blog Views (Public)
# ============================================

class BlogPostListView(generics.ListAPIView):
    """Public blog posts list with pagination"""
    
    serializer_class = PostListSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = BlogPagination
    
    def get_queryset(self):
        queryset = Post.objects.filter(status='PUBLISHED').select_related('author')
        
        # Filter by tag
        tag_slug = self.request.query_params.get('tag')
        if tag_slug:
            queryset = queryset.filter(tags__slug=tag_slug)
        
        return queryset.order_by('-published_at')


class BlogPostDetailView(generics.RetrieveAPIView):
    """Get a single blog post by slug"""
    
    serializer_class = PostDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    
    def get_queryset(self):
        return Post.objects.filter(status='PUBLISHED').select_related('author')
    
    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        
        # Track view
        post = self.get_object()
        ip_hash = request.META.get('REMOTE_ADDR', '')[:32]
        user_id = str(request.user.id) if request.user.is_authenticated else None
        
        PostView.objects.create(
            post=post,
            ip_hash=ip_hash,
            user_id=user_id,
        )
        
        return response


class TagListView(generics.ListAPIView):
    """List all tags with post counts"""
    
    serializer_class = TagSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        return Tag.objects.annotate(
            post_count=Count('posts', filter=models.Q(posts__post__status='PUBLISHED'))
        ).order_by('name')


# ============================================
# Comment Views
# ============================================

class CommentView(APIView):
    """Create or delete comments"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Create a comment"""
        serializer = CreateCommentSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Validation failed', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        data = serializer.validated_data
        
        comment = Comment.objects.create(
            content=data['content'],
            post_id=data['postId'],
            author=request.user,
        )
        
        return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)
    
    def delete(self, request):
        """Delete a comment"""
        comment_id = request.data.get('commentId')
        
        if not comment_id:
            return Response(
                {'error': 'Comment ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            comment = Comment.objects.get(id=comment_id)
        except Comment.DoesNotExist:
            return Response(
                {'error': 'Comment not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check permission
        if comment.author != request.user and request.user.role != 'ADMIN':
            return Response(
                {'error': 'Forbidden'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        comment.delete()
        return Response({'success': True})


# ============================================
# Like Views
# ============================================

class LikeToggleView(APIView):
    """Toggle like on a post"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = LikeToggleSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Validation failed', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        post_id = serializer.validated_data['postId']
        
        # Check if already liked
        existing_like = Like.objects.filter(post_id=post_id, user=request.user).first()
        
        if existing_like:
            existing_like.delete()
            return Response({'liked': False})
        else:
            Like.objects.create(post_id=post_id, user=request.user)
            return Response({'liked': True})


# ============================================
# Admin Post Views
# ============================================

class AdminPostListView(generics.ListCreateAPIView):
    """Admin list all posts with filters"""
    
    permission_classes = [IsAdmin]
    pagination_class = BlogPagination
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreatePostSerializer
        return PostListSerializer
    
    def get_queryset(self):
        queryset = Post.objects.all().select_related('author')
        
        # Filter by status
        post_status = self.request.query_params.get('status')
        if post_status:
            queryset = queryset.filter(status=post_status)
        
        return queryset.order_by('-updated_at')
    
    def create(self, request, *args, **kwargs):
        # Reuse PostListView create logic
        return PostListView.as_view()(request._request)


class AdminPostDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin get, update, delete post"""
    
    queryset = Post.objects.all()
    permission_classes = [IsAdmin]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UpdatePostSerializer
        return PostDetailSerializer


# Need to import models for Q
from django.db import models
