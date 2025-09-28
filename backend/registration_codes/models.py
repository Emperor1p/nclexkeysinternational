from django.db import models
from django.utils import timezone
import uuid
from users.models import User

class RegistrationCode(models.Model):
    PROGRAM_CHOICES = [
        ('NIGERIA', 'Nigeria Program'),
        ('AFRICAN', 'African Program'),
        ('USA/CANADA', 'USA/Canada Program'),
        ('EUROPE', 'Europe Program'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=50, unique=True, db_index=True)
    program_type = models.CharField(max_length=50, choices=PROGRAM_CHOICES)
    is_used = models.BooleanField(default=False)
    used_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='registration_codes')
    created_at = models.DateTimeField(auto_now_add=True)
    used_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Registration Code'
        verbose_name_plural = 'Registration Codes'

    def __str__(self):
        return f"{self.code} ({self.program_type}) - {'Used' if self.is_used else 'Unused'}"

    @staticmethod
    def validate_code(code_value):
        """
        Validates a registration code.
        Returns {'valid': True, 'code': RegistrationCode_obj} or {'valid': False, 'error': 'message'}
        """
        try:
            code_obj = RegistrationCode.objects.get(code=code_value)
            if code_obj.is_used:
                return {'valid': False, 'error': 'This registration code has already been used.'}
            return {'valid': True, 'code': code_obj}
        except RegistrationCode.DoesNotExist:
            return {'valid': False, 'error': 'Invalid registration code.'}
        except Exception as e:
            return {'valid': False, 'error': f'An error occurred during code validation: {e}'}

    def mark_as_used(self, user_obj):
        """Marks the code as used and links it to a user."""
        if not self.is_used:
            self.is_used = True
            self.used_at = timezone.now()
            self.used_by = user_obj
            self.save()
            return True
        return False