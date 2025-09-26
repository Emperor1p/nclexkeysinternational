#!/bin/bash

# NCLEX Frontend S3 Deployment Script
echo "🚀 Deploying NCLEX Frontend to AWS S3"
echo "====================================="

# Navigate to frontend directory
cd frontend

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf out
rm -rf .next

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create a simple next.config.mjs for S3
echo "🔧 Creating S3-optimized config..."
cat > next.config.mjs << 'EOF'
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
EOF

# Build the application
echo "🔨 Building frontend for S3..."
npm run build

# Check if build was successful
if [ -d "out" ]; then
    echo "✅ Build successful! Deploying to S3..."
    
    # Deploy to S3
    echo "🚀 Deploying to S3 bucket: nclexkeysfrontend"
    aws s3 sync out/ s3://nclexkeysfrontend --delete --region eu-north-1
    
    # Set proper content types
    echo "🔧 Setting content types..."
    aws s3 cp s3://nclexkeysfrontend s3://nclexkeysfrontend --recursive --metadata-directive REPLACE --content-type "text/html" --exclude "*" --include "*.html"
    aws s3 cp s3://nclexkeysfrontend s3://nclexkeysfrontend --recursive --metadata-directive REPLACE --content-type "application/json" --exclude "*" --include "*.json"
    aws s3 cp s3://nclexkeysfrontend s3://nclexkeysfrontend --recursive --metadata-directive REPLACE --content-type "text/css" --exclude "*" --include "*.css"
    aws s3 cp s3://nclexkeysfrontend s3://nclexkeysfrontend --recursive --metadata-directive REPLACE --content-type "application/javascript" --exclude "*" --include "*.js"
    
    # Make bucket publicly readable
    echo "🔓 Setting bucket permissions..."
    cat > bucket-policy.json << 'EOF'
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
EOF
    
    aws s3api put-bucket-policy --bucket nclexkeysfrontend --policy file://bucket-policy.json
    
    # Enable static website hosting
    echo "🌐 Configuring static website hosting..."
    aws s3 website s3://nclexkeysfrontend --index-document index.html --error-document 404.html
    
    # Get website URL
    WEBSITE_URL="http://nclexkeysfrontend.s3-website.eu-north-1.amazonaws.com"
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo "====================================="
    echo "Website URL: $WEBSITE_URL"
    echo "S3 Console: https://eu-north-1.console.aws.amazon.com/s3/buckets/nclexkeysfrontend"
    echo "====================================="
    
    # Clean up
    rm -f bucket-policy.json
    
    echo "✅ Your NCLEX frontend is now live on AWS S3!"
    echo "📱 The Board of Directors section is ready for production!"
    
else
    echo "❌ Build failed. Please check the build output above."
    exit 1
fi

