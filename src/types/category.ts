// ============================================
// 📂 CATEGORY TYPES (Frontend Mirror)
// ============================================

// Interface Principale Category
// Miroir parfait de CategoryEntity et du Schéma Prisma
export interface Category {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  icon: string | null;
  color: string | null;
  parentId: string | null;
  order: number;
  isActive: boolean;
  announcementsCount: number;
  articlesCount: number;
  advicesCount: number;
  createdAt: string;        // ISO String
  updatedAt: string;        // ISO String

  // Relations optionnelles
  parent?: Category | null;
  children?: Category[];
}

// DTOs pour les formulaires (Payloads vers le backend)
// Correspond à CreateCategoryDto et UpdateCategoryDto
export interface CreateCategoryDto {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  parentId?: string;
  order?: number;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  parentId?: string;
  order?: number;
  isActive?: boolean; // Présent dans UpdateCategoryDto (extends PartialType)
}

// Type pour la réponse paginée de l'API
// Correspond à la structure { data: [], meta: {} }
export interface PaginatedCategoriesResponse {
  data: Category[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}