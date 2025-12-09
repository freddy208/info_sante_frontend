/* eslint-disable @typescript-eslint/no-explicit-any */
// Configuration de l'API OpenCage pour le frontend
export const opencageConfig = {
  apiKey: process.env.NEXT_PUBLIC_OPENCAGE_API_KEY || 'b1f2b9a1a83848948dcf658c033b3b2c',
  apiUrl: process.env.NEXT_PUBLIC_OPENCAGE_API_URL || 'https://api.opencagedata.com/geocode/v1',
  countrycode: 'cm', // Limiter au Cameroun
  language: 'fr', // Résultats en français
  limit: 5, // Maximum 5 résultats
};

// Fonction pour géocoder une adresse
export const geocodeAddress = async (address: string): Promise<any[]> => {
  try {
    const response = await fetch(
      `${opencageConfig.apiUrl}/json?q=${encodeURIComponent(address)}&key=${opencageConfig.apiKey}&countrycode=${opencageConfig.countrycode}&language=${opencageConfig.language}&limit=${opencageConfig.limit}`
    );
    
    if (!response.ok) {
      throw new Error('Erreur lors du géocodage');
    }
    
    const data = await response.json();
    
    if (data.status.code !== 200) {
      throw new Error(data.status.message);
    }
    
    return data.results;
  } catch (error) {
    console.error('Erreur lors du géocodage:', error);
    throw error;
  }
};

// Fonction pour géocoder inverse (coordonnées → adresse)
export const reverseGeocode = async (latitude: number, longitude: number): Promise<any> => {
  try {
    const response = await fetch(
      `${opencageConfig.apiUrl}/json?q=${latitude},${longitude}&key=${opencageConfig.apiKey}&language=${opencageConfig.language}&limit=1`
    );
    
    if (!response.ok) {
      throw new Error('Erreur lors du géocodage inverse');
    }
    
    const data = await response.json();
    
    if (data.status.code !== 200) {
      throw new Error(data.status.message);
    }
    
    return data.results[0]; // Retourner le premier résultat
  } catch (error) {
    console.error('Erreur lors du géocodage inverse:', error);
    throw error;
  }
};