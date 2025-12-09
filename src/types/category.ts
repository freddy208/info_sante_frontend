
// Type principal, miroir de votre CategoryEntity et du modèle Prisma
// Il inclut les relations optionnelles (parent, enfants)
export type Category = {
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
  createdAt: Date;
  updatedAt: Date;

  // Relations optionnelles
  parent?: Category | null;
  children?: Category[];
};

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
  isActive?: boolean;
}

// Type pour la réponse paginée de l'API
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