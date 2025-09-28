# users/signals.py
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.conf import settings
from .models import User
import os


@receiver(post_migrate)
def create_default_admin_accounts(sender, **kwargs):
    """
    Automatically create default admin and instructor accounts after migrations
    """
    # Only run this in production or when explicitly enabled
    if not settings.DEBUG and not os.getenv('CREATE_DEFAULT_ADMINS', 'false').lower() == 'true':
        return
    
    # Create default super admin
    admin_email = os.getenv('DEFAULT_ADMIN_EMAIL', 'admin@nclexkeys.com')
    admin_password = os.getenv('DEFAULT_ADMIN_PASSWORD', 'admin123456')
    admin_name = os.getenv('DEFAULT_ADMIN_NAME', 'NCLEX Keys Admin')
    
    if not User.objects.filter(email=admin_email).exists():
        try:
            admin_user = User.objects.create_superuser(
                email=admin_email,
                password=admin_password,
                full_name=admin_name,
                role='instructor'  # Set as instructor for admin dashboard access
            )
            print(f"✅ Default admin account created: {admin_email}")
        except Exception as e:
            print(f"❌ Error creating default admin: {e}")
    
    # Create default instructor
    instructor_email = os.getenv('DEFAULT_INSTRUCTOR_EMAIL', 'instructor@nclexkeys.com')
    instructor_password = os.getenv('DEFAULT_INSTRUCTOR_PASSWORD', 'instructor123456')
    instructor_name = os.getenv('DEFAULT_INSTRUCTOR_NAME', 'NCLEX Keys Instructor')
    
    if not User.objects.filter(email=instructor_email).exists():
        try:
            instructor_user = User.objects.create(
                email=instructor_email,
                password=instructor_password,
                full_name=instructor_name,
                role='instructor',
                username=instructor_email,
                is_email_verified=True,
                is_staff=True
            )
            instructor_user.set_password(instructor_password)
            instructor_user.save()
            print(f"✅ Default instructor account created: {instructor_email}")
        except Exception as e:
            print(f"❌ Error creating default instructor: {e}")
