#!/usr/bin/env python3
"""
Test script to verify database setup on Render
Run this to check if the database is properly configured
"""

import requests
import json

def test_database_setup():
    base_url = "https://nclexkeysinternational.onrender.com"
    
    print("🔍 Testing Render backend database setup...")
    print(f"🌐 Backend URL: {base_url}")
    
    # Test 1: Check if backend is running
    try:
        response = requests.get(f"{base_url}/api/setup/status/", timeout=10)
        print(f"✅ Backend Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"📊 Database Status:")
            print(f"   - Connected: {data.get('database_connected', False)}")
            print(f"   - Users table exists: {data.get('users_table_exists', False)}")
            print(f"   - Instructor exists: {data.get('instructor_exists', False)}")
            print(f"   - Total tables: {data.get('total_tables', 0)}")
            
            if not data.get('users_table_exists', False):
                print("\n🚨 Database needs setup!")
                return setup_database(base_url)
            else:
                print("✅ Database is properly set up!")
                return True
        else:
            print(f"❌ Backend error: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {e}")
        return False

def setup_database(base_url):
    print("\n🔧 Setting up database...")
    try:
        response = requests.post(f"{base_url}/api/setup/database/", timeout=30)
        print(f"📊 Setup Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Database setup successful!")
            print(f"   - Tables created: {data.get('tables_created', 0)}")
            print(f"   - Instructor created: {data.get('instructor_created', False)}")
            return True
        else:
            print(f"❌ Setup failed: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Setup error: {e}")
        return False

if __name__ == "__main__":
    success = test_database_setup()
    if success:
        print("\n🎉 Database setup completed successfully!")
        print("🔑 You can now login with:")
        print("   Email: instructor@nclexkeys.com")
        print("   Password: instructor123")
    else:
        print("\n❌ Database setup failed. Please check the logs.")
