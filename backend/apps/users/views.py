import datetime
import jwt
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.conf import settings
from bson import ObjectId

from config.database import get_db
from config.authentication import generate_access_token, generate_refresh_token, JWTAuthentication
from apps.users.serializers import RegisterSerializer, LoginSerializer, TokenRefreshSerializer

class HealthCheckView(APIView):
    """
    Checks the status of the Django API service and local MongoDB connectivity.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        db = get_db()
        if db is None:
            return Response({
                "status": "error",
                "service": "PlaceTrack API",
                "database": "disconnected"
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        try:
            # Check database ping
            db.command('ping')
            return Response({
                "status": "ok",
                "service": "PlaceTrack API",
                "database": "connected"
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "status": "error",
                "service": "PlaceTrack API",
                "database": "disconnected",
                "error": str(e)
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)


class RegisterView(APIView):
    """
    Handles new user creation. Checks duplicate email and stores hashed password.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        name = serializer.validated_data['name']
        email = serializer.validated_data['email'].lower().strip()
        password = serializer.validated_data['password']

        db = get_db()
        if db is None:
            return Response({
                "success": False,
                "message": "Database connection offline."
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        # Check uniqueness
        existing_user = db.users.find_one({"email": email})
        if existing_user:
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": {
                    "email": "A user with this email address already exists."
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        # Create user document
        user_doc = {
            "name": name,
            "email": email,
            "passwordHash": make_password(password),
            "createdAt": datetime.datetime.utcnow(),
            "updatedAt": datetime.datetime.utcnow()
        }

        try:
            result = db.users.insert_one(user_doc)
            user_id = result.inserted_id
            
            # Generate JWT credentials
            access_token = generate_access_token(user_id)
            refresh_token = generate_refresh_token(user_id)

            return Response({
                "success": True,
                "data": {
                    "user": {
                        "id": str(user_id),
                        "name": name,
                        "email": email
                    },
                    "access": access_token,
                    "refresh": refresh_token
                }
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                "success": False,
                "message": f"Failed to register user: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):
    """
    Verifies user credentials and returns JWT credentials.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email'].lower().strip()
        password = serializer.validated_data['password']

        db = get_db()
        if db is None:
            return Response({
                "success": False,
                "message": "Database connection offline."
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        user_doc = db.users.find_one({"email": email})
        if not user_doc or not check_password(password, user_doc.get("passwordHash", "")):
            return Response({
                "success": False,
                "message": "Invalid email or password."
            }, status=status.HTTP_401_UNAUTHORIZED)

        user_id = user_doc["_id"]
        access_token = generate_access_token(user_id)
        refresh_token = generate_refresh_token(user_id)

        return Response({
            "success": True,
            "data": {
                "user": {
                    "id": str(user_id),
                    "name": user_doc.get("name"),
                    "email": user_doc.get("email")
                },
                "access": access_token,
                "refresh": refresh_token
            }
        }, status=status.HTTP_200_OK)


class TokenRefreshView(APIView):
    """
    Generates a new access token using a valid refresh token.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = TokenRefreshSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        refresh_token = serializer.validated_data['refresh']

        try:
            payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
            if payload.get('type') != 'refresh':
                raise jwt.InvalidTokenError()
        except jwt.ExpiredSignatureError:
            return Response({
                "success": False,
                "message": "Refresh token has expired."
            }, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({
                "success": False,
                "message": "Invalid refresh token."
            }, status=status.HTTP_401_UNAUTHORIZED)

        user_id = payload.get('user_id')
        db = get_db()
        if db is None:
            return Response({
                "success": False,
                "message": "Database connection offline."
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        user_doc = db.users.find_one({"_id": ObjectId(user_id)})
        if not user_doc:
            return Response({
                "success": False,
                "message": "User associated with token not found."
            }, status=status.HTTP_401_UNAUTHORIZED)

        # Generate a new access token
        new_access_token = generate_access_token(user_id)

        return Response({
            "success": True,
            "data": {
                "access": new_access_token
            }
        }, status=status.HTTP_200_OK)


class MeView(APIView):
    """
    Returns profile information of the currently authenticated user.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        user = request.user
        return Response({
            "success": True,
            "data": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        }, status=status.HTTP_200_OK)
