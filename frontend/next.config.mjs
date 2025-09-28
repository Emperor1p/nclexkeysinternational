/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for Vercel deployment
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  
  // Environment variables for production
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://ec2-13-50-116-201.eu-north-1.compute.amazonaws.com:8000',
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: 'pk_live_9afe0ff4d8f81a67b5e799bd12a30551da1b0e19',
  },
  
  // Image optimization for Vercel
  images: {
    domains: [
      'localhost', 
      'res.cloudinary.com', 
      'images.unsplash.com',
      'ec2-13-50-116-201.eu-north-1.compute.amazonaws.com',
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Security headers for Vercel
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
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
