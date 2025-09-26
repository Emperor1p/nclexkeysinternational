/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export for now to allow dynamic routes
  // output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  // Image optimization
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