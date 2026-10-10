from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from config.authentication import JWTAuthentication

from apps.questions.serializers import QuestionSerializer, QuestionSettingsSerializer
import apps.questions.services as q_services

class QuestionSettingsView(APIView):
    """
    Handles retrieving and updating subjects, topics, and custom columns configuration.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        config = q_services.get_questions_settings(request.user.id)
        serializer = QuestionSettingsSerializer(config)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = QuestionSettingsSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        config = q_services.update_questions_settings(request.user.id, serializer.validated_data)
        if not config:
            return Response({
                "success": False,
                "message": "Failed to update settings."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        res_serializer = QuestionSettingsSerializer(config)
        return Response({
            "success": True,
            "message": "Settings updated successfully.",
            "data": res_serializer.data
        }, status=status.HTTP_200_OK)

class QuestionListCreateView(APIView):
    """
    Handles retrieving (GET) and creating (POST) questions scoped to the authenticated user.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        questions = q_services.get_user_questions(request.user.id)
        # Sort in reverse chronological order
        questions.sort(key=lambda x: x.get('updatedAt') or x.get('createdAt') or '', reverse=True)
        serializer = QuestionSerializer(questions, many=True)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = QuestionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        new_q = q_services.create_question(request.user.id, serializer.validated_data)
        if not new_q:
            return Response({
                "success": False,
                "message": "Failed to create question."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        res_serializer = QuestionSerializer(new_q)
        return Response({
            "success": True,
            "message": "Question added successfully.",
            "data": res_serializer.data
        }, status=status.HTTP_201_CREATED)

class QuestionDetailView(APIView):
    """
    Handles fetching, updating (PUT/PATCH), and deleting questions scoped to the owner.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, pk):
        q = q_services.get_question(request.user.id, pk)
        if not q:
            return Response({
                "success": False,
                "message": "Question not found."
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = QuestionSerializer(q)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def put(self, request, pk):
        serializer = QuestionSerializer(data=request.data, partial=False)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        updated_q = q_services.update_question(request.user.id, pk, serializer.validated_data)
        if not updated_q:
            return Response({
                "success": False,
                "message": "Question not found."
            }, status=status.HTTP_404_NOT_FOUND)

        res_serializer = QuestionSerializer(updated_q)
        return Response({
            "success": True,
            "message": "Question updated successfully.",
            "data": res_serializer.data
        }, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        serializer = QuestionSerializer(data=request.data, partial=True)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        updated_q = q_services.update_question(request.user.id, pk, serializer.validated_data)
        if not updated_q:
            return Response({
                "success": False,
                "message": "Question not found."
            }, status=status.HTTP_404_NOT_FOUND)

        res_serializer = QuestionSerializer(updated_q)
        return Response({
            "success": True,
            "message": "Question updated successfully.",
            "data": res_serializer.data
        }, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        success = q_services.delete_question(request.user.id, pk)
        if not success:
            return Response({
                "success": False,
                "message": "Question not found."
            }, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "success": True,
            "message": "Question deleted successfully."
        }, status=status.HTTP_200_OK)
