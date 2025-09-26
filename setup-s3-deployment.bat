@echo off
echo 🚀 NCLEX Frontend S3 Deployment Setup
echo =====================================

REM Check if PowerShell is available
powershell -Command "Get-Host" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PowerShell is not available
    echo Please install PowerShell or run the setup manually
    pause
    exit /b 1
)

REM Run the PowerShell script
echo Running S3 deployment setup...
powershell -ExecutionPolicy Bypass -File "setup-s3-deployment.ps1"

echo.
echo Setup completed! Check the output above for next steps.
pause
