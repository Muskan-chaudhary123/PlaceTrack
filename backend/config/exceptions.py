from rest_framework.views import exception_handler
from rest_framework import exceptions

def custom_exception_handler(exc, context):
    """
    Custom exception handler to format validation errors and map unauthenticated requests to 401.
    """
    response = exception_handler(exc, context)

    if response is not None:
        
        if isinstance(exc, (exceptions.NotAuthenticated, exceptions.AuthenticationFailed)):
            response.status_code = 401
            response.data = {
                "success": False,
                "message": getattr(exc, 'detail', "Authentication credentials were not provided.")
            }
        
        elif isinstance(exc, exceptions.PermissionDenied):
            request = context.get('request')
            if request and (not request.user or not request.user.is_authenticated):
                response.status_code = 401
                response.data = {
                    "success": False,
                    "message": "Authentication credentials were not provided."
                }
            else:
                response.data = {
                    "success": False,
                    "message": getattr(exc, 'detail', "You do not have permission to perform this action.")
                }
    
    return response
