# payments/management/commands/create_payment_tables.py
from django.core.management.base import BaseCommand
from django.db import connection
import os
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Create payment tables using raw SQL'

    def handle(self, *args, **options):
        self.stdout.write('Creating payment tables...')
        
        try:
            # Read SQL file
            sql_file_path = os.path.join(
                os.path.dirname(__file__), 
                '..', '..', 'sql', 'create_payment_tables.sql'
            )
            
            with open(sql_file_path, 'r') as f:
                sql_content = f.read()
            
            # Execute SQL
            with connection.cursor() as cursor:
                cursor.execute(sql_content)
            
            self.stdout.write(self.style.SUCCESS('✅ Payment tables created successfully!'))
            
            # Verify tables exist
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT table_name FROM information_schema.tables 
                    WHERE table_name IN ('payment_gateways', 'payments')
                    ORDER BY table_name;
                """)
                tables = cursor.fetchall()
                
                for table in tables:
                    self.stdout.write(f'✅ Table {table[0]} exists')
            
            # Check gateway count
            with connection.cursor() as cursor:
                cursor.execute("SELECT COUNT(*) FROM payment_gateways;")
                gateway_count = cursor.fetchone()[0]
                self.stdout.write(f'✅ Payment gateways: {gateway_count}')
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error creating payment tables: {str(e)}')
            )
            logger.error(f'Create payment tables error: {str(e)}')
            raise
