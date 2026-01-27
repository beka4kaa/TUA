from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    SignUpView, CustomTokenObtainPairView, 
    UserListView, UserDetailView, UpdateUserRoleView, MeView,
    VerifyEmailView, ResendVerificationView, ForgotPasswordView,
    ResetPasswordView, LogoutView, UpdateUserStatusView,
    AdminUserUpdateView, ProfileView
)

urlpatterns = [
    # Auth endpoints
    path('auth/signup/', SignUpView.as_view(), name='signup'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Email verification
    path('auth/verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('auth/resend-verification/', ResendVerificationView.as_view(), name='resend-verification'),
    
    # Password reset
    path('auth/forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('auth/reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    
    # Current user
    path('auth/me/', MeView.as_view(), name='me'),
    
    # Profile
    path('profile/', ProfileView.as_view(), name='my-profile'),
    path('profile/<uuid:pk>/', ProfileView.as_view(), name='user-profile'),
    
    # User management (Admin)
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<uuid:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('users/<uuid:pk>/role/', UpdateUserRoleView.as_view(), name='user-role'),
    path('users/<uuid:pk>/status/', UpdateUserStatusView.as_view(), name='user-status'),
    path('users/<uuid:pk>/admin-update/', AdminUserUpdateView.as_view(), name='admin-user-update'),
]
