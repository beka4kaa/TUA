from rest_framework import serializers
from .models import Subscription


class SubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for Subscription (camelCase for frontend)"""
    
    currentPeriodEnd = serializers.DateTimeField(source='current_period_end', read_only=True)
    currentPeriodStart = serializers.DateTimeField(source='current_period_start', read_only=True)
    cancelAtPeriodEnd = serializers.BooleanField(source='cancel_at_period_end', read_only=True)
    subscriptionStatus = serializers.CharField(source='subscription_status', read_only=True)
    stripeCustomerId = serializers.CharField(source='stripe_customer_id', read_only=True)
    isActive = serializers.BooleanField(source='is_active', read_only=True)
    isPremium = serializers.BooleanField(source='is_premium', read_only=True)
    
    class Meta:
        model = Subscription
        fields = [
            'id', 'tier', 'subscriptionStatus', 'currentPeriodStart', 
            'currentPeriodEnd', 'cancelAtPeriodEnd', 'stripeCustomerId',
            'isActive', 'isPremium',
        ]
        read_only_fields = fields


class CheckoutSessionResponseSerializer(serializers.Serializer):
    """Response for checkout session creation"""
    url = serializers.URLField()


class PortalSessionResponseSerializer(serializers.Serializer):
    """Response for portal session creation"""
    url = serializers.URLField()

