// Enums basés sur le schéma Prisma
export enum ContentType {
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  ARTICLE = 'ARTICLE',
  ADVICE = 'ADVICE',
  COMMENT = 'COMMENT',
  ORGANIZATION = 'ORGANIZATION',
  PROFILE = 'PROFILE',
  COVER = 'COVER',
}

// Types de base
export interface Location {
  id: string;
  contentType: ContentType;
  contentId: string;
  address: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  placeId?: string | null;
  formattedAddress?: string | null;
  additionalInfo?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GeocodeResult {
  formattedAddress: string;
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  postcode?: string;
  confidence: number;
  placeId?: string;
}

// DTOs pour les formulaires
export interface CreateLocationDto {
  contentType: ContentType;
  contentId: string;
  address: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  placeId?: string;
  formattedAddress?: string;
  additionalInfo?: string;
}

export interface UpdateLocationDto {
  address?: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  placeId?: string;
  formattedAddress?: string;
  additionalInfo?: string;
}

export interface GeocodeDto {
  address: string;
}

export interface ReverseGeocodeDto {
  latitude: number;
  longitude: number;
}

// Types pour les réponses API
export interface OpenCageGeometry {
  lat: number;
  lng: number;
}

export interface OpenCageComponents {
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
  country?: string;
  country_code?: string;
  postcode?: string;
  road?: string;
  suburb?: string;
  neighbourhood?: string;
  region?: string;
  state_district?: string;
  _type?: string;
}

export interface OpenCageResult {
  components: OpenCageComponents;
  formatted: string;
  geometry: OpenCageGeometry;
  bounds?: {
    northeast: OpenCageGeometry;
    southwest: OpenCageGeometry;
  };
  confidence: number;
  annotations?: {
    timezone?: {
      name: string;
      offset_string: string;
    };
    currency?: {
      name: string;
      symbol: string;
      iso_code: string;
    };
  };
}

export interface OpenCageResponse {
  results: OpenCageResult[];
  status: {
    code: number;
    message: string;
  };
  total_results: number;
  rate: {
    limit: number;
    remaining: number;
    reset: number;
  };
}