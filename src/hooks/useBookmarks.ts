/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/use-bookmarks.tsx

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarksApi } from '@/lib/api-endponts';
import { 
  CreateBookmarkDto, 
  QueryBookmarkDto,
  PaginatedBookmarksResponse, 
  BookmarkCheckResponse,
  BookmarkStatsResponse
} from '@/types/bookmark';
import { ContentType } from '@/types/reaction';
import { toast } from 'react-hot-toast';

// ==========================================
// 📋 HOOKS LECTURE (Liste & Stats)
// ==========================================

/**
 * Récupère la liste des favoris de l'utilisateur connecté.
 * ✅ CORRECTION : Accepte un objet `options` en 2ème paramètre pour passer `enabled` et `retry`.
 */
export const useBookmarksList = (
  params?: QueryBookmarkDto,
  options?: {
    isAuthenticated?: boolean;
    retry?: (failureCount: number, error: any) => boolean;
  }
) => {
  // Si isAuthenticated n'est pas fourni dans options, on utilise `true` par défaut (pour compatibilité)
  const isAuthenticated = options?.isAuthenticated ?? true;

  // Logique de retry personnalisée ou par défaut
  const retryLogic = options?.retry ?? ((failureCount: number, error: any) => {
    // Si le token est invalide (401 ou 403), on arrête immédiatement pour éviter le 429
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return false;
    }
    // Pour les erreurs réseau, on réessaie 1 fois
    return failureCount < 1;
  });

  return useQuery<PaginatedBookmarksResponse, Error>({
    queryKey: ['bookmarks', 'list', params],
    queryFn: () => bookmarksApi.findAll(params),
    // ✅ On utilise les options extraites
    enabled: isAuthenticated,
    retry: retryLogic,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false, // Éviter le re-fetch inutile au focus
  });
};

/**
 * Vérifie si un contenu spécifique est en favori.
 */
export const useIsBookmarked = (contentType: ContentType, contentId: string, isAuthenticated = true) => {
  return useQuery<BookmarkCheckResponse, Error>({
    queryKey: ['bookmarks', 'check', contentType, contentId],
    queryFn: () => bookmarksApi.isBookmarked(contentType, contentId),
    enabled: !!contentType && !!contentId && isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Pas de retry pour le check
  });
};

/**
 * Récupère les statistiques des favoris.
 */
export const useBookmarkStats = (isAuthenticated = true) => {
  return useQuery<BookmarkStatsResponse, Error>({
    queryKey: ['bookmarks', 'stats'],
    queryFn: () => bookmarksApi.getStats(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
};

// ==========================================
// 🔖 HOOKS MUTATIONS (Actions)
// ==========================================

export const useCreateBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookmarkDto) => bookmarksApi.create(data),
    onSuccess: () => {
      toast.success('Ajouté aux favoris');
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de l'ajout aux favoris");
    },
  });
};

export const useRemoveBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookmarksApi.remove(id),
    onSuccess: () => {
      toast.success('Retiré des favoris');
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors du retrait des favoris");
    },
  });
};

export const useRemoveBookmarkByContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contentType, contentId }: { contentType: string; contentId: string }) =>
      bookmarksApi.removeByContent(contentType, contentId),
    onSuccess: (_, variables) => {
      toast.success('Retiré des favoris');
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      // Invalide le cache spécifique pour le check
      queryClient.invalidateQueries({ 
        queryKey: ['bookmarks', 'check', variables.contentType, variables.contentId] 
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de la suppression");
    },
  });
};

/**
 * ⭐ HOOK PRINCIPAL : TOGGLE FAVORI
 */
export const useToggleBookmark = () => {
  const queryClient = useQueryClient();
  const createMutation = useCreateBookmark();
  const removeMutation = useRemoveBookmarkByContent();

  const toggle = async (
    contentType: ContentType, 
    contentId: string, 
    isCurrentlyBookmarked: boolean
  ) => {
    try {
      if (isCurrentlyBookmarked) {
        await removeMutation.mutateAsync({ contentType, contentId });
        return false;
      } else {
        await createMutation.mutateAsync({ contentType, contentId });
        return true;
      }
    } catch (error) {
      return isCurrentlyBookmarked;
    }
  };

  return {
    mutate: toggle,
    isLoading: createMutation.isPending || removeMutation.isPending,
  };

};
export const useBookmarksCheck = (
  contentType: ContentType,
  contentIds: string[],
  isAuthenticated: boolean
) => {
  return useQuery<Record<string, boolean>, Error>({
    queryKey: ['bookmarks', 'check-batch', contentType, contentIds],
    queryFn: () => bookmarksApi.checkMany(contentType, contentIds),
    enabled: !!isAuthenticated && contentIds.length > 0,
    staleTime: 1000 * 60 * 2, // 2 min
    retry: 1,
  });
};