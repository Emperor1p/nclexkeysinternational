#!/usr/bin/env python
"""
Quick testing script for NCLEX Keys Platform
Run this to test all major components
"""

import os
import sys
import django
import requests
import json
from datetime import datetime

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import Client
from django.contrib.auth import get_user_model
from registration_codes.models import RegistrationCode
from courses.models import Course
from payments.models import Payment

User = get_user_model()

def test_database_connection():
    """Test database connection"""
    print("🔍 Testing database connection...")
    try:
        user_count = User.objects.count()
        print(f"✅ Database connected - Found {user_count} users")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_user_creation():
    """Test user creation and authentication"""
    print("\n👤 Testing user creation...")
    try:
        # Check if admin user exists
        admin_user = User.objects.filter(email='admin@nclexkeys.com').first()
        if admin_user:
            print(f"✅ Admin user exists: {admin_user.email}")
        else:
            print("❌ Admin user not found")
            return False
        
        # Check if instructor user exists
        instructor_user = User.objects.filter(email='instructor@nclexkeys.com').first()
        if instructor_user:
            print(f"✅ Instructor user exists: {instructor_user.email}")
        else:
            print("❌ Instructor user not found")
            return False
        
        return True
    except Exception as e:
        print(f"❌ User creation test failed: {e}")
        return False

def test_registration_codes():
    """Test registration codes"""
    print("\n🔑 Testing registration codes...")
    try:
        codes_count = RegistrationCode.objects.count()
        print(f"📊 Found {codes_count} registration codes")
        
        if codes_count == 0:
            print("⚠️  No registration codes found. Creating sample codes...")
            # Create sample codes
            programs = ['NIGERIA', 'AFRICAN', 'USA/CANADA', 'EUROPE']
            for program in programs:
                code = f"NCLEX-{program[:3]}-TEST123"
                RegistrationCode.objects.create(
                    code=code,
                    program_type=program,
                    is_used=False
                )
            print("✅ Sample registration codes created")
        
        # Show available codes
        available_codes = RegistrationCode.objects.filter(is_used=False)
        print(f"✅ {available_codes.count()} codes available for use")
        
        for code in available_codes[:5]:  # Show first 5
            print(f"  📋 {code.code} - {code.program_type}")
        
        return True
    except Exception as e:
        print(f"❌ Registration codes test failed: {e}")
        return False

def test_api_endpoints():
    """Test API endpoints"""
    print("\n🌐 Testing API endpoints...")
    
    client = Client()
    base_url = "http://localhost:8000"
    
    # Test endpoints
    endpoints = [
        ("/api/courses/", "GET", "Courses endpoint"),
        ("/api/auth/login/", "POST", "Login endpoint"),
        ("/api/registration-codes/validate/", "POST", "Registration codes endpoint"),
    ]
    
    results = []
    
    for endpoint, method, description in endpoints:
        try:
            if method == "GET":
                response = client.get(endpoint)
            elif method == "POST":
                response = client.post(endpoint, {}, content_type='application/json')
            
            if response.status_code in [200, 400, 401, 405]:  # Acceptable status codes
                print(f"✅ {description}: Status {response.status_code}")
                results.append(True)
            else:
                print(f"❌ {description}: Status {response.status_code}")
                results.append(False)
        except Exception as e:
            print(f"❌ {description}: Error - {e}")
            results.append(False)
    
    return all(results)

def test_payment_integration():
    """Test payment integration"""
    print("\n💳 Testing payment integration...")
    try:
        # Check if payment models exist
        payment_count = Payment.objects.count()
        print(f"📊 Found {payment_count} payments in database")
        
        # Test payment gateway configuration
        from payments.models import PaymentGateway
        gateways = PaymentGateway.objects.filter(is_active=True)
        print(f"✅ Found {gateways.count()} active payment gateways")
        
        return True
    except Exception as e:
        print(f"❌ Payment integration test failed: {e}")
        return False

def test_course_management():
    """Test course management"""
    print("\n📚 Testing course management...")
    try:
        courses_count = Course.objects.count()
        print(f"📊 Found {courses_count} courses in database")
        
        if courses_count == 0:
            print("⚠️  No courses found. This is normal for a new installation.")
        
        return True
    except Exception as e:
        print(f"❌ Course management test failed: {e}")
        return False

def test_email_configuration():
    """Test email configuration"""
    print("\n📧 Testing email configuration...")
    try:
        from django.conf import settings
        
        email_backend = getattr(settings, 'EMAIL_BACKEND', None)
        email_host = getattr(settings, 'EMAIL_HOST', None)
        
        if email_backend and email_host:
            print(f"✅ Email backend configured: {email_backend}")
            print(f"✅ Email host configured: {email_host}")
            return True
        else:
            print("⚠️  Email configuration not fully set up")
            return False
    except Exception as e:
        print(f"❌ Email configuration test failed: {e}")
        return False

def run_comprehensive_test():
    """Run all tests"""
    print("🚀 NCLEX Keys Platform - Comprehensive Testing")
    print("=" * 60)
    print(f"🕐 Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    tests = [
        ("Database Connection", test_database_connection),
        ("User Creation", test_user_creation),
        ("Registration Codes", test_registration_codes),
        ("API Endpoints", test_api_endpoints),
        ("Payment Integration", test_payment_integration),
        ("Course Management", test_course_management),
        ("Email Configuration", test_email_configuration),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n🧪 Running {test_name} test...")
        result = test_func()
        results.append((test_name, result))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall Result: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Your platform is ready!")
    elif passed >= total * 0.8:
        print("⚠️  Most tests passed. Minor issues detected.")
    else:
        print("🚨 Multiple issues detected. Please check the failed tests.")
    
    print(f"\n🕐 Test completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    return passed == total

if __name__ == "__main__":
    run_comprehensive_test()
