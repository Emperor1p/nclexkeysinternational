# NCLEX Frontend S3 Deployment Script
# This script will install AWS CLI, configure it, and deploy your frontend

Write-Host "🚀 NCLEX Frontend S3 Deployment Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if AWS CLI is installed
$awsInstalled = $false
try {
    $awsVersion = aws --version 2>$null
    if ($awsVersion) {
        Write-Host "✅ AWS CLI is already installed: $awsVersion" -ForegroundColor Green
        $awsInstalled = $true
    }
} catch {
    Write-Host "❌ AWS CLI not found. Installing..." -ForegroundColor Yellow
}

# Install AWS CLI if not installed
if (-not $awsInstalled) {
    Write-Host "📦 Installing AWS CLI..." -ForegroundColor Yellow
    
    # Try winget first
    try {
        winget install Amazon.AWSCLI --accept-package-agreements --accept-source-agreements
        Write-Host "✅ AWS CLI installed successfully via winget" -ForegroundColor Green
    } catch {
        Write-Host "❌ Winget installation failed. Trying alternative method..." -ForegroundColor Red
        
        # Alternative: Download and install MSI
        $msiUrl = "https://awscli.amazonaws.com/AWSCLIV2.msi"
        $msiPath = "$env:TEMP\AWSCLIV2.msi"
        
        Write-Host "📥 Downloading AWS CLI MSI..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri $msiUrl -OutFile $msiPath
        
        Write-Host "🔧 Installing AWS CLI MSI..." -ForegroundColor Yellow
        Start-Process msiexec.exe -Wait -ArgumentList "/i $msiPath /quiet"
        
        # Clean up
        Remove-Item $msiPath -Force
        
        Write-Host "✅ AWS CLI installed successfully via MSI" -ForegroundColor Green
    }
    
    # Refresh PATH
    $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
}

# Verify AWS CLI installation
try {
    $awsVersion = aws --version
    Write-Host "✅ AWS CLI verified: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI installation failed. Please install manually from: https://aws.amazon.com/cli/" -ForegroundColor Red
    exit 1
}

# Configure AWS CLI
Write-Host "🔧 Configuring AWS CLI..." -ForegroundColor Yellow
Write-Host "You'll need your AWS Access Key ID and Secret Access Key" -ForegroundColor Cyan
Write-Host "Get them from: https://console.aws.amazon.com/iam/home#/security_credentials" -ForegroundColor Cyan

$accessKey = Read-Host "Enter your AWS Access Key ID"
$secretKey = Read-Host "Enter your AWS Secret Access Key" -AsSecureString
$region = "eu-north-1"  # Your bucket region
$bucketName = "nclexkeysfrontend"

# Convert secure string to plain text
$secretKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($secretKey))

# Configure AWS CLI
aws configure set aws_access_key_id $accessKey
aws configure set aws_secret_access_key $secretKeyPlain
aws configure set default.region $region
aws configure set default.output json

Write-Host "✅ AWS CLI configured successfully" -ForegroundColor Green

# Navigate to frontend directory
Set-Location frontend

# Install dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
npm install

# Build the application
Write-Host "🔨 Building frontend for production..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if (Test-Path "out") {
    Write-Host "✅ Build successful! Static files generated in 'out' directory" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed. Please check the build output above." -ForegroundColor Red
    exit 1
}

# Deploy to S3
Write-Host "🚀 Deploying to S3 bucket: $bucketName" -ForegroundColor Yellow

# Sync files to S3 with optimizations
aws s3 sync out/ s3://$bucketName --delete --region $region --cache-control "public, max-age=31536000" --exclude "*.html" --exclude "*.json"
aws s3 sync out/ s3://$bucketName --delete --region $region --cache-control "public, max-age=0, must-revalidate" --include "*.html" --include "*.json"

# Set proper content types
aws s3 cp s3://$bucketName s3://$bucketName --recursive --metadata-directive REPLACE --content-type "text/html" --exclude "*" --include "*.html"
aws s3 cp s3://$bucketName s3://$bucketName --recursive --metadata-directive REPLACE --content-type "application/json" --exclude "*" --include "*.json"
aws s3 cp s3://$bucketName s3://$bucketName --recursive --metadata-directive REPLACE --content-type "text/css" --exclude "*" --include "*.css"
aws s3 cp s3://$bucketName s3://$bucketName --recursive --metadata-directive REPLACE --content-type "application/javascript" --exclude "*" --include "*.js"

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
            "Resource": "arn:aws:s3:::$bucketName/*"
        }
    ]
}
"@

$bucketPolicy | Out-File -FilePath "$env:TEMP\bucket-policy.json" -Encoding UTF8
aws s3api put-bucket-policy --bucket $bucketName --policy file://"$env:TEMP\bucket-policy.json"

# Enable static website hosting
Write-Host "🌐 Configuring static website hosting..." -ForegroundColor Yellow
aws s3 website s3://$bucketName --index-document index.html --error-document 404.html

# Get website URL
$websiteUrl = "http://$bucketName.s3-website.$region.amazonaws.com"
$websiteUrlHttps = "https://$bucketName.s3-website.$region.amazonaws.com"

Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host "Website URL: $websiteUrl" -ForegroundColor Cyan
Write-Host "HTTPS URL: $websiteUrlHttps" -ForegroundColor Cyan
Write-Host "S3 Console: https://eu-north-1.console.aws.amazon.com/s3/buckets/$bucketName" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Green

# Clean up
Remove-Item "$env:TEMP\bucket-policy.json" -Force -ErrorAction SilentlyContinue

Write-Host "✅ Your NCLEX frontend is now live on AWS S3!" -ForegroundColor Green
Write-Host "📱 The Board of Directors section is ready for production!" -ForegroundColor Green
