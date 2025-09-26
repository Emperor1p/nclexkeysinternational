# 🔑 How to Get Your AWS Credentials

## Current Issue
The credentials you provided appear to be:
- **603346703545** - This is your **AWS Account ID** (not Access Key ID)
- **wRxFlMeZKgS+O7T4uTw8qJG1UmLH7PoP5v4I33v5** - This looks like a Secret Access Key

## ✅ What You Need

### 1. AWS Access Key ID
- Format: `AKIA...` (starts with AKIA, 20 characters)
- Example: `AKIAIOSFODNN7EXAMPLE`

### 2. AWS Secret Access Key
- Format: Random string (40 characters)
- Example: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`

## 🔧 How to Get Your Credentials

### Step 1: Go to AWS Console
1. Open: https://console.aws.amazon.com/iam/home#/security_credentials
2. Make sure you're in the correct account (603346703545)

### Step 2: Create Access Key
1. Scroll down to **"Access keys"** section
2. Click **"Create access key"**
3. Choose **"Command Line Interface (CLI)"**
4. Check the confirmation box
5. Click **"Next"**

### Step 3: Copy Your Credentials
1. **Access Key ID**: Copy the key that starts with `AKIA...`
2. **Secret Access Key**: Copy the secret key (40 characters)
3. **Important**: Save these securely - you won't see the secret key again!

### Step 4: Test Your Credentials
Once you have the correct credentials, run:
```bash
aws configure set aws_access_key_id YOUR_ACCESS_KEY_ID
aws configure set aws_secret_access_key YOUR_SECRET_ACCESS_KEY
aws sts get-caller-identity
```

## 🚨 Security Note
- Never share your Secret Access Key publicly
- Store credentials securely
- Use IAM roles when possible in production

## 📋 Quick Checklist
- [ ] Access Key ID starts with `AKIA...`
- [ ] Access Key ID is 20 characters long
- [ ] Secret Access Key is 40 characters long
- [ ] Both keys are from the same AWS account (603346703545)
- [ ] Keys have S3 permissions for nclexkeysfrontend bucket
