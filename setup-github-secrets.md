# GitHub Secrets Setup Guide

## Required Secrets for GitHub Actions

Go to your GitHub repository settings and add these secrets:
**URL**: https://github.com/Emperor1p/nclexkeysinternational/settings/secrets/actions

### 1. AWS_ACCESS_KEY_ID
- **Name**: `AWS_ACCESS_KEY_ID`
- **Value**: `[Your AWS Access Key ID - starts with AKIA...]`

### 2. AWS_SECRET_ACCESS_KEY
- **Name**: `AWS_SECRET_ACCESS_KEY`
- **Value**: `[Your AWS Secret Access Key]`

### 3. EC2_HOST
- **Name**: `EC2_HOST`
- **Value**: `ec2-13-50-116-201.eu-north-1.compute.amazonaws.com`

### 4. EC2_SSH_KEY
- **Name**: `EC2_SSH_KEY`
- **Value**: [Copy the entire content of your `nclexkeyskeypairs.pem` file]

### 5. CLOUDFRONT_DISTRIBUTION_ID
- **Name**: `CLOUDFRONT_DISTRIBUTION_ID`
- **Value**: [Get this from your AWS CloudFront console]

## How to Add Secrets:

1. Go to your GitHub repository
2. Click on "Settings" tab
3. Click on "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add each secret with the name and value above
6. Click "Add secret"

## Deployment URLs:

- **Frontend**: https://nclexkeysfrontend.s3.eu-north-1.amazonaws.com
- **Backend**: http://ec2-13-50-116-201.eu-north-1.compute.amazonaws.com:8000
- **Database**: database-1.c9i8gmcwmltt.eu-north-1.rds.amazonaws.com:5432

## GitHub Actions Status:
Check your deployments at: https://github.com/Emperor1p/nclexkeysinternational/actions
