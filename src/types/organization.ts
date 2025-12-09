/* eslint-disable @typescript-eslint/no-explicit-any */
// Enums basés sur le schéma Prisma
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

// Types de base
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
  verifiedAt?: Date | null;
  verifiedBy?: string | null;
  openingHours?: any;
  emergencyAvailable: boolean;
  insuranceAccepted: string[];
  rating?: number | null;
  totalReviews: number;
  totalAnnouncements: number;
  totalArticles: number;
  status: OrganizationStatus;
  suspensionReason?: string | null;
  suspendedAt?: Date | null;
  suspendedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

// DTOs pour les formulaires
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

// Types pour les réponses API
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