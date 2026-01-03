/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import Image from 'next/image'; // Utilisation de l'optimisation Next.js pour l'image

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  category?: string | { name: string }; // Accepte une chaîne ou un objet avec un nom
  title?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function SafeImage({ 
  src, 
  alt, 
  className, 
  category,
  title,
  width,
  height,
  priority
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  
  // Fonction pour obtenir une image placeholder basée sur la catégorie
  const getPlaceholderImage = (categoryName: string, itemTitle: string) => {
    // Images basées sur la catégorie ( URLs Unsplash fiables )
    const categoryImages: Record<string, string> = {
      'vaccination': 'https://images.unsplash.com/photo-1596495579954-90b1fe5a072a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'cancer': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'paludisme': 'https://images.unsplash.com/photo-1584999734482-03a1d9b6a5bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'santé maternelle': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'nutrition': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'diabète': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'hypertension': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'dépistage vih': 'https://images.unsplash.com/photo-1584999734482-03a1d9b6a5bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'planification familiale': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'hygiène': 'https://images.unsplash.com/photo-1584999734482-03a1d9b6a5bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    };
    
    // Image par défaut
    const defaultImage = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    
    // Chercher une image basée sur la catégorie
    if (categoryName) {
      const lowerCategory = categoryName.toLowerCase();
      for (const [key, value] of Object.entries(categoryImages)) {
        if (lowerCategory.includes(key)) {
          return value;
        }
      }
    }
    
    return defaultImage;
  };
  
  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Utiliser une image placeholder basée sur la catégorie ou le titre
      const categoryName = typeof category === 'string' ? category : (category?.name || '');
      const fallbackImage = category 
        ? getPlaceholderImage(categoryName, title || '')
        : getPlaceholderImage('', title || '');
      setImgSrc(fallbackImage);
    }
  };
  
  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      width={width || 800} // Valeurs par défaut pour Next.js Image
      height={height || 600}
      priority={priority || false}
      onError={handleError}
    />
  );
}