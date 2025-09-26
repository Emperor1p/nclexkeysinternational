# AWS Credentials Setup for Account: 603346703545
Write-Host "🔧 AWS Configuration Setup" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host ""
Write-Host "Account ID: 603346703545" -ForegroundColor Cyan
Write-Host "Region: eu-north-1" -ForegroundColor Cyan
Write-Host "Bucket: nclexkeysfrontend" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 To get your AWS credentials:" -ForegroundColor Yellow
Write-Host "1. Go to: https://console.aws.amazon.com/iam/home#/security_credentials" -ForegroundColor White
Write-Host "2. Click 'Create access key'" -ForegroundColor White
Write-Host "3. Choose 'Command Line Interface (CLI)'" -ForegroundColor White
Write-Host "4. Copy the Access Key ID and Secret Access Key" -ForegroundColor White
Write-Host ""
Write-Host "Press any key when you have your credentials ready..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "Enter your AWS credentials:" -ForegroundColor Green
$accessKey = Read-Host "AWS Access Key ID"
$secretKey = Read-Host "AWS Secret Access Key" -AsSecureString

# Convert secure string to plain text
$secretKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($secretKey))

# Configure AWS CLI
Write-Host "🔧 Configuring AWS CLI..." -ForegroundColor Yellow
aws configure set aws_access_key_id $accessKey
aws configure set aws_secret_access_key $secretKeyPlain
aws configure set default.region eu-north-1
aws configure set default.output json

# Test the configuration
Write-Host "🧪 Testing AWS connection..." -ForegroundColor Yellow
try {
    $identity = aws sts get-caller-identity
    Write-Host "✅ AWS CLI configured successfully!" -ForegroundColor Green
    Write-Host "Account: $($identity | ConvertFrom-Json | Select-Object -ExpandProperty Account)" -ForegroundColor Cyan
    Write-Host "User: $($identity | ConvertFrom-Json | Select-Object -ExpandProperty Arn)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ AWS configuration failed. Please check your credentials." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Ready to deploy! Run: .\deploy-frontend.ps1" -ForegroundColor Green
