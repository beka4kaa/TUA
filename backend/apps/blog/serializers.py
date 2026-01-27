from rest_framework import serializers
from .models import Post, Tag, PostTag, PostView, Comment, Like
from apps.users.serializers import UserPublicSerializer


class TagSerializer(serializers.ModelSerializer):
    """Serializer for Tag"""
    
    post_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug', 'post_count', 'created_at']
    
    def get_post_count(self, obj):
        return obj.posts.filter(status='PUBLISHED').count()


class PostTagSerializer(serializers.ModelSerializer):
    """Serializer for PostTag with nested tag info"""
    
    tag = TagSerializer(read_only=True)
    
    class Meta:
        model = PostTag
        fields = ['id', 'tag']


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for Comment"""
    
    author = UserPublicSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'content', 'post', 'author', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']


class CreateCommentSerializer(serializers.Serializer):
    """Serializer for creating a comment"""
    
    postId = serializers.CharField()
    content = serializers.CharField(min_length=1, max_length=2000)
    
    def validate_postId(self, value):
        if not Post.objects.filter(id=value).exists():
            raise serializers.ValidationError("Post not found")
        return value


class PostListSerializer(serializers.ModelSerializer):
    """Serializer for Post list view"""
    
    author = UserPublicSerializer(read_only=True)
    tags = serializers.SerializerMethodField()
    _count = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'slug', 'excerpt', 'status', 'published_at', 
                  'reading_time_minutes', 'cover_image_url', 'author', 'tags', 
                  '_count', 'created_at', 'updated_at']
    
    def get_tags(self, obj):
        post_tags = PostTag.objects.filter(post=obj).select_related('tag')
        return [{'tag': TagSerializer(pt.tag).data} for pt in post_tags]
    
    def get__count(self, obj):
        return {
            'likes': obj.likes.count(),
            'comments': obj.comments.count(),
        }


class PostDetailSerializer(serializers.ModelSerializer):
    """Serializer for Post detail view"""
    
    author = UserPublicSerializer(read_only=True)
    tags = serializers.SerializerMethodField()
    _count = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'slug', 'excerpt', 'content', 'status', 
                  'published_at', 'reading_time_minutes', 'cover_image_url',
                  'author', 'tags', '_count', 'comments', 'likes',
                  'created_at', 'updated_at']
    
    def get_tags(self, obj):
        post_tags = PostTag.objects.filter(post=obj).select_related('tag')
        return [{'tag': TagSerializer(pt.tag).data} for pt in post_tags]
    
    def get__count(self, obj):
        return {
            'likes': obj.likes.count(),
            'comments': obj.comments.count(),
        }
    
    def get_comments(self, obj):
        comments = obj.comments.select_related('author').order_by('-created_at')[:5]
        return CommentSerializer(comments, many=True).data
    
    def get_likes(self, obj):
        return [{'userId': like.user_id} for like in obj.likes.all()]


class CreatePostSerializer(serializers.Serializer):
    """Serializer for creating a post"""
    
    title = serializers.CharField(min_length=1, max_length=200)
    slug = serializers.SlugField(required=False, allow_blank=True)
    excerpt = serializers.CharField(max_length=500, required=False, allow_blank=True)
    content = serializers.CharField(min_length=1)
    status = serializers.ChoiceField(choices=['DRAFT', 'PUBLISHED'], default='DRAFT')
    coverImageUrl = serializers.URLField(required=False, allow_blank=True, allow_null=True)
    tags = serializers.ListField(child=serializers.CharField(), default=list)


class UpdatePostSerializer(serializers.Serializer):
    """Serializer for updating a post"""
    
    title = serializers.CharField(min_length=1, max_length=200, required=False)
    slug = serializers.SlugField(required=False)
    excerpt = serializers.CharField(max_length=500, required=False, allow_blank=True)
    content = serializers.CharField(min_length=1, required=False)
    status = serializers.ChoiceField(choices=['DRAFT', 'PUBLISHED'], required=False)
    coverImageUrl = serializers.URLField(required=False, allow_blank=True, allow_null=True)
    tags = serializers.ListField(child=serializers.CharField(), required=False)


class LikeToggleSerializer(serializers.Serializer):
    """Serializer for toggling a like"""
    
    postId = serializers.CharField()
    
    def validate_postId(self, value):
        if not Post.objects.filter(id=value).exists():
            raise serializers.ValidationError("Post not found")
        return value
