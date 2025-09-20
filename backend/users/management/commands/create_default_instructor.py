# users/management/commands/create_default_instructor.py
from django.core.management.base import BaseCommand
from users.models import User
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Create a default instructor account for testing'

    def handle(self, *args, **options):
        try:
            # Default instructor credentials
            email = 'instructor@nclexkeys.com'
            password = 'instructor123'
            full_name = 'NCLEX Instructor'
            
            # Check if instructor already exists
            if User.objects.filter(email=email).exists():
                # Update existing instructor with correct permissions
                user = User.objects.get(email=email)
                user.role = 'instructor'
                user.is_staff = True
                user.is_superuser = True
                user.is_email_verified = True
                user.set_password(password)
                user.save()
                
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✅ Existing instructor account updated!\n'
                        f'📧 Email: {email}\n'
                        f'🔑 Password: {password}\n'
                        f'👤 Role: {user.role}\n'
                        f'🔐 Verified: {user.is_email_verified}\n'
                        f'👨‍💼 Staff: {user.is_staff}\n'
                        f'🛡️ Superuser: {user.is_superuser}'
                    )
                )
                return
            
            # Create instructor user
            user = User.objects.create(
                email=email,
                full_name=full_name,
                role='instructor',
                username=email,
                is_email_verified=True,  # Auto-verify instructors
                is_staff=True,  # Give staff permissions
                is_superuser=True  # Give superuser permissions for admin access
            )
            user.set_password(password)
            user.save()
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'✅ Default instructor account created successfully!\n'
                    f'📧 Email: {email}\n'
                    f'🔑 Password: {password}\n'
                    f'👤 Role: {user.role}\n'
                    f'🔐 Verified: {user.is_email_verified}\n'
                    f'👨‍💼 Staff: {user.is_staff}\n'
                    f'🛡️ Superuser: {user.is_superuser}'
                )
            )
            
            logger.info(f"Default instructor account created: {email}")
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error creating instructor: {str(e)}')
            )
            logger.error(f"Error creating default instructor: {str(e)}")
            raise e
