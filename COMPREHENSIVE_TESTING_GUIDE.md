# 🧪 Comprehensive Testing Guide for NCLEX Keys Platform

## 🚀 **Complete Testing Checklist**

### **1. Backend Testing (EC2 Instance)**

#### **A. Check Backend Services**
```bash
# Check if Django is running
sudo systemctl status gunicorn

# Check if Nginx is running  
sudo systemctl status nginx

# Check if database is connected
cd /home/ubuntu/nclexkey/backend
source venv/bin/activate
python manage.py check
```

#### **B. Test Backend API Endpoints**
```bash
# Test basic connectivity
curl http://localhost:8000/

# Test authentication endpoints
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@nclexkeys.com", "password": "admin123"}'

# Test registration endpoint
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "fullName": "Test User",
    "phoneNumber": "+1234567890",
    "payment_status": "yes",
    "registration_code": "NCLEX-NIG-ABC12345"
  }'

# Test courses endpoint
curl http://localhost:8000/api/courses/

# Test payments endpoint
curl http://localhost:8000/api/payments/initialize/
```

#### **C. Test Registration Codes**
```bash
# Check existing registration codes
python check_and_create_codes.py

# Test registration code validation
curl -X POST http://localhost:8000/api/registration-codes/validate/ \
  -H "Content-Type: application/json" \
  -d '{"code": "NCLEX-NIG-ABC12345"}'
```

#### **D. Test Database Connection**
```bash
# Test AWS RDS connection
python test_aws_connection.py

# Check database migrations
python manage.py showmigrations

# Test database queries
python manage.py shell
```

### **2. Frontend Testing (Local/Vercel)**

#### **A. Test Frontend Locally**
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Test in browser: http://localhost:3000
```

#### **B. Test Frontend-Backend Integration**
```bash
# Check API configuration
cat frontend/lib/api.js | grep API_BASE_URL

# Test API calls from frontend
# Open browser console and test:
# - Login functionality
# - Registration with codes
# - Course listing
# - Payment integration
```

#### **C. Test Production Frontend**
```bash
# Build for production
npm run build

# Test production build
npm start

# Deploy to Vercel (if using Vercel)
vercel --prod
```

### **3. End-to-End Testing**

#### **A. User Registration Flow**
1. **Visit registration page**
2. **Fill registration form**
3. **Select "Yes, I have paid"**
4. **Enter registration code**
5. **Submit registration**
6. **Check email verification**

#### **B. Admin Login Flow**
1. **Visit login page**
2. **Login with admin credentials**
3. **Access admin dashboard**
4. **Check user management**
5. **Test course management**

#### **C. Payment Integration**
1. **Test Paystack integration**
2. **Verify payment processing**
3. **Check payment verification**
4. **Test registration code generation**

### **4. Security Testing**

#### **A. Authentication Testing**
```bash
# Test invalid credentials
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "wrong@email.com", "password": "wrongpass"}'

# Test rate limiting
for i in {1..10}; do
  curl -X POST http://localhost:8000/api/auth/login/ \
    -H "Content-Type: application/json" \
    -d '{"email": "test@test.com", "password": "testpass"}'
done
```

#### **B. Authorization Testing**
```bash
# Test protected endpoints without token
curl http://localhost:8000/api/auth/profile/

# Test with invalid token
curl -H "Authorization: Bearer invalid_token" \
  http://localhost:8000/api/auth/profile/
```

### **5. Performance Testing**

#### **A. Backend Performance**
```bash
# Test response times
time curl http://localhost:8000/api/courses/

# Check memory usage
free -h

# Check disk usage
df -h

# Check CPU usage
top
```

#### **B. Database Performance**
```bash
# Test database queries
python manage.py shell
>>> from users.models import User
>>> User.objects.count()
>>> from registration_codes.models import RegistrationCode
>>> RegistrationCode.objects.count()
```

### **6. Error Handling Testing**

#### **A. Test Error Scenarios**
```bash
# Test invalid endpoints
curl http://localhost:8000/api/invalid-endpoint/

# Test malformed JSON
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"invalid": json}'

# Test missing required fields
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com"}'
```

### **7. Integration Testing**

#### **A. Frontend-Backend Communication**
```bash
# Test CORS settings
curl -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS http://localhost:8000/api/auth/login/

# Test API responses
curl -v http://localhost:8000/api/courses/
```

#### **B. Email Integration**
```bash
# Test email sending
python manage.py shell
>>> from django.core.mail import send_mail
>>> send_mail('Test', 'Test message', 'from@example.com', ['to@example.com'])
```

### **8. Mobile Responsiveness Testing**

#### **A. Test on Different Devices**
- **Desktop**: Chrome, Firefox, Safari
- **Tablet**: iPad, Android tablet
- **Mobile**: iPhone, Android phone

#### **B. Test Responsive Features**
- **Navigation menu**
- **Forms and inputs**
- **Images and videos**
- **Payment forms**

### **9. Browser Compatibility Testing**

#### **A. Test Different Browsers**
- **Chrome** (latest)
- **Firefox** (latest)
- **Safari** (latest)
- **Edge** (latest)

#### **B. Test Different Screen Sizes**
- **Desktop**: 1920x1080, 1366x768
- **Tablet**: 768x1024, 1024x768
- **Mobile**: 375x667, 414x896

### **10. Production Deployment Testing**

#### **A. Test Production URLs**
```bash
# Test backend API
curl http://ec2-34-206-167-168.compute-1.amazonaws.com:8000/api/courses/

# Test frontend
# Visit your Vercel URL or S3 URL
```

#### **B. Test SSL/HTTPS**
```bash
# Test HTTPS endpoints
curl -k https://your-domain.com/api/courses/

# Test SSL certificate
openssl s_client -connect your-domain.com:443
```

## 🎯 **Quick Testing Commands**

### **Backend Health Check**
```bash
# One-liner to test everything
curl -s http://localhost:8000/api/courses/ && echo "✅ Backend API working" || echo "❌ Backend API failed"
```

### **Frontend Health Check**
```bash
# Test frontend build
cd frontend && npm run build && echo "✅ Frontend build successful" || echo "❌ Frontend build failed"
```

### **Database Health Check**
```bash
# Test database connection
python manage.py check --database default && echo "✅ Database connected" || echo "❌ Database failed"
```

## 📊 **Testing Results Template**

### **Backend Tests**
- [ ] Django server running
- [ ] Database connected
- [ ] API endpoints responding
- [ ] Authentication working
- [ ] Registration codes working
- [ ] Payment integration working

### **Frontend Tests**
- [ ] Development server running
- [ ] Production build successful
- [ ] API calls working
- [ ] Forms submitting
- [ ] Navigation working
- [ ] Responsive design

### **Integration Tests**
- [ ] Frontend-backend communication
- [ ] User registration flow
- [ ] Admin login flow
- [ ] Payment processing
- [ ] Email verification

## 🚨 **Common Issues & Solutions**

### **Backend Issues**
- **Port 8000 not accessible**: Check security groups
- **Database connection failed**: Check RDS settings
- **Static files not loading**: Run `collectstatic`
- **CORS errors**: Check CORS settings

### **Frontend Issues**
- **API calls failing**: Check API_BASE_URL
- **Build errors**: Check dependencies
- **Styling issues**: Check Tailwind CSS
- **Routing issues**: Check Next.js routing

## 🎉 **Success Criteria**

Your application is ready when:
- ✅ All backend endpoints respond correctly
- ✅ Frontend loads without errors
- ✅ User registration works with codes
- ✅ Admin can login and manage
- ✅ Payment integration works
- ✅ Mobile responsive design
- ✅ Cross-browser compatibility
- ✅ Production deployment successful

## 📞 **Need Help?**

If you encounter issues:
1. Check the logs: `sudo journalctl -u gunicorn`
2. Check the database: `python manage.py shell`
3. Check the frontend: Browser console
4. Check the network: `curl -v` commands
5. Contact support with specific error messages
