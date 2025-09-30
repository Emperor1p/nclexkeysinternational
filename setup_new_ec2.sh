#!/bin/bash

# NCLEX Keys Backend Setup Script for New EC2 Instance
# Run this script on your new EC2 instance after connecting via SSH

echo "🚀 Starting NCLEX Keys Backend Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root. Use a regular user account."
    exit 1
fi

print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

print_status "Installing required software..."
sudo apt install -y python3.12 python3.12-venv python3-pip postgresql-client nginx git curl wget

print_status "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

print_status "Installing Gunicorn..."
pip3 install gunicorn

print_status "Creating application directory..."
sudo mkdir -p /home/ubuntu/nclexkey
sudo chown ubuntu:ubuntu /home/ubuntu/nclexkey
cd /home/ubuntu/nclexkey

print_status "Cloning repository..."
git clone https://github.com/Emperor1p/nclexkeysinternational.git .

print_status "Setting up Python virtual environment..."
python3.12 -m venv venv
source venv/bin/activate

print_status "Installing Python dependencies..."
cd backend
pip install -r requirements.txt

print_status "Setting up environment variables..."
cat > .env << EOF
DEBUG=False
SECRET_KEY=your-secret-key-here-change-in-production
DB_NAME=nclexkeysdb
DB_USER=nclexkeysdb
DB_PASSWORD=nclexkeysinternational
DB_HOST=database-1.c9i8gmcwmltt.eu-north-1.rds.amazonaws.com
DB_PORT=5432
FRONTEND_URL=https://nclex-cx5hhtc91-peters-projects-db86b6fd.vercel.app
ALLOWED_HOSTS=localhost,127.0.0.1,$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
CORS_ALLOWED_ORIGINS=https://nclex-cx5hhtc91-peters-projects-db86b6fd.vercel.app
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@nclexkeysinternational.com
EOF

print_status "Testing AWS RDS database connection..."
python test_aws_connection.py

if [ $? -eq 0 ]; then
    print_success "Database connection successful!"
else
    print_error "Database connection failed! Please check your RDS settings."
    exit 1
fi

print_status "Running database migrations..."
python manage.py makemigrations
python manage.py migrate

print_status "Creating default admin accounts..."
python manage.py create_default_accounts

print_status "Collecting static files..."
python manage.py collectstatic --noinput

print_status "Creating Gunicorn configuration..."
cat > gunicorn.conf.py << EOF
bind = "127.0.0.1:8000"
workers = 3
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2
max_requests = 1000
max_requests_jitter = 100
preload_app = True
EOF

print_status "Creating Gunicorn systemd service..."
sudo tee /etc/systemd/system/gunicorn.service > /dev/null << EOF
[Unit]
Description=Gunicorn instance to serve NCLEX Keys
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/nclexkey/backend
Environment="PATH=/home/ubuntu/nclexkey/venv/bin"
ExecStart=/home/ubuntu/nclexkey/venv/bin/gunicorn --config gunicorn.conf.py config.wsgi:application
ExecReload=/bin/kill -s HUP \$MAINPID
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

print_status "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/nclexkeys > /dev/null << EOF
server {
    listen 80;
    server_name _;

    location = /favicon.ico { access_log off; log_not_found off; }
    location /static/ {
        root /home/ubuntu/nclexkey/backend;
    }

    location / {
        include proxy_params;
        proxy_pass http://127.0.0.1:8000;
    }
}
EOF

print_status "Enabling Nginx site..."
sudo ln -sf /etc/nginx/sites-available/nclexkeys /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

print_status "Configuring firewall..."
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

print_status "Starting services..."
sudo systemctl daemon-reload
sudo systemctl enable gunicorn
sudo systemctl start gunicorn
sudo systemctl enable nginx
sudo systemctl restart nginx

print_status "Testing services..."
sleep 5

# Check Gunicorn status
if sudo systemctl is-active --quiet gunicorn; then
    print_success "Gunicorn is running!"
else
    print_error "Gunicorn failed to start. Check logs: sudo journalctl -u gunicorn -f"
fi

# Check Nginx status
if sudo systemctl is-active --quiet nginx; then
    print_success "Nginx is running!"
else
    print_error "Nginx failed to start. Check logs: sudo journalctl -u nginx -f"
fi

# Test application
print_status "Testing application..."
curl -f http://localhost:8000/api/health/ > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Application is responding!"
else
    print_warning "Application health check failed. Check application logs."
fi

print_success "Setup completed!"
print_status "Your backend should now be accessible at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
print_status "To check logs: sudo journalctl -u gunicorn -f"
print_status "To restart services: sudo systemctl restart gunicorn nginx"