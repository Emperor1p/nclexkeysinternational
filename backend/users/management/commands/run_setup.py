from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.db import connection
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Run database setup - migrations and create instructor'

    def handle(self, *args, **options):
        try:
            self.stdout.write(self.style.SUCCESS('🚀 Starting database setup...'))
            
            # Run migrations
            self.stdout.write('📊 Running database migrations...')
            call_command('migrate', verbosity=0)
            self.stdout.write(self.style.SUCCESS('✅ Migrations completed'))
            
            # Create default instructor
            self.stdout.write('👨‍🏫 Creating default instructor account...')
            try:
                call_command('create_default_instructor', verbosity=0)
                self.stdout.write(self.style.SUCCESS('✅ Default instructor created'))
            except Exception as e:
                self.stdout.write(self.style.WARNING(f'⚠️ Instructor creation: {str(e)}'))
            
            # Check database tables
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_type = 'BASE TABLE'
                    ORDER BY table_name;
                """)
                tables = cursor.fetchall()
                self.stdout.write(self.style.SUCCESS(f'✅ Database tables: {len(tables)}'))
                for table in tables:
                    self.stdout.write(f'   - {table[0]}')
            
            self.stdout.write(self.style.SUCCESS('🎉 Database setup completed!'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Setup failed: {str(e)}'))
            logger.error(f"Database setup error: {str(e)}")
            raise e
