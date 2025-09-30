# Connect to New EC2 Instance (nclexkeyspairs)

## 🔑 Connection Steps

### 1. Get Your EC2 Instance Details
First, you need to get your new EC2 instance details from AWS Console:
- **Instance ID**: (from AWS Console)
- **Public IP**: (from AWS Console)
- **Keypair**: nclexkeyspairs

### 2. Download Your Private Key
1. Go to AWS Console → EC2 → Key Pairs
2. Find "nclexkeyspairs" 
3. Download the private key file (.pem)
4. Save it securely on your local machine

### 3. Set Proper Permissions (Linux/Mac)
```bash
chmod 400 nclexkeyspairs.pem
```

### 4. Connect via SSH
```bash
ssh -i nclexkeyspairs.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### 5. Windows Users (PowerShell)
```powershell
ssh -i nclexkeyspairs.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

## 🚀 Quick Setup Commands

Once connected, run these commands on your EC2 instance:

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Required Software
```bash
# Install Python
sudo apt install python3.12 python3.12-venv python3-pip postgresql-client -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt install nginx -y

# Install Gunicorn
pip3 install gunicorn
```

### 3. Clone and Setup Application
```bash
# Create directory
sudo mkdir -p /home/ubuntu/nclexkey
sudo chown ubuntu:ubuntu /home/ubuntu/nclexkey
cd /home/ubuntu/nclexkey

# Clone repository
git clone https://github.com/Emperor1p/nclexkeysinternational.git .

# Create virtual environment
python3.12 -m venv venv
source venv/bin/activate

# Install dependencies
cd backend
pip install -r requirements.txt
```

### 4. Configure Environment
```bash
# Set environment variables
export DB_NAME=nclexkeysdb
export DB_USER=nclexkeysdb
export DB_PASSWORD=nclexkeysinternational
export DB_HOST=database-1.c9i8gmcwmltt.eu-north-1.rds.amazonaws.com
export DB_PORT=5432
export FRONTEND_URL=https://nclex-cx5hhtc91-peters-projects-db86b6fd.vercel.app
export DEBUG=False
export ALLOWED_HOSTS=localhost,127.0.0.1,$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
```

### 5. Test Database Connection
```bash
python test_aws_connection.py
```

### 6. Run Migrations
```bash
python manage.py migrate
python manage.py create_default_accounts
python manage.py collectstatic --noinput
```

### 7. Configure Services
```bash
# Create Gunicorn service
sudo nano /etc/systemd/system/gunicorn.service
```

Add this content:
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

### 8. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/nclexkeys
```

Add this content:
```nginx
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
```

### 9. Enable Services
```bash
# Enable Nginx site
sudo ln -sf /etc/nginx/sites-available/nclexkeys /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Configure firewall
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Start services
sudo systemctl enable gunicorn
sudo systemctl start gunicorn
sudo systemctl enable nginx
sudo systemctl restart nginx
```

### 10. Test Application
```bash
# Check services
sudo systemctl status gunicorn
sudo systemctl status nginx

# Test application
curl http://localhost:8000/api/health/
```

## 🔧 Troubleshooting

### If connection fails:
1. Check security groups allow SSH (port 22)
2. Verify keypair permissions
3. Check instance is running

### If application doesn't start:
1. Check logs: `sudo journalctl -u gunicorn -f`
2. Verify database connection
3. Check environment variables

### If database connection fails:
1. Check RDS security groups
2. Verify database credentials
3. Test connection: `python test_aws_connection.py`

## 📞 Need Help?

If you encounter issues:
1. Check AWS Console for instance status
2. Verify security group settings
3. Test database connectivity
4. Review application logs

---

**Next Steps**: Once connected and setup is complete, your backend will be accessible at your EC2 public IP on port 80.




