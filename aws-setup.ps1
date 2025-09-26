# AWS Setup for Account 603346703545
Write-Host "AWS Configuration Setup" -ForegroundColor Green
Write-Host "=======================" -ForegroundColor Green
Write-Host ""
Write-Host "Account: 603346703545" -ForegroundColor Cyan
Write-Host "Region: eu-north-1" -ForegroundColor Cyan
Write-Host "Bucket: nclexkeysfrontend" -ForegroundColor Cyan
Write-Host ""
Write-Host "Get your AWS credentials from:" -ForegroundColor Yellow
Write-Host "https://console.aws.amazon.com/iam/home#/security_credentials" -ForegroundColor White
Write-Host ""

$accessKey = Read-Host "Enter AWS Access Key ID"
$secretKey = Read-Host "Enter AWS Secret Access Key" -AsSecureString

$secretKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($secretKey))

aws configure set aws_access_key_id $accessKey
aws configure set aws_secret_access_key $secretKeyPlain
aws configure set default.region eu-north-1
aws configure set default.output json

Write-Host "Testing AWS connection..." -ForegroundColor Yellow
aws sts get-caller-identity

Write-Host "AWS CLI configured successfully!" -ForegroundColor Green
