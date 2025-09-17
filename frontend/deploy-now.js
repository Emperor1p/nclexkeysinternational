const { execSync } = require('child_process');

console.log('🚀 Attempting to deploy frontend...');

try {
  // Try to trigger deployment via git push (which should trigger auto-deployment)
  console.log('📤 Pushing latest changes to trigger auto-deployment...');
  
  // Check if we're in the right directory
  const currentDir = process.cwd();
  console.log(`📍 Current directory: ${currentDir}`);
  
  // Check git status
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  if (gitStatus.trim()) {
    console.log('📝 Uncommitted changes found, committing them...');
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "Update frontend for new backend URL deployment"', { stdio: 'inherit' });
  }
  
  // Push to trigger auto-deployment
  console.log('🚀 Pushing to GitHub to trigger Vercel auto-deployment...');
  execSync('git push origin production-ready', { stdio: 'inherit' });
  
  console.log('✅ Push successful! Vercel should auto-deploy within 2-3 minutes.');
  console.log('🔗 Check your Vercel dashboard for deployment status.');
  
} catch (error) {
  console.error('❌ Error during deployment:', error.message);
  console.log('💡 Alternative: Go to Vercel dashboard and manually trigger deployment');
}
