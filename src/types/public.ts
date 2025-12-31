 

// ==========================================
// 1. Types pour les Alertes (Bannière)
// ==========================================
export type AlertLevel = 'critical' | 'warning';

export interface PublicAlert {
  id: string;
  title: string;
  excerpt: string;
  level: AlertLevel; // Mappé depuis Priority.HIGH/URGENT dans le backend
  location: string;
  date: string;
  type: 'ANNOUNCEMENT' | 'ARTICLE';
  slug?: string; // Optionnel si pas de slug
}

// ==========================================
// 2. Types pour les Organisations (Carte)
// ==========================================
export interface PublicOrganization {
  id: string;
  name: string;
  type: string; // OrganizationType
  phone: string;
  address: string;
  city: string;
  region: string;
  latitude: number; // Important : Number pour Leaflet
  longitude: number;
  distance?: number; // Calculé par le backend
}

// ==========================================
// 3. Types pour la Recherche Globale
// ==========================================
export interface SearchResultItem {
  id: string;
  title: string;
  type: 'ORGANIZATION' | 'ANNOUNCEMENT' | 'ARTICLE';
  // D'autres champs optionnels selon le type...
  excerpt?: string;
  cityName?: string;
}

export interface PublicSearchResponse {
  status: 'success' | 'empty';
  data: SearchResultItem[];
  suggestions?: string[]; // Présent uniquement si status === 'empty'
}


// ==========================================
// DTOs (Data Transfer Objects) pour les Requêtes
// ==========================================

export interface NearbyQueryDto {
  lat: number;
  lng: number;
  radius?: number; // Optionnel, le backend a une valeur par défaut (50km)
}