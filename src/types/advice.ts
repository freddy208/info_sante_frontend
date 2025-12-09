// Enums basés sur le schéma Prisma
export enum AdviceStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TargetAudience {
  CHILDREN = 'CHILDREN',
  INFANTS = 'INFANTS',
  ADULTS = 'ADULTS',
  ELDERLY = 'ELDERLY',
  PREGNANT_WOMEN = 'PREGNANT_WOMEN',
  ALL = 'ALL',
}

// Types de base
export interface Advice {
  id: string;
  organizationId: string;
  categoryId: string;
  title: string;
  content: string;
  icon?: string | null;
  reactionsCount: number;
  priority: Priority;
  targetAudience?: TargetAudience[];
  viewsCount: number;
  sharesCount: number;
  isActive: boolean;
  publishedAt?: Date | null;
  status: AdviceStatus;
  deletedAt?: Date | null;
  createdAt: Date;
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
}

// DTOs pour les formulaires
export interface CreateAdviceDto {
  categoryId: string;
  title: string;
  content: string;
  icon?: string;
  priority?: Priority;
  targetAudience?: TargetAudience[];
}

export interface UpdateAdviceDto {
  categoryId?: string;
  title?: string;
  content?: string;
  icon?: string;
  priority?: Priority;
  targetAudience?: TargetAudience[];
}

export interface QueryAdviceDto {
  page?: number;
  limit?: number;
  categoryId?: string;
  organizationId?: string;
  search?: string;
  city?: string;
  status?: AdviceStatus;
  priority?: Priority;
  targetAudience?: TargetAudience[];
  isActive?: boolean;
}

// Types pour les réponses API
export interface PaginatedAdvicesResponse {
  data: Advice[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Type pour les statistiques
export interface AdviceStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  byPriority: Record<Priority, number>;
  byAudience: Record<TargetAudience, number>;
  totalViews: number;
  totalReactions: number;
  totalShares: number;
}