#!/bin/bash

# NCLEX Frontend Deployment Script for AWS
# This script deploys the Next.js frontend to AWS Amplify or S3 + CloudFront

set -e

# Configuration
APP_NAME="nclex-frontend"
REGION="us-east-1"
DEPLOYMENT_METHOD="${DEPLOYMENT_METHOD:-amplify}" # amplify or s3
S3_BUCKET_NAME="${S3_BUCKET_NAME:-}"
CLOUDFRONT_DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID:-}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check if AWS CLI is installed (for S3 deployment)
    if [ "$DEPLOYMENT_METHOD" = "s3" ]; then
        if ! command -v aws &> /dev/null; then
            log_error "AWS CLI is not installed. Please install it first."
            exit 1
        fi
        
        # Check if user is logged in to AWS
        if ! aws sts get-caller-identity &> /dev/null; then
            log_error "Not logged in to AWS. Please run 'aws configure' first."
            exit 1
        fi
    fi
    
    # Check if Amplify CLI is installed (for Amplify deployment)
    if [ "$DEPLOYMENT_METHOD" = "amplify" ]; then
        if ! command -v amplify &> /dev/null; then
            log_warning "Amplify CLI is not installed. Installing it now..."
            npm install -g @aws-amplify/cli
        fi
    fi
    
    log_success "Prerequisites check passed"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    cd frontend
    
    # Install dependencies
    if [ -f "pnpm-lock.yaml" ]; then
        log_info "Using pnpm..."
        if ! command -v pnpm &> /dev/null; then
            npm install -g pnpm
        fi
        pnpm install
    elif [ -f "yarn.lock" ]; then
        log_info "Using yarn..."
        if ! command -v yarn &> /dev/null; then
            npm install -g yarn
        fi
        yarn install
    else
        log_info "Using npm..."
        npm ci
    fi
    
    log_success "Dependencies installed"
}

# Build the application
build_application() {
    log_info "Building Next.js application..."
    
    # Set production environment
    export NODE_ENV=production
    
    # Build the application
    if [ -f "pnpm-lock.yaml" ]; then
        pnpm run build
    elif [ -f "yarn.lock" ]; then
        yarn build
    else
        npm run build
    fi
    
    log_success "Application built successfully"
}

# Deploy to AWS Amplify
deploy_to_amplify() {
    log_info "Deploying to AWS Amplify..."
    
    # Check if Amplify app exists
    if amplify status &> /dev/null; then
        log_info "Amplify app already initialized. Publishing..."
        amplify publish --yes
    else
        log_info "Initializing Amplify app..."
        amplify init --yes
        
        # Add hosting
        amplify add hosting
        
        # Publish
        amplify publish --yes
    fi
    
    log_success "Deployed to AWS Amplify"
}

# Deploy to S3 + CloudFront
deploy_to_s3() {
    log_info "Deploying to S3 + CloudFront..."
    
    if [ -z "$S3_BUCKET_NAME" ]; then
        log_error "S3_BUCKET_NAME environment variable is required for S3 deployment"
        exit 1
    fi
    
    # Check if S3 bucket exists
    if ! aws s3 ls s3://$S3_BUCKET_NAME &> /dev/null; then
        log_error "S3 bucket $S3_BUCKET_NAME does not exist or is not accessible"
        exit 1
    fi
    
    # Sync files to S3
    log_info "Syncing files to S3 bucket: $S3_BUCKET_NAME"
    aws s3 sync out/ s3://$S3_BUCKET_NAME --delete
    
    # Invalidate CloudFront if distribution ID is provided
    if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
        log_info "Invalidating CloudFront distribution: $CLOUDFRONT_DISTRIBUTION_ID"
        aws cloudfront create-invalidation \
            --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
            --paths "/*"
    fi
    
    log_success "Deployed to S3 + CloudFront"
}

# Set up environment variables
setup_environment() {
    log_info "Setting up environment variables..."
    
    # Create production environment file if it doesn't exist
    if [ ! -f ".env.production" ]; then
        log_info "Creating .env.production file..."
        cat > .env.production << 'EOF'
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com

# Payment Gateway Configuration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_paystack_public_key_here

# Video Streaming Configuration
NEXT_PUBLIC_VIDEO_STREAMING_URL=https://api.yourdomain.com/media/videos
NEXT_PUBLIC_CDN_URL=https://cdn.yourdomain.com

# Application Configuration
NEXT_PUBLIC_APP_NAME=NCLEX Virtual School
NEXT_PUBLIC_APP_DESCRIPTION=Comprehensive NCLEX preparation platform
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Feature Flags
NEXT_PUBLIC_ENABLE_VIDEO_STREAMING=true
NEXT_PUBLIC_ENABLE_PAYMENT=true
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true

# Production Environment
NODE_ENV=production
EOF
        log_warning "Please update .env.production with your actual values"
    fi
    
    log_success "Environment variables configured"
}

# Run tests
run_tests() {
    log_info "Running tests..."
    
    # Check if test script exists
    if grep -q '"test"' package.json; then
        if [ -f "pnpm-lock.yaml" ]; then
            pnpm test
        elif [ -f "yarn.lock" ]; then
            yarn test
        else
            npm test
        fi
        log_success "Tests passed"
    else
        log_info "No test script found. Skipping tests."
    fi
}

# Health check
health_check() {
    log_info "Performing health check..."
    
    # Get the deployment URL
    if [ "$DEPLOYMENT_METHOD" = "amplify" ]; then
        # Get Amplify app URL
        APP_URL=$(amplify status --json | jq -r '.amplifyMeta.providers.awscloudformation.StackName' 2>/dev/null || echo "")
        if [ -n "$APP_URL" ]; then
            APP_URL="https://$APP_URL.amplifyapp.com"
        fi
    elif [ "$DEPLOYMENT_METHOD" = "s3" ]; then
        # Get S3 bucket website URL or CloudFront URL
        if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
            APP_URL=$(aws cloudfront get-distribution --id $CLOUDFRONT_DISTRIBUTION_ID --query 'Distribution.DomainName' --output text 2>/dev/null || echo "")
            if [ -n "$APP_URL" ]; then
                APP_URL="https://$APP_URL"
            fi
        else
            APP_URL="http://$S3_BUCKET_NAME.s3-website-$REGION.amazonaws.com"
        fi
    fi
    
    if [ -n "$APP_URL" ]; then
        log_info "Checking application health at $APP_URL"
        
        # Wait for application to be ready
        for i in {1..30}; do
            if curl -f $APP_URL &> /dev/null; then
                log_success "Application is healthy"
                echo "  - Application URL: $APP_URL"
                return 0
            fi
            log_info "Waiting for application to be ready... ($i/30)"
            sleep 10
        done
        
        log_error "Health check failed after 5 minutes"
        return 1
    else
        log_warning "Could not determine application URL. Skipping health check."
    fi
}

# Optimize images
optimize_images() {
    log_info "Optimizing images..."
    
    # Check if next-optimized-images is installed
    if grep -q "next-optimized-images" package.json; then
        log_info "Images will be optimized during build"
    else
        log_info "Consider installing next-optimized-images for better image optimization"
    fi
}

# Generate sitemap
generate_sitemap() {
    log_info "Generating sitemap..."
    
    # Check if next-sitemap is installed
    if grep -q "next-sitemap" package.json; then
        if [ -f "pnpm-lock.yaml" ]; then
            pnpm run postbuild
        elif [ -f "yarn.lock" ]; then
            yarn postbuild
        else
            npm run postbuild
        fi
        log_success "Sitemap generated"
    else
        log_info "Consider installing next-sitemap for SEO optimization"
    fi
}

# Main deployment function
deploy() {
    log_info "Starting NCLEX frontend deployment to AWS..."
    
    check_prerequisites
    install_dependencies
    setup_environment
    run_tests
    optimize_images
    build_application
    generate_sitemap
    
    if [ "$DEPLOYMENT_METHOD" = "amplify" ]; then
        deploy_to_amplify
    elif [ "$DEPLOYMENT_METHOD" = "s3" ]; then
        deploy_to_s3
    else
        log_error "Invalid deployment method: $DEPLOYMENT_METHOD"
        log_error "Supported methods: amplify, s3"
        exit 1
    fi
    
    health_check
    
    log_success "Frontend deployment completed successfully!"
    
    # Display useful information
    echo ""
    log_info "Deployment Summary:"
    echo "  - Deployment Method: $DEPLOYMENT_METHOD"
    echo "  - Region: $REGION"
    
    if [ "$DEPLOYMENT_METHOD" = "s3" ]; then
        echo "  - S3 Bucket: $S3_BUCKET_NAME"
        if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
            echo "  - CloudFront Distribution: $CLOUDFRONT_DISTRIBUTION_ID"
        fi
    fi
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        deploy
        ;;
    "build")
        check_prerequisites
        install_dependencies
        build_application
        ;;
    "test")
        check_prerequisites
        install_dependencies
        run_tests
        ;;
    "health")
        health_check
        ;;
    *)
        echo "Usage: $0 {deploy|build|test|health}"
        echo "  deploy  - Full deployment (default)"
        echo "  build   - Build application only"
        echo "  test    - Run tests only"
        echo "  health  - Run health check only"
        echo ""
        echo "Environment Variables:"
        echo "  DEPLOYMENT_METHOD - Deployment method (amplify|s3)"
        echo "  S3_BUCKET_NAME - S3 bucket name (required for s3 deployment)"
        echo "  CLOUDFRONT_DISTRIBUTION_ID - CloudFront distribution ID (optional for s3 deployment)"
        exit 1
        ;;
esac

