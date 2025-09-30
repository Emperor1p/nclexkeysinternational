# Update GitHub Secrets for New EC2 Instance

## 🔧 **Update GitHub Repository Secrets**

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

### **Required Secrets to Update:**

1. **EC2_HOST**
   - **Value**: `ec2-34-206-167-168.compute-1.amazonaws.com`
   - **Description**: New EC2 instance hostname

2. **EC2_SSH_KEY**
   - **Value**: Content of your `nclexkeyspair.pem` file
   - **Description**: SSH private key for EC2 access

### **Steps to Update:**

1. **Copy your SSH key content:**
   ```bash
   # On your local machine, copy the content of your .pem file
   cat nclexkeyspair.pem
   ```

2. **Update GitHub Secrets:**
   - Go to: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions`
   - Click **"New repository secret"** for each secret
   - Or click **"Update"** if the secrets already exist

3. **Verify the secrets are set:**
   - You should see both `EC2_HOST` and `EC2_SSH_KEY` in your secrets list

## 🚀 **Test the Deployment**

Once secrets are updated, push to main branch to trigger deployment:

```bash
git add .
git commit -m "Update EC2 configuration for new instance"
git push origin main
```

## 📋 **What Happens Next:**

1. **Backend Deployment**: GitHub Actions will deploy to your new EC2 instance
2. **Frontend Deployment**: Will deploy to S3 and CloudFront
3. **Automatic Setup**: Default admin and instructor accounts will be created
4. **Service Restart**: Gunicorn and Nginx will be restarted

## ✅ **Verification Steps:**

After deployment, test these endpoints:

```bash
# Test backend API
curl http://ec2-34-206-167-168.compute-1.amazonaws.com:8000/api/auth/login/

# Test frontend
# Visit your Vercel URL or S3 URL
```

## 🔑 **Default Admin Credentials:**

- **Email**: `admin@nclexkeys.com`
- **Password**: `admin123`
- **Role**: Admin

- **Email**: `instructor@nclexkeys.com`  
- **Password**: `instructor123`
- **Role**: Instructor

## 🆘 **Troubleshooting:**

If deployment fails:
1. Check GitHub Actions logs
2. Verify SSH key format (should start with `-----BEGIN RSA PRIVATE KEY-----`)
3. Ensure EC2 instance is running
4. Check security group allows SSH (port 22) and HTTP (port 8000)
