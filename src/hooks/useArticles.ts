/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// ✅ CORRECTION : Chemin du fichier (endpoints et non endponts)
import { articlesApi } from '@/lib/api-endponts';
import {
  Article,
  CreateArticleDto,
  UpdateArticleDto,
  QueryArticleDto,
  PaginatedArticlesResponse,
} from '@/types/article';
import { toast } from 'react-hot-toast';
import {
  CreateArticleFormData,
  UpdateArticleFormData,
  QueryArticleFormData,
} from '@/lib/validations/article';

const normalizeArticleParams = (
  params?: QueryArticleDto
): QueryArticleDto => ({
  page: params?.page ?? 1,
  limit: params?.limit ?? 20,
  categoryId: params?.categoryId || undefined,
  organizationId: params?.organizationId || undefined,
  search: params?.search || undefined,
  status: params?.status ?? undefined,
  featured: params?.featured ?? undefined,
  tags: params?.tags?.length ? params.tags : undefined,
});


// ==========================================
// HOOKS POUR LA LECTURE (Public)
// ==========================================

export const useArticlesList = (params?: QueryArticleDto) => {
  const normalizedParams = normalizeArticleParams(params);

  return useQuery<PaginatedArticlesResponse, Error>({
    queryKey: ['articles', 'list', normalizedParams],
    queryFn: () => articlesApi.getArticles(normalizedParams),
    staleTime: 1000 * 60 * 5,
  });
};


export const useArticle = (idOrSlug: string) => {
  return useQuery<Article, Error>({
    queryKey: ['articles', 'detail', idOrSlug],
    queryFn: () => articlesApi.getArticleById(idOrSlug),
    enabled: !!idOrSlug,
    staleTime: 1000 * 60 * 5,
  });
};

// ==========================================
// HOOKS POUR L'ORGANISATION CONNECTÉE
// ==========================================

export const useMyArticlesList = (params?: QueryArticleDto) => {
  const normalizedParams = normalizeArticleParams(params);

  return useQuery<PaginatedArticlesResponse, Error>({
    queryKey: ['articles', 'my', normalizedParams],
    queryFn: () => articlesApi.getMyArticles(normalizedParams),
    staleTime: 1000 * 60 * 5,
  });
};


// ==========================================
// HOOKS POUR LES MUTATIONS (CRUD)
// ==========================================

export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateArticleFormData) => articlesApi.create(data),
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
    mutationFn: ({ id, data }: { id: string; data: UpdateArticleFormData }) =>
      articlesApi.updateArticle(id, data),
    onSuccess: (_, variables) => {
      toast.success('Article mis à jour avec succès');
      // Invalide la liste ET le détail spécifique
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['articles', 'detail', variables.id] });
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

// ==========================================
// ✨ HOOKS POUR LES VUES (Best Practice)
// ==========================================

export const useViewArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idOrSlug: string) => articlesApi.incrementView(idOrSlug),
    onSuccess: (updatedArticle, idOrSlug) => {
      // Invalide le détail de l'article pour mettre à jour le compteur de vues
      queryClient.invalidateQueries({ queryKey: ['articles', 'detail', idOrSlug] });
    },
    onError: (error) => {
      console.error("Erreur incrémentation vue:", error);
      // Pas de toast pour ne pas déranger l'utilisateur
    },
  });
};

export const useFeatureArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      articlesApi.featureArticle(id, isFeatured),
    onSuccess: (_, variables) => {
      // ✅ CORRECTION : Récupérer 'isFeatured' depuis le second argument 'variables'
      const msg = variables.isFeatured
        ? 'Article mis en avant'
        : 'Article retiré de l\'avant';

      toast.success(msg);
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Erreur lors de la modification de la mise en avant'
      );
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

// NOTE : J'ai volontairement retiré `useArchiveArticle` car ton Backend 
// ne possède pas de route `PATCH /articles/:id/archive`. 
// Si tu ajoutes cette route dans le contrôleur, tu pourras recréer ce hook.