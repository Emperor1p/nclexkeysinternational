# AWS Deployment Guide for NCLEX Keys International

## 🚀 AWS Infrastructure Overview

This project uses the following AWS services:
- **EC2**: Backend server hosting
- **RDS PostgreSQL**: Database hosting
- **S3**: Static file storage (optional)
- **CloudFront**: CDN (optional)

## 📊 Database Configuration

### AWS RDS PostgreSQL Setup
- **Database Engine**: PostgreSQL
- **Instance**: database-1.c9i8gmcwmltt.eu-north-1.rds.amazonaws.com
- **Database Name**: nclexkeysdb
- **Username**: nclexkeysdb
- **Password**: nclexkeysinternational
- **Port**: 5432
- **SSL**: Required

### Environment Variables for Production
Set these environment variables on your EC2 instance:

```bash
# Database Configuration
export DB_NAME=nclexkeysdb
export DB_USER=nclexkeysdb
export DB_PASSWORD=nclexkeysinternational
export DB_HOST=database-1.c9i8gmcwmltt.eu-north-1.rds.amazonaws.com
export DB_PORT=5432

# Email Configuration
export EMAIL_HOST_PASSWORD=your_gmail_app_password

# Frontend URL
export FRONTEND_URL=https://nclex-cx5hhtc91-peters-projects-db86b6fd.vercel.app

# Security
export SECRET_KEY=your_django_secret_key
export JWT_SECRET_KEY=your_jwt_secret_key
```

## 🔧 Backend Deployment Steps

### 1. EC2 Instance Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install python3.12 python3.12-venv python3-pip postgresql-client -y

# Install Node.js (for frontend build tools)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt install nginx -y

# Install Gunicorn
pip3 install gunicorn
```

### 2. Application Setup
```bash
# Clone repository
git clone https://github.com/Emperor1p/nclexkeysinternational.git
cd nclexkeysinternational

# Create virtual environment
python3.12 -m venv venv
source venv/bin/activate

# Install Python dependencies
cd backend
pip install -r requirements.txt

# Set environment variables
export DJANGO_SETTINGS_MODULE=config.settings
export DEBUG=False
export ALLOWED_HOSTS=your-ec2-ip,your-domain.com

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Create default accounts
python manage.py create_default_accounts

# Collect static files
python manage.py collectstatic --noinput
```

### 3. Gunicorn Configuration
Create `/home/ubuntu/nclexkey/backend/gunicorn.conf.py`:
```python
bind = "127.0.0.1:8000"
workers = 3
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2
max_requests = 1000
max_requests_jitter = 100
preload_app = True
```

### 4. Systemd Service
Create `/etc/systemd/system/gunicorn.service`:
```ini
[Unit]
Description=Gunicorn instance to serve NCLEX Keys
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/nclexkey/backend
Environment="PATH=/home/ubuntu/nclexkey/venv/bin"
ExecStart=/home/ubuntu/nclexkey/venv/bin/gunicorn --config gunicorn.conf.py config.wsgi:application
ExecReload=/bin/kill -s HUP $MAINPID
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

### 5. Nginx Configuration
Create `/etc/nginx/sites-available/nclexkeys`:
```nginx
server {
    listen 80;
    server_name your-domain.com your-ec2-ip;

    location = /favicon.ico { access_log off; log_not_found off; }
    location /static/ {
        root /home/ubuntu/nclexkey/backend;
    }

    location / {
        include proxy_params;
        proxy_pass http://127.0.0.1:8000;
    }
}
```

### 6. Start Services
```bash
# Enable and start services
sudo systemctl enable gunicorn
sudo systemctl start gunicorn
sudo systemctl enable nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status gunicorn
sudo systemctl status nginx
```

## 🔐 Security Configuration

### 1. Firewall Setup
```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. SSL Certificate (Optional)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## 📊 Database Management

### 1. Connect to RDS Database
```bash
# Install PostgreSQL client
sudo apt install postgresql-client -y

# Connect to database
psql -h database-1.c9i8gmcwmltt.eu-north-1.rds.amazonaws.com -U nclexkeysdb -d nclexkeysdb
```

### 2. Backup Database
```bash
# Create backup
pg_dump -h database-1.c9i8gmcwmltt.eu-north-1.rds.amazonaws.com -U nclexkeysdb nclexkeysdb > backup.sql

# Restore from backup
psql -h database-1.c9i8gmcwmltt.eu-north-1.rds.amazonaws.com -U nclexkeysdb nclexkeysdb < backup.sql
```

## 🚀 GitHub Actions Deployment

The project uses GitHub Actions for automated deployment. Ensure these secrets are set in GitHub:

### Required GitHub Secrets:
- `EC2_HOST`: Your EC2 instance IP
- `EC2_SSH_KEY`: Your EC2 SSH private key
- `EMAIL_HOST_PASSWORD`: Gmail app password
- `DB_PASSWORD`: Database password (if different)

### Deployment Process:
1. Push to `main` branch
2. GitHub Actions automatically:
   - Tests the code
   - Deploys to EC2
   - Runs database migrations
   - Restarts services

## 🔍 Monitoring and Maintenance

### 1. Check Application Status
```bash
# Check Gunicorn status
sudo systemctl status gunicorn

# Check Nginx status
sudo systemctl status nginx

# Check application logs
sudo journalctl -u gunicorn -f
```

### 2. Database Monitoring
```bash
# Test database connection
python manage.py dbshell

# Check database size
psql -h database-1.c9i8gmcwmltt.eu-north-1.rds.amazonaws.com -U nclexkeysdb -d nclexkeysdb -c "SELECT pg_size_pretty(pg_database_size('nclexkeysdb'));"
```

### 3. Performance Monitoring
```bash
# Check system resources
htop
df -h
free -h

# Check application performance
curl -I http://your-domain.com/api/health/
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check RDS security groups
   - Verify database credentials
   - Ensure SSL is enabled

2. **Static Files Not Loading**
   - Run `python manage.py collectstatic`
   - Check Nginx configuration
   - Verify file permissions

3. **Application Not Starting**
   - Check Gunicorn logs: `sudo journalctl -u gunicorn`
   - Verify environment variables
   - Check Python dependencies

4. **Email Not Sending**
   - Verify Gmail app password
   - Check SMTP settings
   - Test email configuration

## 📈 Scaling Considerations

### 1. Database Scaling
- Consider RDS read replicas for read-heavy workloads
- Monitor database performance metrics
- Set up automated backups

### 2. Application Scaling
- Use Application Load Balancer for multiple EC2 instances
- Implement Redis for session storage
- Consider containerization with ECS/EKS

### 3. Monitoring
- Set up CloudWatch monitoring
- Implement log aggregation
- Create performance dashboards

## ✅ Verification Checklist

- [ ] EC2 instance is running
- [ ] RDS PostgreSQL is accessible
- [ ] Application is deployed and running
- [ ] Database migrations are applied
- [ ] Static files are served correctly
- [ ] SSL certificate is installed (if using custom domain)
- [ ] Email functionality is working
- [ ] Frontend can connect to backend API
- [ ] All environment variables are set
- [ ] Security groups are configured correctly

## 🆘 Support

For deployment issues:
1. Check application logs
2. Verify AWS service status
3. Test database connectivity
4. Review GitHub Actions logs
5. Contact system administrator

---

**Last Updated**: January 2025
**Version**: 1.0
**Status**: Production Ready
