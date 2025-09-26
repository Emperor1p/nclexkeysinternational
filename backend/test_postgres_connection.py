#!/usr/bin/env python3
"""
Test PostgreSQL connection to AWS RDS
Run this script to verify database connectivity
"""

import os
import sys
import django
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Setup Django
django.setup()

from django.db import connection
from django.core.management import execute_from_command_line

def test_database_connection():
    """Test the database connection"""
    print("🔍 Testing PostgreSQL connection to AWS RDS...")
    print("=" * 50)
    
    try:
        # Test basic connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            print(f"✅ Database connection successful!")
            print(f"📊 PostgreSQL version: {version[0]}")
            
        # Test database name
        with connection.cursor() as cursor:
            cursor.execute("SELECT current_database();")
            db_name = cursor.fetchone()
            print(f"🗄️  Connected to database: {db_name[0]}")
            
        # Test user
        with connection.cursor() as cursor:
            cursor.execute("SELECT current_user;")
            user = cursor.fetchone()
            print(f"👤 Connected as user: {user[0]}")
            
        # Test if tables exist
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name;
            """)
            tables = cursor.fetchall()
            print(f"📋 Found {len(tables)} tables in database:")
            for table in tables[:10]:  # Show first 10 tables
                print(f"   - {table[0]}")
            if len(tables) > 10:
                print(f"   ... and {len(tables) - 10} more tables")
                
        print("\n🎉 Database connection test completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Database connection failed!")
        print(f"Error: {str(e)}")
        print("\n🔧 Troubleshooting steps:")
        print("1. Check if PostgreSQL client is installed: pip install psycopg2-binary")
        print("2. Verify RDS instance is running and accessible")
        print("3. Check security group allows port 5432")
        print("4. Verify database credentials in settings.py")
        return False

def test_django_models():
    """Test Django models and migrations"""
    print("\n🔍 Testing Django models and migrations...")
    print("=" * 50)
    
    try:
        # Check if migrations are needed
        print("📋 Checking migration status...")
        execute_from_command_line(['manage.py', 'showmigrations'])
        
        print("\n✅ Django models test completed!")
        return True
        
    except Exception as e:
        print(f"❌ Django models test failed!")
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 PostgreSQL Connection Test for NCLEX Keys Backend")
    print("=" * 60)
    
    # Test database connection
    db_success = test_database_connection()
    
    if db_success:
        # Test Django models
        models_success = test_django_models()
        
        if models_success:
            print("\n🎉 All tests passed! Backend is ready for production.")
        else:
            print("\n⚠️  Database connection works, but Django models need attention.")
    else:
        print("\n❌ Database connection failed. Please fix the connection first.")
    
    print("\n" + "=" * 60)
