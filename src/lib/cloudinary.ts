// Configuration de Cloudinary pour le frontend
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'duqsblvzm',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default',
};

// Fonction pour générer une URL d'image Cloudinary avec des transformations
export const getCloudinaryImageUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  } = {}
): string => {
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = options;

  const transformations = [];
  
  if (width || height) {
    transformations.push(`w_${width || 'auto'},h_${height || 'auto'},c_${crop}`);
  }
  
  transformations.push(`q_${quality},f_${format}`);

  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/v1765163001/${publicId}`;
};

// Fonction pour générer une URL de thumbnail
export const getCloudinaryThumbnailUrl = (publicId: string, size = 300): string => {
  return getCloudinaryImageUrl(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    quality: 'auto:good',
  });
};

// ✅ Nouvelle fonction pour les annonces (compatible publicId ou URL)
export const getAnnouncementImageUrl = (
  image: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  }
): string => {
  if (!image) return ''; // fallback si pas d'image

  // Si image commence par http → c'est déjà une URL complète, on peut l'utiliser telle quelle
  if (image.startsWith('http')) return image;

  // Sinon, c'est un publicId → on construit l'URL Cloudinary sans toucher à l'URL complète
  return getCloudinaryImageUrl(image, options);
};

