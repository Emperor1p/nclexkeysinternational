# GitHub Secrets Setup for Full-Stack Deployment

## Required Secrets for Automatic Deployment

To enable automatic deployment of both frontend and backend, you need to add the following secrets to your GitHub repository.

### 🔧 **How to Add Secrets:**

1. Go to your GitHub repository: https://github.com/Emperor1p/nclexkeysinternational
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **"New repository secret"** for each secret below

---

## 📋 **Required Secrets:**

### **1. AWS Credentials (for Frontend S3 Deployment)**
- **Name:** `AWS_ACCESS_KEY_ID`
- **Value:** `[Your AWS Access Key ID]`

- **Name:** `AWS_SECRET_ACCESS_KEY`
- **Value:** `[Your AWS Secret Access Key]`

### **2. EC2 SSH Credentials (for Backend Deployment)**
- **Name:** `EC2_HOST`
- **Value:** `ec2-13-50-116-201.eu-north-1.compute.amazonaws.com`

- **Name:** `EC2_SSH_KEY`
- **Value:** [Content of your nclexkeyskeypairs.pem file]

### **3. Optional: CloudFront Distribution (for Cache Invalidation)**
- **Name:** `CLOUDFRONT_DISTRIBUTION_ID`
- **Value:** [Your CloudFront distribution ID if you have one]

---

## 🔑 **How to Get EC2_SSH_KEY:**

1. Open your `nclexkeyskeypairs.pem` file in a text editor
2. Copy the entire content (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`)
3. Paste this content as the value for `EC2_SSH_KEY` secret

**Example format:**
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
[entire key content]
...
-----END RSA PRIVATE KEY-----
```

---

## ✅ **Verification Checklist:**

- [ ] `AWS_ACCESS_KEY_ID` added
- [ ] `AWS_SECRET_ACCESS_KEY` added
- [ ] `EC2_HOST` added
- [ ] `EC2_SSH_KEY` added
- [ ] `CLOUDFRONT_DISTRIBUTION_ID` added (optional)

---

## 🚀 **After Adding Secrets:**

1. **Push any change** to trigger the deployment
2. **Check GitHub Actions:** https://github.com/Emperor1p/nclexkeysinternational/actions
3. **Monitor deployment progress** in the Actions tab
4. **Verify deployment** by checking your live sites

---

## 📊 **What the Deployment Does:**

### **Backend Deployment:**
- Connects to your EC2 instance via SSH
- Pulls latest code from GitHub
- Installs Python dependencies
- Runs database migrations
- Collects static files
- Restarts Gunicorn and Nginx services

### **Frontend Deployment:**
- Builds the Next.js application
- Deploys static files to S3 bucket
- Optionally invalidates CloudFront cache

---

## 🔧 **Troubleshooting:**

### **If Backend Deployment Fails:**
- Check that `EC2_HOST` and `EC2_SSH_KEY` are correct
- Verify your EC2 instance is running
- Ensure the SSH key has proper permissions

### **If Frontend Deployment Fails:**
- Check that `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are correct
- Verify your S3 bucket exists and is accessible
- Check AWS region is set to `eu-north-1`

### **If Both Deployments Fail:**
- Check GitHub Actions logs for specific error messages
- Verify all secrets are added correctly
- Ensure your repository has the latest code

---

## 📞 **Support:**

If you encounter any issues:
1. Check the GitHub Actions logs
2. Verify all secrets are correctly added
3. Ensure your AWS and EC2 resources are properly configured
4. Contact support if problems persist

**Your full-stack application will deploy automatically once all secrets are configured!** 🎯
