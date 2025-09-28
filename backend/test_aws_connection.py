#!/usr/bin/env python
"""
Test AWS RDS PostgreSQL connection
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

def test_aws_rds_connection():
    """Test connection to AWS RDS PostgreSQL"""
    print("🔍 Testing AWS RDS PostgreSQL Connection...")
    print("=" * 50)
    
    try:
        # Test database connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            print(f"✅ Database connection successful!")
            print(f"📊 PostgreSQL version: {version[0]}")
            
            # Test if our tables exist
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name IN ('users_user', 'registration_codes_registrationcode', 'users_emailverification');
            """)
            tables = cursor.fetchall()
            
            if tables:
                print(f"✅ Found {len(tables)} application tables:")
                for table in tables:
                    print(f"   - {table[0]}")
            else:
                print("⚠️  No application tables found. Run migrations first.")
                
    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")
        return False
    
    print("\n" + "=" * 50)
    print("AWS RDS connection test completed!")
    return True

def check_environment_variables():
    """Check if all required environment variables are set"""
    print("\n🔧 Checking Environment Variables...")
    print("=" * 50)
    
    required_vars = [
        'DB_NAME',
        'DB_USER', 
        'DB_PASSWORD',
        'DB_HOST',
        'DB_PORT'
    ]
    
    missing_vars = []
    for var in required_vars:
        value = os.getenv(var)
        if value:
            print(f"✅ {var}: {'*' * len(value)} (set)")
        else:
            print(f"❌ {var}: Not set")
            missing_vars.append(var)
    
    if missing_vars:
        print(f"\n⚠️  Missing environment variables: {', '.join(missing_vars)}")
        print("💡 Set these in your EC2 instance or GitHub Secrets")
    else:
        print("\n✅ All required environment variables are set!")
    
    return len(missing_vars) == 0

if __name__ == "__main__":
    print("🚀 AWS Backend Configuration Test")
    print("=" * 50)
    
    # Check environment variables
    env_ok = check_environment_variables()
    
    # Test database connection
    if env_ok:
        db_ok = test_aws_rds_connection()
        
        if db_ok:
            print("\n🎉 AWS backend is properly configured!")
        else:
            print("\n❌ AWS backend needs configuration fixes.")
    else:
        print("\n⚠️  Please set the required environment variables first.")
