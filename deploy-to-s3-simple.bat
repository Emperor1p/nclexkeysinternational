@echo off
echo 🚀 Deploying NCLEX Frontend to AWS S3
echo =====================================

cd frontend

echo 🧹 Cleaning previous builds...
if exist out rmdir /s /q out
if exist .next rmdir /s /q .next

echo 📦 Installing dependencies...
npm install

echo 🔧 Creating S3-optimized config...
echo /** @type {import('next').NextConfig} */ > next.config.mjs
echo const nextConfig = { >> next.config.mjs
echo   output: 'export', >> next.config.mjs
echo   trailingSlash: true, >> next.config.mjs
echo   distDir: 'out', >> next.config.mjs
echo   images: { >> next.config.mjs
echo     unoptimized: true, >> next.config.mjs
echo   }, >> next.config.mjs
echo } >> next.config.mjs
echo. >> next.config.mjs
echo export default nextConfig >> next.config.mjs

echo 🔨 Building frontend for S3...
npm run build

if exist out (
    echo ✅ Build successful! Deploying to S3...
    
    echo 🚀 Deploying to S3 bucket: nclexkeysfrontend
    aws s3 sync out/ s3://nclexkeysfrontend --delete --region eu-north-1
    
    echo 🔧 Setting content types...
    aws s3 cp s3://nclexkeysfrontend s3://nclexkeysfrontend --recursive --metadata-directive REPLACE --content-type "text/html" --exclude "*" --include "*.html"
    aws s3 cp s3://nclexkeysfrontend s3://nclexkeysfrontend --recursive --metadata-directive REPLACE --content-type "application/json" --exclude "*" --include "*.json"
    aws s3 cp s3://nclexkeysfrontend s3://nclexkeysfrontend --recursive --metadata-directive REPLACE --content-type "text/css" --exclude "*" --include "*.css"
    aws s3 cp s3://nclexkeysfrontend s3://nclexkeysfrontend --recursive --metadata-directive REPLACE --content-type "application/javascript" --exclude "*" --include "*.js"
    
    echo 🔓 Setting bucket permissions...
    echo { > bucket-policy.json
    echo     "Version": "2012-10-17", >> bucket-policy.json
    echo     "Statement": [ >> bucket-policy.json
    echo         { >> bucket-policy.json
    echo             "Sid": "PublicReadGetObject", >> bucket-policy.json
    echo             "Effect": "Allow", >> bucket-policy.json
    echo             "Principal": "*", >> bucket-policy.json
    echo             "Action": "s3:GetObject", >> bucket-policy.json
    echo             "Resource": "arn:aws:s3:::nclexkeysfrontend/*" >> bucket-policy.json
    echo         } >> bucket-policy.json
    echo     ] >> bucket-policy.json
    echo } >> bucket-policy.json
    
    aws s3api put-bucket-policy --bucket nclexkeysfrontend --policy file://bucket-policy.json
    
    echo 🌐 Configuring static website hosting...
    aws s3 website s3://nclexkeysfrontend --index-document index.html --error-document 404.html
    
    echo.
    echo 🎉 Deployment completed successfully!
    echo =====================================
    echo Website URL: http://nclexkeysfrontend.s3-website.eu-north-1.amazonaws.com
    echo S3 Console: https://eu-north-1.console.aws.amazon.com/s3/buckets/nclexkeysfrontend
    echo =====================================
    
    del bucket-policy.json
    
    echo ✅ Your NCLEX frontend is now live on AWS S3!
    echo 📱 The Board of Directors section is ready for production!
) else (
    echo ❌ Build failed. Please check the build output above.
)

pause

