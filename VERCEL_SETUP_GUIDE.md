# Vercel Deployment Setup Guide

## Prerequisites
1. Vercel account (sign up at https://vercel.com)
2. GitHub repository connected to Vercel

## Step 1: Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository: `nclexkeysinternational`
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install`

## Step 2: Environment Variables

Add these environment variables in Vercel dashboard:

```
NEXT_PUBLIC_API_BASE_URL=http://ec2-13-50-116-201.eu-north-1.compute.amazonaws.com:8000
```

## Step 3: GitHub Secrets Setup

Add these secrets to your GitHub repository:

### Vercel Secrets
- `VERCEL_TOKEN`: Get from Vercel Account Settings → Tokens
- `VERCEL_ORG_ID`: Get from Vercel Team Settings → General
- `VERCEL_PROJECT_ID`: Get from your project settings in Vercel

### Existing Secrets (Keep these)
- `EC2_HOST`: Your EC2 instance hostname
- `EC2_SSH_KEY`: Your EC2 SSH private key
- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key

## Step 4: Deploy

1. Push your changes to the `main` branch
2. GitHub Actions will automatically deploy to Vercel
3. Your site will be available at: `https://your-project-name.vercel.app`

## Step 5: Update Backend CORS (After Deployment)

After getting your Vercel URL, update the backend CORS settings:

1. SSH into your EC2 instance
2. Edit `backend/config/settings.py`
3. Update `CORS_ALLOWED_ORIGINS` with your actual Vercel URL
4. Restart the backend services

## Benefits of Vercel Deployment

✅ **Automatic HTTPS**: SSL certificates handled automatically
✅ **Global CDN**: Fast loading worldwide
✅ **Automatic Deployments**: Deploy on every push
✅ **Preview Deployments**: Test branches before merging
✅ **Analytics**: Built-in performance monitoring
✅ **No S3 Issues**: No more Access Denied errors

## Troubleshooting

### If deployment fails:
1. Check Vercel build logs in the dashboard
2. Ensure all environment variables are set
3. Verify the `frontend/vercel.json` configuration

### If CORS errors occur:
1. Update `CORS_ALLOWED_ORIGINS` in backend settings
2. Restart backend services on EC2
3. Check browser network tab for specific errors

## Manual Deployment (Alternative)

If you prefer manual deployment:

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the `frontend` directory
3. Follow the prompts to configure
4. Run `vercel --prod` to deploy to production
