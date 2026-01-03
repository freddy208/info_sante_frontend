// ============================================
// 📢 ANNOUNCEMENT TYPES (Frontend Mirror)
// ============================================

// Enums miroirs du Backend
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

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

// Types Relations
export interface OrganizationLite {
  id: string;
  name: string;
  logo?: string | null;
  phone?: string | null;
  type?: string;
}

export interface CategoryLite {
  id: string;
  name: string;
  slug?: string | null;
  icon?: string | null;
}

export interface Location {
  id: string;
  contentType: string;
  contentId: string;
  address: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  placeId?: string | null;
  formattedAddress?: string | null;
}

// Interface Principale
export interface Announcement {
  id: string;
  organizationId: string;
  title: string;
  slug?: string | null;
  content: string;
  excerpt?: string | null;
  featuredImage: string;
  thumbnailImage?: string | null;
  priority?: Priority; // Présent dans le schéma Prisma
  categoryId: string;
  startDate: string; // ISO String
  endDate: string;   // ISO String
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
  publishedAt?: string | null;
  status: AnnouncementStatus;
  suspensionReason?: string | null;
  suspendedBy?: string | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Relations (Inclusions)
  organization?: OrganizationLite;
  category?: CategoryLite;
  location?: Location;
}

// DTOs (Payloads pour création/mise à jour)
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
  priority?: Priority;
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
  priority?: Priority;
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
  priority?: Priority; // Ajouté pour filtrer par urgence
}

// Réponse API
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
};