# RDS Database Setup Guide

## 🗄️ AWS RDS PostgreSQL Configuration

Your RDS database has been configured with the following credentials:

### Database Details
- **Database Name**: `nclexkeysdb`
- **Username**: `nclexkeysdb`
- **Password**: `nclexkeysinternational`
- **Host**: `database-1.c9i8gmcwmltt.eu-north-1.rds.amazonaws.com`
- **Port**: `5432`
- **Engine**: PostgreSQL

## 📋 Setup Steps

### 1. Connect to Your EC2 Server
```bash
ssh -i "nclexkeyskeypairs.pem" ubuntu@ec2-13-50-116-201.eu-north-1.compute.amazonaws.com
```

### 2. Navigate to Backend Directory
```bash
cd /home/ubuntu/nclexkey/backend
```

### 3. Install PostgreSQL Client
```bash
sudo apt update
sudo apt install postgresql-client python3-psycopg2 -y
```

### 4. Setup Environment Variables
```bash
# Make the setup script executable
chmod +x setup_rds_env.sh

# Run the setup script
./setup_rds_env.sh
```

### 5. Test Database Connection
```bash
# Test the connection
python3 test_rds_connection.py
```

### 6. Run Database Migrations
```bash
# Set Django settings module
export DJANGO_SETTINGS_MODULE=config.settings

# Run migrations
python3 manage.py migrate
```

### 7. Create Superuser
```bash
python3 manage.py createsuperuser
```

### 8. Collect Static Files
```bash
python3 manage.py collectstatic --noinput
```

## 🔧 Configuration Files Created

### 1. `database_config.py`
- Contains RDS database configuration
- Handles environment variable loading
- Provides fallback configuration

### 2. `setup_rds_env.sh`
- Creates `.env` file with all necessary environment variables
- Configures production settings
- Sets up database connection string

### 3. `test_rds_connection.py`
- Tests database connectivity
- Verifies Django model operations
- Provides troubleshooting information

## 🔍 Troubleshooting

### Connection Issues
If you encounter connection issues:

1. **Check Security Groups**
   - Ensure port 5432 is open for your EC2 instance
   - Verify RDS security group allows inbound connections

2. **Check VPC Configuration**
   - Ensure EC2 and RDS are in the same VPC or have proper routing
   - Verify subnet groups are configured correctly

3. **Test Connection Manually**
   ```bash
   psql -h database-1.c9i8gmcwmltt.eu-north-1.rds.amazonaws.com -U nclexkeysdb -d nclexkeysdb -p 5432
   ```

### Django Issues
If Django has issues:

1. **Check Environment Variables**
   ```bash
   cat .env | grep DATABASE
   ```

2. **Verify Settings**
   ```bash
   python3 manage.py check --database default
   ```

3. **Test Database Operations**
   ```bash
   python3 manage.py dbshell
   ```

## 🚀 Production Deployment

### 1. Update Gunicorn Configuration
Make sure your Gunicorn service is configured to use the new database:

```bash
# Check current Gunicorn service
sudo systemctl status gunicorn

# Restart Gunicorn to pick up new environment
sudo systemctl restart gunicorn
```

### 2. Update Nginx Configuration
Ensure Nginx is properly configured to serve your Django application:

```bash
# Check Nginx status
sudo systemctl status nginx

# Test Nginx configuration
sudo nginx -t

# Restart Nginx if needed
sudo systemctl restart nginx
```

### 3. Monitor Logs
```bash
# Check Django logs
tail -f log/app.log

# Check Gunicorn logs
sudo journalctl -u gunicorn -f

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

## 📊 Database Management

### Backup Database
```bash
# Create backup
pg_dump -h database-1.c9i8gmcwmltt.eu-north-1.rds.amazonaws.com -U nclexkeysdb -d nclexkeysdb > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database
```bash
# Restore from backup
psql -h database-1.c9i8gmcwmltt.eu-north-1.rds.amazonaws.com -U nclexkeysdb -d nclexkeysdb < backup_file.sql
```

## 🔐 Security Notes

1. **Environment Variables**: The `.env` file contains sensitive information. Ensure it's not committed to version control.

2. **Database Access**: Only allow necessary IP addresses to access the RDS instance.

3. **SSL Connection**: The configuration uses SSL for secure connections.

4. **Password Security**: Consider rotating the database password periodically.

## 📞 Support

If you encounter any issues:
1. Check the logs first
2. Verify network connectivity
3. Test database connection manually
4. Review security group settings

Your RDS database is now configured and ready for production use! 🎉
