/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articlesApi } from '@/lib/api-endponts';
import { 
  Article, 
  CreateArticleDto, 
  UpdateArticleDto, 
  QueryArticleDto,
  PaginatedArticlesResponse 
} from '@/types/article';
import { toast } from 'react-hot-toast';
import { 
  CreateArticleFormData, 
  UpdateArticleFormData, 
  QueryArticleFormData 
} from '@/lib/validations/article';

// ==========================================
// HOOKS POUR LA LECTURE (Public)
// ==========================================

export const useArticlesList = (params?: QueryArticleFormData) => {
  return useQuery<PaginatedArticlesResponse, Error>({
    queryKey: ['articles', 'list', params],
    queryFn: () => articlesApi.getArticles(params),
    staleTime: 1000 * 60 * 10, // 10 minutes (Les articles changent moins souvent)
  });
};

export const useArticle = (idOrSlug: string) => {
  return useQuery<Article, Error>({
    queryKey: ['articles', 'detail', idOrSlug],
    queryFn: () => articlesApi.getArticleById(idOrSlug),
    enabled: !!idOrSlug, // Ne lance la requête que si l'ID est fourni
  });
};

// ==========================================
// HOOKS POUR L'ORGANISATION CONNECTÉE
// ==========================================

export const useMyArticlesList = (params?: QueryArticleFormData) => {
  return useQuery<PaginatedArticlesResponse, Error>({
    queryKey: ['articles', 'my', params],
    queryFn: () => articlesApi.getMyArticles(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// ==========================================
// HOOKS POUR LES MUTATIONS (CRUD)
// ==========================================

export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateArticleDto) => articlesApi.create(data),
    onSuccess: () => {
      toast.success('Article créé avec succès');
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création de l\'article');
    },
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateArticleDto }) =>
      articlesApi.updateArticle(id, data),
    onSuccess: () => {
      toast.success('Article mis à jour avec succès');
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'article');
    },
  });
};

export const usePublishArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => articlesApi.publishArticle(id),
    onSuccess: () => {
      toast.success('Article publié avec succès');
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la publication de l\'article');
    },
  });
};

export const useFeatureArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      articlesApi.featureArticle(id, isFeatured),
    onSuccess: () => {
      const msg = 'Article mis en avant'; // Ou "retiré de l'avant" selon le cas
      toast.success(msg);
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la modification de la mise en avant');
    },
  });
};

export const useRemoveArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => articlesApi.removeArticle(id),
    onSuccess: () => {
      toast.success('Article supprimé avec succès');
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression de l\'article');
    },
  });
};