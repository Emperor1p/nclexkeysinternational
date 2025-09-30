from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import RegistrationCode
from .serializers import (
    RegistrationCodeSerializer, 
    CreateRegistrationCodeSerializer,
    ValidateRegistrationCodeSerializer
)

User = get_user_model()

class RegistrationCodeListCreateView(generics.ListCreateAPIView):
    """List and create registration codes (Admin only)"""
    
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateRegistrationCodeSerializer
        return RegistrationCodeSerializer
    
    def get_queryset(self):
        return RegistrationCode.objects.all().order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save()

class RegistrationCodeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a registration code (Admin only)"""
    
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = RegistrationCodeSerializer
    queryset = RegistrationCode.objects.all()
    lookup_field = 'code'

@api_view(['POST'])
@permission_classes([AllowAny])
def validate_registration_code(request):
    """Validate a registration code for user registration"""
    
    serializer = ValidateRegistrationCodeSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response({
            'success': False,
            'error': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    code = serializer.validated_data['code']
    
    # Validate the code
    result = RegistrationCode.validate_code(code)
    
    if not result['valid']:
        return Response({
            'success': False,
            'error': result['error']
        }, status=status.HTTP_400_BAD_REQUEST)
    
    registration_code = result['code']
    
    return Response({
        'success': True,
        'code': RegistrationCodeSerializer(registration_code).data,
        'message': 'Registration code is valid'
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def use_registration_code(request):
    """Mark a registration code as used by the current user"""
    
    code = request.data.get('code')
    if not code:
        return Response({
            'success': False,
            'error': 'Registration code is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        registration_code = RegistrationCode.objects.get(code=code)
    except RegistrationCode.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Invalid registration code'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if registration_code.is_used:
        return Response({
            'success': False,
            'error': 'Registration code has already been used'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Mark as used
    registration_code.mark_as_used(request.user)
    
    return Response({
        'success': True,
        'message': 'Registration code marked as used'
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def generate_codes(request):
    """Generate multiple registration codes (Admin only)"""
    
    serializer = CreateRegistrationCodeSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response({
            'success': False,
            'error': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        codes = serializer.save()
        return Response({
            'success': True,
            'codes': RegistrationCodeSerializer(codes, many=True).data,
            'message': f'Successfully generated {len(codes)} registration codes'
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)