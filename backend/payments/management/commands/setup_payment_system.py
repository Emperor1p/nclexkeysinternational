# payments/management/commands/setup_payment_system.py
from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.conf import settings
from django.db import connection
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Setup complete payment system including migrations and gateway'

    def handle(self, *args, **options):
        self.stdout.write('Setting up complete payment system...')
        
        try:
            # Step 1: Run migrations
            self.stdout.write('Step 1: Running database migrations...')
            call_command('migrate', 'payments', verbosity=0)
            self.stdout.write(self.style.SUCCESS('✅ Migrations completed'))
            
            # Step 2: Check if tables exist
            self.stdout.write('Step 2: Verifying database tables...')
            with connection.cursor() as cursor:
                # Check payment_gateways table
                cursor.execute("""
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables 
                        WHERE table_name = 'payment_gateways'
                    );
                """)
                gateways_table_exists = cursor.fetchone()[0]
                
                # Check payments table
                cursor.execute("""
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables 
                        WHERE table_name = 'payments'
                    );
                """)
                payments_table_exists = cursor.fetchone()[0]
                
                if gateways_table_exists:
                    self.stdout.write(self.style.SUCCESS('✅ payment_gateways table exists'))
                else:
                    self.stdout.write(self.style.ERROR('❌ payment_gateways table missing'))
                
                if payments_table_exists:
                    self.stdout.write(self.style.SUCCESS('✅ payments table exists'))
                else:
                    self.stdout.write(self.style.ERROR('❌ payments table missing'))
            
            # Step 3: Setup payment gateway
            self.stdout.write('Step 3: Setting up payment gateway...')
            call_command('setup_payment_gateway', verbosity=0)
            self.stdout.write(self.style.SUCCESS('✅ Payment gateway setup completed'))
            
            # Step 4: Verify setup
            self.stdout.write('Step 4: Verifying payment system...')
            from payments.models import PaymentGateway, Payment
            
            gateway_count = PaymentGateway.objects.count()
            payment_count = Payment.objects.count()
            
            self.stdout.write(f'Payment Gateways: {gateway_count}')
            self.stdout.write(f'Payments: {payment_count}')
            
            if gateway_count > 0:
                gateway = PaymentGateway.objects.first()
                self.stdout.write(f'Default Gateway: {gateway.name} ({gateway.display_name})')
                self.stdout.write(f'Gateway Active: {gateway.is_active}')
                self.stdout.write(f'Gateway Default: {gateway.is_default}')
            
            self.stdout.write(
                self.style.SUCCESS('🎉 Payment system setup completed successfully!')
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error setting up payment system: {str(e)}')
            )
            logger.error(f'Payment system setup error: {str(e)}')
            raise
