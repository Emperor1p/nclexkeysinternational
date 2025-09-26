# S3 Frontend Deployment Setup Script for Windows
# This script helps you set up S3 deployment for your NCLEX frontend

Write-Host "🚀 NCLEX Frontend S3 Deployment Setup" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if AWS CLI is installed
Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Yellow

try {
    $awsVersion = aws --version 2>$null
    if ($awsVersion) {
        Write-Host "✅ AWS CLI is installed: $awsVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ AWS CLI is not installed" -ForegroundColor Red
    Write-Host "Please install AWS CLI from: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    Write-Host "Or run: winget install Amazon.AWSCLI" -ForegroundColor Yellow
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Node.js is not installed" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if we're in the right directory
if (-not (Test-Path "frontend/package.json")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    Write-Host "Expected to find: frontend/package.json" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Project structure looks good" -ForegroundColor Green

# Create S3 bucket name
$timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$bucketName = "nclex-frontend-$timestamp"

Write-Host "`n🪣 Creating S3 bucket: $bucketName" -ForegroundColor Yellow

try {
    # Create S3 bucket
    aws s3 mb "s3://$bucketName" --region us-east-1
    Write-Host "✅ S3 bucket created: $bucketName" -ForegroundColor Green
    
    # Enable static website hosting
    aws s3 website "s3://$bucketName" --index-document index.html --error-document 404.html
    Write-Host "✅ Static website hosting enabled" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Failed to create S3 bucket" -ForegroundColor Red
    Write-Host "Please check your AWS credentials and permissions" -ForegroundColor Yellow
    exit 1
}

# Build the frontend
Write-Host "`n🔨 Building frontend application..." -ForegroundColor Yellow

try {
    Set-Location frontend
    
    # Install dependencies
    Write-Host "Installing dependencies..." -ForegroundColor Cyan
    npm install
    
    # Build the application
    Write-Host "Building application..." -ForegroundColor Cyan
    npm run build
    
    Write-Host "✅ Frontend built successfully" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Failed to build frontend" -ForegroundColor Red
    Write-Host "Please check your Node.js installation and dependencies" -ForegroundColor Yellow
    Set-Location ..
    exit 1
}

# Deploy to S3
Write-Host "`n🚀 Deploying to S3..." -ForegroundColor Yellow

try {
    # Sync files to S3
    aws s3 sync out/ "s3://$bucketName" --delete
    Write-Host "✅ Files uploaded to S3" -ForegroundColor Green
    
    # Get the website URL
    $websiteUrl = "http://$bucketName.s3-website-us-east-1.amazonaws.com"
    Write-Host "🌐 Website URL: $websiteUrl" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Failed to deploy to S3" -ForegroundColor Red
    Write-Host "Please check your AWS credentials and S3 permissions" -ForegroundColor Yellow
    Set-Location ..
    exit 1
}

# Return to project root
Set-Location ..

# Create GitHub secrets template
Write-Host "`n📝 GitHub Secrets Configuration" -ForegroundColor Yellow

$secretsTemplate = @"
# Add these secrets to your GitHub repository:
# Settings → Secrets and variables → Actions

AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
S3_BUCKET_NAME=$bucketName
CLOUDFRONT_DISTRIBUTION_ID=your-distribution-id
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_paystack_key
NEXT_PUBLIC_APP_NAME=NCLEX Virtual School
NEXT_PUBLIC_APP_URL=https://yourdomain.com
"@

Write-Host $secretsTemplate -ForegroundColor Cyan

# Save secrets template to file
$secretsTemplate | Out-File -FilePath "github-secrets.txt" -Encoding UTF8
Write-Host "✅ GitHub secrets template saved to: github-secrets.txt" -ForegroundColor Green

# Next steps
Write-Host "`n🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Configure GitHub secrets (see github-secrets.txt)" -ForegroundColor White
Write-Host "2. Create CloudFront distribution (optional but recommended)" -ForegroundColor White
Write-Host "3. Push your changes to GitHub to trigger automatic deployment" -ForegroundColor White
Write-Host "4. Test your website at: $websiteUrl" -ForegroundColor White

Write-Host "`n🎉 S3 deployment setup completed!" -ForegroundColor Green
Write-Host "Your frontend is now deployed to: $websiteUrl" -ForegroundColor Green
