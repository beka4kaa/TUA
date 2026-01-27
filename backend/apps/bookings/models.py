from django.db import models
from apps.users.models import User


class Booking(models.Model):
    """Consultation booking"""
    
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        CONFIRMED = 'CONFIRMED', 'Confirmed'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    scheduled_date = models.DateField()
    scheduled_time = models.TimeField()
    duration = models.IntegerField(default=60)  # Duration in minutes
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.PENDING)
    notes = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'bookings'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['scheduled_date']),
            models.Index(fields=['status']),
        ]
        ordering = ['-scheduled_date', '-scheduled_time']
        # Prevent double bookings for same slot
        unique_together = ['scheduled_date', 'scheduled_time']
    
    def __str__(self):
        return f"{self.user.email} - {self.scheduled_date} {self.scheduled_time}"
