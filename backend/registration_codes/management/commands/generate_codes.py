from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from registration_codes.models import RegistrationCode

User = get_user_model()

class Command(BaseCommand):
    help = 'Generate registration codes for different programs'

    def add_arguments(self, parser):
        parser.add_argument(
            '--program',
            type=str,
            choices=['nigeria', 'african', 'usa-canada', 'europe'],
            help='Program type to generate codes for'
        )
        parser.add_argument(
            '--count',
            type=int,
            default=10,
            help='Number of codes to generate (default: 10)'
        )
        parser.add_argument(
            '--admin-email',
            type=str,
            help='Email of admin user to create codes (default: first admin)'
        )

    def handle(self, *args, **options):
        program = options['program']
        count = options['count']
        admin_email = options['admin_email']

        # Get admin user
        if admin_email:
            try:
                admin_user = User.objects.get(email=admin_email, role='admin')
            except User.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'Admin user with email {admin_email} not found')
                )
                return
        else:
            admin_user = User.objects.filter(role='admin').first()
            if not admin_user:
                self.stdout.write(
                    self.style.ERROR('No admin user found. Please create an admin user first.')
                )
                return

        # Program pricing
        pricing = {
            'nigeria': {'amount': 30000, 'currency': 'NGN'},
            'african': {'amount': 35000, 'currency': 'NGN'},
            'usa-canada': {'amount': 60, 'currency': 'USD'},
            'europe': {'amount': 35, 'currency': 'GBP'},
        }

        if program:
            # Generate codes for specific program
            self.stdout.write(f'Generating {count} codes for {program} program...')
            
            for i in range(count):
                code = RegistrationCode.create_code(
                    program_type=program,
                    amount=pricing[program]['amount'],
                    currency=pricing[program]['currency'],
                    created_by=admin_user,
                    expires_in_days=30,
                    notes=f'Generated code #{i+1} for {program} program'
                )
                self.stdout.write(f'Generated code: {code.code}')
        else:
            # Generate codes for all programs
            self.stdout.write(f'Generating {count} codes for each program...')
            
            for program_type in pricing.keys():
                self.stdout.write(f'\nGenerating codes for {program_type} program:')
                
                for i in range(count):
                    code = RegistrationCode.create_code(
                        program_type=program_type,
                        amount=pricing[program_type]['amount'],
                        currency=pricing[program_type]['currency'],
                        created_by=admin_user,
                        expires_in_days=30,
                        notes=f'Generated code #{i+1} for {program_type} program'
                    )
                    self.stdout.write(f'  {code.code}')

        self.stdout.write(
            self.style.SUCCESS(f'Successfully generated {count} codes for {program or "all programs"}')
        )
