# AlpenWegs import:
from alpenwegs.ashared.api.serializers.base_serializers import (
    SerializedPkRelatedField,
    WritableNestedSerializer,
    BaseSerializer,
)
from alpenwegs.ashared.api.serializers.base_model_variables import (
    base_identification_read_only_fields,
    base_sport_category_read_only_fields,
    base_characteristic_read_only_fields,
    base_descriptive_read_only_fields,
    base_timestamp_read_only_fields,
    base_creator_read_only_fields,
    base_model_read_only_fields,
    base_identification_fields,
    base_representation_fields,
    base_characteristic_fields,
    base_sport_category_fields,
    base_gpx_read_only_fields,
    base_descriptive_fields,
    base_timestamp_fields,
    base_creator_fields,
    base_model_fields,
    base_gpx_fields,
)

# AlpenWegs application import:
from alpenwegs.ashared.constants.sport_category_difficulty import SportCategoryDifficultyChoices
from compendiums.api.serializers.region_serializer import RegionRelationSerializer
from compendiums.api.serializers.poi_serializer import PoiRelationSerializer
from profiles.api.serializers.user_serializer import UserRelationSerializer
from assets.api.serializers.photo_serializer import PhotoRelationSerializer
from alpenwegs.ashared.constants.sport_category import SportCategoryChoices
from alpenwegs.ashared.constants.season_category import SeasonChoices
from alpenwegs.ashared.constants.season_category import MonthChoices
from explorers.models.section_model import SectionModel
from compendiums.models.region_model import RegionModel
from compendiums.models.poi_model import PoiModel
from assets.models.photo_model import PhotoModel

# Rest framework import:
from rest_framework.serializers import HyperlinkedIdentityField
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers


# Section Model serializer details:
model = SectionModel
depth = 0

# Section Model serializer fields:
section_fields = [
    'start_poi',
    'regions',
    'end_poi',
    'photos',
    'pois',
]
section_gpx_fields = [
    'url',
    'name',
    'snippet',
    'is_public',
    'gpx_data',
]

# Section model serializer combined fields:
fields = (
    base_model_fields
    + base_characteristic_fields
    + base_identification_fields
    + base_sport_category_fields
    + base_descriptive_fields
    + base_timestamp_fields
    + base_creator_fields
    + base_gpx_fields
    + section_fields
)
read_only_fields = (
    base_model_read_only_fields
    + base_identification_read_only_fields
    + base_characteristic_read_only_fields
    + base_sport_category_read_only_fields
    + base_descriptive_read_only_fields
    + base_timestamp_read_only_fields
    + base_creator_read_only_fields
    + base_gpx_read_only_fields
)
gpx_fields = (
    section_gpx_fields
    + base_characteristic_fields
    + base_sport_category_fields
    + base_descriptive_fields
    + section_fields
)
gpx_read_only_fields = [
    'url',
]


# Section Detailed serializer:
class SectionDetailedSerializer(
    BaseSerializer,
):
    """
    Detailed serializer for the Section model. Includes all fields
    of the model together with serializers for related models.

    Used for standard API actions such as create, list, retrieve,
    update, and delete, whenever complete details of a Section object
    are required.
    """

    url = HyperlinkedIdentityField(
        view_name='api-explorers:section_model-detail',
        help_text='URL to provided object.',
        read_only=True,
    )

    # Other object relation schemas:
    creator = UserRelationSerializer(
        help_text=SectionModel.creator.field.help_text,
        required=SectionModel.creator.field.null,
        allow_null=SectionModel.creator.field.blank,
    )

    # Other object Many to Many relation schemas:
    photos = SerializedPkRelatedField(
        queryset=PhotoModel.objects.all(),
        serializer=PhotoRelationSerializer,
        required=False,
        allow_null=True,
        many=True,
    )
    regions = SerializedPkRelatedField(
        queryset=RegionModel.objects.all(),
        serializer=RegionRelationSerializer,
        required=False,
        allow_null=True,
        many=True,
    )
    pois = SerializedPkRelatedField(
        queryset=PoiModel.objects.all(),
        serializer=PoiRelationSerializer,
        required=False,
        allow_null=True,
        many=True,
    )

    # Other object relation schemas:
    start_poi = PoiRelationSerializer(
        help_text=SectionModel.start_poi.field.help_text,
        required=SectionModel.start_poi.field.null,
        allow_null=SectionModel.start_poi.field.blank,
    )
    end_poi = PoiRelationSerializer(
        help_text=SectionModel.end_poi.field.help_text,
        required=SectionModel.end_poi.field.null,
        allow_null=SectionModel.end_poi.field.blank,
    )

    # Special constance fields:
    category_specific_difficulty = serializers.SerializerMethodField()
    best_seasons = serializers.SerializerMethodField()
    best_months = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()

    # Special constance methods:
    def get_category_specific_difficulty(self, obj):
        # Return metadata dict for country:
        return SportCategoryDifficultyChoices.dict_from_int(
            obj.category_specific_difficulty
        )

    def get_best_seasons(self, obj):
        # Return metadata dict for country:
        return SeasonChoices.dict_from_int(
            obj.best_seasons
        )
    
    def get_best_months(self, obj):
        # Return metadata dict for country:
        return MonthChoices.dict_from_int(
            obj.best_months
        )
    
    def get_category(self, obj):
        # Return metadata dict for country:
        return SportCategoryChoices.dict_from_int(
            obj.category
        )

    class Meta:
        read_only_fields = read_only_fields
        fields = fields
        model = model
        depth = depth


# Section Representation serializer:
class SectionRepresentationSerializer(
    BaseSerializer,
):
    """
    Representation serializer for the Section model. Includes only the fields
    necessary for representing a Section object in API responses.

    Used for standard API actions such as list and retrieve, whenever
    a simplified representation of a Section object is sufficient.
    """

    # Default model URL field with hyperlink to retrieve view:
    url = HyperlinkedIdentityField(
        view_name='api-explorers:section_model-detail',
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


# Section relation serializer:
class SectionRelationSerializer(
    WritableNestedSerializer,
):
    """
    Relation serializer for the Section model. Includes all fields of
    the Section model but represents related objects in a simplified form.

    Intended for use in other model serializers when only the relation
    to the Section model is needed, not its full details.
    """

    url = HyperlinkedIdentityField(
        view_name='api-explorers:section_model-detail',
        help_text='URL to provided object.',
        read_only=True,
    )

    @extend_schema_field({
        "type": "object",
        "properties": {
            "lat": {"type": "number"},
            "lng": {"type": "number"},
        },
    })
    def get_location(self, obj):
        if not obj.location:
            return None
        return {
            "lat": obj.location.y,
            "lng": obj.location.x,
        }

    class Meta:
        read_only_fields = read_only_fields
        fields = fields
        model = model
        depth = depth


# Section GPX serializer:
class SectionGpxSerializer(
    BaseSerializer,
):
    """
    """

    # Default model URL field with hyperlink to retrieve view:
    url = HyperlinkedIdentityField(
        view_name='api-explorers:section_model-detail',
        help_text='URL to provided object.',
        read_only=True,
    )

    # Special constance fields:
    category_specific_difficulty = serializers.SerializerMethodField()
    best_seasons = serializers.SerializerMethodField()
    best_months = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()

    # Special constance methods:
    def get_category_specific_difficulty(self, obj):
        # Return metadata dict for country:
        return SportCategoryDifficultyChoices.dict_from_int(
            obj.category_specific_difficulty
        )

    def get_best_seasons(self, obj):
        # Return metadata dict for country:
        return SeasonChoices.dict_from_int(
            obj.best_seasons
        )
    
    def get_best_months(self, obj):
        # Return metadata dict for country:
        return MonthChoices.dict_from_int(
            obj.best_months
        )
    
    def get_category(self, obj):
        # Return metadata dict for country:
        return SportCategoryChoices.dict_from_int(
            obj.category
        )

    class Meta:

        # Define read only fields:
        read_only_fields = gpx_read_only_fields

        # Define writable fields:
        fields = gpx_fields

        # Define related model:
        model = model

        # Define model depth:
        depth = depth
