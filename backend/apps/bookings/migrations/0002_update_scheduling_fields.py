from django.db import migrations, models
from django.utils import timezone
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0001_initial'),
    ]

    operations = [
        # Step 1: Add new fields first
        migrations.AddField(
            model_name='booking',
            name='scheduled_date',
            field=models.DateField(default=timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='booking',
            name='scheduled_time',
            field=models.TimeField(default=datetime.time(10, 0)),
            preserve_default=False,
        ),
        
        # Step 2: Remove index BEFORE removing the column it references (SQLite requirement)
        migrations.RemoveIndex(
            model_name='booking',
            name='bookings_schedul_1c3c17_idx',
        ),
        
        # Step 3: Remove old fields
        migrations.RemoveField(
            model_name='booking',
            name='scheduled_at',
        ),
        migrations.RemoveField(
            model_name='booking',
            name='title',
        ),
        migrations.RemoveField(
            model_name='booking',
            name='description',
        ),
        
        # Step 4: Add new index
        migrations.AddIndex(
            model_name='booking',
            index=models.Index(fields=['scheduled_date'], name='bookings_schedul_d9a23d_idx'),
        ),
        
        # Step 5: Add unique constraint and update meta
        migrations.AlterUniqueTogether(
            name='booking',
            unique_together={('scheduled_date', 'scheduled_time')},
        ),
        migrations.AlterModelOptions(
            name='booking',
            options={'ordering': ['-scheduled_date', '-scheduled_time']},
        ),
    ]
