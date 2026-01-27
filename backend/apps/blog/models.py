from django.db import models
from apps.users.models import User


class Tag(models.Model):
    """Blog post tags"""
    
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'tags'
        indexes = [
            models.Index(fields=['slug']),
        ]
    
    def __str__(self):
        return self.name


class Post(models.Model):
    """Blog post model"""
    
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        PUBLISHED = 'PUBLISHED', 'Published'
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=150)
    excerpt = models.TextField(blank=True, null=True)
    content = models.TextField()
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.DRAFT)
    published_at = models.DateTimeField(blank=True, null=True)
    reading_time_minutes = models.IntegerField(default=5)
    cover_image_url = models.URLField(blank=True, null=True)
    
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    tags = models.ManyToManyField(Tag, through='PostTag', related_name='posts')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'posts'
        indexes = [
            models.Index(fields=['author']),
            models.Index(fields=['status']),
            models.Index(fields=['-published_at']),
            models.Index(fields=['-created_at']),
        ]
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        # Auto-calculate reading time
        if self.content:
            words = len(self.content.split())
            self.reading_time_minutes = max(1, words // 200)
        super().save(*args, **kwargs)


class PostTag(models.Model):
    """Many-to-many relationship between Post and Tag"""
    
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'post_tags'
        unique_together = ['post', 'tag']
        indexes = [
            models.Index(fields=['post']),
            models.Index(fields=['tag']),
        ]


class PostView(models.Model):
    """Track post views for analytics"""
    
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='views')
    ip_hash = models.CharField(max_length=255, blank=True, null=True)
    user_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'post_views'
        indexes = [
            models.Index(fields=['post']),
            models.Index(fields=['created_at']),
        ]


class Comment(models.Model):
    """Post comments"""
    
    content = models.TextField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'comments'
        indexes = [
            models.Index(fields=['post']),
            models.Index(fields=['author']),
        ]
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Comment by {self.author.email} on {self.post.title}"


class Like(models.Model):
    """Post likes - unique per user per post"""
    
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'likes'
        unique_together = ['post', 'user']
        indexes = [
            models.Index(fields=['post']),
            models.Index(fields=['user']),
        ]
