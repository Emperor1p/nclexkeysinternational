#!/usr/bin/env python3
"""
Script to create default admin and instructor accounts for NCLEX Keys International
Run this script to create the default accounts that can be used to access the admin dashboard.
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User


def create_default_accounts():
    """Create default admin and instructor accounts"""
    
    print("🚀 Creating default admin and instructor accounts for NCLEX Keys International...")
    print("=" * 70)
    
    # Default credentials
    admin_email = "admin@nclexkeys.com"
    admin_password = "admin123456"
    admin_name = "NCLEX Keys Admin"
    
    instructor_email = "instructor@nclexkeys.com"
    instructor_password = "instructor123456"
    instructor_name = "NCLEX Keys Instructor"
    
    # Create admin account
    if not User.objects.filter(email=admin_email).exists():
        try:
            admin_user = User.objects.create_superuser(
                email=admin_email,
                password=admin_password,
                full_name=admin_name,
                role='admin'  # Set as admin for full system access
            )
            print(f"✅ Admin account created successfully!")
            print(f"   📧 Email: {admin_email}")
            print(f"   🔑 Password: {admin_password}")
            print(f"   👤 Name: {admin_name}")
            print(f"   🎯 Role: {admin_user.role}")
            print(f"   🔧 Staff: {admin_user.is_staff}")
            print(f"   👑 Superuser: {admin_user.is_superuser}")
        except Exception as e:
            print(f"❌ Error creating admin account: {e}")
    else:
        print(f"ℹ️  Admin account already exists: {admin_email}")
    
    print()
    
    # Create instructor account
    if not User.objects.filter(email=instructor_email).exists():
        try:
            instructor_user = User.objects.create(
                email=instructor_email,
                full_name=instructor_name,
                role='instructor',
                username=instructor_email,
                is_email_verified=True,
                is_staff=True
            )
            instructor_user.set_password(instructor_password)
            instructor_user.save()
            print(f"✅ Instructor account created successfully!")
            print(f"   📧 Email: {instructor_email}")
            print(f"   🔑 Password: {instructor_password}")
            print(f"   👤 Name: {instructor_name}")
            print(f"   🎯 Role: {instructor_user.role}")
            print(f"   🔧 Staff: {instructor_user.is_staff}")
        except Exception as e:
            print(f"❌ Error creating instructor account: {e}")
    else:
        print(f"ℹ️  Instructor account already exists: {instructor_email}")
    
    print()
    print("🎯 Default accounts setup complete!")
    print("=" * 70)
    print("📋 Login Information:")
    print(f"🔐 Admin Dashboard: {admin_email} / {admin_password}")
    print(f"👨‍🏫 Instructor Dashboard: {instructor_email} / {instructor_password}")
    print()
    print("🌐 Access URLs:")
    print("🏠 Frontend: https://nclex-cx5hhtc91-peters-projects-db86b6fd.vercel.app")
    print("🔧 Django Admin: https://ec2-13-50-116-201.eu-north-1.compute.amazonaws.com:8000/admin/")
    print("📊 Custom Admin Dashboard: https://nclex-cx5hhtc91-peters-projects-db86b6fd.vercel.app/admin")
    print("=" * 70)


if __name__ == "__main__":
    create_default_accounts()
