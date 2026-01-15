"""
Abstract Base Model for Ownership and Visibility
-------------------------------------------------

This abstract model serves as a foundation for tracking the ownership 
of objects within the system. It ensures that each object is linked 
to a creator (a registered member) and includes an `is_public` flag 
to control its visibility.
"""

# AlpenWegs import:
from alpenwegs.ashared.models.base_model import BaseModel
from profiles.models.user_model import UserModel

# Django import:
from django.db.models import Q
from django.db import models


# Base Creator models class:
class BaseCreatorModel(
    BaseModel, 
):
    """
    An abstract base model for tracking object ownership and visibility.

    This model provides a `creator` field to associate each object 
    with the user who created it, enabling ownership tracking. It 
    also includes an `is_public` field to control whether the object 
    is accessible to other users.

    Intended to be inherited by models that require:
    - Ownership tracking via a foreign key to the user model.
    - A visibility flag to define public or private access.
    """

    class Meta:

        # Model name values:
        verbose_name = 'Base Creator Model'
        verbose_name_plural = 'Base Creator Models'

        # Abstract class value:
        abstract = True

        # Database indexes:
        indexes = [
            models.Index(fields=["is_public"]),
            models.Index(fields=["creator"]),
            models.Index(fields=["creator", "is_public"]),
        ]

    # Creator model values:
    creator = models.ForeignKey(
        UserModel,
        on_delete=models.CASCADE,
        verbose_name='Creator',
        help_text='Stores the unique identifier (UUID) of '
            'the user who created the object. This field is '
            'used to track ownership of the object.'
    )
    is_public = models.BooleanField(
        verbose_name='Is Public',
        help_text='Indicates whether the object is publicly '
            'accessible (True) or private (False). If set to True, '
            'the object will be visible to all users and guests.',
        default=True,
    )

# Conditional index for public objects:
creator_object_index = models.Index(
    fields=['is_public', 'id'],
    condition=Q(is_public=True),
    name="%(class)s_public_idx",
)
