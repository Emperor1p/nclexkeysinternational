#!/bin/bash

# User data script for EC2 instances
# This script sets up the Django application on EC2

set -e

# Update system
yum update -y

# Install Docker
yum install -y docker
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Git
yum install -y git

# Install Python and pip
yum install -y python3 python3-pip

# Install PostgreSQL client
yum install -y postgresql

# Create application directory
mkdir -p /opt/nclex
cd /opt/nclex

# Clone the repository (replace with your actual repository URL)
# git clone https://github.com/your-username/nclexkeyswebsite.git .

# For now, we'll create a simple setup script
cat > /opt/nclex/setup.sh << 'EOF'
#!/bin/bash

# Environment variables
export DB_HOST="${db_host}"
export DB_NAME="${db_name}"
export DB_USER="${db_user}"
export DB_PASSWORD="your-db-password"  # This should be retrieved from AWS Secrets Manager
export REDIS_HOST="${redis_host}"
export S3_BUCKET="${s3_bucket}"
export AWS_REGION="${region}"

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate --settings=config.settings_production

# Collect static files
python manage.py collectstatic --noinput --settings=config.settings_production

# Create superuser (optional)
# python manage.py createsuperuser --noinput --username admin --email admin@example.com

# Start the application
gunicorn --bind 0.0.0.0:8000 --workers 3 config.wsgi:application
EOF

chmod +x /opt/nclex/setup.sh

# Create systemd service
cat > /etc/systemd/system/nclex.service << 'EOF'
[Unit]
Description=NCLEX Django Application
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/opt/nclex
Environment=PATH=/opt/nclex/venv/bin
ExecStart=/opt/nclex/venv/bin/gunicorn --bind 0.0.0.0:8000 --workers 3 config.wsgi:application
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
systemctl daemon-reload
systemctl enable nclex

# Create health check script
cat > /opt/nclex/health_check.sh << 'EOF'
#!/bin/bash
curl -f http://localhost:8000/health/ || exit 1
EOF

chmod +x /opt/nclex/health_check.sh

# Install CloudWatch agent
yum install -y amazon-cloudwatch-agent

# Create CloudWatch agent configuration
cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json << 'EOF'
{
    "logs": {
        "logs_collected": {
            "files": {
                "collect_list": [
                    {
                        "file_path": "/opt/nclex/logs/app.log",
                        "log_group_name": "/aws/ec2/nclex-backend",
                        "log_stream_name": "{instance_id}"
                    }
                ]
            }
        }
    },
    "metrics": {
        "namespace": "NCLEX/Application",
        "metrics_collected": {
            "cpu": {
                "measurement": [
                    "cpu_usage_idle",
                    "cpu_usage_iowait",
                    "cpu_usage_user",
                    "cpu_usage_system"
                ],
                "metrics_collection_interval": 60
            },
            "disk": {
                "measurement": [
                    "used_percent"
                ],
                "metrics_collection_interval": 60,
                "resources": [
                    "*"
                ]
            },
            "diskio": {
                "measurement": [
                    "io_time"
                ],
                "metrics_collection_interval": 60,
                "resources": [
                    "*"
                ]
            },
            "mem": {
                "measurement": [
                    "mem_used_percent"
                ],
                "metrics_collection_interval": 60
            }
        }
    }
}
EOF

# Start CloudWatch agent
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json \
    -s

# Create log directory
mkdir -p /opt/nclex/logs
chown ec2-user:ec2-user /opt/nclex/logs

# Set up log rotation
cat > /etc/logrotate.d/nclex << 'EOF'
/opt/nclex/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 ec2-user ec2-user
    postrotate
        systemctl reload nclex
    endscript
}
EOF

# Create environment file
cat > /opt/nclex/.env << EOF
DEBUG=False
SECRET_KEY=your-super-secure-production-secret-key
ALLOWED_HOSTS=yourdomain.com,api.yourdomain.com

# Database
DATABASE_URL=postgresql://${db_user}:your-db-password@${db_host}:5432/${db_name}

# Redis Cache
REDIS_URL=redis://${redis_host}:6379/0

# S3 Storage
AWS_STORAGE_BUCKET_NAME=${s3_bucket}
AWS_S3_REGION_NAME=${region}

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@domain.com
EMAIL_HOST_PASSWORD=your-app-password

# Payment Gateway
PAYSTACK_PUBLIC_KEY=pk_live_...
PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_WEBHOOK_SECRET=your-webhook-secret

# Frontend URL
FRONTEND_URL=https://yourdomain.com
SITE_URL=https://api.yourdomain.com

# Security
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SECURE_HSTS_PRELOAD=True
EOF

# Set proper permissions
chown -R ec2-user:ec2-user /opt/nclex
chmod 600 /opt/nclex/.env

# Signal that the instance is ready
/opt/aws/bin/cfn-signal -e $? --stack ${AWS::StackName} --resource AutoScalingGroup --region ${AWS::Region}

