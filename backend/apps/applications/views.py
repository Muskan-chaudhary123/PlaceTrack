from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from config.authentication import JWTAuthentication

from apps.applications.serializers import ApplicationSerializer
import apps.applications.services as app_services

class ApplicationListCreateView(APIView):
    """
    Handles retrieval (GET) and creation (POST) of applications scoped to the authenticated user.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        
        limit = request.query_params.get('limit')
        apps = app_services.get_user_applications(request.user.id)
        
        apps.sort(key=lambda x: x.get('updatedAt') or x.get('createdAt') or '', reverse=True)
        
        if limit:
            try:
                apps = apps[:int(limit)]
            except ValueError:
                pass
                
        serializer = ApplicationSerializer(apps, many=True)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ApplicationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        new_app = app_services.create_application(request.user.id, serializer.validated_data)
        if not new_app:
            return Response({
                "success": False,
                "message": "Failed to create application."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        res_serializer = ApplicationSerializer(new_app)
        return Response({
            "success": True,
            "message": "Application added successfully.",
            "data": res_serializer.data
        }, status=status.HTTP_201_CREATED)


class ApplicationDetailView(APIView):
    """
    Handles fetching, updating (PUT/PATCH), and deleting applications, strictly scoped to the owner.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, pk):
        app = app_services.get_application(request.user.id, pk)
        if not app:
            return Response({
                "success": False,
                "message": "Application not found."
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = ApplicationSerializer(app)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def put(self, request, pk):
        serializer = ApplicationSerializer(data=request.data, partial=False)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        updated_app = app_services.update_application(request.user.id, pk, serializer.validated_data)
        if not updated_app:
            return Response({
                "success": False,
                "message": "Application not found."
            }, status=status.HTTP_404_NOT_FOUND)

        res_serializer = ApplicationSerializer(updated_app)
        return Response({
            "success": True,
            "message": "Application updated successfully.",
            "data": res_serializer.data
        }, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        serializer = ApplicationSerializer(data=request.data, partial=True)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        updated_app = app_services.update_application(request.user.id, pk, serializer.validated_data)
        if not updated_app:
            return Response({
                "success": False,
                "message": "Application not found."
            }, status=status.HTTP_404_NOT_FOUND)

        res_serializer = ApplicationSerializer(updated_app)
        return Response({
            "success": True,
            "message": "Application updated successfully.",
            "data": res_serializer.data
        }, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        success = app_services.delete_application(request.user.id, pk)
        if not success:
            return Response({
                "success": False,
                "message": "Application not found."
            }, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "success": True,
            "message": "Application deleted successfully."
        }, status=status.HTTP_200_OK)


class ApplicationStatsView(APIView):
    """
    Returns aggregated metrics scoped to the authenticated user.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        stats_data = app_services.get_application_stats(request.user.id)
        return Response({
            "success": True,
            "data": stats_data
        }, status=status.HTTP_200_OK)
