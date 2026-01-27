import os
import logging
from datetime import datetime

try:
    import stripe
    STRIPE_AVAILABLE = True
except ImportError:
    STRIPE_AVAILABLE = False
    stripe = None

from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Subscription, StripeEvent
from .serializers import SubscriptionSerializer

logger = logging.getLogger(__name__)

# Initialize Stripe (only if available)
if STRIPE_AVAILABLE and stripe:
    stripe.api_key = os.getenv('STRIPE_SECRET_KEY', '')
STRIPE_WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET', '')
STRIPE_PRICE_MONTHLY_ID = os.getenv('STRIPE_PRICE_MONTHLY_ID', '')
APP_URL = os.getenv('APP_URL', 'http://localhost:3000')


def get_or_create_subscription(user):
    """Get or create subscription for user"""
    subscription, created = Subscription.objects.get_or_create(
        user=user,
        defaults={'tier': Subscription.Tier.FREE}
    )
    return subscription


class BillingMeView(APIView):
    """Get current user's billing/subscription info"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        subscription = get_or_create_subscription(request.user)
        serializer = SubscriptionSerializer(subscription)
        return Response(serializer.data)


class CreateCheckoutSessionView(APIView):
    """Create Stripe Checkout session for subscription"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        if not STRIPE_AVAILABLE:
            return Response(
                {'error': 'Stripe is not installed. Run: pip install stripe'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        
        user = request.user
        subscription = get_or_create_subscription(user)
        
        if not STRIPE_PRICE_MONTHLY_ID:
            return Response(
                {'error': 'Stripe price ID not configured'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        try:
            # Create or get Stripe customer
            if not subscription.stripe_customer_id:
                customer = stripe.Customer.create(
                    email=user.email,
                    name=user.display_name,
                    metadata={'user_id': str(user.id)}
                )
                subscription.stripe_customer_id = customer.id
                subscription.save()
            
            # Create checkout session
            checkout_session = stripe.checkout.Session.create(
                customer=subscription.stripe_customer_id,
                mode='subscription',
                line_items=[{
                    'price': STRIPE_PRICE_MONTHLY_ID,
                    'quantity': 1,
                }],
                success_url=f"{APP_URL}/subscription?success=1",
                cancel_url=f"{APP_URL}/subscription?canceled=1",
                metadata={
                    'user_id': str(user.id),
                },
                subscription_data={
                    'metadata': {'user_id': str(user.id)},
                },
            )
            
            return Response({'url': checkout_session.url})
            
        except stripe.error.StripeError as e:
            logger.error(f"Stripe error creating checkout session: {e}")
            return Response(
                {'error': 'Failed to create checkout session'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CreatePortalSessionView(APIView):
    """Create Stripe Customer Portal session"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        if not STRIPE_AVAILABLE:
            return Response(
                {'error': 'Stripe is not installed. Run: pip install stripe'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        
        subscription = get_or_create_subscription(request.user)
        
        if not subscription.stripe_customer_id:
            return Response(
                {'error': 'No active subscription found'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            portal_session = stripe.billing_portal.Session.create(
                customer=subscription.stripe_customer_id,
                return_url=f"{APP_URL}/subscription",
            )
            
            return Response({'url': portal_session.url})
            
        except stripe.error.StripeError as e:
            logger.error(f"Stripe error creating portal session: {e}")
            return Response(
                {'error': 'Failed to create portal session'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(APIView):
    """Handle Stripe webhooks"""
    
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    
    def post(self, request):
        if not STRIPE_AVAILABLE:
            logger.error("Stripe module not available")
            return HttpResponse(status=503)
        
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE', '')
        
        if not STRIPE_WEBHOOK_SECRET:
            logger.error("Stripe webhook secret not configured")
            return HttpResponse(status=400)
        
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            logger.error("Invalid payload")
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError:
            logger.error("Invalid signature")
            return HttpResponse(status=400)
        
        # Check idempotency
        event_id = event.get('id')
        if StripeEvent.objects.filter(event_id=event_id).exists():
            logger.info(f"Event {event_id} already processed, skipping")
            return HttpResponse(status=200)
        
        event_type = event.get('type')
        data = event.get('data', {}).get('object', {})
        
        logger.info(f"Processing Stripe event: {event_type}")
        
        try:
            if event_type == 'checkout.session.completed':
                self._handle_checkout_completed(data)
            elif event_type == 'customer.subscription.created':
                self._handle_subscription_created(data)
            elif event_type == 'customer.subscription.updated':
                self._handle_subscription_updated(data)
            elif event_type == 'customer.subscription.deleted':
                self._handle_subscription_deleted(data)
            elif event_type == 'invoice.paid':
                self._handle_invoice_paid(data)
            elif event_type == 'invoice.payment_failed':
                self._handle_invoice_payment_failed(data)
            else:
                logger.info(f"Unhandled event type: {event_type}")
            
            # Mark event as processed
            StripeEvent.objects.create(
                event_id=event_id,
                event_type=event_type
            )
            
        except Exception as e:
            logger.error(f"Error processing webhook: {e}")
            return HttpResponse(status=500)
        
        return HttpResponse(status=200)
    
    def _get_subscription_by_customer(self, customer_id):
        """Get subscription by Stripe customer ID"""
        try:
            return Subscription.objects.get(stripe_customer_id=customer_id)
        except Subscription.DoesNotExist:
            return None
    
    def _handle_checkout_completed(self, session):
        """Handle checkout.session.completed"""
        customer_id = session.get('customer')
        subscription_id = session.get('subscription')
        
        if not customer_id:
            return
        
        subscription = self._get_subscription_by_customer(customer_id)
        if subscription and subscription_id:
            # Fetch full subscription details from Stripe
            stripe_sub = stripe.Subscription.retrieve(subscription_id)
            
            subscription.stripe_subscription_id = subscription_id
            subscription.subscription_status = stripe_sub.status
            subscription.tier = Subscription.Tier.PREMIUM
            
            if stripe_sub.current_period_start:
                subscription.current_period_start = datetime.fromtimestamp(
                    stripe_sub.current_period_start
                )
            if stripe_sub.current_period_end:
                subscription.current_period_end = datetime.fromtimestamp(
                    stripe_sub.current_period_end
                )
            
            subscription.cancel_at_period_end = stripe_sub.cancel_at_period_end
            subscription.save()
            
            logger.info(f"Checkout completed for user {subscription.user.email}")
    
    def _handle_subscription_created(self, stripe_sub):
        """Handle customer.subscription.created"""
        customer_id = stripe_sub.get('customer')
        subscription = self._get_subscription_by_customer(customer_id)
        
        if subscription:
            subscription.stripe_subscription_id = stripe_sub.get('id')
            subscription.subscription_status = stripe_sub.get('status')
            subscription.tier = Subscription.Tier.PREMIUM
            
            if stripe_sub.get('current_period_start'):
                subscription.current_period_start = datetime.fromtimestamp(
                    stripe_sub['current_period_start']
                )
            if stripe_sub.get('current_period_end'):
                subscription.current_period_end = datetime.fromtimestamp(
                    stripe_sub['current_period_end']
                )
            
            subscription.cancel_at_period_end = stripe_sub.get('cancel_at_period_end', False)
            subscription.save()
            
            logger.info(f"Subscription created for user {subscription.user.email}")
    
    def _handle_subscription_updated(self, stripe_sub):
        """Handle customer.subscription.updated"""
        customer_id = stripe_sub.get('customer')
        subscription = self._get_subscription_by_customer(customer_id)
        
        if subscription:
            subscription.subscription_status = stripe_sub.get('status')
            
            if stripe_sub.get('current_period_start'):
                subscription.current_period_start = datetime.fromtimestamp(
                    stripe_sub['current_period_start']
                )
            if stripe_sub.get('current_period_end'):
                subscription.current_period_end = datetime.fromtimestamp(
                    stripe_sub['current_period_end']
                )
            
            subscription.cancel_at_period_end = stripe_sub.get('cancel_at_period_end', False)
            
            # If subscription is canceled/expired, revert to FREE
            if stripe_sub.get('status') in ['canceled', 'unpaid', 'incomplete_expired']:
                subscription.tier = Subscription.Tier.FREE
            
            subscription.save()
            
            logger.info(f"Subscription updated for user {subscription.user.email}")
    
    def _handle_subscription_deleted(self, stripe_sub):
        """Handle customer.subscription.deleted"""
        customer_id = stripe_sub.get('customer')
        subscription = self._get_subscription_by_customer(customer_id)
        
        if subscription:
            subscription.tier = Subscription.Tier.FREE
            subscription.subscription_status = 'canceled'
            subscription.stripe_subscription_id = None
            subscription.current_period_start = None
            subscription.current_period_end = None
            subscription.cancel_at_period_end = False
            subscription.save()
            
            logger.info(f"Subscription deleted for user {subscription.user.email}")
    
    def _handle_invoice_paid(self, invoice):
        """Handle invoice.paid"""
        customer_id = invoice.get('customer')
        subscription = self._get_subscription_by_customer(customer_id)
        
        if subscription:
            subscription.tier = Subscription.Tier.PREMIUM
            subscription.subscription_status = 'active'
            subscription.save()
            
            logger.info(f"Invoice paid for user {subscription.user.email}")
    
    def _handle_invoice_payment_failed(self, invoice):
        """Handle invoice.payment_failed"""
        customer_id = invoice.get('customer')
        subscription = self._get_subscription_by_customer(customer_id)
        
        if subscription:
            subscription.subscription_status = 'past_due'
            subscription.save()
            
            logger.info(f"Payment failed for user {subscription.user.email}")

