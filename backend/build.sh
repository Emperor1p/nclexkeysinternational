#!/usr/bin/env bash
set -o errexit  # Exit on error

echo "🚀 Starting Django deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.production.txt

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

# Run database migrations
echo "📊 Running database migrations..."
python manage.py migrate --noinput

# Create default instructor account
echo "👨‍🏫 Creating default instructor account..."
python manage.py create_default_instructor --noinput || echo "⚠️ Instructor creation failed or already exists"

echo "✅ Deployment completed successfully!"
