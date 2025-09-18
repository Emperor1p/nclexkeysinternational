# payments/management/commands/setup_payment_gateway.py
from django.core.management.base import BaseCommand
from django.conf import settings
from payments.models import PaymentGateway
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Setup initial payment gateway configuration'

    def handle(self, *args, **options):
        self.stdout.write('Setting up payment gateway...')
        
        try:
            # Create or update Paystack gateway
            gateway, created = PaymentGateway.objects.get_or_create(
                name='paystack',
                defaults={
                    'display_name': 'Paystack',
                    'is_active': True,
                    'is_default': True,
                    'public_key': getattr(settings, 'PAYSTACK_PUBLIC_KEY', 'pk_live_9afe0ff4d8f81a67b5e799bd12a30551da1b0e19'),
                    'secret_key': getattr(settings, 'PAYSTACK_SECRET_KEY', 'sk_live_your_live_paystack_secret_key_here'),
                    'webhook_secret': getattr(settings, 'PAYSTACK_WEBHOOK_SECRET', ''),
                    'supported_currencies': ['NGN', 'USD', 'GHS', 'KES'],
                    'transaction_fee_percentage': 0.0150,  # 1.5%
                    'transaction_fee_cap': 2000.00,  # 2000 NGN cap
                    'supports_transfers': True,
                    'minimum_transfer_amount': 1000.00
                }
            )
            
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully created Paystack gateway: {gateway.id}')
                )
            else:
                # Update existing gateway with current settings
                gateway.public_key = getattr(settings, 'PAYSTACK_PUBLIC_KEY', 'pk_live_9afe0ff4d8f81a67b5e799bd12a30551da1b0e19')
                gateway.secret_key = getattr(settings, 'PAYSTACK_SECRET_KEY', 'sk_live_your_live_paystack_secret_key_here')
                gateway.webhook_secret = getattr(settings, 'PAYSTACK_WEBHOOK_SECRET', '')
                gateway.is_active = True
                gateway.is_default = True
                gateway.save()
                
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully updated Paystack gateway: {gateway.id}')
                )
            
            # Display gateway info
            self.stdout.write(f'Gateway ID: {gateway.id}')
            self.stdout.write(f'Name: {gateway.name}')
            self.stdout.write(f'Display Name: {gateway.display_name}')
            self.stdout.write(f'Active: {gateway.is_active}')
            self.stdout.write(f'Default: {gateway.is_default}')
            self.stdout.write(f'Public Key: {gateway.public_key[:20]}...')
            self.stdout.write(f'Secret Key: {"*" * 20}...')
            self.stdout.write(f'Supported Currencies: {gateway.supported_currencies}')
            
            # Check if we have valid Paystack keys
            public_key = getattr(settings, 'PAYSTACK_PUBLIC_KEY', '')
            secret_key = getattr(settings, 'PAYSTACK_SECRET_KEY', '')
            
            if public_key and secret_key:
                if public_key.startswith('pk_live_'):
                    self.stdout.write(
                        self.style.SUCCESS('✅ Live Paystack keys detected')
                    )
                elif public_key.startswith('pk_test_'):
                    self.stdout.write(
                        self.style.WARNING('⚠️  Test Paystack keys detected')
                    )
                else:
                    self.stdout.write(
                        self.style.ERROR('❌ Invalid Paystack public key format')
                    )
            else:
                self.stdout.write(
                    self.style.ERROR('❌ Paystack keys not found in environment variables')
                )
            
            self.stdout.write(
                self.style.SUCCESS('Payment gateway setup completed successfully!')
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error setting up payment gateway: {str(e)}')
            )
            logger.error(f'Payment gateway setup error: {str(e)}')
            raise
