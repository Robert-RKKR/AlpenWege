# Rest framework import:
from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers

# AlpenWegs application imports:
from profiles.models.user_model import UserModel

# Django import:
from django.contrib.auth.models import Group


# User registration serializer class:
class UserRegisterSerializer(
    RegisterSerializer,
):

    _has_phone_field = False
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    def validate_email(self,
        value,
    ):
        """
        Ensure email is unique before hitting the database.
        Case-insensitive check.
        """

        # Check if email already exists:
        if UserModel.objects.filter(email__iexact=value).exists():
            # If mail exists, raise validation error:
            raise serializers.ValidationError(
                f'The email address \'{value}\' is already in use by a '
                'other user. Please verify provided email address or '
                'log in with your existing account.'
            )
        
        # If email is unique, return it:
        return value

    def validate_username(self, value):
        """
        Ensure username is unique before hitting the database.
        Case-insensitive check.
        """

        # Check if username already exists:
        if UserModel.objects.filter(username__iexact=value).exists():
            # If username exists, raise validation error:
            raise serializers.ValidationError(
                f'The user with username \'{value}\' already exists. '
                'Please provide a different username.'
            )
        
        # If username is unique, return it:
        return value

    def custom_signup(self,
        request,
        user,
    ):
        """
        Called after user is created. We can add extra fields here.
        """

        # Set extra fields:
        user.first_name = self.validated_data.get('first_name', '')
        user.last_name = self.validated_data.get('last_name', '')
        user.save(update_fields=['first_name', 'last_name'])

        # Assign user to Members group:
        members_group, _ = Group.objects.get_or_create(name="Member")
        user.groups.add(members_group)

        # Return user:
        return user
