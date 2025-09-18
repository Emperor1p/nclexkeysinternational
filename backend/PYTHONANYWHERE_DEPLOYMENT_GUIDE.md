# 🚀 PythonAnywhere Deployment Guide for NCLEX Backend

## Prerequisites
- PythonAnywhere account (free tier available)
- GitHub repository access
- Domain name (optional)

## Step 1: Create PythonAnywhere Account
1. Go to [pythonanywhere.com](https://pythonanywhere.com)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create New Web App
1. Login to PythonAnywhere dashboard
2. Click **"Web"** tab
3. Click **"Add a new web app"**
4. Choose **"Manual Configuration"**
5. Select **"Python 3.11"** (or latest available)
6. Click **"Next"**

## Step 3: Clone Your Repository
1. Go to **"Files"** tab
2. Open a bash console
3. Run these commands:
```bash
cd ~
git clone https://github.com/Emperor1p/nclexkeysinternational.git
cd nclexkeysinternational/backend
```

## Step 4: Install Dependencies
```bash
# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install requirements
pip install -r requirements.pythonanywhere.txt
```

## Step 5: Configure Environment Variables
1. Create `.env` file in the backend directory:
```bash
nano .env
```

2. Copy content from `env.pythonanywhere.template` and update values:
```env
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourusername.pythonanywhere.com,www.yourusername.pythonanywhere.com
FRONTEND_URL=https://nclexintl.vercel.app
SITE_URL=https://yourusername.pythonanywhere.com
CORS_ALLOWED_ORIGINS=https://nclexintl.vercel.app,http://localhost:3000
JWT_SECRET_KEY=your-jwt-secret-key-here

# Paystack
PAYSTACK_PUBLIC_KEY=pk_live_9afe0ff4d8f81a67b5e799bd12a30551da1b0e19
PAYSTACK_SECRET_KEY=sk_live_36eb68b72a4a663e9dd4109431e7d4b0e66468d1
PAYSTACK_WEBHOOK_SECRET=https://yourusername.pythonanywhere.com/api/payments/webhooks/paystack/

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=nclexkeysintl.academy@gmail.com
EMAIL_HOST_PASSWORD=your-gmail-app-password
DEFAULT_FROM_EMAIL=Nclexkeys <nclexkeysintl.academy@gmail.com>

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Database (SQLite for free tier)
DATABASE_URL=sqlite:///db.sqlite3

# Security
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SECURE_HSTS_PRELOAD=True
DISABLE_RATE_LIMITING=False
TIME_ZONE=UTC
```

## Step 6: Database Setup
```bash
# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput
```

## Step 7: Configure Web App
1. Go back to **"Web"** tab
2. Click on your web app
3. Configure these settings:

### Source Code
- **Source code**: `/home/yourusername/nclexkeysinternational/backend`

### WSGI Configuration
- **WSGI configuration file**: `/var/www/yourusername_pythonanywhere_com_wsgi.py`

4. Edit the WSGI file:
```python
import os
import sys

# Add your project directory to the Python path
path = '/home/yourusername/nclexkeysinternational/backend'
if path not in sys.path:
    sys.path.append(path)

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Import Django WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

### Static Files
- **URL**: `/static/`
- **Directory**: `/home/yourusername/nclexkeysinternational/backend/staticfiles`

### Virtualenv
- **Path**: `/home/yourusername/nclexkeysinternational/backend/venv`

## Step 8: Reload Web App
1. Click **"Reload"** button
2. Your app should be live at: `https://yourusername.pythonanywhere.com`

## Step 9: Test Your Deployment
1. Visit your domain
2. Test API endpoints: `https://yourusername.pythonanywhere.com/api/`
3. Check admin panel: `https://yourusername.pythonanywhere.com/admin/`

## Troubleshooting

### Common Issues:
1. **Import Errors**: Check virtualenv path
2. **Static Files**: Run `collectstatic` command
3. **Database Errors**: Check DATABASE_URL
4. **Permission Errors**: Check file permissions

### Logs:
- Check **"Log files"** tab for error logs
- Use **"Console"** tab for debugging

## Free Tier Limitations:
- 512MB RAM
- 1 CPU core
- 1GB disk space
- 3 months renewal required
- No custom domains (free tier)

## Upgrading:
- **Hacker Plan**: $5/month - Custom domains, more resources
- **Web Developer Plan**: $20/month - More resources, always-on

## Security Notes:
- Use strong SECRET_KEY
- Enable HTTPS
- Keep dependencies updated
- Use environment variables for secrets

## Support:
- PythonAnywhere Help: [help.pythonanywhere.com](https://help.pythonanywhere.com)
- Django Documentation: [docs.djangoproject.com](https://docs.djangoproject.com)

---

**Your backend will be live at: `https://yourusername.pythonanywhere.com`** 🎉