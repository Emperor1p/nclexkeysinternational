# payments/debug_views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.conf import settings
from django.db import connection
import logging

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([AllowAny])
def debug_payment_system(request):
    """
    Debug endpoint to check payment system status
    GET /api/payments/debug-system/
    """
    try:
        debug_info = {
            'timestamp': '2025-01-18T00:30:00Z',
            'backend_url': 'https://nclexkeysinternational.onrender.com',
            'environment': 'production',
            'debug': True
        }
        
        # Check database connection
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                debug_info['database_connection'] = 'OK'
        except Exception as e:
            debug_info['database_connection'] = f'ERROR: {str(e)}'
        
        # Check PaymentGateway table
        try:
            from .models import PaymentGateway
            gateway_count = PaymentGateway.objects.count()
            debug_info['payment_gateways'] = {
                'table_exists': True,
                'count': gateway_count
            }
            
            # List existing gateways
            gateways = PaymentGateway.objects.all()
            debug_info['gateways'] = [
                {
                    'name': g.name,
                    'display_name': g.display_name,
                    'is_active': g.is_active,
                    'is_default': g.is_default
                } for g in gateways
            ]
        except Exception as e:
            debug_info['payment_gateways'] = {
                'table_exists': False,
                'error': str(e)
            }
        
        # Check Paystack settings
        debug_info['paystack_settings'] = {
            'public_key_set': bool(getattr(settings, 'PAYSTACK_PUBLIC_KEY', None)),
            'secret_key_set': bool(getattr(settings, 'PAYSTACK_SECRET_KEY', None)),
            'webhook_secret_set': bool(getattr(settings, 'PAYSTACK_WEBHOOK_SECRET', None)),
            'public_key_preview': getattr(settings, 'PAYSTACK_PUBLIC_KEY', '')[:20] + '...' if getattr(settings, 'PAYSTACK_PUBLIC_KEY', None) else 'Not set'
        }
        
        # Check Payment table
        try:
            from .models import Payment
            payment_count = Payment.objects.count()
            debug_info['payments'] = {
                'table_exists': True,
                'count': payment_count
            }
        except Exception as e:
            debug_info['payments'] = {
                'table_exists': False,
                'error': str(e)
            }
        
        return Response({
            'success': True,
            'debug_info': debug_info
        })
        
    except Exception as e:
        logger.error(f"Debug payment system error: {str(e)}")
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_test_gateway(request):
    """
    Create a test payment gateway for debugging
    POST /api/payments/create-test-gateway/
    """
    try:
        from .models import PaymentGateway
        
        # Create or get Paystack gateway
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
                'transaction_fee_percentage': 0.0150,
                'transaction_fee_cap': 2000.00,
                'supports_transfers': True,
                'minimum_transfer_amount': 1000.00
            }
        )
        
        return Response({
            'success': True,
            'gateway': {
                'id': str(gateway.id),
                'name': gateway.name,
                'display_name': gateway.display_name,
                'is_active': gateway.is_active,
                'is_default': gateway.is_default,
                'created': created
            }
        })
        
    except Exception as e:
        logger.error(f"Create test gateway error: {str(e)}")
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def setup_payment_system(request):
    """
    Setup complete payment system including migrations
    POST /api/payments/setup-system/
    """
    try:
        from django.core.management import call_command
        from django.db import connection
        from io import StringIO
        import sys
        
        # Capture output
        old_stdout = sys.stdout
        sys.stdout = captured_output = StringIO()
        
        try:
            # Run migrations
            call_command('migrate', 'payments', verbosity=0)
            
            # Setup payment gateway
            call_command('setup_payment_gateway', verbosity=0)
            
            # Get output
            output = captured_output.getvalue()
            
            # Check if tables exist now
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables 
                        WHERE table_name = 'payment_gateways'
                    );
                """)
                gateways_table_exists = cursor.fetchone()[0]
                
                cursor.execute("""
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables 
                        WHERE table_name = 'payments'
                    );
                """)
                payments_table_exists = cursor.fetchone()[0]
            
            return Response({
                'success': True,
                'message': 'Payment system setup completed',
                'output': output,
                'tables_created': {
                    'payment_gateways': gateways_table_exists,
                    'payments': payments_table_exists
                }
            })
            
        finally:
            sys.stdout = old_stdout
        
    except Exception as e:
        logger.error(f"Setup payment system error: {str(e)}")
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_payment_tables(request):
    """
    Create payment tables using raw SQL
    POST /api/payments/create-tables/
    """
    try:
        from django.db import connection
        
        # SQL to create payment_gateways table
        create_gateways_sql = """
        CREATE TABLE IF NOT EXISTS payment_gateways (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(50) UNIQUE NOT NULL,
            display_name VARCHAR(100) NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            is_default BOOLEAN DEFAULT FALSE,
            public_key VARCHAR(255),
            secret_key VARCHAR(255),
            webhook_secret VARCHAR(255),
            supported_currencies JSONB DEFAULT '[]',
            transaction_fee_percentage DECIMAL(5,4) DEFAULT 0.0150,
            transaction_fee_cap DECIMAL(10,2),
            supports_transfers BOOLEAN DEFAULT FALSE,
            minimum_transfer_amount DECIMAL(10,2) DEFAULT 1000.00,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        """
        
        # SQL to create payments table
        create_payments_sql = """
        CREATE TABLE IF NOT EXISTS payments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            reference VARCHAR(100) UNIQUE NOT NULL,
            gateway_id UUID REFERENCES payment_gateways(id) ON DELETE RESTRICT,
            gateway_reference VARCHAR(255),
            user_id UUID REFERENCES users_user(id) ON DELETE CASCADE,
            course_id UUID REFERENCES courses_course(id) ON DELETE CASCADE,
            amount DECIMAL(12,2) NOT NULL,
            currency VARCHAR(3) DEFAULT 'NGN',
            gateway_fee DECIMAL(10,2) DEFAULT 0.00,
            platform_fee DECIMAL(10,2) DEFAULT 0.00,
            net_amount DECIMAL(12,2),
            status VARCHAR(20) DEFAULT 'pending',
            payment_method VARCHAR(50),
            customer_email VARCHAR(255) NOT NULL,
            customer_name VARCHAR(255),
            customer_phone VARCHAR(20),
            metadata JSONB DEFAULT '{}',
            authorization_code VARCHAR(255),
            card_type VARCHAR(20),
            last_4_digits VARCHAR(4),
            exp_month VARCHAR(2),
            exp_year VARCHAR(4),
            bank VARCHAR(100),
            initiated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            paid_at TIMESTAMP WITH TIME ZONE,
            failed_at TIMESTAMP WITH TIME ZONE,
            gateway_response JSONB DEFAULT '{}',
            failure_reason TEXT,
            callback_url VARCHAR(500),
            webhook_verified BOOLEAN DEFAULT FALSE,
            ip_address INET,
            user_agent TEXT
        );
        """
        
        # SQL to create indexes
        create_indexes_sql = """
        CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(reference);
        CREATE INDEX IF NOT EXISTS idx_payments_user_status ON payments(user_id, status);
        CREATE INDEX IF NOT EXISTS idx_payments_course ON payments(course_id);
        CREATE INDEX IF NOT EXISTS idx_payments_status_initiated ON payments(status, initiated_at);
        CREATE INDEX IF NOT EXISTS idx_payments_gateway_reference ON payments(gateway_reference);
        """
        
        # SQL to insert default Paystack gateway
        insert_gateway_sql = """
        INSERT INTO payment_gateways (
            name, display_name, is_active, is_default, 
            public_key, secret_key, webhook_secret,
            supported_currencies, transaction_fee_percentage, 
            transaction_fee_cap, supports_transfers, minimum_transfer_amount
        ) VALUES (
            'paystack', 'Paystack', TRUE, TRUE,
            'pk_live_9afe0ff4d8f81a67b5e799bd12a30551da1b0e19',
            'sk_live_your_live_paystack_secret_key_here',
            '',
            '["NGN", "USD", "GHS", "KES"]',
            0.0150,
            2000.00,
            TRUE,
            1000.00
        ) ON CONFLICT (name) DO UPDATE SET
            is_active = TRUE,
            is_default = TRUE,
            public_key = EXCLUDED.public_key,
            secret_key = EXCLUDED.secret_key,
            webhook_secret = EXCLUDED.webhook_secret,
            updated_at = NOW();
        """
        
        # Execute SQL statements
        with connection.cursor() as cursor:
            cursor.execute(create_gateways_sql)
            cursor.execute(create_payments_sql)
            cursor.execute(create_indexes_sql)
            cursor.execute(insert_gateway_sql)
        
        # Verify tables exist
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT table_name FROM information_schema.tables 
                WHERE table_name IN ('payment_gateways', 'payments')
                ORDER BY table_name;
            """)
            tables = cursor.fetchall()
            
            cursor.execute("SELECT COUNT(*) FROM payment_gateways;")
            gateway_count = cursor.fetchone()[0]
        
        return Response({
            'success': True,
            'message': 'Payment tables created successfully',
            'tables_created': [table[0] for table in tables],
            'gateway_count': gateway_count
        })
        
    except Exception as e:
        logger.error(f"Create payment tables error: {str(e)}")
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
