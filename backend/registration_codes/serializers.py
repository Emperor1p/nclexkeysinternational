from rest_framework import serializers
from .models import RegistrationCode

class RegistrationCodeSerializer(serializers.ModelSerializer):
    """Serializer for registration codes"""
    
    is_valid = serializers.SerializerMethodField()
    is_expired = serializers.SerializerMethodField()
    days_until_expiry = serializers.SerializerMethodField()
    
    class Meta:
        model = RegistrationCode
        fields = [
            'code', 'program_type', 'amount', 'currency', 'is_used', 
            'used_by', 'used_at', 'created_at', 'expires_at', 'created_by',
            'notes', 'is_valid', 'is_expired', 'days_until_expiry'
        ]
        read_only_fields = ['code', 'created_at', 'used_at']
    
    def get_is_valid(self, obj):
        return obj.is_valid()
    
    def get_is_expired(self, obj):
        return obj.is_expired()
    
    def get_days_until_expiry(self, obj):
        from django.utils import timezone
        if obj.is_expired():
            return 0
        delta = obj.expires_at - timezone.now()
        return delta.days

class CreateRegistrationCodeSerializer(serializers.Serializer):
    """Serializer for creating new registration codes"""
    
    program_type = serializers.ChoiceField(choices=RegistrationCode._meta.get_field('program_type').choices)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    currency = serializers.ChoiceField(choices=RegistrationCode._meta.get_field('currency').choices)
    expires_in_days = serializers.IntegerField(default=30, min_value=1, max_value=365)
    notes = serializers.CharField(required=False, allow_blank=True)
    
    def create(self, validated_data):
        request = self.context.get('request')
        created_by = request.user if request and request.user.is_authenticated else None
        
        return RegistrationCode.create_code(
            program_type=validated_data['program_type'],
            amount=validated_data['amount'],
            currency=validated_data['currency'],
            created_by=created_by,
            expires_in_days=validated_data.get('expires_in_days', 30),
            notes=validated_data.get('notes')
        )

class ValidateRegistrationCodeSerializer(serializers.Serializer):
    """Serializer for validating registration codes"""
    
    code = serializers.CharField(max_length=20)
    program_type = serializers.ChoiceField(
        choices=RegistrationCode._meta.get_field('program_type').choices,
        required=False
    )
    
    def validate_code(self, value):
        """Validate the registration code"""
        result = RegistrationCode.validate_code(value, self.initial_data.get('program_type'))
        
        if not result['valid']:
            raise serializers.ValidationError(result['error'])
        
        return value
