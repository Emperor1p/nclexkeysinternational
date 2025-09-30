from rest_framework import serializers
from .models import RegistrationCode

class RegistrationCodeSerializer(serializers.ModelSerializer):
    """Serializer for registration codes"""
    
    class Meta:
        model = RegistrationCode
        fields = [
            'id', 'code', 'program_type', 'is_used', 
            'used_by', 'used_at', 'created_at'
        ]
        read_only_fields = ['id', 'code', 'created_at', 'used_at']

class CreateRegistrationCodeSerializer(serializers.Serializer):
    """Serializer for creating new registration codes"""
    
    program_type = serializers.ChoiceField(choices=RegistrationCode.PROGRAM_CHOICES)
    count = serializers.IntegerField(default=1, min_value=1, max_value=100)
    
    def create(self, validated_data):
        """Create multiple registration codes"""
        codes = []
        for _ in range(validated_data['count']):
            code = RegistrationCode.objects.create(
                program_type=validated_data['program_type']
            )
            codes.append(code)
        return codes

class ValidateRegistrationCodeSerializer(serializers.Serializer):
    """Serializer for validating registration codes"""
    
    code = serializers.CharField(max_length=50)
    
    def validate_code(self, value):
        """Validate the registration code"""
        result = RegistrationCode.validate_code(value)
        
        if not result['valid']:
            raise serializers.ValidationError(result['error'])
        
        return value