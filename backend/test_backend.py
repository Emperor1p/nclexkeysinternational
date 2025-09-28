#!/usr/bin/env python
"""
Simple backend test script to verify all endpoints are working
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

from django.test import TestCase, Client
from django.urls import reverse
import json

def test_backend_endpoints():
    """Test all backend endpoints"""
    client = Client()
    
    print("🧪 Testing Backend Endpoints...")
    print("=" * 50)
    
    # Test endpoints
    endpoints = [
        ('/api/auth/login/', 'POST'),
        ('/api/auth/register/', 'POST'),
        ('/api/auth/verify-email/', 'POST'),
        ('/api/auth/forgot-password/', 'POST'),
        ('/api/registration-codes/validate/', 'POST'),
        ('/api/courses/', 'GET'),
        ('/api/payments/initialize/', 'POST'),
    ]
    
    for endpoint, method in endpoints:
        try:
            if method == 'GET':
                response = client.get(endpoint)
            else:
                response = client.post(endpoint, {}, content_type='application/json')
            
            print(f"✅ {method} {endpoint} - Status: {response.status_code}")
            
            # Check if it's a 404 (endpoint doesn't exist)
            if response.status_code == 404:
                print(f"   ⚠️  Endpoint not found - may need to be created")
            elif response.status_code == 405:
                print(f"   ⚠️  Method not allowed - endpoint exists but method not supported")
            elif response.status_code >= 500:
                print(f"   ❌ Server error - check backend logs")
            else:
                print(f"   ✅ Endpoint is accessible")
                
        except Exception as e:
            print(f"❌ {method} {endpoint} - Error: {str(e)}")
    
    print("\n" + "=" * 50)
    print("Backend endpoint testing completed!")

if __name__ == "__main__":
    test_backend_endpoints()
