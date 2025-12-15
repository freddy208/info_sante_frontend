// next.config.js
import withPWA from '@ducanh2912/next-pwa';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Vos autres configurations restent ici
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

  // LA SOLUTION : enveloppez votre configuration dans workboxOptions
  workboxOptions: {
    runtimeCaching: [
      // Règle 1 : Cache pour votre API NestJS (si vous l'avez)
      {
        urlPattern: /^https:\/\/api\.votreapp\.com\/.*/, // Remplacez par votre URL d'API
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24, // 1 jour
          },
        },
      },

      // Règle 2 : Cache pour les images de Cloudinary
      {
        urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'cloudinary-images-cache',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },

      // Règle 3 : Cache pour les tuiles de la carte (OpenStreetMap)
      {
        urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'osm-map-tiles-cache',
          expiration: {
            maxEntries: 500,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 jours
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },

      // Règle 4 : Cache pour les polices et autres assets statiques
      {
        urlPattern: /\.(?:woff|woff2|ttf|otf)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'fonts-cache',
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 365 * 24 * 60 * 60, // 1 an
          },
        },
      },
    ],
    navigateFallback: '/offline.html',
  },
})(nextConfig);