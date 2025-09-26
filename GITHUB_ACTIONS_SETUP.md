# 🚀 GitHub Actions Setup for AWS Deployment

This guide will help you set up automatic deployment of your NCLEX Virtual School frontend to AWS using GitHub Actions.

## 📋 Prerequisites

1. **GitHub Repository** with your code
2. **AWS Account** with appropriate permissions
3. **AWS CLI** configured locally (for initial setup)

## 🔧 Required GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

### AWS Credentials
```
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
```

### Frontend Environment Variables
```
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_paystack_key
NEXT_PUBLIC_VIDEO_STREAMING_URL=https://api.yourdomain.com/media/videos
NEXT_PUBLIC_APP_NAME=NCLEX Virtual School
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_CDN_URL=https://cdn.yourdomain.com
NEXT_PUBLIC_ENABLE_VIDEO_STREAMING=true
NEXT_PUBLIC_ENABLE_PAYMENT=true
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

### Deployment Options (Choose One)

#### Option 1: S3 + CloudFront
```
S3_BUCKET_NAME=your-s3-bucket-name
CLOUDFRONT_DISTRIBUTION_ID=your-cloudfront-distribution-id
```

#### Option 2: AWS Amplify
```
AMPLIFY_APP_ID=your-amplify-app-id
```

#### Option 3: Vercel
```
VERCEL_TOKEN=your-vercel-token
```

## 🚀 Deployment Options

### Option 1: S3 + CloudFront (Recommended)

1. **Create S3 Bucket:**
   ```bash
   aws s3 mb s3://your-nclex-frontend-bucket
   aws s3 website s3://your-nclex-frontend-bucket --index-document index.html
   ```

2. **Create CloudFront Distribution:**
   - Go to AWS CloudFront console
   - Create distribution with S3 bucket as origin
   - Set up custom domain (optional)

3. **Set GitHub Secrets:**
   - `S3_BUCKET_NAME=your-nclex-frontend-bucket`
   - `CLOUDFRONT_DISTRIBUTION_ID=your-distribution-id`

### Option 2: AWS Amplify

1. **Create Amplify App:**
   ```bash
   amplify init
   amplify add hosting
   amplify publish
   ```

2. **Get App ID from Amplify Console**

3. **Set GitHub Secret:**
   - `AMPLIFY_APP_ID=your-app-id`

### Option 3: Vercel (Easiest)

1. **Create Vercel Account:**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository

2. **Get Vercel Token:**
   - Go to Vercel Settings → Tokens
   - Create new token

3. **Set GitHub Secret:**
   - `VERCEL_TOKEN=your-vercel-token`

## 🔄 How It Works

### Automatic Triggers
- **Push to main/production branches** → Deploys to production
- **Push to other branches** → Runs tests only
- **Pull requests** → Runs tests and security scans

### Deployment Process
1. **Checkout code** from GitHub
2. **Install dependencies** (npm ci)
3. **Run tests** (linting, unit tests)
4. **Build application** (npm run build)
5. **Deploy to AWS** (S3/Amplify/Vercel)
6. **Invalidate cache** (CloudFront)
7. **Health check** and notifications

## 📁 File Structure

```
.github/workflows/
├── deploy-frontend-aws.yml    # Frontend deployment
└── deploy.yml                 # Full stack deployment

frontend/
├── components/sections/
│   └── board-of-directors-section.jsx  # New Board section
├── app/about/
│   └── page.jsx                        # Updated About page
└── public/images/board/                # Board member images
    ├── README.md
    └── [board-member-images].jpg
```

## 🎯 Board of Directors Section

The new Board of Directors section includes:

- **Professional headshots** for each board member
- **Credentials and expertise** display
- **Responsive design** for all devices
- **Fallback to initials** if images not available
- **Statistics section** showing board metrics

### Adding Board Member Images

1. **Upload images** to `frontend/public/images/board/`
2. **Follow naming convention:**
   - `dr-sarah-johnson.jpg`
   - `prof-michael-chen.jpg`
   - etc.

3. **Image specifications:**
   - Format: JPG or PNG
   - Size: 400x400 pixels
   - Quality: High resolution

## 🔍 Monitoring and Logs

### GitHub Actions Logs
- Go to your repository → Actions tab
- Click on any workflow run to see detailed logs
- Check for any errors or warnings

### AWS CloudWatch (if using S3/CloudFront)
- Monitor S3 access logs
- Check CloudFront metrics
- Set up alarms for errors

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Deployment Failures:**
   - Verify AWS credentials are correct
   - Check S3 bucket permissions
   - Ensure CloudFront distribution is active

3. **Image Loading Issues:**
   - Verify image paths are correct
   - Check image file formats and sizes
   - Ensure images are committed to repository

### Debug Commands

```bash
# Test build locally
cd frontend
npm run build

# Test deployment locally
npm run start

# Check AWS credentials
aws sts get-caller-identity

# List S3 buckets
aws s3 ls
```

## 📞 Support

- **GitHub Actions Documentation:** [docs.github.com/actions](https://docs.github.com/actions)
- **AWS S3 Documentation:** [docs.aws.amazon.com/s3](https://docs.aws.amazon.com/s3)
- **Next.js Deployment:** [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)

## ✅ Success Checklist

- [ ] GitHub repository created
- [ ] AWS account set up
- [ ] GitHub secrets configured
- [ ] Deployment option chosen (S3/Amplify/Vercel)
- [ ] Board member images uploaded
- [ ] First deployment successful
- [ ] Health checks passing
- [ ] Monitoring set up

---

**🎉 Congratulations!** Your frontend will now automatically deploy to AWS whenever you push changes to the main or production branch. The Board of Directors section will be live on your About page!
