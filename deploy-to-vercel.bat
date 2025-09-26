@echo off
echo 🚀 Deploying NCLEX Frontend to Vercel
echo =====================================

cd frontend

echo 📦 Installing Vercel CLI...
npm install -g vercel

echo 🔐 Logging into Vercel...
vercel login

echo 🚀 Deploying to Vercel...
vercel --prod

echo ✅ Deployment completed!
echo Your frontend is now live on Vercel!
echo The Board of Directors section is ready for production!

pause
