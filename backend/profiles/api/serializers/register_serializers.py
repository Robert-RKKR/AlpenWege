# Django import:
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model

# dj-rest-auth import:
from dj_rest_auth.registration.serializers import RegisterSerializer

# Rest framework import:
from rest_framework import serializers

# AlpenWegs application import:
UserModel = get_user_model()


class UserRegisterSerializer(RegisterSerializer):
    """
    Custom AlpenWegs registration serializer.

    Automatically assigns newly created users
    to the 'Members' group.
    """

    # Optional: if you want to expose extra fields during registration
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)

    class Meta:
        model = UserModel
        fields = (
            "username",
            "email",
            "password1",
            "password2",
            "first_name",
            "last_name",
        )

    def save(self, request):
        user = super().save(request)

        # Assign to Members group
        members_group, _ = Group.objects.get_or_create(name="Members")
        user.groups.add(members_group)

        return user
