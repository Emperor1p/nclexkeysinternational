# users/instructor_auth_views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .models import User
import logging
import jwt
from django.conf import settings
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

# JWT settings
JWT_SECRET_KEY = getattr(settings, 'SECRET_KEY', 'your-secret-key-here')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24

def generate_jwt_token(user):
    """Generate JWT token for user"""
    payload = {
        'user_id': str(user.id),
        'email': user.email,
        'role': user.role,
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
        'iat': datetime.utcnow()
    }
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token

@api_view(['POST'])
@permission_classes([AllowAny])
def instructor_login(request):
    """
    Instructor login endpoint with default credentials
    POST /api/instructor/login/
    """
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        
        # Check for default instructor credentials
        if email == 'instructor@nclexkeys.com' and password == 'instructor123':
            try:
                # Get or create default instructor
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                # Create default instructor if doesn't exist
                user = User.objects.create(
                    email=email,
                    full_name='NCLEX Instructor',
                    role='instructor',
                    username=email,
                    is_email_verified=True,
                    is_staff=True,
                    is_superuser=True
                )
                user.set_password(password)
                user.save()
                logger.info(f"Default instructor account created: {email}")
        
        # Authenticate user
        user = authenticate(request, email=email, password=password)
        
        if user is None:
            return Response({
                'success': False,
                'error': {
                    'message': 'Invalid email or password.'
                }
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Check if user is instructor or admin
        if user.role not in ['instructor', 'admin']:
            return Response({
                'success': False,
                'error': {
                    'message': 'Access denied. Instructor role required.'
                }
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Generate JWT token
        token = generate_jwt_token(user)
        
        logger.info(f"Instructor login successful: {user.email}")
        
        return Response({
            'success': True,
            'data': {
                'token': token,
                'user': {
                    'id': str(user.id),
                    'email': user.email,
                    'full_name': user.full_name,
                    'role': user.role,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser
                }
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Instructor login error: {str(e)}")
        return Response({
            'success': False,
            'error': {
                'message': 'Login failed. Please try again.'
            }
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def instructor_info(request):
    """
    Get default instructor credentials for easy access
    GET /api/instructor/info/
    """
    return Response({
        'success': True,
        'data': {
            'default_credentials': {
                'email': 'instructor@nclexkeys.com',
                'password': 'instructor123',
                'role': 'instructor',
                'access': 'full_admin_dashboard'
            },
            'login_url': '/api/instructor/login/',
            'dashboard_url': '/admin'
        }
    }, status=status.HTTP_200_OK)
