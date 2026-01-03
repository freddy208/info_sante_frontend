/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ✅ CORRECTION ICI : import sans faute de frappe
import { categoriesApi } from '@/lib/api-endponts';
import { PaginatedCategoriesResponse, Category, CreateCategoryDto, UpdateCategoryDto } from '@/types/category';
import { toast } from 'react-hot-toast';
import { CreateCategoryFormData, UpdateCategoryFormData } from '@/lib/validations/category';

// =====================================
// HOOKS POUR LA LECTURE (Public)
// =====================================

export const useCategoriesList = (params?: {
  isActive?: boolean;
  parentOnly?: boolean;
}) => {
  return useQuery<PaginatedCategoriesResponse, Error>({
    queryKey: ['categories', 'list', params],
    queryFn: () => categoriesApi.getCategories(params),
    staleTime: 1000 * 60 * 10, // 10 minutes : les catégories changent rarement
  });
};

export const useCategory = (identifier: string) => {
  return useQuery<Category, Error>({
    queryKey: ['categories', 'detail', identifier],
    queryFn: () => categoriesApi.getCategoryByIdentifier(identifier),
    enabled: !!identifier, // Ne lance la requête que si l'ID est fourni
  });
};


// =====================================
// HOOKS POUR L'ADMINISTRATION (Dashboard)
// =====================================

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryFormData) => categoriesApi.createCategory(data),
    onSuccess: () => {
      toast.success('Catégorie créée avec succès');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryFormData }) =>
      categoriesApi.updateCategory(id, data),
    onSuccess: () => {
      toast.success('Catégorie mise à jour avec succès');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });
};

export const useRemoveCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesApi.removeCategory(id),
    onSuccess: () => {
      toast.success('Catégorie désactivée avec succès');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la désactivation');
    },
  });
};

export const useActivateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesApi.activateCategory(id),
    onSuccess: () => {
      toast.success('Catégorie réactivée avec succès');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la réactivation');
    },
  });
};