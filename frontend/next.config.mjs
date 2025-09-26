/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for AWS S3 deployment
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  
  // Environment variables for production
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://ec2-13-50-116-201.eu-north-1.compute.amazonaws.com:8000',
  },
  
  // Image optimization for static export
  images: {
    unoptimized: true, // Required for static export
    domains: [
      'localhost', 
      'res.cloudinary.com', 
      'images.unsplash.com',
      process.env.NEXT_PUBLIC_CDN_URL?.replace('https://', '').replace('http://', ''),
      process.env.NEXT_PUBLIC_API_BASE_URL?.replace('https://', '').replace('http://', ''),
    ].filter(Boolean),
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Note: Security headers are configured at the S3/CloudFront level
  // since they don't work with static export
  
  // Webpack optimization for smaller bundle
  webpack: (config, { buildId, dev, isServer, webpack }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    
    return config;
  },
  
  // Production optimizations
  compress: true,
  poweredByHeader: false,
}

export default nextConfig
