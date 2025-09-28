from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
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
@permission_classes([IsAuthenticated])
def validate_registration_code(request):
    """Validate a registration code for user registration"""
    
    serializer = ValidateRegistrationCodeSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response({
            'success': False,
            'error': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    code = serializer.validated_data['code']
    program_type = serializer.validated_data.get('program_type')
    
    # Validate the code
    result = RegistrationCode.validate_code(code, program_type)
    
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
        
        if not registration_code.is_valid():
            return Response({
                'success': False,
                'error': 'Registration code is expired or already used'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Mark code as used
        registration_code.mark_as_used(request.user)
        
        return Response({
            'success': True,
            'message': 'Registration code used successfully',
            'code': RegistrationCodeSerializer(registration_code).data
        })
        
    except RegistrationCode.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Invalid registration code'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def generate_codes(request):
    """Generate multiple registration codes (Admin only)"""
    
    program_type = request.GET.get('program_type')
    count = int(request.GET.get('count', 5))
    
    if not program_type:
        return Response({
            'success': False,
            'error': 'Program type is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if count > 50:
        return Response({
            'success': False,
            'error': 'Cannot generate more than 50 codes at once'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Program pricing
    pricing = {
        'nigeria': {'amount': 30000, 'currency': 'NGN'},
        'african': {'amount': 35000, 'currency': 'NGN'},
        'usa-canada': {'amount': 60, 'currency': 'USD'},
        'europe': {'amount': 35, 'currency': 'GBP'},
    }
    
    if program_type not in pricing:
        return Response({
            'success': False,
            'error': 'Invalid program type'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    created_codes = []
    for _ in range(count):
        code = RegistrationCode.create_code(
            program_type=program_type,
            amount=pricing[program_type]['amount'],
            currency=pricing[program_type]['currency'],
            created_by=request.user,
            expires_in_days=30
        )
        created_codes.append(RegistrationCodeSerializer(code).data)
    
    return Response({
        'success': True,
        'message': f'Generated {count} registration codes for {program_type}',
        'codes': created_codes
    })