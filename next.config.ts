// next.config.js
import withPWA from '@ducanh2912/next-pwa';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  reloadOnOnline: true,
  
  workboxOptions: {
    runtimeCaching: [
      // Règle 1 : API NestJS
      {
        urlPattern: /^https:\/\/api\.votreapp\.com\/.*/, 
        // CORRECTION : On garde StaleWhileRevalidate pour la rapidité,
        // mais on supprime 'networkTimeoutSeconds' car incompatible.
        handler: 'StaleWhileRevalidate', 
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24, // 1 jour
          },
          // networkTimeoutSeconds: 10, <--- SUPPRIMÉ (Erreur corrigée)
        },
      },

      // Règle 2 : Images Cloudinary
      {
        urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'cloudinary-images-cache',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
        },
      },

      // Règle 3 : Tuiles Carte
      {
        urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'osm-map-tiles-cache',
          expiration: {
            maxEntries: 500,
            maxAgeSeconds: 7 * 24 * 60 * 60, 
          },
        },
      },
      
      // Règle 4 : Polices et Assets
      {
        urlPattern: /\.(?:woff|woff2|ttf|otf)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'fonts-cache',
        },
      },
    ],
    // IMPORTANT : Assurez-vous que le fichier public/offline.html existe
    navigateFallback: '/offline.html', 
  },
})(nextConfig);