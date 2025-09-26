# PowerShell script to get SSH key content for GitHub secrets
Write-Host "🔑 Getting SSH Key Content for GitHub Secrets..." -ForegroundColor Green
Write-Host ""

# Check if the key file exists
$keyPath = "nclexkeyskeypairs.pem"
if (Test-Path $keyPath) {
    Write-Host "✅ Found SSH key file: $keyPath" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 SSH Key Content (copy this for EC2_SSH_KEY secret):" -ForegroundColor Yellow
    Write-Host ("=" * 60) -ForegroundColor Gray
    Get-Content $keyPath
    Write-Host ("=" * 60) -ForegroundColor Gray
    Write-Host ""
    Write-Host "📝 Instructions:" -ForegroundColor Cyan
    Write-Host "1. Copy the entire content above (including BEGIN and END lines)" -ForegroundColor White
    Write-Host "2. Go to GitHub → Settings → Secrets and variables → Actions" -ForegroundColor White
    Write-Host "3. Add new secret named 'EC2_SSH_KEY'" -ForegroundColor White
    Write-Host "4. Paste the content as the value" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 GitHub Repository: https://github.com/Emperor1p/nclexkeysinternational/settings/secrets/actions" -ForegroundColor Blue
} else {
    Write-Host "❌ SSH key file not found: $keyPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "📁 Please make sure the nclexkeyskeypairs.pem file is in the current directory" -ForegroundColor Yellow
    Write-Host "   Current directory: $(Get-Location)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 If the file is in a different location, copy it to this directory first" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🚀 After adding all secrets, your full-stack deployment will work automatically!" -ForegroundColor Green