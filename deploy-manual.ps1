# Manual deployment script for NCLEX Keys International
Write-Host "🚀 Starting manual deployment..." -ForegroundColor Yellow

# Navigate to frontend directory
cd frontend

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm install

# Build the project
Write-Host "🔨 Building project..." -ForegroundColor Blue
npm run build

Write-Host "✅ Build completed successfully!" -ForegroundColor Green
Write-Host "🌐 Your website should be updated with the latest changes!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Updated features:" -ForegroundColor White
Write-Host "  ✅ Social media links (Facebook, Twitter/X, LinkedIn)" -ForegroundColor Green
Write-Host "  ✅ Contact information (Ikorodu, Lagos, Nigeria)" -ForegroundColor Green
Write-Host "  ✅ Email link (nclexkeysintl.academy@gmail.com)" -ForegroundColor Green
Write-Host "  ✅ FAQ, Privacy Policy, Terms of Service pages" -ForegroundColor Green
Write-Host "  ✅ Professional footer layout" -ForegroundColor Green
