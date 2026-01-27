from rest_framework import serializers
from .models import Booking
from apps.users.serializers import UserPublicSerializer


class BookingSerializer(serializers.ModelSerializer):
    """Serializer for Booking (camelCase for frontend)"""
    
    user = UserPublicSerializer(read_only=True)
    scheduledDate = serializers.DateField(source='scheduled_date')
    scheduledTime = serializers.TimeField(source='scheduled_time')
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)
    
    class Meta:
        model = Booking
        fields = ['id', 'user', 'scheduledDate', 'scheduledTime', 
                  'duration', 'status', 'notes', 'createdAt', 'updatedAt']
        read_only_fields = ['id', 'user', 'createdAt', 'updatedAt']


class CreateBookingSerializer(serializers.Serializer):
    """Serializer for creating a booking"""
    
    scheduled_date = serializers.DateField()
    scheduled_time = serializers.TimeField()
    duration = serializers.IntegerField(min_value=15, max_value=180, default=60)
    notes = serializers.CharField(max_length=2000, required=False, allow_blank=True)
    
    def validate(self, data):
        """Validate the booking slot is available"""
        from datetime import datetime, date
        
        scheduled_date = data['scheduled_date']
        scheduled_time = data['scheduled_time']
        
        # Check if date is in the past
        if scheduled_date < date.today():
            raise serializers.ValidationError("Cannot book a date in the past")
        
        # Check if date is today and time has passed
        if scheduled_date == date.today():
            now = datetime.now().time()
            if scheduled_time <= now:
                raise serializers.ValidationError("Cannot book a time that has already passed")
        
        # Check if slot is already booked
        existing = Booking.objects.filter(
            scheduled_date=scheduled_date,
            scheduled_time=scheduled_time,
            status__in=['PENDING', 'CONFIRMED']
        ).exists()
        
        if existing:
            raise serializers.ValidationError("This time slot is already booked")
        
        return data


class UpdateBookingSerializer(serializers.Serializer):
    """Serializer for updating a booking"""
    
    status = serializers.ChoiceField(
        choices=['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
        required=False
    )
    notes = serializers.CharField(max_length=2000, required=False, allow_blank=True)
