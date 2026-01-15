# AlpenWegs import:
from alpenwegs.ashared.api.base_exceptions import PermissionAPIException
from alpenwegs.ashared.models.creator_model import BaseCreatorModel
from alpenwegs.ashared.api.mixins.base_mixin import BaseMixin

# AlpenWegs application import:
from profiles.models.user_model import UserModel

# Rest framework import:
from django.core.exceptions import FieldDoesNotExist
from rest_framework.mixins import ListModelMixin
from rest_framework.exceptions import ParseError
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q


class BaseListModelMixin(
    BaseMixin,
    ListModelMixin,
):
    """
    Base model mixin for listing a queryset.
    """

    # Define custom list values:
    allow_list = False

    def _collect_queryset(self):
        """
        Default queryset restriction:
        - If model has `creator` field → restrict to objects created by the user.
        - Otherwise → return all objects.
        """

        # Collect model and user:
        model = self.query_model
        user = self.request.user

        # If model is UserModel return only the user itself:
        if model is UserModel:
            # Check if user is authenticated:
            if not user.is_authenticated:
                # Return empty queryset:
                return model.objects.none()
            # Return only the user object itself:
            return model.objects.filter(pk=user.pk)

        # Check if model is subclass of BaseCreatorModel:
        if issubclass(model, BaseCreatorModel):
            # Check if user is authenticated:
            if not user.is_authenticated:
                # Return only public objects:
                return model.objects.filter(is_public=True)

            # Return objects created by the user or public objects:
            return model.objects.filter(
                Q(is_public=True) | Q(creator=user)
            )

        # If model is not subclass of BaseCreatorModel, raise permission exception:
        raise PermissionAPIException(
            # Raise permission denied exception:
            error_details={
                "error_message": "Model does not support list access.",
                "error_code": "permission_denied",
            }
        )

    def _call_list(self,
        request: Response,
        *args: list,
        **kwargs: dict,
    ) -> Response:

        # Collect all instances:
        queryset = self.filter_queryset(
            self._collect_queryset()
        )
        
        # Prepare page view with pagination:
        page = self.paginate_queryset(queryset)
        if page is not None:
            # If page has been received, serializer it:
            serializer = self._get_serializer(
                page,
                serializer_name='relation',
                many=True
            )
            # Prepare paginated response:
            paginated = self.get_paginated_response(
                serializer.data
            )
            # Return paginated response:
            return paginated
        
        # Prepare page view without pagination:
        serializer = self._get_serializer(
            queryset,
            serializer_name='relation',
            many=True,
        )

        # Return (200 HTTP - Ok) response:
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK,
        )

    def list(self,
        request: Response,
        *args: list,
        **kwargs: dict,
    ) -> Response:


        # Try to collect all instances:
        return self._call_list(
            request=request,
            *args,
            **kwargs,
        )