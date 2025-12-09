// Enums basés sur le schéma Prisma
export enum AnnouncementStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
  SUSPENDED = 'SUSPENDED',
}

export enum TargetAudience {
  CHILDREN = 'CHILDREN',
  INFANTS = 'INFANTS',
  ADULTS = 'ADULTS',
  ELDERLY = 'ELDERLY',
  PREGNANT_WOMEN = 'PREGNANT_WOMEN',
  ALL = 'ALL',
  YOUTH = "YOUTH",
  TEENAGERS = "TEENAGERS",
  FAMILIES = "FAMILIES",
  HEALTHCARE_WORKERS = "HEALTHCARE_WORKERS",
  TEACHERS = "TEACHERS",
  STUDENTS = "STUDENTS",
}

// Types de base
export interface Announcement {
  id: string;
  organizationId: string;
  title: string;
  slug?: string | null;
  content: string;
  excerpt?: string | null;
  featuredImage: string;
  thumbnailImage?: string | null;
  categoryId: string;
  startDate: string;
  endDate: string;
  targetAudience?: TargetAudience[];
  isFree: boolean;
  cost?: number | null;
  capacity?: number | null;
  registeredCount: number;
  requiresRegistration: boolean;
  viewsCount: number;
  sharesCount: number;
  commentsCount: number;
  reactionsCount: number;
  notificationsSent: number;
  isPinned: boolean;
  publishedAt?: Date | null;
  status: AnnouncementStatus;
  suspensionReason?: string | null;
  suspendedBy?: string | null;
  deletedAt?: Date | null;
  createdAt: Date | string;
  updatedAt: Date;
  
  // Inclusions optionnelles
  organization?: {
    id: string;
    name: string;
    logo?: string | null;
    phone?: string | null;
  };
  category?: {
    id: string;
    name: string;
    slug?: string | null;
  };
  location?: {
    id: string;
    address: string;
    city: string;
    region: string;
    latitude?: number | null;
    longitude?: number | null;
  };
}

// DTOs pour les formulaires
export interface CreateAnnouncementDto {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage: string;
  thumbnailImage?: string;
  categoryId: string;
  startDate: string;
  endDate: string;
  targetAudience?: TargetAudience[];
  isFree?: boolean;
  cost?: number;
  capacity?: number;
  requiresRegistration?: boolean;
}

export interface UpdateAnnouncementDto {
  title?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  thumbnailImage?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  targetAudience?: TargetAudience[];
  isFree?: boolean;
  cost?: number;
  capacity?: number;
  requiresRegistration?: boolean;
}

export interface QueryAnnouncementDto {
  page?: number;
  limit?: number;
  categoryId?: string;
  organizationId?: string;
  search?: string;
  city?: string;
  status?: AnnouncementStatus;
}

// Types pour les réponses API
export interface PaginatedAnnouncementsResponse {
  data: Announcement[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}