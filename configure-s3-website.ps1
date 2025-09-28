# Configure S3 bucket for public website hosting
# Run this script to fix the Access Denied error

Write-Host "🔧 Configuring S3 bucket for website hosting..." -ForegroundColor Yellow

# 1. Enable static website hosting
Write-Host "📝 Enabling static website hosting..." -ForegroundColor Blue
aws s3 website s3://nclexkeysfrontend --index-document index.html --error-document index.html

# 2. Set bucket policy for public read access
Write-Host "🔓 Setting bucket policy for public access..." -ForegroundColor Blue
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

# Save policy to temporary file
$policyFile = "bucket-policy.json"
$bucketPolicy | Out-File -FilePath $policyFile -Encoding UTF8

# Apply the policy
aws s3api put-bucket-policy --bucket nclexkeysfrontend --policy file://$policyFile

# Clean up
Remove-Item $policyFile

# 3. Disable block public access
Write-Host "🚫 Disabling block public access..." -ForegroundColor Blue
aws s3api put-public-access-block --bucket nclexkeysfrontend --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

Write-Host "✅ S3 bucket configured for website hosting!" -ForegroundColor Green
Write-Host "🌐 Your website should now be accessible at:" -ForegroundColor Cyan
Write-Host "   https://nclexkeysfrontend.s3-website.eu-north-1.amazonaws.com" -ForegroundColor White
Write-Host ""
Write-Host "📝 Note: Use the s3-website URL above, not the regular S3 URL" -ForegroundColor Yellow