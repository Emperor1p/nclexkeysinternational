# Test AWS S3 Deployment Script
# Run this to test if your AWS credentials work

Write-Host "🔧 Testing AWS S3 Deployment..." -ForegroundColor Green

# Set AWS credentials from environment variables
# Make sure to set these before running the script:
# $env:AWS_ACCESS_KEY_ID = "your-access-key"
# $env:AWS_SECRET_ACCESS_KEY = "your-secret-key"
$env:AWS_DEFAULT_REGION = "eu-north-1"

# Check if credentials are set
if (-not $env:AWS_ACCESS_KEY_ID -or -not $env:AWS_SECRET_ACCESS_KEY) {
    Write-Host "❌ AWS credentials not set!" -ForegroundColor Red
    Write-Host "Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables first." -ForegroundColor Yellow
    Write-Host "Example:" -ForegroundColor Cyan
    Write-Host '$env:AWS_ACCESS_KEY_ID = "your-access-key"' -ForegroundColor Gray
    Write-Host '$env:AWS_SECRET_ACCESS_KEY = "your-secret-key"' -ForegroundColor Gray
    exit 1
}

Write-Host "📦 Building frontend..." -ForegroundColor Yellow
cd frontend
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    
    Write-Host "☁️ Testing AWS connection..." -ForegroundColor Yellow
    aws sts get-caller-identity
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ AWS connection successful!" -ForegroundColor Green
        
        Write-Host "📤 Deploying to S3..." -ForegroundColor Yellow
        aws s3 sync out/ s3://nclexkeysfrontend --delete
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "🎉 Deployment successful!" -ForegroundColor Green
            Write-Host "🌐 Your site should be live at: https://nclexkeysfrontend.s3.eu-north-1.amazonaws.com" -ForegroundColor Cyan
        } else {
            Write-Host "❌ S3 deployment failed!" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ AWS connection failed! Check your credentials." -ForegroundColor Red
    }
} else {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
}

cd ..
