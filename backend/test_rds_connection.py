#!/usr/bin/env python3
"""
Test script to verify RDS PostgreSQL database connection
Run this script to test if the database connection is working properly
"""

import os
import sys
import django
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Setup Django
django.setup()

def test_database_connection():
    """Test the database connection"""
    try:
        from django.db import connection
        from django.core.management import execute_from_command_line
        
        print("🔍 Testing RDS PostgreSQL Database Connection...")
        print("=" * 50)
        
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
            
        # Test if we can create a simple table (and drop it)
        with connection.cursor() as cursor:
            cursor.execute("""
                CREATE TEMPORARY TABLE test_connection (
                    id SERIAL PRIMARY KEY,
                    test_data VARCHAR(100)
                );
            """)
            cursor.execute("INSERT INTO test_connection (test_data) VALUES ('RDS connection test successful');")
            cursor.execute("SELECT test_data FROM test_connection;")
            result = cursor.fetchone()
            print(f"🧪 Test query result: {result[0]}")
            
        print("=" * 50)
        print("🎉 All database tests passed! RDS connection is working properly.")
        return True
        
    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")
        print("=" * 50)
        print("🔧 Troubleshooting steps:")
        print("1. Check if RDS instance is running")
        print("2. Verify security group allows connections on port 5432")
        print("3. Check database credentials")
        print("4. Ensure VPC/subnet configuration is correct")
        return False

def test_django_models():
    """Test Django model operations"""
    try:
        print("\n🔍 Testing Django Model Operations...")
        print("=" * 50)
        
        # Test if we can import models
        from users.models import User
        print("✅ User model imported successfully")
        
        # Test database table existence
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE'
                ORDER BY table_name;
            """)
            tables = cursor.fetchall()
            print(f"📋 Found {len(tables)} tables in database:")
            for table in tables[:10]:  # Show first 10 tables
                print(f"   - {table[0]}")
            if len(tables) > 10:
                print(f"   ... and {len(tables) - 10} more tables")
                
        print("✅ Django model operations successful")
        return True
        
    except Exception as e:
        print(f"❌ Django model test failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 NCLEX Keys RDS Database Connection Test")
    print("=" * 60)
    
    # Test basic connection
    connection_ok = test_database_connection()
    
    if connection_ok:
        # Test Django models
        models_ok = test_django_models()
        
        if models_ok:
            print("\n🎉 All tests passed! Your RDS database is ready to use.")
            sys.exit(0)
        else:
            print("\n⚠️  Database connection works, but Django models need attention.")
            print("💡 Try running: python manage.py migrate")
            sys.exit(1)
    else:
        print("\n❌ Database connection failed. Please check your configuration.")
        sys.exit(1)
