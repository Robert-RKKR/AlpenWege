# AlpenWegs import:
from alpenwegs.ashared.api.mixins.base_mixin import BaseMixin

# Rest framework import:
from rest_framework.mixins import ListModelMixin
from rest_framework.exceptions import ParseError
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status


class BaseListRepresentationModelMixin(
    BaseMixin,
    ListModelMixin,
):
    """
    Base model mixin for listing a queryset.
    """

    # Define custom list values:
    allow_list = False

    def _call_representation(self,
        request: Response,
        *args: list,
        **kwargs: dict,
    ) -> Response:
        
        # Collect queryset value:
        queryset = (
            self._collect_queryset()
            .only("id", "name")
            .select_related(None)
            .prefetch_related(None)
        )

        # Collect all instances:
        queryset = self.filter_queryset(queryset)

        # Prepare page view without pagination:
        serializer = self._get_serializer(
            queryset,
            serializer_name="representation",
            many=True,
        )

        # Return (200 HTTP - Ok) response:
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=['get'], url_path='representation')
    def representation(self,
        request: Response,
        *args: list,
        **kwargs: dict,
    ) -> Response:

        try:
            # Try to collect all instances:
            return self._call_representation(
                request=request,
                *args,
                **kwargs,
            )

        # Unexpected exception handling !TEMPORARY:
        except Exception as exception:
            # Test exceptions:
            print(f'Type of list exception: {type(exception)}')
            
            # Raise not found error:
            raise ParseError(
                'An error occurred during the GET List API call.',
            )
