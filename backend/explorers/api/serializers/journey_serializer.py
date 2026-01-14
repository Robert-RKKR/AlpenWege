# AlpenWegs import:
from alpenwegs.ashared.api.serializers.base_serializers import (
    SerializedPkRelatedField,
    WritableNestedSerializer,
    BaseSerializer,
)
from alpenwegs.ashared.api.serializers.base_model_variables import (
    base_identification_read_only_fields,
    base_sport_category_read_only_fields,
    base_statistic_read_only_fields,
    base_timestamp_read_only_fields,
    base_multi_day_read_only_fields,
    base_creator_read_only_fields,
    base_model_read_only_fields,
    base_score_read_only_fields,
    base_identification_fields,
    base_representation_fields,
    base_sport_category_fields,
    base_statistic_fields,
    base_timestamp_fields,
    base_multi_day_fields,
    base_creator_fields,
    base_model_fields,
    base_score_fields,
)

# AlpenWegs application import:
from alpenwegs.ashared.constants.accommodation_type import AccommodationTypeChoices
from explorers.api.serializers.trip_serializer import TripRelationSerializer
from profiles.api.serializers.user_serializer import UserRelationSerializer
from explorers.models.journey_model import JourneyModel

# Rest framework import:
from rest_framework.serializers import HyperlinkedIdentityField
from rest_framework import serializers


# Journey Model serializer details:
model = JourneyModel
depth = 0

# Journey Model serializer fields:
journey_fields = [
    'trip',
]

# Journey model serializer combined fields:
fields = (
    base_model_fields
    + base_identification_fields
    + base_sport_category_fields
    + base_timestamp_fields
    + base_multi_day_fields
    + base_statistic_fields
    + base_creator_fields
    + base_score_fields
    + journey_fields
)
read_only_fields = (
    base_model_read_only_fields
    + base_identification_read_only_fields
    + base_sport_category_read_only_fields
    + base_statistic_read_only_fields
    + base_timestamp_read_only_fields
    + base_multi_day_read_only_fields
    + base_creator_read_only_fields
    + base_score_read_only_fields
)


# Journey Detailed serializer:
class JourneyDetailedSerializer(
    BaseSerializer,
):
    """
    Detailed serializer for the Journey model. Includes all fields
    of the model together with serializers for related models.

    Used for standard API actions such as create, list, retrieve,
    update, and delete, whenever complete details of a Journey object
    are required.
    """

    url = HyperlinkedIdentityField(
        view_name='api-explorers:journey_model-detail',
        help_text='URL to provided object.',
        read_only=True,
    )

    class Meta:
        read_only_fields = read_only_fields
        fields = fields
        model = model
        depth = depth

    # Other object relation schemas:
    creator = UserRelationSerializer(
        help_text=JourneyModel.creator.field.help_text,
        required=JourneyModel.creator.field.null,
        allow_null=JourneyModel.creator.field.blank,
    )
    trip = TripRelationSerializer(
        help_text=JourneyModel.trip.field.help_text,
        required=JourneyModel.trip.field.null,
        allow_null=JourneyModel.trip.field.blank,
    )

    # Special constance fields:
    accommodation = serializers.SerializerMethodField()

    # Special constance methods:
    def get_accommodation(self, obj):
        # Return metadata dict for country:
        return AccommodationTypeChoices.dict_from_int(
            obj.accommodation
        )


# Journey Representation serializer:
class JourneyRepresentationSerializer(
    BaseSerializer,
):
    """
    Representation serializer for the Journey model. Includes only the fields
    necessary for representing a Journey object in API responses.

    Used for standard API actions such as list and retrieve, whenever
    a simplified representation of a Journey object is sufficient.
    """

    # Default model URL field with hyperlink to retrieve view:
    url = HyperlinkedIdentityField(
        view_name='api-explorers:journey_model-detail',
        help_text='URL to provided object.',
        read_only=True,
    )

    class Meta:

        # Define read only fields:
        read_only_fields = base_representation_fields

        # Define writable fields:
        fields = base_representation_fields

        # Define related model:
        model = model

        # Define model depth:
        depth = depth


# Journey relation serializer:
class JourneyRelationSerializer(
    WritableNestedSerializer,
):
    """
    Relation serializer for the Journey model. Includes all fields of
    the Journey model but represents related objects in a simplified form.

    Intended for use in other model serializers when only the relation
    to the Journey model is needed, not its full details.
    """

    url = HyperlinkedIdentityField(
        view_name='api-explorers:journey_model-detail',
        help_text='URL to provided object.',
        read_only=True,
    )

    # Special constance fields:
    accommodation = serializers.SerializerMethodField()

    # Special constance methods:
    def get_accommodation(self, obj):
        # Return metadata dict for country:
        return AccommodationTypeChoices.dict_from_int(
            obj.accommodation
        )

    class Meta:
        read_only_fields = read_only_fields
        fields = fields
        model = model
        depth = depth
