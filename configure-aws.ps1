# AWS CLI Configuration Script
Write-Host "🔧 Configuring AWS CLI for NCLEX Frontend Deployment" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green
Write-Host ""
Write-Host "You need your AWS credentials to deploy to S3." -ForegroundColor Yellow
Write-Host "Get them from: https://console.aws.amazon.com/iam/home#/security_credentials" -ForegroundColor Cyan
Write-Host ""

# Get credentials from user
$accessKey = Read-Host "Enter your AWS Access Key ID"
$secretKey = Read-Host "Enter your AWS Secret Access Key" -AsSecureString

# Convert secure string to plain text
$secretKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($secretKey))

# Configure AWS CLI
Write-Host "🔧 Setting up AWS CLI..." -ForegroundColor Yellow
aws configure set aws_access_key_id $accessKey
aws configure set aws_secret_access_key $secretKeyPlain
aws configure set default.region eu-north-1
aws configure set default.output json

Write-Host "✅ AWS CLI configured successfully!" -ForegroundColor Green
Write-Host "Region: eu-north-1" -ForegroundColor Cyan
Write-Host "Bucket: nclexkeysfrontend" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ready to deploy! Run the deployment script next." -ForegroundColor Green
