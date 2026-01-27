"""
URL configuration for YMIT Academy Backend
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', include('apps.users.urls')),
    path('api/', include('apps.blog.urls')),
    path('api/', include('apps.bookings.urls')),
    path('api/', include('apps.subscriptions.urls')),
]
