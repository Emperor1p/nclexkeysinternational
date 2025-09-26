# 🚀 S3 Frontend Deployment Setup Guide

This guide will help you deploy your NCLEX Virtual School frontend to AWS S3 with CloudFront for global distribution.

## 📋 Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **Node.js 18+** installed
4. **Git** repository with your code

## 🔧 Step 1: Install AWS CLI

### Windows (PowerShell)
```powershell
# Download and install AWS CLI
# Go to: https://aws.amazon.com/cli/
# Or use winget:
winget install Amazon.AWSCLI
```

### Alternative: Use AWS Console
If you prefer not to install AWS CLI, you can use the AWS Console for initial setup.

## 🔧 Step 2: Configure AWS Credentials

```bash
# Configure AWS CLI
aws configure

# Enter your credentials:
# AWS Access Key ID: [your-access-key]
# AWS Secret Access Key: [your-secret-key]
# Default region name: us-east-1
# Default output format: json
```

## 🚀 Step 3: Create S3 Bucket

### Option A: Using AWS CLI
```bash
# Create S3 bucket (must be globally unique)
aws s3 mb s3://nclex-frontend-$(date +%s) --region us-east-1

# Enable static website hosting
aws s3 website s3://your-bucket-name --index-document index.html --error-document 404.html
```

### Option B: Using AWS Console
1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Click "Create bucket"
3. Enter bucket name (must be globally unique)
4. Choose region: US East (N. Virginia)
5. Uncheck "Block all public access"
6. Check "I acknowledge that the current settings might result in this bucket and the objects within it becoming public"
7. Click "Create bucket"

## 🔧 Step 4: Configure S3 Bucket for Static Website

### Set Bucket Policy
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

### Enable Static Website Hosting
1. Go to your S3 bucket
2. Click "Properties" tab
3. Scroll to "Static website hosting"
4. Click "Edit"
5. Enable static website hosting
6. Set index document: `index.html`
7. Set error document: `404.html`
8. Save changes

## 🔧 Step 5: Create CloudFront Distribution

### Using AWS Console
1. Go to [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Click "Create distribution"
3. Set origin domain: `your-bucket-name.s3.amazonaws.com`
4. Set origin path: `/`
5. Set default root object: `index.html`
6. Configure caching:
   - Default TTL: 86400 (1 day)
   - Maximum TTL: 31536000 (1 year)
7. Set price class: "Use only US, Canada and Europe" (cheaper)
8. Click "Create distribution"

## 🔧 Step 6: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

```
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
S3_BUCKET_NAME=your-bucket-name
CLOUDFRONT_DISTRIBUTION_ID=your-distribution-id
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_paystack_key
NEXT_PUBLIC_APP_NAME=NCLEX Virtual School
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 🚀 Step 7: Test Local Build

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build the application
npm run build

# Test the build locally
npm run start
```

## 🔧 Step 8: Manual Deployment (Test)

```bash
# Build the application
cd frontend
npm run build

# Deploy to S3
aws s3 sync out/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🔧 Step 9: Set Up GitHub Actions

The GitHub Actions workflow is already configured in `.github/workflows/deploy-frontend-aws.yml`.

### Trigger Deployment
1. Push your changes to the `main` branch
2. GitHub Actions will automatically:
   - Install dependencies
   - Run tests
   - Build the application
   - Deploy to S3
   - Invalidate CloudFront cache

## 🔍 Step 10: Verify Deployment

### Check S3 Bucket
1. Go to your S3 bucket
2. Verify files are uploaded
3. Check file permissions

### Check CloudFront
1. Go to CloudFront console
2. Check distribution status
3. Test the domain name

### Test Website
1. Visit your CloudFront domain
2. Test all pages and functionality
3. Check Board of Directors section

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check Node.js version
   node --version
   
   # Clear npm cache
   npm cache clean --force
   
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **S3 Upload Failures**
   ```bash
   # Check AWS credentials
   aws sts get-caller-identity
   
   # Check S3 bucket permissions
   aws s3 ls s3://your-bucket-name
   ```

3. **CloudFront Issues**
   - Check distribution status
   - Verify origin configuration
   - Check cache settings

### Debug Commands

```bash
# Test AWS connection
aws sts get-caller-identity

# List S3 buckets
aws s3 ls

# Check S3 bucket contents
aws s3 ls s3://your-bucket-name

# Test CloudFront distribution
curl -I https://your-distribution-id.cloudfront.net
```

## 📊 Monitoring and Maintenance

### CloudWatch Metrics
- Monitor S3 requests
- Check CloudFront metrics
- Set up alarms for errors

### Cost Optimization
- Use S3 Intelligent Tiering
- Configure CloudFront caching
- Monitor data transfer costs

## 🔒 Security Best Practices

1. **S3 Bucket Policy**: Restrict access to CloudFront only
2. **CloudFront Security**: Use HTTPS only
3. **CORS Configuration**: Set appropriate CORS headers
4. **Access Logs**: Enable S3 and CloudFront access logs

## 📞 Support

- **AWS S3 Documentation**: [docs.aws.amazon.com/s3](https://docs.aws.amazon.com/s3)
- **CloudFront Documentation**: [docs.aws.amazon.com/cloudfront](https://docs.aws.amazon.com/cloudfront)
- **GitHub Actions**: [docs.github.com/actions](https://docs.github.com/actions)

## ✅ Success Checklist

- [ ] AWS CLI installed and configured
- [ ] S3 bucket created and configured
- [ ] CloudFront distribution created
- [ ] GitHub secrets configured
- [ ] Local build successful
- [ ] Manual deployment successful
- [ ] GitHub Actions deployment successful
- [ ] Website accessible via CloudFront URL
- [ ] Board of Directors section working
- [ ] All functionality tested

---

**🎉 Congratulations!** Your frontend is now deployed to AWS S3 with CloudFront for global distribution!
