#!/bin/bash

# NCLEX Backend Deployment Script for AWS
# This script deploys the Django backend to AWS using Docker and ECR

set -e

# Configuration
APP_NAME="nclex-backend"
REGION="us-east-1"
ECR_REPOSITORY="nclex-backend"
ECR_IMAGE_TAG="latest"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

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
    
    # Check if AWS CLI is installed
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    # Check if user is logged in to AWS
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "Not logged in to AWS. Please run 'aws configure' first."
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Create ECR repository if it doesn't exist
create_ecr_repository() {
    log_info "Creating ECR repository if it doesn't exist..."
    
    if aws ecr describe-repositories --repository-names $ECR_REPOSITORY --region $REGION &> /dev/null; then
        log_info "ECR repository $ECR_REPOSITORY already exists"
    else
        log_info "Creating ECR repository $ECR_REPOSITORY..."
        aws ecr create-repository \
            --repository-name $ECR_REPOSITORY \
            --region $REGION \
            --image-scanning-configuration scanOnPush=true \
            --encryption-configuration encryptionType=AES256
        
        log_success "ECR repository created"
    fi
}

# Build and push Docker image
build_and_push_image() {
    log_info "Building Docker image..."
    
    # Navigate to backend directory
    cd backend
    
    # Build Docker image
    docker build -t $ECR_REPOSITORY:$ECR_IMAGE_TAG .
    
    # Tag image for ECR
    docker tag $ECR_REPOSITORY:$ECR_IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_REPOSITORY:$ECR_IMAGE_TAG
    
    # Login to ECR
    log_info "Logging in to ECR..."
    aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com
    
    # Push to ECR
    log_info "Pushing image to ECR..."
    docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_REPOSITORY:$ECR_IMAGE_TAG
    
    log_success "Docker image built and pushed successfully"
    
    # Return to original directory
    cd ..
}

# Update ECS service (if using ECS)
update_ecs_service() {
    log_info "Updating ECS service..."
    
    # Check if ECS cluster exists
    if aws ecs describe-clusters --clusters nclex-cluster --region $REGION &> /dev/null; then
        # Check if service exists
        if aws ecs describe-services --cluster nclex-cluster --services nclex-backend-service --region $REGION &> /dev/null; then
            log_info "Updating ECS service..."
            aws ecs update-service \
                --cluster nclex-cluster \
                --service nclex-backend-service \
                --force-new-deployment \
                --region $REGION
            
            log_success "ECS service updated"
        else
            log_warning "ECS service nclex-backend-service not found. Skipping ECS update."
        fi
    else
        log_warning "ECS cluster nclex-cluster not found. Skipping ECS update."
    fi
}

# Update Auto Scaling Group (if using EC2 with Auto Scaling)
update_autoscaling_group() {
    log_info "Updating Auto Scaling Group..."
    
    # Check if Auto Scaling Group exists
    if aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names nclex-asg --region $REGION &> /dev/null; then
        log_info "Triggering Auto Scaling Group refresh..."
        aws autoscaling start-instance-refresh \
            --auto-scaling-group-name nclex-asg \
            --region $REGION
        
        log_success "Auto Scaling Group refresh started"
    else
        log_warning "Auto Scaling Group nclex-asg not found. Skipping ASG update."
    fi
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."
    
    # This would typically be done by the application itself on startup
    # or through a separate migration task
    log_info "Migrations will be handled by the application on startup"
}

# Health check
health_check() {
    log_info "Performing health check..."
    
    # Get ALB DNS name from Terraform output
    ALB_DNS=$(terraform -chdir=terraform output -raw alb_dns_name 2>/dev/null || echo "")
    
    if [ -n "$ALB_DNS" ]; then
        log_info "Checking application health at http://$ALB_DNS/health/"
        
        # Wait for application to be ready
        for i in {1..30}; do
            if curl -f http://$ALB_DNS/health/ &> /dev/null; then
                log_success "Application is healthy"
                return 0
            fi
            log_info "Waiting for application to be ready... ($i/30)"
            sleep 10
        done
        
        log_error "Health check failed after 5 minutes"
        return 1
    else
        log_warning "Could not determine ALB DNS name. Skipping health check."
    fi
}

# Clean up old images
cleanup_old_images() {
    log_info "Cleaning up old Docker images..."
    
    # Keep only the latest 5 images
    aws ecr list-images \
        --repository-name $ECR_REPOSITORY \
        --region $REGION \
        --filter tagStatus=TAGGED \
        --query 'imageIds[?imagePushedAt<`'$(date -d '7 days ago' --iso-8601)'`]' \
        --output json | \
    jq -r '.[] | .imageDigest' | \
    head -n -5 | \
    xargs -I {} aws ecr batch-delete-image \
        --repository-name $ECR_REPOSITORY \
        --region $REGION \
        --image-ids imageDigest={} || true
    
    log_success "Old images cleaned up"
}

# Main deployment function
deploy() {
    log_info "Starting NCLEX backend deployment to AWS..."
    
    check_prerequisites
    create_ecr_repository
    build_and_push_image
    update_ecs_service
    update_autoscaling_group
    run_migrations
    health_check
    cleanup_old_images
    
    log_success "Backend deployment completed successfully!"
    
    # Display useful information
    echo ""
    log_info "Deployment Summary:"
    echo "  - ECR Repository: $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_REPOSITORY"
    echo "  - Image Tag: $ECR_IMAGE_TAG"
    echo "  - Region: $REGION"
    
    if [ -n "$ALB_DNS" ]; then
        echo "  - Application URL: http://$ALB_DNS"
    fi
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        deploy
        ;;
    "build")
        check_prerequisites
        build_and_push_image
        ;;
    "health")
        health_check
        ;;
    "cleanup")
        cleanup_old_images
        ;;
    *)
        echo "Usage: $0 {deploy|build|health|cleanup}"
        echo "  deploy  - Full deployment (default)"
        echo "  build   - Build and push Docker image only"
        echo "  health  - Run health check only"
        echo "  cleanup - Clean up old Docker images"
        exit 1
        ;;
esac

