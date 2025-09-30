# 🚀 Quick Setup Guide for New EC2 Instance

## 📋 What You Need to Do:

### 1. **Connect to Your EC2 Instance**
```bash
# Replace YOUR_EC2_IP with your actual EC2 public IP
ssh -i nclexkeyspairs.pem ubuntu@YOUR_EC2_IP
```

### 2. **Run the Setup Script**
Once connected, run:
```bash
# Download and run the setup script
curl -o setup_new_ec2.sh https://raw.githubusercontent.com/Emperor1p/nclexkeysinternational/main/setup_new_ec2.sh
chmod +x setup_new_ec2.sh
./setup_new_ec2.sh
```

### 3. **Update GitHub Secrets**
Go to your GitHub repository → Settings → Secrets and variables → Actions, and update:
- `EC2_HOST`: Your new EC2 public IP address
- `EC2_SSH_KEY`: Content of your nclexkeyspairs.pem file

### 4. **Test Your Setup**
After setup completes, test:
```bash
# Check if services are running
sudo systemctl status gunicorn
sudo systemctl status nginx

# Test the application
curl http://localhost:8000/api/health/
```

## 🔧 If Something Goes Wrong:

### Check Logs:
```bash
# Gunicorn logs
sudo journalctl -u gunicorn -f

# Nginx logs
sudo journalctl -u nginx -f
```

### Restart Services:
```bash
sudo systemctl restart gunicorn nginx
```

### Check Database Connection:
```bash
cd /home/ubuntu/nclexkey/backend
source venv/bin/activate
python test_aws_connection.py
```

## ✅ Success Indicators:

1. **SSH Connection**: You can connect to your EC2 instance
2. **Setup Script**: Runs without errors
3. **Services Running**: Gunicorn and Nginx are active
4. **Database Connected**: AWS RDS connection works
5. **Application Responding**: Health check returns success

## 🎯 Next Steps:

Once everything is working:
1. Your backend will be accessible at `http://YOUR_EC2_IP`
2. GitHub Actions will automatically deploy updates
3. Your frontend will continue working with the new backend

---

**Need help?** Check the logs and let me know what errors you see!


