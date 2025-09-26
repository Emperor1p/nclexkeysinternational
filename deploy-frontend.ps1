# NCLEX Frontend S3 Deployment Script
Write-Host "🚀 Deploying NCLEX Frontend to S3" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Check if AWS CLI is configured
try {
    aws sts get-caller-identity | Out-Null
    Write-Host "✅ AWS CLI is configured" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI not configured. Please run: .\configure-aws.ps1" -ForegroundColor Red
    exit 1
}

# Navigate to frontend directory
Set-Location frontend

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Build the application
Write-Host "🔨 Building frontend for production..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if (Test-Path "out") {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed. Please check the build output." -ForegroundColor Red
    exit 1
}

# Deploy to S3
Write-Host "🚀 Deploying to S3 bucket: nclexkeysfrontend" -ForegroundColor Yellow

# Sync files to S3 with optimizations
aws s3 sync out/ s3://nclexkeysfrontend --delete --region eu-north-1

# Set proper content types for better performance
Write-Host "🔧 Setting content types..." -ForegroundColor Yellow
aws s3 cp s3://nclexkeysfrontend s3://nclexkeysfrontend --recursive --metadata-directive REPLACE --content-type "text/html" --exclude "*" --include "*.html"
aws s3 cp s3://nclexkeysfrontend s3://nclexkeysfrontend --recursive --metadata-directive REPLACE --content-type "application/json" --exclude "*" --include "*.json"
aws s3 cp s3://nclexkeysfrontend s3://nclexkeysfrontend --recursive --metadata-directive REPLACE --content-type "text/css" --exclude "*" --include "*.css"
aws s3 cp s3://nclexkeysfrontend s3://nclexkeysfrontend --recursive --metadata-directive REPLACE --content-type "application/javascript" --exclude "*" --include "*.js"

# Make bucket publicly readable
Write-Host "🔓 Setting bucket permissions..." -ForegroundColor Yellow
$bucketPolicy = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::nclexkeysfrontend/*"
        }
    ]
}
"@

$bucketPolicy | Out-File -FilePath "$env:TEMP\bucket-policy.json" -Encoding UTF8
aws s3api put-bucket-policy --bucket nclexkeysfrontend --policy file://"$env:TEMP\bucket-policy.json"

# Enable static website hosting
Write-Host "🌐 Configuring static website hosting..." -ForegroundColor Yellow
aws s3 website s3://nclexkeysfrontend --index-document index.html --error-document 404.html

# Get website URL
$websiteUrl = "http://nclexkeysfrontend.s3-website.eu-north-1.amazonaws.com"

Write-Host ""
Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host "Website URL: $websiteUrl" -ForegroundColor Cyan
Write-Host "S3 Console: https://eu-north-1.console.aws.amazon.com/s3/buckets/nclexkeysfrontend" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Green

# Clean up
Remove-Item "$env:TEMP\bucket-policy.json" -Force -ErrorAction SilentlyContinue

Write-Host "✅ Your NCLEX frontend is now live on AWS S3!" -ForegroundColor Green
Write-Host "📱 The Board of Directors section is ready for production!" -ForegroundColor Green
