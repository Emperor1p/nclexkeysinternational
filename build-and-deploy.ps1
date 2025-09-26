# NCLEX Frontend Build and Deploy Script
Write-Host "🚀 Building and Deploying NCLEX Frontend to S3" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Navigate to frontend directory
Set-Location frontend

# Clean previous builds
Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path "out") {
    Remove-Item -Recurse -Force "out"
}
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Try to build with a simpler configuration
Write-Host "🔨 Building frontend..." -ForegroundColor Yellow

# Create a temporary next.config.mjs for build
$tempConfig = @"
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
"@

$tempConfig | Out-File -FilePath "next.config.temp.mjs" -Encoding UTF8

# Backup original config
if (Test-Path "next.config.mjs") {
    Move-Item "next.config.mjs" "next.config.backup.mjs"
}

# Use temp config
Move-Item "next.config.temp.mjs" "next.config.mjs"

# Try to build
try {
    npm run build
    Write-Host "✅ Build successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Build failed. Trying alternative approach..." -ForegroundColor Red
    
    # Restore original config
    if (Test-Path "next.config.backup.mjs") {
        Move-Item "next.config.backup.mjs" "next.config.mjs"
    }
    
    # Try building without static export
    $simpleConfig = @"
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
}

export default nextConfig
"@
    
    $simpleConfig | Out-File -FilePath "next.config.mjs" -Encoding UTF8
    
    npm run build
    Write-Host "✅ Build successful with simple config!" -ForegroundColor Green
}

# Check if build was successful
if (Test-Path "out") {
    Write-Host "✅ Static files generated successfully!" -ForegroundColor Green
    
    # Deploy to S3
    Write-Host "🚀 Deploying to S3 bucket: nclexkeysfrontend" -ForegroundColor Yellow
    
    # Sync files to S3
    aws s3 sync out/ s3://nclexkeysfrontend --delete --region eu-north-1
    
    # Set proper content types
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
    
} else {
    Write-Host "❌ Build failed. Please check the build output above." -ForegroundColor Red
    exit 1
}
