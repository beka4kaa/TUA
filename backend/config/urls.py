"""
URL configuration for SEA Backend
"""

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def health_check(request):
    return JsonResponse({'status': 'ok'})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health_check'),
    
    # API endpoints
    path('api/', include('apps.users.urls')),
    path('api/', include('apps.blog.urls')),
    path('api/', include('apps.bookings.urls')),
    path('api/', include('apps.subscriptions.urls')),
]
