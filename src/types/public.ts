/* eslint-disable @typescript-eslint/no-explicit-any */
// ==========================================
// TYPES FRONTEND POUR PUBLIC (Alertes / Organisations / Recherche)
// ==========================================

// ----------------------------
// 1. Alertes (Bannière)
// ----------------------------
export enum PublicAlertLevel {
  CRITICAL = 'critical',
  WARNING = 'warning',
}

export enum PublicAlertType {
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  ARTICLE = 'ARTICLE',
}

export interface PublicAlert {
  id: string;
  title: string;
  excerpt: string;
  level: PublicAlertLevel; // Mappé depuis Priority.HIGH/URGENT backend
  location: string;
  date: string;
  type: PublicAlertType;
  slug?: string;
}

// ----------------------------
// 2. Organisations (Carte / Liste)
// ----------------------------
export enum OrganizationType {
  HOSPITAL_PUBLIC = 'HOSPITAL_PUBLIC',
  HOSPITAL_PRIVATE = 'HOSPITAL_PRIVATE',
  CLINIC = 'CLINIC',
  HEALTH_CENTER = 'HEALTH_CENTER',
  DISPENSARY = 'DISPENSARY',
  MINISTRY = 'MINISTRY',
  NGO = 'NGO',
  FOUNDATION = 'FOUNDATION',
  RESEARCH_CENTER = 'RESEARCH_CENTER',
}

export enum OrganizationStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export interface PublicOrganization {
  id: string;
  name: string;
  type: OrganizationType;
  phone: string;
  address: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  distance?: number; // Calculé par le backend
}

// ----------------------------
// 3. Recherche Globale
// ----------------------------
export interface SearchResultItem {
  id: string;
  title: string;
  type: 'ORGANIZATION' | 'ANNOUNCEMENT' | 'ARTICLE';
  excerpt?: string;
  slug?: string;
  cityName?: string; // Pour les organisations
  publishedAt?: string;
}

export interface PublicSearchResponse {
  status: 'success' | 'empty';
  data: SearchResultItem[];
  suggestions?: string[];
}

// ----------------------------
// 4. DTOs pour requêtes
// ----------------------------
export interface NearbyQueryDto {
  lat: number;
  lng: number;
  limit?: number;
  radius?: number;
  types?: OrganizationType[];
}

// ----------------------------
// 5. Organisation / Authentification
// ----------------------------
export interface Organization {
  id: string;
  name: string;
  email: string;
  type: OrganizationType;
  phone: string;
  whatsapp?: string | null;
  logo?: string | null;
  coverImage?: string | null;
  description?: string | null;
  website?: string | null;
  address: string;
  city: string;
  region: string;
  latitude?: number | null;
  longitude?: number | null;
  registrationNumber: string;
  licenseDocument?: string | null;
  isVerified: boolean;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  openingHours?: any;
  emergencyAvailable: boolean;
  insuranceAccepted: string[];
  totalReviews: number;
  totalAnnouncements: number;
  totalArticles: number;
  status: OrganizationStatus;
  suspensionReason?: string | null;
  suspendedAt?: string | null;
  suspendedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  position?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ----------------------------
// 6. DTOs Création / Mise à jour
// ----------------------------
export interface RegisterOrganizationDto {
  name: string;
  email: string;
  password: string;
  type: OrganizationType;
  phone: string;
  whatsapp?: string;
  description?: string;
  website?: string;
  address: string;
  city: string;
  region: string;
  latitude?: number;
  longitude?: number;
  registrationNumber: string;
  licenseDocument?: string;
  emergencyAvailable?: boolean;
  insuranceAccepted?: string[];
  openingHours?: any;
}

export interface LoginOrganizationDto {
  email: string;
  password: string;
}

export interface UpdateOrganizationDto {
  name?: string;
  phone?: string;
  whatsapp?: string;
  description?: string;
  website?: string;
  address?: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  logo?: string;
  coverImage?: string;
  emergencyAvailable?: boolean;
  insuranceAccepted?: string[];
  openingHours?: any;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface CreateMemberDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
}

export interface UpdateMemberDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  position?: string;
  isActive?: boolean;
}

// ----------------------------
// 7. Réponses API
// ----------------------------
export interface OrganizationAuthResponse {
  organization: Organization;
  accessToken: string;
  refreshToken: string;
}

export interface PaginatedOrganizationsResponse {
  data: Organization[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
