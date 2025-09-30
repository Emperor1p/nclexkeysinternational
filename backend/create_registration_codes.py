#!/usr/bin/env python
"""
Script to create registration codes for the NCLEX Keys platform
Run this script to generate registration codes for different programs
"""

import os
import sys
import django
import uuid
from datetime import datetime

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from registration_codes.models import RegistrationCode
from users.models import User

def generate_registration_codes():
    """Generate registration codes for all programs"""
    
    print("🚀 Generating Registration Codes for NCLEX Keys Platform")
    print("=" * 60)
    
    # Program configurations
    programs = [
        ('NIGERIA', 'Nigeria Program'),
        ('AFRICAN', 'African Program'), 
        ('USA/CANADA', 'USA/Canada Program'),
        ('EUROPE', 'Europe Program')
    ]
    
    codes_per_program = 5  # Generate 5 codes per program
    
    generated_codes = []
    
    for program_code, program_name in programs:
        print(f"\n📚 Generating codes for {program_name}:")
        print("-" * 40)
        
        for i in range(codes_per_program):
            # Generate a unique code
            code = f"NCLEX-{program_code[:3]}-{uuid.uuid4().hex[:8].upper()}"
            
            # Create registration code
            registration_code = RegistrationCode.objects.create(
                code=code,
                program_type=program_code,
                is_used=False
            )
            
            generated_codes.append(registration_code)
            print(f"  ✅ {code}")
    
    print(f"\n🎉 Successfully generated {len(generated_codes)} registration codes!")
    print("\n📋 Generated Codes Summary:")
    print("=" * 60)
    
    for code in generated_codes:
        status = "✅ Available" if not code.is_used else "❌ Used"
        print(f"{code.code} - {code.program_type} - {status}")
    
    print(f"\n💡 How to use these codes:")
    print("1. Share these codes with students who have made payment")
    print("2. Students enter the code during registration")
    print("3. Each code can only be used once")
    print("4. Codes are valid for 30 days from creation")
    
    return generated_codes

def show_existing_codes():
    """Show all existing registration codes"""
    
    print("📋 Existing Registration Codes")
    print("=" * 60)
    
    codes = RegistrationCode.objects.all().order_by('-created_at')
    
    if not codes.exists():
        print("❌ No registration codes found.")
        print("💡 Run this script to generate codes first.")
        return
    
    print(f"Found {codes.count()} registration codes:")
    print("-" * 60)
    
    for code in codes:
        status = "✅ Available" if not code.is_used else "❌ Used"
        used_by = f" (Used by: {code.used_by.email})" if code.used_by else ""
        created = code.created_at.strftime("%Y-%m-%d %H:%M")
        
        print(f"{code.code} - {code.program_type} - {status}{used_by} - Created: {created}")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Manage registration codes')
    parser.add_argument('--show', action='store_true', help='Show existing codes')
    parser.add_argument('--generate', action='store_true', help='Generate new codes')
    
    args = parser.parse_args()
    
    if args.show:
        show_existing_codes()
    elif args.generate:
        generate_registration_codes()
    else:
        print("NCLEX Keys Registration Code Manager")
        print("=" * 40)
        print("Usage:")
        print("  python create_registration_codes.py --show     # Show existing codes")
        print("  python create_registration_codes.py --generate # Generate new codes")
        print("\nOr run without arguments to see this help.")
