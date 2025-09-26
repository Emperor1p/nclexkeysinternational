@echo off
echo 🚀 NCLEX Frontend S3 Deployment
echo ================================
echo.
echo This will deploy your frontend to the nclexkeysfrontend S3 bucket
echo in the EU North (Stockholm) region.
echo.
echo Make sure you have your AWS credentials ready!
echo.
pause

powershell -ExecutionPolicy Bypass -File "deploy-to-s3.ps1"

echo.
echo Deployment script completed!
pause
