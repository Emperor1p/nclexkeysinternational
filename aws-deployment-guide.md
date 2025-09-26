# 🚀 Complete AWS Deployment Guide for NCLEX Virtual School

This guide provides everything you need to deploy both your Django backend and Next.js frontend to AWS with production-ready configurations.

## 📋 Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │    │   (Django)      │    │   (PostgreSQL)  │
│   AWS Amplify   │◄──►│   EC2 + ALB     │◄──►│   RDS           │
│   or S3+CF      │    │   + AutoScaling │    │   + ElastiCache │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Storage       │
                    │   S3 + CloudFront│
                    │   (Media Files)  │
                    └─────────────────┘
```

## 🎯 Deployment Options

### Option 1: Full AWS Stack (Recommended for Production)
- **Backend**: EC2 + Application Load Balancer + Auto Scaling
- **Frontend**: AWS Amplify or S3 + CloudFront
- **Database**: RDS PostgreSQL
- **Cache**: ElastiCache Redis
- **Storage**: S3 + CloudFront
- **CDN**: CloudFront

### Option 2: Simplified AWS Stack
- **Backend**: Elastic Beanstalk
- **Frontend**: AWS Amplify
- **Database**: RDS PostgreSQL
- **Storage**: S3

## 🛠️ Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **Terraform** (for infrastructure as code)
4. **Docker** (for containerization)
5. **Domain name** (optional but recommended)

## 📦 Infrastructure Setup

### 1. VPC and Networking

```hcl
# terraform/main.tf
provider "aws" {
  region = "us-east-1"
}

# VPC
resource "aws_vpc" "nclex_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "nclex-vpc"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "nclex_igw" {
  vpc_id = aws_vpc.nclex_vpc.id

  tags = {
    Name = "nclex-igw"
  }
}

# Public Subnets
resource "aws_subnet" "public_subnet_1" {
  vpc_id                  = aws_vpc.nclex_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "nclex-public-subnet-1"
  }
}

resource "aws_subnet" "public_subnet_2" {
  vpc_id                  = aws_vpc.nclex_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "nclex-public-subnet-2"
  }
}

# Private Subnets
resource "aws_subnet" "private_subnet_1" {
  vpc_id            = aws_vpc.nclex_vpc.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "nclex-private-subnet-1"
  }
}

resource "aws_subnet" "private_subnet_2" {
  vpc_id            = aws_vpc.nclex_vpc.id
  cidr_block        = "10.0.4.0/24"
  availability_zone = "us-east-1b"

  tags = {
    Name = "nclex-private-subnet-2"
  }
}

# Route Tables
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.nclex_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.nclex_igw.id
  }

  tags = {
    Name = "nclex-public-rt"
  }
}

resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.nclex_vpc.id

  tags = {
    Name = "nclex-private-rt"
  }
}

# Route Table Associations
resource "aws_route_table_association" "public_1" {
  subnet_id      = aws_subnet.public_subnet_1.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_2" {
  subnet_id      = aws_subnet.public_subnet_2.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "private_1" {
  subnet_id      = aws_subnet.private_subnet_1.id
  route_table_id = aws_route_table.private_rt.id
}

resource "aws_route_table_association" "private_2" {
  subnet_id      = aws_subnet.private_subnet_2.id
  route_table_id = aws_route_table.private_rt.id
}
```

### 2. Security Groups

```hcl
# Security Groups
resource "aws_security_group" "alb_sg" {
  name_prefix = "nclex-alb-"
  vpc_id      = aws_vpc.nclex_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "nclex-alb-sg"
  }
}

resource "aws_security_group" "ec2_sg" {
  name_prefix = "nclex-ec2-"
  vpc_id      = aws_vpc.nclex_vpc.id

  ingress {
    from_port       = 8000
    to_port         = 8000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "nclex-ec2-sg"
  }
}

resource "aws_security_group" "rds_sg" {
  name_prefix = "nclex-rds-"
  vpc_id      = aws_vpc.nclex_vpc.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2_sg.id]
  }

  tags = {
    Name = "nclex-rds-sg"
  }
}
```

### 3. RDS Database

```hcl
# RDS Subnet Group
resource "aws_db_subnet_group" "nclex_db_subnet_group" {
  name       = "nclex-db-subnet-group"
  subnet_ids = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]

  tags = {
    Name = "nclex-db-subnet-group"
  }
}

# RDS Instance
resource "aws_db_instance" "nclex_db" {
  identifier = "nclex-production-db"
  
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.t3.micro"
  
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp2"
  storage_encrypted     = true
  
  db_name  = "nclex_production"
  username = "nclex_admin"
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.nclex_db_subnet_group.name
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = false
  final_snapshot_identifier = "nclex-final-snapshot"
  
  tags = {
    Name = "nclex-production-db"
  }
}
```

### 4. S3 Bucket for Media

```hcl
# S3 Bucket for Media Files
resource "aws_s3_bucket" "nclex_media" {
  bucket = "nclex-media-${random_string.bucket_suffix.result}"

  tags = {
    Name = "nclex-media-bucket"
  }
}

resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

# S3 Bucket Versioning
resource "aws_s3_bucket_versioning" "nclex_media_versioning" {
  bucket = aws_s3_bucket.nclex_media.id
  versioning_configuration {
    status = "Enabled"
  }
}

# S3 Bucket Public Access Block
resource "aws_s3_bucket_public_access_block" "nclex_media_pab" {
  bucket = aws_s3_bucket.nclex_media.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Bucket CORS Configuration
resource "aws_s3_bucket_cors_configuration" "nclex_media_cors" {
  bucket = aws_s3_bucket.nclex_media.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}
```

## 🐳 Docker Configuration

### Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        build-essential \
        libpq-dev \
        gettext \
        curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /app/

# Create directories for logs and static files
RUN mkdir -p /app/logs /app/staticfiles /app/media

# Collect static files
RUN python manage.py collectstatic --noinput --settings=config.settings_production

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health/ || exit 1

# Run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "120", "config.wsgi:application"]
```

### Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

## 🚀 Deployment Scripts

### Backend Deployment Script

```bash
#!/bin/bash
# deploy-backend.sh

set -e

echo "🚀 Starting Django backend deployment to AWS..."

# Configuration
APP_NAME="nclex-backend"
REGION="us-east-1"
ECR_REPOSITORY="nclex-backend"
ECR_IMAGE_TAG="latest"

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Login to ECR
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# Build and push Docker image
echo "📦 Building Docker image..."
docker build -t $ECR_REPOSITORY:$ECR_IMAGE_TAG ./backend

# Tag image for ECR
docker tag $ECR_REPOSITORY:$ECR_IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_REPOSITORY:$ECR_IMAGE_TAG

# Push to ECR
echo "⬆️ Pushing image to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_REPOSITORY:$ECR_IMAGE_TAG

# Update ECS service (if using ECS)
echo "🔄 Updating ECS service..."
aws ecs update-service --cluster nclex-cluster --service nclex-backend-service --force-new-deployment --region $REGION

echo "✅ Backend deployment completed!"
```

### Frontend Deployment Script

```bash
#!/bin/bash
# deploy-frontend.sh

set -e

echo "🚀 Starting Next.js frontend deployment to AWS..."

# Configuration
APP_NAME="nclex-frontend"
REGION="us-east-1"

# Build the application
echo "📦 Building Next.js application..."
cd frontend
npm ci
npm run build

# Deploy to AWS Amplify (if using Amplify)
if [ "$DEPLOYMENT_METHOD" = "amplify" ]; then
    echo "🚀 Deploying to AWS Amplify..."
    amplify publish --yes
fi

# Deploy to S3 + CloudFront (if using S3)
if [ "$DEPLOYMENT_METHOD" = "s3" ]; then
    echo "🚀 Deploying to S3 + CloudFront..."
    
    # Sync to S3
    aws s3 sync out/ s3://$S3_BUCKET_NAME --delete
    
    # Invalidate CloudFront
    aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
fi

echo "✅ Frontend deployment completed!"
```

## 🔧 Environment Configuration

### Backend Environment Variables

```bash
# backend/.env.production
DEBUG=False
SECRET_KEY=your-super-secure-production-secret-key
ALLOWED_HOSTS=yourdomain.com,api.yourdomain.com

# Database
DATABASE_URL=postgresql://nclex_admin:password@nclex-production-db.xxxxx.us-east-1.rds.amazonaws.com:5432/nclex_production

# Redis Cache
REDIS_URL=redis://nclex-redis.xxxxx.cache.amazonaws.com:6379/0

# S3 Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_STORAGE_BUCKET_NAME=nclex-media-xxxxx
AWS_S3_REGION_NAME=us-east-1
AWS_S3_CUSTOM_DOMAIN=cdn.yourdomain.com

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
```

### Frontend Environment Variables

```bash
# frontend/.env.production
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
NEXT_PUBLIC_VIDEO_STREAMING_URL=https://api.yourdomain.com/media/videos
NEXT_PUBLIC_APP_NAME=NCLEX Virtual School
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_CDN_URL=https://cdn.yourdomain.com
NODE_ENV=production
```

## 🚀 Quick Start Commands

### 1. Initialize Infrastructure

```bash
# Clone and setup
git clone <your-repo>
cd nclexkeyswebsite

# Initialize Terraform
cd terraform
terraform init
terraform plan
terraform apply
```

### 2. Deploy Backend

```bash
# Make deployment script executable
chmod +x deploy-backend.sh

# Deploy backend
./deploy-backend.sh
```

### 3. Deploy Frontend

```bash
# Make deployment script executable
chmod +x deploy-frontend.sh

# Deploy frontend
DEPLOYMENT_METHOD=amplify ./deploy-frontend.sh
```

## 📊 Monitoring and Logging

### CloudWatch Configuration

```yaml
# cloudwatch-config.yml
version: 1
log_groups:
  - name: /aws/ecs/nclex-backend
    retention_days: 30
  - name: /aws/amplify/nclex-frontend
    retention_days: 30

alarms:
  - name: HighCPUUtilization
    metric: CPUUtilization
    threshold: 80
    comparison: GreaterThanThreshold
    period: 300
    evaluation_periods: 2
```

## 🔒 Security Best Practices

1. **SSL/TLS**: Use AWS Certificate Manager for SSL certificates
2. **Secrets Management**: Use AWS Secrets Manager for sensitive data
3. **IAM Roles**: Use least privilege principle
4. **VPC**: Keep database in private subnets
5. **WAF**: Use AWS WAF for DDoS protection
6. **Backup**: Enable automated backups for RDS

## 💰 Cost Optimization

1. **Reserved Instances**: Use for predictable workloads
2. **Spot Instances**: Use for non-critical workloads
3. **S3 Lifecycle**: Configure lifecycle policies
4. **CloudFront**: Use for global content delivery
5. **Monitoring**: Set up billing alerts

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**: Check CORS settings in Django
2. **Database Connection**: Verify security groups and subnet groups
3. **Static Files**: Check S3 bucket permissions
4. **SSL Issues**: Verify certificate configuration

### Useful Commands

```bash
# Check ECS service status
aws ecs describe-services --cluster nclex-cluster --services nclex-backend-service

# View CloudWatch logs
aws logs tail /aws/ecs/nclex-backend --follow

# Check RDS status
aws rds describe-db-instances --db-instance-identifier nclex-production-db
```

## 📞 Support

- **AWS Documentation**: https://docs.aws.amazon.com/
- **Django Deployment**: https://docs.djangoproject.com/en/stable/howto/deployment/
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

**Remember**: Always test in a staging environment before deploying to production!

