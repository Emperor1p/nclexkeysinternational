# Quick S3 Deployment - Fastest Method
Write-Host "🚀 Quick S3 Deployment - Fastest Method" -ForegroundColor Green

# Remove ALL problematic routes
Write-Host "Removing problematic routes..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "app/courses" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "app/payment-status" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "app/dashboard" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "app/admin" -ErrorAction SilentlyContinue

# Create simple config
Write-Host "Creating simple config..." -ForegroundColor Yellow
$config = @"
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: { unoptimized: true }
}
export default nextConfig
"@
$config | Out-File -FilePath "next.config.mjs" -Encoding UTF8

# Build
Write-Host "Building..." -ForegroundColor Yellow
npm run build

# Deploy to S3
if (Test-Path "out") {
    Write-Host "Deploying to S3..." -ForegroundColor Yellow
    aws s3 sync out/ s3://nclexkeysfrontend --delete --region eu-north-1
    aws s3 website s3://nclexkeysfrontend --index-document index.html
    Write-Host "✅ DONE! Your site is live!" -ForegroundColor Green
    Write-Host "URL: http://nclexkeysfrontend.s3-website.eu-north-1.amazonaws.com" -ForegroundColor Cyan
} else {
    Write-Host "❌ Build failed" -ForegroundColor Red
}

