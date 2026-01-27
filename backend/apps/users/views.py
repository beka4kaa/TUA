from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from django.db.models import Q
from django.conf import settings
from django.contrib.auth.hashers import make_password
import secrets

from .models import User
from .serializers import (
    UserSerializer, UserWithSubscriptionSerializer, SignUpSerializer,
    CustomTokenObtainPairSerializer, UpdateUserRoleSerializer,
    UpdateUserStatusSerializer, AdminUserUpdateSerializer,
    VerifyEmailSerializer, ResendVerificationSerializer,
    ForgotPasswordSerializer, ResetPasswordSerializer
)
from apps.subscriptions.models import Subscription
from core.permissions import IsAdmin
from core.pagination import StandardPagination
from core.email import send_verification_email, send_password_reset_email


# ============================================
# Auth Views
# ============================================

class SignUpView(APIView):
    """User registration endpoint"""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Validation failed', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = serializer.save()
        
        # Generate verification token
        token = secrets.token_hex(32)
        user.verification_token = token
        user.verification_expires = timezone.now() + timezone.timedelta(hours=24)
        user.save()
        
        # Create default FREE subscription
        Subscription.objects.create(
            user=user,
            tier=Subscription.Tier.FREE,
            status=Subscription.Status.ACTIVE,
        )
        
        # Send verification email
        email_sent = send_verification_email(user, token)
        
        # Get frontend URL with fallback
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        verification_url = f"{frontend_url}/verify-email?token={token}"
        
        if settings.DEBUG:
            print(f"\n{'='*50}")
            print(f"EMAIL VERIFICATION")
            print(f"Email: {user.email}")
            print(f"Token: {token}")
            print(f"URL: {verification_url}")
            print(f"Email sent: {email_sent}")
            print(f"{'='*50}\n")
        
        return Response(
            {
                'success': True,
                'message': 'Account created. Please check your email for verification link.',
                'email': user.email,
                **({"verificationUrl": verification_url} if settings.DEBUG else {}),
            },
            status=status.HTTP_201_CREATED
        )


class VerifyEmailView(APIView):
    """Verify email with token"""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = VerifyEmailSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid token format'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        token = serializer.validated_data['token']
        
        try:
            user = User.objects.get(verification_token=token)
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid or expired verification token'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if token expired
        if user.verification_expires and user.verification_expires < timezone.now():
            return Response(
                {'error': 'Verification token has expired. Please request a new one.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify email
        user.email_verified = timezone.now()
        user.status = User.Status.ACTIVE
        user.verification_token = None
        user.verification_expires = None
        user.save()
        
        return Response({
            'success': True,
            'message': 'Email verified successfully. You can now log in.'
        })


class ResendVerificationView(APIView):
    """Resend verification email"""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = ResendVerificationSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid email'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        email = serializer.validated_data['email'].lower().strip()
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({
                'success': True,
                'message': 'If this email exists, a verification email will be sent.'
            })
        
        if user.is_verified:
            return Response({
                'success': True,
                'message': 'Email is already verified. You can log in.'
            })
        
        # Generate new token
        token = secrets.token_hex(32)
        user.verification_token = token
        user.verification_expires = timezone.now() + timezone.timedelta(hours=24)
        user.save()
        
        # Send verification email
        email_sent = send_verification_email(user, token)
        
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        verification_url = f"{frontend_url}/verify-email?token={token}"
        
        if settings.DEBUG:
            print(f"\n{'='*50}")
            print(f"RESEND VERIFICATION")
            print(f"Email: {user.email}")
            print(f"Token: {token}")
            print(f"URL: {verification_url}")
            print(f"Email sent: {email_sent}")
            print(f"{'='*50}\n")
        
        return Response({
            'success': True,
            'message': 'If this email exists, a verification email will be sent.',
            **({"verificationUrl": verification_url} if settings.DEBUG else {}),
        })


class ForgotPasswordView(APIView):
    """Request password reset"""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid email'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        email = serializer.validated_data['email'].lower().strip()
        
        try:
            user = User.objects.get(email=email)
            
            # Generate reset token
            token = secrets.token_hex(32)
            user.reset_token = token
            user.reset_expires = timezone.now() + timezone.timedelta(hours=1)
            user.save()
            
            # Send password reset email
            email_sent = send_password_reset_email(user, token)
            
            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
            reset_url = f"{frontend_url}/reset-password?token={token}"
            
            if settings.DEBUG:
                print(f"\n{'='*50}")
                print(f"PASSWORD RESET")
                print(f"Email: {user.email}")
                print(f"Token: {token}")
                print(f"URL: {reset_url}")
                print(f"Email sent: {email_sent}")
                print(f"{'='*50}\n")
            
        except User.DoesNotExist:
            pass  # Don't reveal if user exists
        
        return Response({
            'success': True,
            'message': 'If this email exists, a password reset link will be sent.'
        })


class ResetPasswordView(APIView):
    """Reset password with token"""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Validation failed', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        token = serializer.validated_data['token']
        password = serializer.validated_data['password']
        
        try:
            user = User.objects.get(reset_token=token)
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid or expired reset token'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if user.reset_expires and user.reset_expires < timezone.now():
            return Response(
                {'error': 'Reset token has expired. Please request a new one.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update password
        user.password = make_password(password)
        user.reset_token = None
        user.reset_expires = None
        user.save()
        
        return Response({
            'success': True,
            'message': 'Password reset successfully. You can now log in.'
        })


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom login view with user info in response"""
    
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            email = request.data.get('email', '').lower().strip()
            User.objects.filter(email=email).update(last_login_at=timezone.now())
        
        return response


class LogoutView(APIView):
    """Logout - blacklist refresh token"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'success': True, 'message': 'Logged out successfully'})
        except Exception:
            return Response({'success': True, 'message': 'Logged out'})


class MeView(APIView):
    """Get current user info"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserWithSubscriptionSerializer(request.user)
        return Response(serializer.data)
    
    def patch(self, request):
        """Update current user profile"""
        user = request.user
        
        allowed_fields = ['first_name', 'last_name', 'image']
        for field in allowed_fields:
            if field in request.data:
                setattr(user, field, request.data[field])
        
        user.save()
        return Response(UserWithSubscriptionSerializer(user).data)


# ============================================
# Admin User Management Views
# ============================================

class UserListView(generics.ListAPIView):
    """List all users (Admin only)"""
    
    serializer_class = UserWithSubscriptionSerializer
    permission_classes = [IsAdmin]
    pagination_class = StandardPagination
    
    def get_queryset(self):
        queryset = User.objects.select_related('subscription').all()
        
        # Search filter
        search = self.request.query_params.get('search', '')
        if search:
            queryset = queryset.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search)
            )
        
        # Role filter
        role = self.request.query_params.get('role')
        if role and role != 'all':
            queryset = queryset.filter(role=role)
        
        # Status filter
        status_filter = self.request.query_params.get('status')
        if status_filter and status_filter != 'all':
            queryset = queryset.filter(status=status_filter)
        
        # Tier filter
        tier = self.request.query_params.get('tier')
        if tier and tier != 'all':
            queryset = queryset.filter(subscription__tier=tier)
        
        # Exclude admins option
        exclude_admins = self.request.query_params.get('exclude_admins')
        if exclude_admins == 'true':
            queryset = queryset.exclude(role=User.Role.ADMIN)
        
        return queryset.order_by('-created_at')


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """User detail, update, delete (Admin only)"""
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]


class UpdateUserRoleView(APIView):
    """Update user role (Admin only)"""
    
    permission_classes = [IsAdmin]
    
    def patch(self, request, pk):
        serializer = UpdateUserRoleSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Validation failed', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(pk=pk)
            user.role = serializer.validated_data['role']
            user.save()
            
            return Response({'success': True, 'role': user.role})
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class UpdateUserStatusView(APIView):
    """Update user status (Admin only)"""
    
    permission_classes = [IsAdmin]
    
    def patch(self, request, pk):
        serializer = UpdateUserStatusSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Validation failed', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(pk=pk)
            user.status = serializer.validated_data['status']
            user.save()
            
            return Response({'success': True, 'status': user.status})
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class AdminUserUpdateView(APIView):
    """Admin bulk update user (role + status)"""
    
    permission_classes = [IsAdmin]
    
    def patch(self, request, pk):
        serializer = AdminUserUpdateSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Validation failed', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(pk=pk)
            
            if 'role' in serializer.validated_data:
                user.role = serializer.validated_data['role']
            if 'status' in serializer.validated_data:
                user.status = serializer.validated_data['status']
            
            user.save()
            
            return Response({
                'success': True,
                'user': UserWithSubscriptionSerializer(user).data
            })
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class ProfileView(APIView):
    """View user profile (Admin can view any, users only their own)"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, pk=None):
        if pk:
            # Viewing another user's profile - admin only
            if request.user.role != User.Role.ADMIN:
                return Response(
                    {'error': 'Permission denied'},
                    status=status.HTTP_403_FORBIDDEN
                )
            try:
                user = User.objects.get(pk=pk)
            except User.DoesNotExist:
                return Response(
                    {'error': 'User not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            user = request.user
        
        return Response(UserWithSubscriptionSerializer(user).data)
