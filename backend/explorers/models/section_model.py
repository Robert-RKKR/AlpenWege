# AlpenWegs import:
from alpenwegs.ashared.models.relationship_model import BaseRelationshipOrderedModel
from alpenwegs.ashared.models.characteristic_model import BaseCharacteristicModel
from alpenwegs.ashared.models.identification_model import BaseIdentificationModel
from alpenwegs.ashared.models.sport_category_model import BaseSportCategoryModel
from alpenwegs.ashared.models.relationship_model import BaseRelationshipModel
from alpenwegs.ashared.models.descriptive_model import BaseDescriptiveModel
from alpenwegs.ashared.models.timestamp_model import BaseTimestampModel
from alpenwegs.ashared.models.creator_model import creator_object_index
from alpenwegs.ashared.models.creator_model import BaseCreatorModel
from alpenwegs.ashared.models.liked_model import BaseLikedModel
from alpenwegs.ashared.models.gpx_model import BaseGpxModel



# AlpenWegs application import:
from compendiums.models.region_model import RegionModel
from compendiums.models.poi_model import PoiModel
from assets.models.photo_model import PhotoModel

# Django import:
from django.db import models


# Section Model class:
class SectionModel(
    BaseCharacteristicModel,
    BaseIdentificationModel,
    BaseSportCategoryModel,
    BaseDescriptiveModel,
    BaseTimestampModel,
    BaseCreatorModel,
    BaseLikedModel,
    BaseGpxModel,
):
    """
    Represents a single Section within the AlpenWegs ecosystem.

    A Section is the smallest, well-defined structural component of a full
    Route. It represents a logically cohesive trail segment such as a valley
    passage, ridge traversal, lakeside contour, alpine ascent, or technical
    via ferrata stretch. Sections combine navigational geometry (GPX line),
    sport-specific attributes (difficulty, allowed sports), descriptive
    metadata, and relationships to Points of Interest, Regions, and visual
    media.

    Sections allow Routes to be built from modular, reusable, and clearly
    delineated parts. This structure supports multi-route reuse (the same
    Section may appear in multiple Routes), flexible trail construction,
    detailed segment-level analytics, and user-friendly map presentation.
    """

    class Meta:

        # Model name values:
        verbose_name = 'Section'
        verbose_name_plural = 'Sections'

        # Database indexes:
        indexes = [
            creator_object_index,
        ]

        # Add custom AlpenWegs permissions:
        permissions = [
            ('change_own_sectionmodel', 'Can change own sections'),
            ('change_all_sectionmodel', 'Can change all sections'),
            ('delete_own_sectionmodel', 'Can delete own sections'),
            ('delete_all_sectionmodel', 'Can delete all sections'),
            ('view_own_sectionmodel', 'Can view own sections'),
            ('view_all_sectionmodel', 'Can view all sections'),
            ('add_own_sectionmodel', 'Can add own sections'),
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

    # Section Many-to-Many Relationships:
    photos = models.ManyToManyField(
        PhotoModel,
        through='SectionToPhotoModel',
        related_name='section_photos',
        verbose_name='Section Photos',
        help_text=(
            'Photos that visually document this Section. These images may '
            'include landscape views, trail markers, huts, technical areas, '
            'bridges, seasonal conditions, or user-submitted impressions. '
            'This media enriches the map and helps users understand terrain '
            'difficulty, exposure, or scenic value.'
        ),
    )
    pois = models.ManyToManyField(
        PoiModel,
        through='SectionToPoiModel',
        related_name='section_pois',
        verbose_name='Section Points of Interest (PoIs)',
        help_text=(
            'Points of Interest that structure and annotate this Section. '
            'PoIs mark meaningful locations like summits, huts, passes, lakes, '
            'cultural sites, trail junctions, or way finding references. PoIs '
            'provide semantic meaning to the raw GPX path and help users '
            'navigate and understand the Section.'
        ),
    )
    regions = models.ManyToManyField(
        RegionModel,
        through='SectionToRegionModel',
        related_name='section_regions',
        verbose_name='Section Regions',
        help_text=(
            'Geographical regions that this Section traverses or belongs to. '
            'Regions support filtering, browsing, and map-based exploration. '
            'A Section may span multiple regions if it crosses borders or '
            'large geographic areas.'
        ),
    )

    # Section One-to-Many Relationships:
    start_poi = models.ForeignKey(
        PoiModel,
        related_name='poi_sections_start',
        verbose_name='Start PoI',
        help_text=(
            'The logical starting Point of Interest for this Section. This '
            'PoI acts as the anchor at the beginning of the GPX geometry. '
            'It often represents a village, pass entrance, hut, or '
            'junction where the Section officially begins.'
        ),
        on_delete=models.PROTECT,
        blank=True,
        null=True,
    )
    end_poi = models.ForeignKey(
        PoiModel,
        related_name='poi_sections_end',
        verbose_name='End PoI',
        help_text=(
            'The logical ending Point of Interest for this Section. This PoI '
            'marks where the Section concludes. It is often a hut, pass, road, '
            'summit, or transition point where the next Section begins.'
        ),
        on_delete=models.PROTECT,
        blank=True,
        null=True,
    )

    # Section Many-to-Many Relationships (reverse side):
    routes = models.ManyToManyField(
        'RouteModel',
        through='SectionToRouteModel',
        related_name='route_sections',
        verbose_name='Route Sections',
        help_text=(
            'Routes that contain this Section. Routes are composed of multiple '
            'Sections arranged in a defined order. The same Section may appear '
            'in multiple Routes (e.g., shared valley trails or ridge lines).'
        ),
    )


# Section Model Many-to-many relationships with other models:
class SectionToPhotoModel(
    BaseRelationshipModel,
):
    """
    Intermediate model linking a Section to Photos.

    Stores the association between a route section and one or more 
    photos that visually document the section. This enables attaching 
    user-contributed or system-provided media to enhance the section’s 
    descriptive context.
    """
    
    # Base relation between Many-to-many Models:
    section = models.ForeignKey(
        SectionModel,
        related_name='photo_section_associations',
        verbose_name='Section',
        help_text='The Section that is associated with the Photo '
            'to Section M2M relationship.',
        on_delete=models.PROTECT,
    )
    photo = models.ForeignKey(
        PhotoModel,
        related_name='section_photo_associations',
        verbose_name='Photo',
        help_text='The Photo that is associated with the Section '
            'to Photo M2M relationship.',
        on_delete=models.PROTECT,
    )

    # Additional fields for the Section-Photo relationship:
    is_primary = models.BooleanField(
        default=False,
        verbose_name="Primary Section Photo",
        help_text=(
            'Marks this photo as the primary visual representation of the '
            'section. The primary photo is used as the default image in '
            'section previews, detail headers, maps, and summary cards. '
            'Only one photo per section may be designated as primary.'
        ),
    )


class SectionToPoiModel(
    BaseRelationshipOrderedModel,
):
    """
    Intermediate model linking a Section to one or more
    Points of Interest (PoIs).

    Stores the ordered association and semantic role of a PoI
    within the section's path. For example, a PoI can mark the
    start, an intermediate waypoint, or the end of the section.
    """
    
    # Base relation between Many-to-many Models:
    section = models.ForeignKey(
        SectionModel,
        related_name='poi_section_associations',
        verbose_name='Section',
        help_text='The Section that is associated with the Point of '
            'Interest to Section M2M relationship.',
        on_delete=models.PROTECT,
    )
    poi = models.ForeignKey(
        PoiModel,
        related_name='section_poi_associations',
        verbose_name='Point of Interest',
        help_text='The Point of Interest that is associated with the '
            'Section to Point of Interest M2M relationship.',
        on_delete=models.PROTECT,
    )


class SectionToRegionModel(
    BaseRelationshipModel,
):
    """
    Intermediate model linking a Section to Regions.

    Represents the geographical regions that a section belongs to 
    or traverses, enabling filtering and classification.
    """
    
    # Base relation between Many-to-many Models:
    section = models.ForeignKey(
        SectionModel,
        related_name='region_section_associations',
        verbose_name='Section',
        help_text='The Section that is associated with the Region '
            'to Section M2M relationship.',
        on_delete=models.PROTECT,
    )
    region = models.ForeignKey(
        RegionModel,
        related_name='section_region_associations',
        verbose_name='Region',
        help_text='The Region that is associated with the Section '
            'to Region M2M relationship.',
        on_delete=models.PROTECT,
    )
