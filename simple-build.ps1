# Simple Build Script for NCLEX Frontend
Write-Host "Building NCLEX Frontend for S3 deployment..." -ForegroundColor Green

# Clean previous builds
if (Test-Path "out") {
    Remove-Item -Recurse -Force "out"
}
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Create a simple next.config.mjs
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

# Try to build
Write-Host "Building frontend..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if (Test-Path "out") {
    Write-Host "Build successful! Static files generated in 'out' directory" -ForegroundColor Green
    Write-Host "You can now deploy these files to S3" -ForegroundColor Cyan
} else {
    Write-Host "Build failed. Please check the build output above." -ForegroundColor Red
}
