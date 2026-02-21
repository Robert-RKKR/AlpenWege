"""
Abstract GPX Track Model for Collecting Extended GPX Activity Data
------------------------------------------------------------------

This abstract model extends the Base GPX Model by incorporating
advanced, user-specific GPX activity metrics. It is designed for
handling detailed performance data derived from recorded GPX tracks,
such as heart rate, speed, movement analysis, and environmental
conditions.

Key Features:
- Extends the basic GPX data model with additional activity-related
    statistics (e.g., average speed, heart rate, moving time).
- Stores information about environmental context such as weather
    conditions and temperature.
- Provides enhanced support for performance and endurance tracking.
- Designed to be inherited by models that represent recorded
    user activities or performance-based route data.
"""

# AlpenWegs import:
from alpenwegs.ashared.models.base_model import BaseModel

# Django import:
from django.db import models


# Base GPX model class:
class BaseGpxTrackModel(
    BaseModel,
):
    """
    Abstract base class extending BaseGpxModel to include detailed
    user activity and performance data derived from GPX track files.

    This class provides enhanced metrics such as speed, heart rate,
    and movement-based statistics that reflect a user's actual
    recorded activity on a given route or section.
    """

    class Meta:

        # Model name values:
        verbose_name = 'Base GPX Track Model'
        verbose_name_plural = 'Base GPX Track Models'

        # Abstract class value:
        abstract = True

    # Add Celery task requests for this model:
    model_processing_tasks_request = {
        'alpenwegs.ashared.tasks.model_tasks.gpx_model_track_task.GpxTrackModelTask': 11,
    }

    # Time-related metrics:
    start_time = models.DateTimeField(
        verbose_name='Track Start Time',
        help_text='Marks the exact time when the activity recording '
            'began. This value defines the starting point of the '
            'entire performance timeline.',
        blank=True,
        null=True,
    )
    end_time = models.DateTimeField(
        verbose_name='Track End Time',
        help_text='Marks the exact time when the activity recording '
            'finished. Used to determine total duration and to '
            'close the activity timeline.',
        blank=True,
        null=True,
    )
    duration = models.FloatField(
        verbose_name='Duration',
        help_text='Total recorded time of the activity, measured in hours. '
            'This value is derived from the tracked GPX data and reflects '
            'the actual movement and pauses during the route.',
        blank=True,
        null=True,
    )
    moving_time = models.FloatField(
        verbose_name='Moving Time (hours)',
        help_text='Total accumulated time during which the user was '
            'actively progressing along the route. All pauses and '
            'stationary intervals are excluded from this metric.',
        blank=True,
        null=True,
    )
    total_time = models.FloatField(
        verbose_name='Total Time (hours)',
        help_text='Overall elapsed duration of the activity from start '
            'to end. Includes pauses, waiting periods and all non '
            'moving intervals.',
        blank=True,
        null=True,
    )
    stop_time = models.FloatField(
        verbose_name='Stop Time hours',
        help_text='Total duration of all pauses recorded throughout the '
            'activity. Represents the accumulated period when the '
            'user was stationary.',
        blank=True,
        null=True,
    )

    # Speed metrics:
    average_speed = models.FloatField(
        verbose_name='Average Speed (km/h)',
        help_text='Average traveling speed measured across the full '
            'activity. This value reflects the general pace over '
            'the entire route.',
        blank=True,
        null=True,
    )
    moving_average_speed = models.FloatField(
        verbose_name='Moving Average Speed km/h',
        help_text='Represents the average speed measured only during periods '
            'of recorded movement. Excludes all stop intervals from the '
            'calculation to reflect pure travel speed.',
        blank=True,
        null=True,
    )
    ascent_average_speed = models.FloatField(
        verbose_name='Ascent Average Speed km/h',
        help_text='Represents the average speed achieved during climbing '
            'sections. Useful for analyzing uphill performance and '
            'physical effort in elevation gain.',
        blank=True,
        null=True,
    )
    descent_average_speed = models.FloatField(
        verbose_name='Descent Average Speed km/h',
        help_text='Represents the average speed achieved during descending '
            'sections. Useful for determining control technique and '
            'confidence on steep segments.',
        blank=True,
        null=True,
    )
    maximum_speed = models.FloatField(
        verbose_name='Maximum Speed (km/h)',
        help_text='Highest traveling speed recorded during the activity. '
            'This value identifies the fastest moment captured.',
        blank=True,
        null=True,
    )
    maximum_ascent_speed = models.FloatField(
        verbose_name='Maximum Ascent Speed km/h',
        help_text='Represents the highest recorded climbing speed along the '
            'full activity track. Indicates peak uphill efficiency and '
            'maximum physical performance.',
        blank=True,
        null=True,
    )
    maximum_descent_speed = models.FloatField(
        verbose_name='Maximum Descent Speed km/h',
        help_text='Represents the highest recorded descending speed during '
            'the activity. Highlights the fastest downhill section in '
            'the full tracked route.',
        blank=True,
        null=True,
    )

    # Heart rate metrics:
    average_heart_rate = models.FloatField(
        verbose_name='Average Heart Rate (bpm)',
        help_text='Average heart rate sustained over the full duration '
            'of the activity. Indicates exertion levels and fitness '
            'capacity.',
        blank=True,
        null=True,
    )
    maximum_heart_rate = models.FloatField(
        verbose_name='Maximum Heart Rate (bpm)',
        help_text='Highest measured heart rate recorded during the full '
            'activity. Highlights peak physical strain moments.',
        blank=True,
        null=True,
    )
    minimum_heart_rate = models.FloatField(
        verbose_name='Minimum Heart Rate (bpm)',
        help_text='Lowest measured heart rate captured during the activity. '
            'Useful for evaluating recovery stability.',
        blank=True,
        null=True,
    )

    # Energy and performance:
    calories_burned = models.FloatField(
        verbose_name='Calories Burned (kcal)',
        help_text='Estimated total energy expenditure registered during '
            'the activity. Helps evaluate effort and metabolic load.',
        blank=True,
        null=True,
    )
    steps_count = models.IntegerField(
        verbose_name='Steps Count',
        help_text='Total number of steps taken during the full activity. '
            'This value is available only when step data exists.',
        blank=True,
        null=True,
    )

    # Additional environmental and contextual data:
    weather_conditions = models.CharField(
        verbose_name='Weather Conditions',
        help_text='General description of the surrounding weather observed '
            'during the activity. Examples include sunny stormy or foggy.',
        max_length=256,
        blank=True,
        null=True,
    )
    temperature_average = models.FloatField(
        verbose_name='Average Temperature (°C)',
        help_text='Average ambient temperature recorded throughout the '
            'activity. Helps assess environmental influence on effort.',
        blank=True,
        null=True,
    )
    equipment_used = models.CharField(
        verbose_name='Equipment Used',
        help_text='Optional description of used equipment such as boots or '
            'hiking poles. Useful for determining conditions and load.',
        max_length=512,
        blank=True,
        null=True,
    )

    # Motion and elevation data extensions:
    moving_ratio = models.FloatField(
        verbose_name='Moving Ratio (%)',
        help_text='Rate of time spent moving relative to the full activity. '
            'Indicates how constant the forward movement was.',
        blank=True,
        null=True,
    )
    pace_average = models.FloatField(
        verbose_name='Average Pace (min/km)',
        help_text='Average time needed to cover one kilometer. A lower value '
            'reflects stronger performance in forward progression.',
        blank=True,
        null=True,
    )
    pace_best = models.FloatField(
        verbose_name='Best Pace (min/km)',
        help_text='Fastest pace achieved during any continuous part of the '
            'activity. Marks the strongest recorded performance window.',
        blank=True,
        null=True,
    )
