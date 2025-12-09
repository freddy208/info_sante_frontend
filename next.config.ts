import withPWA from '@ducanh2912/next-pwa';
import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // La ligne turbopack: {} a été supprimée
  //outputFileTracingRoot: path.join(__dirname, '../../'), 
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  cacheStartUrl: true,
  dynamicStartUrl: true,
  reloadOnOnline: true,
})(nextConfig);