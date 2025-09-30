#!/usr/bin/env python
"""
Quick script to check existing registration codes and create some if none exist
"""

import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from registration_codes.models import RegistrationCode
import uuid

def check_and_create_codes():
    """Check if registration codes exist, create some if they don't"""
    
    print("🔍 Checking for existing registration codes...")
    
    # Check if any codes exist
    existing_codes = RegistrationCode.objects.all()
    
    if existing_codes.exists():
        print(f"✅ Found {existing_codes.count()} existing registration codes:")
        print("-" * 60)
        
        for code in existing_codes[:10]:  # Show first 10
            status = "✅ Available" if not code.is_used else "❌ Used"
            print(f"{code.code} - {code.program_type} - {status}")
        
        if existing_codes.count() > 10:
            print(f"... and {existing_codes.count() - 10} more codes")
        
        print(f"\n📊 Summary:")
        print(f"  Total codes: {existing_codes.count()}")
        print(f"  Available: {existing_codes.filter(is_used=False).count()}")
        print(f"  Used: {existing_codes.filter(is_used=True).count()}")
        
    else:
        print("❌ No registration codes found.")
        print("🚀 Creating sample registration codes...")
        
        # Create sample codes for each program
        programs = [
            ('NIGERIA', 'Nigeria Program'),
            ('AFRICAN', 'African Program'),
            ('USA/CANADA', 'USA/Canada Program'),
            ('EUROPE', 'Europe Program')
        ]
        
        created_codes = []
        
        for program_code, program_name in programs:
            print(f"\n📚 Creating codes for {program_name}:")
            
            # Create 3 codes per program
            for i in range(3):
                code = f"NCLEX-{program_code[:3]}-{uuid.uuid4().hex[:8].upper()}"
                
                registration_code = RegistrationCode.objects.create(
                    code=code,
                    program_type=program_code,
                    is_used=False
                )
                
                created_codes.append(registration_code)
                print(f"  ✅ {code}")
        
        print(f"\n🎉 Successfully created {len(created_codes)} registration codes!")
        
        print(f"\n📋 Sample codes for testing:")
        print("=" * 60)
        for code in created_codes:
            print(f"{code.code} - {code.program_type}")
    
    print(f"\n💡 How to access codes:")
    print("1. Django Admin: http://ec2-34-206-167-168.compute-1.amazonaws.com:8000/admin/")
    print("2. API Endpoint: GET /api/registration-codes/codes/ (Admin only)")
    print("3. Database: Check registration_codes_registrationcode table")
    
    return existing_codes.count() if existing_codes.exists() else len(created_codes)

if __name__ == "__main__":
    check_and_create_codes()
