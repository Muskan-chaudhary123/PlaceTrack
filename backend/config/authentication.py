import os
import datetime
import jwt
from bson import ObjectId
from django.conf import settings
from rest_framework import authentication
from rest_framework import exceptions
from config.database import get_db

class MongoDBUser:
    """
    Lightweight User wrapper class for MongoDB documents,
    fulfilling DRF/Django auth check interfaces.
    """
    def __init__(self, user_doc):
        self.doc = user_doc
        self.id = str(user_doc.get('_id'))
        self.name = user_doc.get('name')
        self.email = user_doc.get('email')

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False


class JWTAuthentication(authentication.BaseAuthentication):
    """
    Custom JWT Authentication class reading from MongoDB.
    Supports Authorization header and query param token (for file streaming/previews).
    """
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        token = None
        if auth_header:
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                token = parts[1]

        if not token:
            # Check query params for media/file requests
            token = request.query_params.get('token') if hasattr(request, 'query_params') else None
            if not token and hasattr(request, 'GET'):
                token = request.GET.get('token')

        if not token:
            return None
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired.')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token.')

        # Ensure it is an access token
        if payload.get('type') != 'access':
            raise exceptions.AuthenticationFailed('Invalid token type.')

        user_id = payload.get('user_id')
        if not user_id:
            raise exceptions.AuthenticationFailed('Malformed token payload.')

        db = get_db()
        if db is None:
            raise exceptions.AuthenticationFailed('Database connection offline.')

        try:
            user_doc = db.users.find_one({'_id': ObjectId(user_id)})
        except Exception:
            raise exceptions.AuthenticationFailed('Invalid user reference.')

        if not user_doc:
            raise exceptions.AuthenticationFailed('User not found.')

        return (MongoDBUser(user_doc), token)


# Helper functions to sign tokens
def generate_access_token(user_id):
    payload = {
        'user_id': str(user_id),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=15),
        'type': 'access',
        'iat': datetime.datetime.utcnow()
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

def generate_refresh_token(user_id):
    payload = {
        'user_id': str(user_id),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
        'type': 'refresh',
        'iat': datetime.datetime.utcnow()
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
