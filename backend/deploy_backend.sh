#!/bin/bash

# Backend Deployment Script for AWS EC2
# This script ensures the backend is properly configured and running

echo "🚀 Starting NCLEX Keys Backend Deployment..."
echo "=============================================="

# Set working directory
cd /home/ubuntu/nclexkey/backend

# Activate virtual environment
echo "📦 Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "📥 Installing/updating dependencies..."
pip install -r requirements.txt

# Install PostgreSQL client if not already installed
echo "🗄️  Ensuring PostgreSQL client is installed..."
pip install psycopg2-binary

# Test database connection
echo "🔍 Testing database connection..."
python test_postgres_connection.py

# Run Django migrations
echo "📋 Running Django migrations..."
python manage.py makemigrations
python manage.py migrate

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

# Create superuser if it doesn't exist
echo "👤 Checking for superuser..."
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@nclex.com', 'admin123')
    print("✅ Superuser 'admin' created with password 'admin123'")
else:
    print("✅ Superuser already exists")
EOF

# Test Django application
echo "🧪 Testing Django application..."
python manage.py check --deploy

# Restart Gunicorn service
echo "🔄 Restarting Gunicorn service..."
sudo systemctl restart gunicorn
sudo systemctl status gunicorn

# Restart Nginx
echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx
sudo systemctl status nginx

# Show service status
echo "📊 Service Status:"
echo "=================="
echo "Gunicorn status:"
sudo systemctl is-active gunicorn
echo "Nginx status:"
sudo systemctl is-active nginx

echo ""
echo "🎉 Backend deployment completed!"
echo "🌐 Backend URL: http://ec2-13-50-116-201.eu-north-1.compute.amazonaws.com:8000"
echo "📊 Admin panel: http://ec2-13-50-116-201.eu-north-1.compute.amazonaws.com:8000/admin"
echo "👤 Admin credentials: admin / admin123"
echo ""
echo "🔍 To check logs:"
echo "   sudo journalctl -u gunicorn -f"
echo "   sudo journalctl -u nginx -f"
