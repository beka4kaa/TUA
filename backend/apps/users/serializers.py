from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password, check_password
from .models import User
import re


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    
    name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'name', 'image', 'role', 
                  'status', 'email_verified', 'last_login_at', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_name(self, obj):
        return obj.display_name


class UserPublicSerializer(serializers.ModelSerializer):
    """Public serializer for User (limited fields)"""
    
    displayName = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'displayName', 'image']
    
    def get_displayName(self, obj):
        return obj.display_name


class UserWithSubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for User with subscription info (camelCase for frontend)"""
    
    subscription = serializers.SerializerMethodField()
    displayName = serializers.SerializerMethodField()
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    emailVerified = serializers.DateTimeField(source='email_verified')
    createdAt = serializers.DateTimeField(source='created_at')
    lastLoginAt = serializers.DateTimeField(source='last_login_at')
    
    class Meta:
        model = User
        fields = ['id', 'email', 'firstName', 'lastName', 'displayName', 'image', 
                  'role', 'status', 'emailVerified', 'createdAt', 'lastLoginAt', 'subscription']
    
    def get_displayName(self, obj):
        return obj.display_name
    
    def get_subscription(self, obj):
        try:
            sub = obj.subscription
            return {
                'id': sub.id,
                'tier': sub.tier,
                'status': sub.status,
                'startedAt': sub.started_at.isoformat() if sub.started_at else None,
                'expiresAt': sub.expires_at.isoformat() if sub.expires_at else None,
            }
        except:
            return None


class SignUpSerializer(serializers.Serializer):
    """Serializer for user registration"""
    
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, max_length=128, write_only=True)
    first_name = serializers.CharField(min_length=1, max_length=100, required=False, allow_blank=True)
    last_name = serializers.CharField(min_length=1, max_length=100, required=False, allow_blank=True)
    
    def validate_email(self, value):
        value = value.lower().strip()
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("An account with this email already exists")
        return value
    
    def validate_password(self, value):
        # Check for uppercase, lowercase, and number
        if not re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$', value):
            raise serializers.ValidationError(
                "Password must contain at least 8 characters, including uppercase, lowercase, and a number"
            )
        return value
    
    def create(self, validated_data):
        email = validated_data['email'].lower().strip()
        user = User.objects.create(
            username=email,
            email=email,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=make_password(validated_data['password']),
            role=User.Role.USER,
            status=User.Status.NEW,
        )
        return user


class VerifyEmailSerializer(serializers.Serializer):
    """Serializer for email verification"""
    token = serializers.CharField(min_length=32)


class ResendVerificationSerializer(serializers.Serializer):
    """Serializer for resending verification email"""
    email = serializers.EmailField()


class ForgotPasswordSerializer(serializers.Serializer):
    """Serializer for forgot password request"""
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    """Serializer for password reset"""
    token = serializers.CharField(min_length=32)
    password = serializers.CharField(min_length=8, max_length=128, write_only=True)
    
    def validate_password(self, value):
        if not re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$', value):
            raise serializers.ValidationError(
                "Password must contain at least 8 characters, including uppercase, lowercase, and a number"
            )
        return value


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT token serializer with user info and email verification check"""
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['email'] = user.email
        token['role'] = user.role
        token['name'] = user.display_name
        token['status'] = user.status
        
        return token
    
    def validate(self, attrs):
        # Check if user exists
        email = attrs.get('email', '').lower().strip()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({'detail': 'Invalid email or password'})
        
        # Check if email is verified
        if not user.is_verified:
            raise serializers.ValidationError({
                'detail': 'Please verify your email before logging in',
                'code': 'email_not_verified',
                'email': email
            })
        
        # Check if account is suspended
        if user.status == User.Status.SUSPENDED:
            raise serializers.ValidationError({
                'detail': 'Your account has been suspended. Please contact support.',
                'code': 'account_suspended'
            })
        
        # Continue with normal validation
        data = super().validate(attrs)
        
        # Add extra response data
        data['user'] = {
            'id': str(self.user.id),
            'email': self.user.email,
            'name': self.user.display_name,
            'image': self.user.image,
            'role': self.user.role,
            'status': self.user.status,
        }
        
        return data


class UpdateUserRoleSerializer(serializers.Serializer):
    """Serializer for updating user role"""
    role = serializers.ChoiceField(choices=User.Role.choices)


class UpdateUserStatusSerializer(serializers.Serializer):
    """Serializer for updating user status"""
    status = serializers.ChoiceField(choices=User.Status.choices)


class AdminUserUpdateSerializer(serializers.Serializer):
    """Serializer for admin user updates"""
    role = serializers.ChoiceField(choices=User.Role.choices, required=False)
    status = serializers.ChoiceField(choices=User.Status.choices, required=False)
