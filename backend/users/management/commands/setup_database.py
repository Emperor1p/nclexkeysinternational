from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.db import connection
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Setup database by running migrations and creating default instructor'

    def handle(self, *args, **options):
        try:
            self.stdout.write(self.style.SUCCESS('🚀 Starting database setup...'))
            
            # Step 1: Run migrations
            self.stdout.write('📊 Running database migrations...')
            call_command('migrate', verbosity=2)
            self.stdout.write(self.style.SUCCESS('✅ Migrations completed'))
            
            # Step 2: Create default instructor
            self.stdout.write('👨‍🏫 Creating default instructor account...')
            call_command('create_default_instructor')
            self.stdout.write(self.style.SUCCESS('✅ Default instructor created'))
            
            # Step 3: Check database tables
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_type = 'BASE TABLE'
                    ORDER BY table_name;
                """)
                tables = cursor.fetchall()
                self.stdout.write(self.style.SUCCESS(f'✅ Database tables created: {len(tables)} tables'))
                for table in tables:
                    self.stdout.write(f'   - {table[0]}')
            
            self.stdout.write(self.style.SUCCESS('🎉 Database setup completed successfully!'))
            self.stdout.write(self.style.WARNING('🔑 Default instructor credentials:'))
            self.stdout.write(self.style.WARNING('   Email: instructor@nclexkeys.com'))
            self.stdout.write(self.style.WARNING('   Password: instructor123'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Database setup failed: {str(e)}'))
            logger.error(f"Database setup error: {str(e)}")
            raise e
