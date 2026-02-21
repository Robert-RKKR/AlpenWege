# Application import:
from alpenwegs.ashared.models.timestamp_model import BaseTimestampModel
from alpenwegs.ashared.constants.gender_type import GenderTypeChoices

# Component import:
from profiles.managers.user_manager import UserProfileManager

# Django import:
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import AbstractBaseUser
from django.db.models.functions import Lower
from django.db.models import Q
from django.db import models


# User model class:
class UserModel(
    BaseTimestampModel,
    AbstractBaseUser,
    PermissionsMixin,
):

    class Meta:

        # Model name values:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

        # Model constraints:
        constraints = [
            models.UniqueConstraint(
                Lower('email'),
                name='uniq_user_email_lower',
            ),
            models.CheckConstraint(
                condition=Q(height__isnull=True) | Q(height__gt=0),
                name='height_gt_zero_or_null',
            ),
            models.CheckConstraint(
                condition=Q(weight__isnull=True) | Q(weight__gt=0),
                name='weight_gt_zero_or_null',
            ),
        ]

        # Add custom AlpenWegs permissions:
        permissions = [
            ('change_own_usermodel', 'Can change own users'),
            ('change_all_usermodel', 'Can change all users'),
            ('delete_own_usermodel', 'Can delete own users'),
            ('delete_all_usermodel', 'Can delete all users'),
            ('view_own_usermodel', 'Can view own users'),
            ('view_all_usermodel', 'Can view all users'),
            ('add_own_usermodel', 'Can add own users'),
        ]

    # Default roles and their permissions:
    ROLE_PERMS = {
        'Member': [
            'change_own',
            'delete_own',
            'view_own',
            'add_own'
        ],
        'Author': [
            'change_own',
            'delete_own',
            'view_own',
            'add_own'
        ],
        'Admin':  [
            'change_all',
            'change_own',
            'delete_all',
            'delete_own',
            'view_all',
            'view_own',
            'add_own',
        ],
    }

    # Model objects manager:
    objects = UserProfileManager()

    # Required User fields:
    is_active = models.BooleanField(
        verbose_name='Is Active',
        help_text='Indicates whether the user account is active.',
        default=True,
    )
    is_staff = models.BooleanField(
        verbose_name='Is Staff',
        help_text='Indicates whether the user has staff privileges.',
        default=False,
    )

    # Base User identification information:
    email = models.EmailField(
        verbose_name='E-mail address',
        help_text='The user\'s unique email address, which serves as the '
            'primary authentication credential and unique identifier '
            'within the system. This email is required for logging in, '
            'password recovery, and receiving notifications or updates. '
            'Each email must be unique to ensure proper identification '
            'and prevent duplication of accounts.',
        max_length=128,
        unique=True,
    )
    username = models.CharField(
        verbose_name='Username',
        help_text=('A display name used to represent the user\'s in public '
            'views, comments, messages, and other interactions. This is not the '
            'user\'s official account name or login credential, but rather '
            'a presentation-friendly alias that helps protect the user\'s '
            'real name when preferred.'
        ),
        max_length=64,
        blank=False,
        unique=True,
        null=False,
    )
    first_name = models.CharField(
        verbose_name='First Name',
        help_text='The user\'s given name, used for personalized '
            'communication. This field is required for proper user '
            'identification. It helps in addressing the user in messages, '
            'emails, and other interactions within the system.',
        max_length=64,
        blank=False,
        null=False,
    )
    middle_name = models.CharField(
        verbose_name='Middle Name',
        help_text='An optional middle name field for users who have '
            'multiple given names. This can provide more precise '
            'identification but is not mandatory.',
        max_length=64,
        blank=True,
        null=True,
    )
    last_name = models.CharField(
        verbose_name='Last Name',
        help_text='The user\'s surname name, used for personalized '
            'communication. This field is required for proper user '
            'identification. It helps in addressing the user in messages, '
            'emails, and other interactions within the system.',
        max_length=64,
        blank=False,
        null=False,
    )

    # Password information:
    password_to_change = models.BooleanField(
        verbose_name='Password change required',
        help_text='Indicates whether the user must change their '
            'password upon next login. This is typically set after an '
            'initial account setup or password reset to enhance '
            'security and ensure the user has set a personalized password.',
        default=False,
    )

    # Contact information:
    phone_number = models.BigIntegerField(
        verbose_name='Phone number',
        help_text='User\'s phone number. It can be used for '
            'communication purposes such as account recovery or '
            'urgent notifications. This field is optional.',
        null=True,
        blank=True
    )

    # Personal information:
    gender = models.IntegerField(
        verbose_name='Gender',
        help_text='User\'s gender. This field can be used to '
            'personalize the user experience and address the '
            'user properly. It is optional.',
        choices=GenderTypeChoices.choices,
        blank=True,
        null=True,
    )
    weight = models.FloatField(
        verbose_name='Weight',
        help_text='User\'s weight in kilograms. This can be '
            'used to track health data or fitness goals. '
            'This field is optional.',
        blank=True,
        null=True,
    )
    height = models.FloatField(
        verbose_name='Height',
        help_text='User\'s height in centimeters. This '
            'can be used to track health data or fitness goals. '
            'This field is optional.',
        blank=True,
        null=True,
    )
    bmi = models.FloatField(
        verbose_name='BMI',
        help_text='User\'s Body Mass Index (BMI). It is '
            'calculated using the user\'s weight and height. '
            'This field is optional.',
        blank=True,
        null=True,
    )
    birthday = models.DateTimeField(
        verbose_name='Birthday',
        help_text='User\'s birthdate. This can be used to '
            'calculate the user\'s age or personalize content.'
            'This field is optional.',
        blank=True,
        null=True,
    )

    # Location information:
    location = models.CharField(
        verbose_name='Location',
        help_text='User\'s geographic location, which '
            'could be used for personalization or for tracking '
            'user activity. This field is optional.',
        max_length=128,
        blank=True,
        null=True,
    )
    location_name = models.CharField(
        verbose_name='Location Name',
        help_text='User\'s location name, such as city, '
            'town, or landmark. This field provides additional '
            'context to the user\'s geographical location and '
            'can help personalize their experience.',
        max_length=128,
        blank=True,
        null=True,
    )

    #=================================================================
    # Django User related static variables:
    #=================================================================
    REQUIRED_FIELDS = ['first_name', 'last_name', 'username']
    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'

    #=================================================================
    # Object data collection:
    #=================================================================
    def get_full_name(self) -> str:
        """
        Collect full user name representation.
        """

        # Collect user first, middel and last name:
        parts = [self.first_name, self.middle_name or '', self.last_name]
        # Return full user name representation:
        return ' '.join(p for p in parts if p).strip()

    def get_short_name(self) -> str:
        """
        Collect user short name representation.
        """

        # Return user short name representation:
        return self.first_name + ' ' + self.last_name

    #=================================================================
    # Object additional methods:
    #=================================================================
    def set_password(self, raw_password):
        """
        Set the password and clear 'password_to_change'.
        """

        self.password_to_change = False
        super().set_password(raw_password)

    #=================================================================
    # Object calculations:
    #=================================================================
    def _compute_bmi(self):
        """
        Calculate BMI based on user weight and height.
        """

        # Check if required data has been provided:
        if not self.height or not self.weight: return None
        # Calculate height for BMI calculation:
        h = self.height / 100.0
        # Calculate and return BMI value:
        return round(self.weight / (h*h), 1) if h > 0 else None
    
    def _lower_case_unique(self):
        """
        Lowercase email and username for uniqueness checks.
        """

        # Lowercase email and username for uniqueness checks:
        self.email = self.email.lower()
        self.username = self.username.lower()

    def run_before_save(self):
        """
        Run additional logic before saving model object to DB.
        """

        # Calculate BMI before saving model object:
        self.bmi_value = self._compute_bmi()
        # Lowercase email and username for uniqueness checks:
        self._lower_case_unique()

    #=================================================================
    # Object representation:
    #=================================================================
    def representation(self):
        """
        Collect user object representation:
        """

        # Return user object representation:
        return self.username
