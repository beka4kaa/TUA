from django.db import models
from apps.users.models import User


class StripeEvent(models.Model):
    """Track processed Stripe events for idempotency"""
    
    event_id = models.CharField(max_length=255, unique=True, db_index=True)
    event_type = models.CharField(max_length=100)
    processed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'stripe_events'
    
    def __str__(self):
        return f"{self.event_type} - {self.event_id}"


class Subscription(models.Model):
    """User subscription with Stripe integration"""
    
    class Tier(models.TextChoices):
        FREE = 'FREE', 'Free'
        PREMIUM = 'PREMIUM', 'Premium'
    
    class StripeStatus(models.TextChoices):
        ACTIVE = 'active', 'Active'
        PAST_DUE = 'past_due', 'Past Due'
        CANCELED = 'canceled', 'Canceled'
        INCOMPLETE = 'incomplete', 'Incomplete'
        INCOMPLETE_EXPIRED = 'incomplete_expired', 'Incomplete Expired'
        TRIALING = 'trialing', 'Trialing'
        UNPAID = 'unpaid', 'Unpaid'
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='subscription')
    tier = models.CharField(max_length=10, choices=Tier.choices, default=Tier.FREE)
    
    # Stripe fields
    stripe_customer_id = models.CharField(max_length=255, unique=True, blank=True, null=True)
    stripe_subscription_id = models.CharField(max_length=255, unique=True, blank=True, null=True)
    stripe_price_id = models.CharField(max_length=255, blank=True, null=True)
    subscription_status = models.CharField(
        max_length=30, 
        choices=StripeStatus.choices, 
        blank=True, 
        null=True
    )
    
    current_period_start = models.DateTimeField(blank=True, null=True)
    current_period_end = models.DateTimeField(blank=True, null=True)
    cancel_at_period_end = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'subscriptions'
        indexes = [
            models.Index(fields=['tier']),
            models.Index(fields=['subscription_status']),
            models.Index(fields=['stripe_customer_id']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.tier}"
    
    @property
    def is_active(self):
        """Check if subscription is actively paid"""
        return self.tier == self.Tier.PREMIUM and self.subscription_status == self.StripeStatus.ACTIVE
    
    @property
    def is_premium(self):
        """Check if user has premium access (active or past_due grace period)"""
        return self.tier == self.Tier.PREMIUM and self.subscription_status in [
            self.StripeStatus.ACTIVE,
            self.StripeStatus.PAST_DUE,
            self.StripeStatus.TRIALING,
        ]
    
    @property
    def booking_limit(self):
        """Monthly booking limits based on subscription tier"""
        limits = {
            self.Tier.FREE: 1,
            self.Tier.PREMIUM: 999,  # Unlimited
        }
        return limits.get(self.tier, 1)
