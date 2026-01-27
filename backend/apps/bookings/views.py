from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from datetime import timedelta, datetime

from .models import Booking
from .serializers import BookingSerializer, CreateBookingSerializer, UpdateBookingSerializer
from core.pagination import StandardPagination


class BookedSlotsView(APIView):
    """Return all booked slots for availability display (public, no auth required)"""
    
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        # Optional date filter
        date_from = request.query_params.get('from')
        date_to = request.query_params.get('to')
        
        # Get all non-cancelled bookings
        queryset = Booking.objects.filter(
            status__in=['PENDING', 'CONFIRMED']
        )
        
        # Filter by date range if provided
        if date_from:
            try:
                from_date = datetime.strptime(date_from, '%Y-%m-%d').date()
                queryset = queryset.filter(scheduled_date__gte=from_date)
            except ValueError:
                pass
        
        if date_to:
            try:
                to_date = datetime.strptime(date_to, '%Y-%m-%d').date()
                queryset = queryset.filter(scheduled_date__lte=to_date)
            except ValueError:
                pass
        
        # Return list of booked slots (date + time)
        slots = list(queryset.values_list('scheduled_date', 'scheduled_time'))
        
        # Format as list of "YYYY-MM-DD_HH:MM"
        booked_slots = [
            f"{date.isoformat()}_{time.strftime('%H:%M')}"
            for date, time in slots
        ]
        
        return Response({'bookedSlots': booked_slots})


class BookingListCreateView(generics.ListCreateAPIView):
    """List bookings or create a new one"""
    
    serializer_class = BookingSerializer
    pagination_class = StandardPagination
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Admin sees all bookings, users see only their own
        if self.request.user.role == 'admin':
            return Booking.objects.all().select_related('user')
        return Booking.objects.filter(user=self.request.user).select_related('user')
    
    def create(self, request, *args, **kwargs):
        # Validate data
        serializer = CreateBookingSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Validation failed', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        data = serializer.validated_data
        
        # Create booking
        booking = Booking.objects.create(
            user=request.user,
            scheduled_date=data['scheduled_date'],
            scheduled_time=data['scheduled_time'],
            duration=data.get('duration', 60),
            notes=data.get('notes', ''),
        )
        
        return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)


class BookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a booking"""
    
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Admin can access all, users only their own
        if self.request.user.role == 'admin':
            return Booking.objects.all()
        return Booking.objects.filter(user=self.request.user)
    
    def update(self, request, *args, **kwargs):
        booking = self.get_object()
        
        # Only admin can update status and notes
        if request.user.role != 'admin':
            # Users can only update if booking is pending
            if booking.status != 'PENDING':
                return Response(
                    {'error': 'Cannot modify confirmed booking'},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        serializer = UpdateBookingSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Validation failed', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        data = serializer.validated_data
        
        if 'status' in data and request.user.role == 'admin':
            booking.status = data['status']
        if 'notes' in data and request.user.role == 'admin':
            booking.notes = data['notes']
        
        booking.save()
        
        return Response(BookingSerializer(booking).data)
    
    def destroy(self, request, *args, **kwargs):
        booking = self.get_object()
        
        # Users can only cancel pending bookings
        if request.user.role != 'admin' and booking.status != 'PENDING':
            return Response(
                {'error': 'Cannot cancel confirmed booking'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if request.user.role == 'admin':
            booking.delete()
        else:
            # Soft delete for users - mark as cancelled
            booking.status = 'CANCELLED'
            booking.save()
        
        return Response({'success': True}, status=status.HTTP_200_OK)
