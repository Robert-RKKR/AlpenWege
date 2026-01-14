# AlpenWegs import:
from alpenwegs.ashared.api.base_exceptions import BaseAPIException

# Rest framework import:
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def collect_exception_data(
    exc: dict,
    context: dict,
 ) -> dict:
    """
    Collects exception data to return a structured error response.
    """

    def non_field_errors():
        # Collect error message based od detail key:
        error_response['error_message'] = (
            'Unable to log in with provided credentials.')
        # Collect error code if available:
        error_response['error_code'] = 'wrong_credentials'
        # Collect response status code:
        error_response['error_status'] = 400

        # Return collected error response:
        return error_response

    def collect_message(data):
        # Try to collect message from details key:
        if data.get('detail'):
            # Return collected message:
            return data['detail']

        # Try to collect message from string key:
        elif data.get('string'):
            # Return collected message:
            return data['string']

    def collect_code(data):
        # Try to collect code from code key:
        if data.get('code'):
            # Return collected code:
            return data['code']
        
        else:
            try:
                # Try to collect code from detail key:
                return data['detail'].code
            except Exception:
                pass

    # Define error response dictionary:
    error_response = {}
    # Collect HTTP response:
    response = exception_handler(exc, context)

    # Check if response data is a dictionary
    if isinstance(response.data, dict):
        
        # Collect response data in special cases:
        if response.data.get('non_field_errors'):
            return non_field_errors(), response

        else:
            # In other case use standard data:
            data = response.data

        if collect_message(data):

            # Collect error message based od detail key:
            error_response['error_message'] = collect_message(data)
            # Collect error code if available:
            error_response['error_code'] = collect_code(data)
            # Collect response status code:
            error_response['error_status'] = response.status_code
            # Collect error details if available:
            error_response['error_details'] = data.get(
                'messages', [])
            
        else:
            # Collect error message based od detail key:
            error_response['error_message'] = 'Error'
            # Collect error code if available:
            error_response['error_code'] = 'Error'
            # Collect response status code:
            error_response['error_status'] = response.status_code
            # Collect error details if available:
            error_response['error_details'] = response.data
        
    # Return:
    return error_response, response

def base_exception_handler(
    exc: dict,
    context: dict,
) -> Response:
    """
    Base exception handler to return JSON error responses.
    """

    # Try to collect exception data:
    error_response, response = collect_exception_data(
        context=context,
        exc=exc,
    )

    # Return error response:
    if response is None:
        return Response(
            data=error_response,
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return Response(
        data=error_response,
        status=response.status_code,
    )

    try:
        error_response, response = collect_exception_data(
            exc=exc,
            context=context,
        )

        # Fallback when DRF returned no response
        if response is None:
            return Response(
                data=error_response,
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            data=error_response,
            status=response.status_code,
        )

    except Exception as exception:
        # Absolute last-resort fallback
        return Response(
            data={
                "error_message": "Internal Server Error",
                "error_code": 500,
                "error_details": str(exception),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    try:
        # Try to collect exception data:
        error_response, response = collect_exception_data(
            context=context,
            exc=exc,
        )

    except Exception as exception:
        # If response if not available, raise 500 error:
        error_response = {
            'error_code': 500,
            'error_message': 'Internal Server Error',
            'error_details': str(exception),
        }

        # Return error response:
        return Response(
            data=error_response,
            status=500
        )

    else:
        # Return error response:
        return Response(
            data=error_response,
            status=response.status_code
        )
