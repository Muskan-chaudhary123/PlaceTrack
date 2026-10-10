import json
from django.http import HttpResponse, Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from config.authentication import JWTAuthentication

from apps.resources.serializers import ResourceSerializer
import apps.resources.services as res_services

class ResourceListCreateView(APIView):
    """
    Handles retrieval (GET) and creation (POST) of resources scoped to the authenticated user.
    Supports both JSON payloads and multipart/form-data for document uploads.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        category = request.query_params.get('category')
        res_type = request.query_params.get('type')
        search = request.query_params.get('search')
        sort_by = request.query_params.get('sortBy')

        resources = res_services.get_user_resources(
            user_id=request.user.id,
            category=category,
            res_type=res_type,
            search=search,
            sort_by=sort_by
        )

        return Response({
            "success": True,
            "data": resources
        }, status=status.HTTP_200_OK)

    def post(self, request):
        uploaded_file = request.FILES.get('file')

        serializer = ResourceSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            created = res_services.create_resource(
                user_id=request.user.id,
                data=serializer.validated_data,
                uploaded_file=uploaded_file
            )
            return Response({
                "success": True,
                "data": created,
                "message": "Resource created successfully."
            }, status=status.HTTP_201_CREATED)
        except ValueError as ve:
            return Response({
                "success": False,
                "message": str(ve)
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                "success": False,
                "message": f"Failed to create resource: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResourceDetailView(APIView):
    """
    Handles retrieval (GET), updating (PATCH/PUT), and deletion (DELETE) of a single resource.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request, pk):
        resource = res_services.get_resource(request.user.id, pk)
        if not resource:
            return Response({
                "success": False,
                "message": "Resource not found or unauthorized."
            }, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "success": True,
            "data": resource
        }, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        uploaded_file = request.FILES.get('file')
        remove_file = request.data.get('removeFile') in ['true', '1', True]

        serializer = ResourceSerializer(data=request.data, partial=True)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            updated = res_services.update_resource(
                user_id=request.user.id,
                resource_id=pk,
                data=serializer.validated_data,
                uploaded_file=uploaded_file,
                remove_file=remove_file
            )
            if not updated:
                return Response({
                    "success": False,
                    "message": "Resource not found or unauthorized."
                }, status=status.HTTP_404_NOT_FOUND)

            return Response({
                "success": True,
                "data": updated,
                "message": "Resource updated successfully."
            }, status=status.HTTP_200_OK)
        except ValueError as ve:
            return Response({
                "success": False,
                "message": str(ve)
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                "success": False,
                "message": f"Failed to update resource: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, pk):
        return self.patch(request, pk)

    def delete(self, request, pk):
        deleted = res_services.delete_resource(request.user.id, pk)
        if not deleted:
            return Response({
                "success": False,
                "message": "Resource not found or unauthorized."
            }, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "success": True,
            "message": "Resource and associated files deleted successfully."
        }, status=status.HTTP_200_OK)


class ResourceFileView(APIView):
    """
    Streams the stored file from GridFS for preview or download.
    Enforces user ownership on the file.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, pk):
        grid_out, file_meta = res_services.get_resource_file(request.user.id, pk)
        if not grid_out or not file_meta:
            raise Http404("File not found or unauthorized.")

        content_type = file_meta.get('contentType') or 'application/octet-stream'
        filename = file_meta.get('fileName') or 'document'
        is_preview = request.query_params.get('preview') in ['1', 'true', True]

        # For browser preview (PDF, text), use 'inline'; otherwise 'attachment'
        if is_preview and (content_type == 'application/pdf' or content_type.startswith('text/')):
            disposition = f'inline; filename="{filename}"'
        else:
            disposition = f'attachment; filename="{filename}"'

        response = HttpResponse(grid_out.read(), content_type=content_type)
        response['Content-Disposition'] = disposition
        response['Content-Length'] = file_meta.get('fileSize', 0)
        return response


class ResourceChecklistToggleView(APIView):
    """
    Quickly toggles a checklist item state.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def patch(self, request, pk, item_id):
        updated = res_services.toggle_checklist_item(request.user.id, pk, item_id)
        if not updated:
            return Response({
                "success": False,
                "message": "Resource or checklist item not found."
            }, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "success": True,
            "data": updated
        }, status=status.HTTP_200_OK)

    def post(self, request, pk, item_id):
        return self.patch(request, pk, item_id)

