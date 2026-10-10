from rest_framework.permissions import BasePermission

class IsApplicationOwner(BasePermission):
    """
    Custom permission to verify that the request user is the owner of the application.
    """
    def has_object_permission(self, request, view, obj):
        
        if not request.user or not request.user.is_authenticated:
            return False
        return str(obj.get('userId')) == str(request.user.id)
