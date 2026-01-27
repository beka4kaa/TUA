from django.urls import path
from .views import (
    BillingMeView,
    CreateCheckoutSessionView,
    CreatePortalSessionView,
    StripeWebhookView,
)

urlpatterns = [
    path('billing/me/', BillingMeView.as_view(), name='billing-me'),
    path('billing/create-checkout-session/', CreateCheckoutSessionView.as_view(), name='create-checkout'),
    path('billing/create-portal-session/', CreatePortalSessionView.as_view(), name='create-portal'),
    path('billing/webhook/', StripeWebhookView.as_view(), name='stripe-webhook'),
]
