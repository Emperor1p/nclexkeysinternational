from django.db import models
from django.utils import timezone
import uuid
import string
import random

class RegistrationCode(models.Model):
    """Model for managing registration codes for payment verification"""
    
    code = models.CharField(max_length=20, unique=True, primary_key=True)
    program_type = models.CharField(max_length=50, choices=[
        ('nigeria', 'Nigeria Program'),
        ('african', 'African Program'),
        ('usa-canada', 'USA/Canada Program'),
        ('europe', 'Europe Program'),
    ])
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, choices=[
        ('NGN', 'Nigerian Naira'),
        ('USD', 'US Dollar'),
        ('GBP', 'British Pound'),
    ])
    is_used = models.BooleanField(default=False)
    used_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True)
    used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    created_by = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='created_codes')
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Registration Code'
        verbose_name_plural = 'Registration Codes'
    
    def __str__(self):
        return f"{self.code} - {self.get_program_type_display()} ({self.currency} {self.amount})"
    
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    def is_valid(self):
        return not self.is_used and not self.is_expired()
    
    def mark_as_used(self, user):
        """Mark code as used by a specific user"""
        self.is_used = True
        self.used_by = user
        self.used_at = timezone.now()
        self.save()
    
    @classmethod
    def generate_code(cls, length=8):
        """Generate a unique registration code"""
        while True:
            # Generate code with letters and numbers
            characters = string.ascii_uppercase + string.digits
            code = ''.join(random.choices(characters, k=length))
            
            # Ensure code doesn't exist
            if not cls.objects.filter(code=code).exists():
                return code
    
    @classmethod
    def create_code(cls, program_type, amount, currency, created_by, expires_in_days=30, notes=None):
        """Create a new registration code"""
        code = cls.generate_code()
        expires_at = timezone.now() + timezone.timedelta(days=expires_in_days)
        
        return cls.objects.create(
            code=code,
            program_type=program_type,
            amount=amount,
            currency=currency,
            created_by=created_by,
            expires_at=expires_at,
            notes=notes
        )
    
    @classmethod
    def validate_code(cls, code, program_type=None):
        """Validate a registration code"""
        try:
            registration_code = cls.objects.get(code=code)
            
            if not registration_code.is_valid():
                return {
                    'valid': False,
                    'error': 'Code is expired or already used'
                }
            
            if program_type and registration_code.program_type != program_type:
                return {
                    'valid': False,
                    'error': 'Code is not valid for this program type'
                }
            
            return {
                'valid': True,
                'code': registration_code
            }
        except cls.DoesNotExist:
            return {
                'valid': False,
                'error': 'Invalid registration code'
            }