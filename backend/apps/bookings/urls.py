from django.urls import path
from .views import BookingListCreateView, BookingDetailView, BookedSlotsView

urlpatterns = [
    path('bookings/', BookingListCreateView.as_view(), name='booking-list'),
    path('bookings/<int:pk>/', BookingDetailView.as_view(), name='booking-detail'),
    path('bookings/slots/', BookedSlotsView.as_view(), name='booked-slots'),
]
