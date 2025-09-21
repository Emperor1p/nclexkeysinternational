from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.management import call_command
from django.db import connection
import logging
import os

logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["POST"])
def setup_database(request):
    """
    Setup database by running migrations and creating default instructor
    POST /api/setup/database/
    """
    try:
        # Check if we're in production (basic security check)
        if not os.getenv('DEBUG', 'False').lower() == 'true':
            # Only allow in production if there's a specific setup token
            setup_token = request.headers.get('X-Setup-Token')
            if setup_token != os.getenv('SETUP_TOKEN', 'your-setup-token-here'):
                return JsonResponse({'error': 'Unauthorized'}, status=401)
        
        logger.info("Starting database setup...")
        
        # Run migrations
        call_command('migrate', verbosity=0)
        logger.info("Migrations completed")
        
        # Create default instructor
        call_command('create_default_instructor', verbosity=0)
        logger.info("Default instructor created")
        
        # Check tables
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE'
                ORDER BY table_name;
            """)
            tables = cursor.fetchall()
            table_names = [table[0] for table in tables]
        
        return JsonResponse({
            'success': True,
            'message': 'Database setup completed successfully',
            'tables_created': len(table_names),
            'tables': table_names,
            'instructor_created': True
        })
        
    except Exception as e:
        logger.error(f"Database setup error: {str(e)}")
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@require_http_methods(["GET"])
def check_database_status(request):
    """
    Check database status and tables
    GET /api/setup/status/
    """
    try:
        with connection.cursor() as cursor:
            # Check if users table exists
            cursor.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'users'
                );
            """)
            users_table_exists = cursor.fetchone()[0]
            
            # Get all tables
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE'
                ORDER BY table_name;
            """)
            tables = cursor.fetchall()
            table_names = [table[0] for table in tables]
            
            # Check if instructor exists
            instructor_exists = False
            if users_table_exists:
                cursor.execute("SELECT COUNT(*) FROM users WHERE email = 'instructor@nclexkeys.com'")
                instructor_count = cursor.fetchone()[0]
                instructor_exists = instructor_count > 0
        
        return JsonResponse({
            'database_connected': True,
            'users_table_exists': users_table_exists,
            'instructor_exists': instructor_exists,
            'total_tables': len(table_names),
            'tables': table_names
        })
        
    except Exception as e:
        logger.error(f"Database status check error: {str(e)}")
        return JsonResponse({
            'database_connected': False,
            'error': str(e)
        }, status=500)
