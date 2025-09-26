"""
Database configuration for NCLEX Keys Platform
AWS RDS PostgreSQL Configuration
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# RDS Database Configuration
RDS_DATABASE_CONFIG = {
    'ENGINE': 'django.db.backends.postgresql',
    'NAME': 'nclexkeysdb',
    'USER': 'nclexkeysdb',
    'PASSWORD': 'nclexkeysinternational',
    'HOST': 'database-1.c9i8gmcwmltt.eu-north-1.rds.amazonaws.com',
    'PORT': '5432',
    'OPTIONS': {
        'sslmode': 'require',
        'connect_timeout': 10,
    },
    'CONN_MAX_AGE': 600,
    'CONN_HEALTH_CHECKS': True,
}

# Alternative DATABASE_URL format for dj_database_url
DATABASE_URL = 'postgresql://nclexkeysdb:nclexkeysinternational@database-1.c9i8gmcwmltt.eu-north-1.rds.amazonaws.com:5432/nclexkeysdb'

# Environment variables for database (can be overridden by .env file)
DB_NAME = os.getenv('DB_NAME', 'nclexkeysdb')
DB_HOST = os.getenv('DB_HOST', 'database-1.c9i8gmcwmltt.eu-north-1.rds.amazonaws.com')
DB_USER = os.getenv('DB_USER', 'nclexkeysdb')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'nclexkeysinternational')
DB_PORT = os.getenv('DB_PORT', '5432')

# Construct DATABASE_URL from environment variables
if os.getenv('DATABASE_URL'):
    DATABASE_URL = os.getenv('DATABASE_URL')
else:
    DATABASE_URL = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

print(f"Database URL: {DATABASE_URL.replace(DB_PASSWORD, '***')}")  # Hide password in logs
