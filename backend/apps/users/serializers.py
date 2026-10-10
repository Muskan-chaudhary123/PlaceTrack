from rest_framework import serializers

class RegisterSerializer(serializers.Serializer):
    """
    Validates user registration input.
    """
    name = serializers.CharField(required=True, max_length=100)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, min_length=6, write_only=True)


class LoginSerializer(serializers.Serializer):
    """
    Validates login credentials.
    """
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)


class TokenRefreshSerializer(serializers.Serializer):
    """
    Validates the refresh token.
    """
    refresh = serializers.CharField(required=True)
