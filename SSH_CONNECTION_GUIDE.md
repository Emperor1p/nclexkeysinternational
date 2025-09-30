# 🔑 SSH Connection Guide

## Your Exact Command:
```bash
ssh -i "neclex-keypairs.pem" ubuntu@ec2-34-206-167-168.compute-1.amazonaws.com
```

## 📋 Step-by-Step Instructions:

### 1. **Open Your Terminal/PowerShell**
- Windows: Open PowerShell or Command Prompt
- Mac/Linux: Open Terminal

### 2. **Navigate to Your Key File**
```bash
# Navigate to where you saved the neclex-keypairs.pem file
cd C:\Users\User\Downloads
# or wherever you saved the file
```

### 3. **Run the SSH Command**
```bash
ssh -i "neclex-keypairs.pem" ubuntu@ec2-34-206-167-168.compute-1.amazonaws.com
```

### 4. **If Connection Succeeds, Run These Commands:**
```bash
# Download the setup script
curl -o setup_new_ec2.sh https://raw.githubusercontent.com/Emperor1p/nclexkeysinternational/main/setup_new_ec2.sh

# Make it executable
chmod +x setup_new_ec2.sh

# Run the setup script
./setup_new_ec2.sh
```

## 🔧 **If SSH Connection Fails:**

### Check Security Groups:
1. Go to AWS Console → EC2 → Security Groups
2. Find your instance's security group
3. Make sure it allows SSH (port 22) from your IP

### Check Key Permissions (Linux/Mac):
```bash
chmod 400 neclex-keypairs.pem
```

### Check Instance Status:
1. Go to AWS Console → EC2 → Instances
2. Make sure your instance is "running"
3. Check if it has a public IP

## 🚀 **What Happens After Connection:**

The setup script will:
- Install all required software (Python, Node.js, Nginx, etc.)
- Clone your repository
- Set up the backend environment
- Connect to your AWS RDS database
- Run database migrations
- Create default admin accounts
- Configure and start all services

## ✅ **Success Indicators:**

1. **SSH Connection**: You can connect without errors
2. **Setup Script**: Runs without errors
3. **Services Running**: Gunicorn and Nginx are active
4. **Database Connected**: AWS RDS connection works
5. **Application Responding**: Health check returns success

## 📞 **Need Help?**

If you encounter issues:
1. Check AWS Console for instance status
2. Verify security group settings
3. Test database connectivity
4. Review application logs

---

**Ready to connect?** Run the SSH command above and let me know what happens!


