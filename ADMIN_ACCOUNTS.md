# 🔐 Default Admin Accounts

This document contains the default admin and instructor accounts that are automatically created for the NCLEX Keys International platform.

## 📋 Default Accounts

### 🏢 Admin Account
- **Email:** `admin@nclexkeys.com`
- **Password:** `admin123456`
- **Role:** Super Admin (Full system access)
- **Access:** Django Admin + Custom Admin Dashboard

### 👨‍🏫 Instructor Account
- **Email:** `instructor@nclexkeys.com`
- **Password:** `instructor123456`
- **Role:** Instructor (Course management access)
- **Access:** Custom Admin Dashboard

## 🚀 How to Access

### 1. **Frontend Login**
1. Go to: https://nclex-cx5hhtc91-peters-projects-db86b6fd.vercel.app/login
2. Use any of the credentials above
3. You'll be redirected to the appropriate dashboard based on your role

### 2. **Django Admin Panel**
1. Go to: https://ec2-13-50-116-201.eu-north-1.compute.amazonaws.com:8000/admin/
2. Use the admin credentials above
3. Full Django admin access for system management

### 3. **Custom Admin Dashboard**
1. Go to: https://nclex-cx5hhtc91-peters-projects-db86b6fd.vercel.app/admin
2. Use any of the credentials above
3. Custom admin interface for course and user management

## 🔧 Account Creation

### Automatic Creation
These accounts are automatically created during deployment via:
- **GitHub Actions:** Runs `python manage.py create_default_accounts` after migrations
- **Django Signals:** Automatically creates accounts after database migrations
- **Manual Script:** Run `python backend/create_admin_accounts.py`

### Manual Creation
You can create these accounts manually using Django management commands:

```bash
# Create admin account
python manage.py create_super_admin --email admin@nclexkeys.com --name "NCLEX Keys Admin" --password admin123456

# Create instructor account
python manage.py create_instructor --email instructor@nclexkeys.com --first_name "NCLEX" --last_name "Instructor" --password instructor123456

# Create default accounts (both admin and instructor)
python manage.py create_default_accounts
```

## 🔒 Security Notes

### ⚠️ Important Security Considerations
1. **Change Default Passwords:** These are default credentials for initial setup
2. **Production Environment:** Change these passwords before going live
3. **Access Control:** Only authorized personnel should have these credentials
4. **Regular Updates:** Rotate passwords regularly for security

### 🛡️ Recommended Actions
1. **Immediate:** Change default passwords after first login
2. **Production:** Use strong, unique passwords
3. **Monitoring:** Monitor admin account activity
4. **Backup:** Keep secure backup of admin credentials

## 📱 Dashboard Access

### Admin Dashboard Features
- **User Management:** View and manage all users
- **Course Management:** Create, edit, and manage courses
- **Analytics:** View system analytics and reports
- **Content Management:** Manage course content and materials
- **Payment Management:** View and manage payments
- **System Settings:** Configure platform settings

### Instructor Dashboard Features
- **Course Management:** Create and manage courses
- **Student Management:** View enrolled students
- **Content Creation:** Add lessons, videos, and materials
- **Progress Tracking:** Monitor student progress
- **Communication:** Message with students

## 🔄 Account Management

### Changing Passwords
1. **Via Django Admin:** Go to Users section and change password
2. **Via API:** Use the password change endpoint
3. **Via Frontend:** Use the profile settings page

### Adding New Admins
1. **Django Admin:** Create new superuser accounts
2. **Management Command:** Use `create_super_admin` command
3. **API Endpoint:** Use the user creation API

## 📞 Support

If you need help with admin accounts:
- **Email:** nclexkeysintl.academy@gmail.com
- **Documentation:** Check the backend documentation
- **Issues:** Report any issues via GitHub

---

**🎯 Remember:** These are default accounts for initial setup. Always change the passwords and follow security best practices in production environments.
