# 🔑 Connect to Your New EC2 Instance

## Step 1: Get Your EC2 Details
1. Go to AWS Console → EC2 → Instances
2. Find your new instance with keypair "nclexkeyspairs"
3. Note down the **Public IPv4 address**

## Step 2: Download Your Private Key
1. Go to AWS Console → EC2 → Key Pairs
2. Find "nclexkeyspairs"
3. Download the `.pem` file
4. Save it to your local machine (e.g., `C:\Users\User\Downloads\nclexkeyspairs.pem`)

## Step 3: Connect via SSH

### For Windows (PowerShell):
```powershell
# Navigate to where you saved the .pem file
cd C:\Users\User\Downloads

# Connect to your EC2 instance
ssh -i nclexkeyspairs.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### For Linux/Mac:
```bash
# Set proper permissions
chmod 400 nclexkeyspairs.pem

# Connect to your EC2 instance
ssh -i nclexkeyspairs.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

## Step 4: Once Connected, Run the Setup Script

After you're connected to your EC2 instance, run these commands:

```bash
# Download the setup script
curl -o setup_new_ec2.sh https://raw.githubusercontent.com/Emperor1p/nclexkeysinternational/main/setup_new_ec2.sh

# Make it executable
chmod +x setup_new_ec2.sh

# Run the setup script
./setup_new_ec2.sh
```

## Step 5: Alternative - Manual Setup

If the script doesn't work, you can run these commands manually:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required software
sudo apt install -y python3.12 python3.12-venv python3-pip postgresql-client nginx git curl wget

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Gunicorn
pip3 install gunicorn

# Create application directory
sudo mkdir -p /home/ubuntu/nclexkey
sudo chown ubuntu:ubuntu /home/ubuntu/nclexkey
cd /home/ubuntu/nclexkey

# Clone repository
git clone https://github.com/Emperor1p/nclexkeysinternational.git .

# Setup Python environment
python3.12 -m venv venv
source venv/bin/activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Set environment variables
export DB_NAME=nclexkeysdb
export DB_USER=nclexkeysdb
export DB_PASSWORD=nclexkeysinternational
export DB_HOST=database-1.c9i8gmcwmltt.eu-north-1.rds.amazonaws.com
export DB_PORT=5432
export FRONTEND_URL=https://nclex-cx5hhtc91-peters-projects-db86b6fd.vercel.app
export DEBUG=False
export ALLOWED_HOSTS=localhost,127.0.0.1,$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# Test database connection
python test_aws_connection.py

# Run migrations
python manage.py makemigrations
python manage.py migrate
python manage.py create_default_accounts
python manage.py collectstatic --noinput
```

## Step 6: Configure Services

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

```bash
# Configure Nginx
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

```bash
# Enable services
sudo ln -sf /etc/nginx/sites-available/nclexkeys /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Configure firewall
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Start services
sudo systemctl daemon-reload
sudo systemctl enable gunicorn
sudo systemctl start gunicorn
sudo systemctl enable nginx
sudo systemctl restart nginx
```

## Step 7: Test Your Setup

```bash
# Check services
sudo systemctl status gunicorn
sudo systemctl status nginx

# Test application
curl http://localhost:8000/api/health/
```

## 🔧 Troubleshooting

### If SSH connection fails:
1. Check security groups allow SSH (port 22)
2. Verify keypair permissions
3. Check instance is running

### If setup fails:
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

**Once setup is complete, your backend will be accessible at your EC2 public IP on port 80!**


