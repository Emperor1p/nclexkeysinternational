#!/bin/bash

# NCLEX Frontend Vercel Deployment Script
echo "🚀 Deploying NCLEX Frontend to Vercel"
echo "====================================="

# Navigate to frontend directory
cd frontend

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Logging into Vercel..."
vercel login

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo "Your frontend is now live on Vercel!"
echo "The Board of Directors section is ready for production!"
