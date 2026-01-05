/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/use-reactions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reactionsApi } from '@/lib/api-endponts';
import { 
  ReactionStats, 
  CreateReactionDto, 
  QueryReactionDto,
  PaginatedReactionsResponse 
} from '@/types/reaction';
import { toast } from 'react-hot-toast';

// ==========================================
// 📊 HOOKS LECTURE (Stats & Liste)
// ==========================================

/**
 * Récupère les statistiques de réactions pour un contenu donné
 * Ex: Combien de LIKE, LOVE, etc. sur une annonce
 */
export const useReactionStats = (contentType: string, contentId: string, p0: boolean) => {
  return useQuery<ReactionStats, Error>({
    queryKey: ['reactions', 'stats', contentType, contentId],
    queryFn: () => reactionsApi.getStats(contentType, contentId),
    enabled: !!contentType && !!contentId, // Exécute seulement si les IDs sont présents
    staleTime: 1000 * 60 * 5, // 5 minutes de cache
  });
};

/**
 * Liste les réactions (utile pour voir "Qui a aimé ?")
 */
export const useReactionsList = (params?: QueryReactionDto) => {
  return useQuery<PaginatedReactionsResponse, Error>({
    queryKey: ['reactions', 'list', params],
    queryFn: () => reactionsApi.findAll(params),
    enabled: !!params?.contentId, // Exécute seulement si on filtre par contenu
  });
};

// ==========================================
// ❤️ HOOKS MUTATIONS (Actions)
// ==========================================

/**
 * Hook pour "Liker" / "Deliker" ou changer le type de réaction
 * Gère automatiquement la mise à jour des stats et des compteurs globaux
 */
export const useToggleReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReactionDto) => reactionsApi.create(data),

    onSuccess: (returnedData, variables) => {
      const { contentType, contentId } = variables;

      // 1. Invalider les stats de ce contenu pour mettre à jour les compteurs (ex: 15 likes)
      queryClient.invalidateQueries({
        queryKey: ['reactions', 'stats', contentType, contentId]
      });

      // 2. Invalider le détail du contenu lui-même pour mettre à jour 'reactionsCount'
      // On suppose que la clé de query du contenu suit ce pattern (à adapter si besoin)
      queryClient.invalidateQueries({
        queryKey: [contentType.toLowerCase(), 'detail', contentId]
      });

      // 3. Invalider la liste globale des contenus (pour le compteur dans les cartes)
      queryClient.invalidateQueries({
        queryKey: [contentType.toLowerCase()]
      });

      // Feedback utilisateur (optionnel, parfois un peu bruyant pour un like)
      // Si le retour est null, c'est que l'utilisateur a "unliké"
      if (returnedData) {
        toast.success('Réaction ajoutée');
      } else {
        // toast.success('Réaction retirée'); // Optionnel
      }
    },

    onError: (error: any) => {
      console.error('Erreur reaction:', error);
      toast.error(error.response?.data?.message || 'Impossible de mettre à jour la réaction');
    },
  });
};