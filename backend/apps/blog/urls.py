from django.urls import path
from .views import (
    PostListView, PostDetailView,
    BlogPostListView, BlogPostDetailView, TagListView,
    CommentView, LikeToggleView,
    AdminPostListView, AdminPostDetailView
)

urlpatterns = [
    # Posts (authenticated)
    path('posts/', PostListView.as_view(), name='post-list'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    
    # Blog (public)
    path('blog/', BlogPostListView.as_view(), name='blog-list'),
    path('blog/tags/', TagListView.as_view(), name='blog-tags'),
    path('blog/<slug:slug>/', BlogPostDetailView.as_view(), name='blog-detail'),
    
    # Comments
    path('comments/', CommentView.as_view(), name='comments'),
    
    # Likes
    path('likes/', LikeToggleView.as_view(), name='likes'),
    
    # Admin posts
    path('admin/posts/', AdminPostListView.as_view(), name='admin-post-list'),
    path('admin/posts/<int:pk>/', AdminPostDetailView.as_view(), name='admin-post-detail'),
]
