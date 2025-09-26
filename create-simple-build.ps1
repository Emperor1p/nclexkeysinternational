# Create Simple Static Build for S3
Write-Host "Creating simple static build for S3 deployment..." -ForegroundColor Green

# Remove problematic dynamic routes temporarily
Write-Host "Removing dynamic routes temporarily..." -ForegroundColor Yellow
if (Test-Path "app/courses/[courseId]") {
    Remove-Item -Recurse -Force "app/courses/[courseId]"
}
if (Test-Path "app/payment-status/[reference]") {
    Remove-Item -Recurse -Force "app/payment-status/[reference]"
}

# Create a simple next.config.mjs
Write-Host "Creating simple Next.js config..." -ForegroundColor Yellow
$simpleConfig = @"
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

$simpleConfig | Out-File -FilePath "next.config.mjs" -Encoding UTF8

# Build the application
Write-Host "Building frontend..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if (Test-Path "out") {
    Write-Host "✅ Build successful! Static files generated in 'out' directory" -ForegroundColor Green
    Write-Host "Ready for S3 deployment!" -ForegroundColor Cyan
} else {
    Write-Host "❌ Build failed. Please check the build output above." -ForegroundColor Red
}

