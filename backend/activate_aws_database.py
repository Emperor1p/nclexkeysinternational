#!/usr/bin/env python
"""
Activate and verify AWS RDS PostgreSQL database
"""
import os
import sys
import django
from django.conf import settings

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import connection
from django.core.management import execute_from_command_line

def activate_aws_database():
    """Activate and verify AWS RDS PostgreSQL database"""
    print("🚀 Activating AWS RDS PostgreSQL Database...")
    print("=" * 60)
    
    # Database configuration
    db_config = {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'nclexkeysdb'),
        'USER': os.getenv('DB_USER', 'nclexkeysdb'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'nclexkeysinternational'),
        'HOST': os.getenv('DB_HOST', 'database-1.c9i8gmcwmltt.eu-north-1.rds.amazonaws.com'),
        'PORT': os.getenv('DB_PORT', '5432'),
        'OPTIONS': {
            'sslmode': 'require',
        },
    }
    
    print(f"📊 Database Configuration:")
    print(f"   Host: {db_config['HOST']}")
    print(f"   Database: {db_config['NAME']}")
    print(f"   User: {db_config['USER']}")
    print(f"   Port: {db_config['PORT']}")
    print(f"   SSL: Required")
    
    try:
        # Test database connection
        print("\n🔍 Testing database connection...")
        with connection.cursor() as cursor:
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            print(f"✅ Database connection successful!")
            print(f"📊 PostgreSQL version: {version[0]}")
            
            # Check if database is active
            cursor.execute("SELECT current_database(), current_user, inet_server_addr(), inet_server_port();")
            db_info = cursor.fetchone()
            print(f"📊 Connected to: {db_info[0]}")
            print(f"📊 User: {db_info[1]}")
            print(f"📊 Server: {db_info[2]}:{db_info[3]}")
            
            # Check if our tables exist
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE'
                ORDER BY table_name;
            """)
            tables = cursor.fetchall()
            
            if tables:
                print(f"\n📋 Found {len(tables)} tables in database:")
                for table in tables:
                    print(f"   - {table[0]}")
            else:
                print("\n⚠️  No tables found. Run migrations first.")
                
    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")
        print("\n🔧 Troubleshooting steps:")
        print("   1. Check if RDS instance is running")
        print("   2. Verify security groups allow connection")
        print("   3. Check database credentials")
        print("   4. Ensure SSL is properly configured")
        return False
    
    print("\n" + "=" * 60)
    print("✅ AWS RDS PostgreSQL database is active and ready!")
    return True

def run_migrations():
    """Run database migrations"""
    print("\n🔄 Running database migrations...")
    try:
        execute_from_command_line(['manage.py', 'migrate'])
        print("✅ Migrations completed successfully!")
        return True
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        return False

def create_default_data():
    """Create default admin and instructor accounts"""
    print("\n👤 Creating default accounts...")
    try:
        execute_from_command_line(['manage.py', 'create_default_accounts'])
        print("✅ Default accounts created successfully!")
        return True
    except Exception as e:
        print(f"❌ Failed to create default accounts: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 AWS Database Activation Script")
    print("=" * 60)
    
    # Activate database
    if activate_aws_database():
        print("\n🔄 Proceeding with database setup...")
        
        # Run migrations
        if run_migrations():
            print("\n👤 Creating default data...")
            create_default_data()
            
            print("\n🎉 AWS database is fully activated and ready!")
            print("✅ Backend is ready to serve requests")
        else:
            print("\n❌ Database setup incomplete")
    else:
        print("\n❌ Database activation failed")
        print("Please check your AWS RDS configuration and try again.")
