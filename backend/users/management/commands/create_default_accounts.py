# users/management/commands/create_default_accounts.py
from django.core.management.base import BaseCommand
from django.core.management import CommandError
from users.models import User
import os


class Command(BaseCommand):
    help = 'Create default admin and instructor accounts for the system'

    def add_arguments(self, parser):
        parser.add_argument('--force', action='store_true', help='Force creation even if accounts exist')
        parser.add_argument('--admin-email', type=str, help='Admin email (default: admin@nclexkeys.com)')
        parser.add_argument('--admin-password', type=str, help='Admin password (default: admin123456)')
        parser.add_argument('--instructor-email', type=str, help='Instructor email (default: instructor@nclexkeys.com)')
        parser.add_argument('--instructor-password', type=str, help='Instructor password (default: instructor123456)')

    def handle(self, *args, **options):
        force = options.get('force', False)
        
        # Get credentials from arguments or environment variables
        admin_email = options.get('admin_email') or os.getenv('DEFAULT_ADMIN_EMAIL', 'admin@nclexkeys.com')
        admin_password = options.get('admin_password') or os.getenv('DEFAULT_ADMIN_PASSWORD', 'admin123456')
        admin_name = os.getenv('DEFAULT_ADMIN_NAME', 'NCLEX Keys Admin')
        
        instructor_email = options.get('instructor_email') or os.getenv('DEFAULT_INSTRUCTOR_EMAIL', 'instructor@nclexkeys.com')
        instructor_password = options.get('instructor_password') or os.getenv('DEFAULT_INSTRUCTOR_PASSWORD', 'instructor123456')
        instructor_name = os.getenv('DEFAULT_INSTRUCTOR_NAME', 'NCLEX Keys Instructor')
        
        # Create admin account
        if force or not User.objects.filter(email=admin_email).exists():
            try:
                if User.objects.filter(email=admin_email).exists() and force:
                    User.objects.filter(email=admin_email).delete()
                    self.stdout.write(f"Deleted existing admin account: {admin_email}")
                
                admin_user = User.objects.create_superuser(
                    email=admin_email,
                    password=admin_password,
                    full_name=admin_name,
                    role='instructor'  # Set as instructor for admin dashboard access
                )
                
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✅ Admin account created successfully!\n'
                        f'   Email: {admin_email}\n'
                        f'   Password: {admin_password}\n'
                        f'   Name: {admin_name}\n'
                        f'   Role: {admin_user.role}\n'
                        f'   Staff: {admin_user.is_staff}\n'
                        f'   Superuser: {admin_user.is_superuser}'
                    )
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'❌ Error creating admin account: {e}')
                )
        else:
            self.stdout.write(f"ℹ️  Admin account already exists: {admin_email}")
        
        # Create instructor account
        if force or not User.objects.filter(email=instructor_email).exists():
            try:
                if User.objects.filter(email=instructor_email).exists() and force:
                    User.objects.filter(email=instructor_email).delete()
                    self.stdout.write(f"Deleted existing instructor account: {instructor_email}")
                
                instructor_user = User.objects.create(
                    email=instructor_email,
                    full_name=instructor_name,
                    role='instructor',
                    username=instructor_email,
                    is_email_verified=True,
                    is_staff=True
                )
                instructor_user.set_password(instructor_password)
                instructor_user.save()
                
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✅ Instructor account created successfully!\n'
                        f'   Email: {instructor_email}\n'
                        f'   Password: {instructor_password}\n'
                        f'   Name: {instructor_name}\n'
                        f'   Role: {instructor_user.role}\n'
                        f'   Staff: {instructor_user.is_staff}'
                    )
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'❌ Error creating instructor account: {e}')
                )
        else:
            self.stdout.write(f"ℹ️  Instructor account already exists: {instructor_email}")
        
        self.stdout.write(
            self.style.SUCCESS(
                '\n🎯 Default accounts created! You can now login to the admin dashboard.\n'
                '📧 Admin Login: Use the admin credentials above\n'
                '👨‍🏫 Instructor Login: Use the instructor credentials above\n'
                '🔗 Admin Dashboard: /admin (Django admin) or /admin (custom admin dashboard)'
            )
        )
