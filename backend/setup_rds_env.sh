#!/bin/bash

# Setup script for RDS Database Environment Variables
# Run this script on your EC2 server to configure the database

echo "Setting up RDS Database Environment Variables..."

# Create .env file with RDS credentials
cat > .env << EOF
# Environment Variables for NCLEX Keys Platform - PRODUCTION
# RDS PostgreSQL Database Configuration

# Database Configuration - AWS RDS PostgreSQL
DATABASE_URL=postgresql://nclexkeysdb:nclexkeysinternational@database-1.c9i8gmcwmltt.eu-north-1.rds.amazonaws.com:5432/nclexkeysdb
DB_NAME=nclexkeysdb
DB_HOST=database-1.c9i8gmcwmltt.eu-north-1.rds.amazonaws.com
DB_USER=nclexkeysdb
DB_PASSWORD=nclexkeysinternational
DB_PORT=5432

# Django Configuration
SECRET_KEY=nclex-keys-django-secret-key-2024-production
JWT_SECRET_KEY=nclex-keys-super-secret-jwt-key-2024-production
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com,*.vercel.app,*.onrender.com,ec2-13-50-116-201.eu-north-1.compute.amazonaws.com

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=nclexkeys@gmail.com
EMAIL_HOST_PASSWORD=your-app-password-here
DEFAULT_FROM_EMAIL=NCLEX <noreply@nclexkeys.com>

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dvmse886w
CLOUDINARY_API_KEY=489264838748466
CLOUDINARY_API_SECRET=qUYlv4AnJeqHCA6he_zH-qX_J9E

# Paystack Configuration (Live Credentials) - NCLEX KEYS
PAYSTACK_PUBLIC_KEY=pk_live_9afe0ff4d8f81a67b5e799bd12a30551da1b0e19
PAYSTACK_SECRET_KEY=sk_live_your_paystack_secret_key_here
PAYSTACK_WEBHOOK_SECRET=your_paystack_webhook_secret_here

# Flutterwave Configuration (Backup Payment)
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_your_flutterwave_public_key_here
FLUTTERWAVE_SECRET_KEY=FLWSECK_your_flutterwave_secret_key_here
FLUTTERWAVE_WEBHOOK_SECRET=your_flutterwave_webhook_secret_here
FLUTTERWAVE_ENCRYPTION_KEY=your_flutterwave_encryption_key_here

# Production Settings
DISABLE_RATE_LIMITING=False

# Bank Account Information
BANK_ACCOUNT_NUMBER=2046498146
BANK_NAME=First Bank of Nigeria
BANK_ACCOUNT_NAME=NCLEX KEYS

# CORS Settings
CORS_ALLOWED_ORIGINS=https://your-domain.vercel.app,https://nclexkeys.vercel.app,https://nclexkeysfrontend.s3.eu-north-1.amazonaws.com

# Frontend URL
FRONTEND_URL=https://nclexkeysfrontend.s3.eu-north-1.amazonaws.com
EOF

echo "✅ .env file created successfully!"
echo "📋 Environment variables configured for RDS database"
echo ""
echo "Next steps:"
echo "1. Install PostgreSQL client: sudo apt install postgresql-client"
echo "2. Test database connection: python manage.py dbshell"
echo "3. Run migrations: python manage.py migrate"
echo "4. Create superuser: python manage.py createsuperuser"
echo ""
echo "Database connection details:"
echo "Host: database-1.c9i8gmcwmltt.eu-north-1.rds.amazonaws.com"
echo "Port: 5432"
echo "Database: nclexkeysdb"
echo "User: nclexkeysdb"
