from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


class User(AbstractUser):
    """Custom User model with roles, status, and email verification support"""
    
    class Role(models.TextChoices):
        USER = 'USER', 'User'
        MEMBER = 'MEMBER', 'Member'
        ADMIN = 'ADMIN', 'Admin'
    
    class Status(models.TextChoices):
        NEW = 'NEW', 'New'
        ACTIVE = 'ACTIVE', 'Active'
        SUSPENDED = 'SUSPENDED', 'Suspended'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    image = models.URLField(blank=True, null=True)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.USER)
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.NEW)
    email_verified = models.DateTimeField(blank=True, null=True)
    last_login_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Email verification fields
    verification_token = models.CharField(max_length=255, blank=True, null=True)
    verification_expires = models.DateTimeField(blank=True, null=True)
    
    # Password reset fields
    reset_token = models.CharField(max_length=255, blank=True, null=True)
    reset_expires = models.DateTimeField(blank=True, null=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return self.email
    
    @property
    def is_verified(self):
        return self.email_verified is not None
    
    @property
    def display_name(self):
        if self.first_name:
            return f"{self.first_name} {self.last_name}".strip()
        return self.email.split('@')[0]


class Account(models.Model):
    """OAuth account for external providers (Google, etc.)"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='accounts')
    type = models.CharField(max_length=50)
    provider = models.CharField(max_length=50)
    provider_account_id = models.CharField(max_length=255)
    refresh_token = models.TextField(blank=True, null=True)
    access_token = models.TextField(blank=True, null=True)
    expires_at = models.IntegerField(blank=True, null=True)
    token_type = models.CharField(max_length=50, blank=True, null=True)
    scope = models.CharField(max_length=255, blank=True, null=True)
    id_token = models.TextField(blank=True, null=True)
    session_state = models.CharField(max_length=255, blank=True, null=True)
    
    class Meta:
        db_table = 'accounts'
        unique_together = ['provider', 'provider_account_id']
        indexes = [
            models.Index(fields=['user']),
        ]


class VerificationToken(models.Model):
    """Email verification tokens"""
    
    identifier = models.CharField(max_length=255)
    token = models.CharField(max_length=255, unique=True)
    expires = models.DateTimeField()
    
    class Meta:
        db_table = 'verification_tokens'
        unique_together = ['identifier', 'token']
