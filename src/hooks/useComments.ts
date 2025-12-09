/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '@/lib/api-endponts';
import { 
  Comment, 
  CreateCommentDto, 
  UpdateCommentDto, 
  QueryCommentDto,
  PaginatedCommentsResponse
} from '@/types/comment';
import { toast } from 'react-hot-toast';
import { 
  CreateCommentFormData, 
  UpdateCommentFormData, 
  QueryCommentFormData
} from '@/lib/validations/comment';

// =====================================
// HOOKS POUR LA LECTURE (public)
// =====================================

export const useCommentsList = (params?: QueryCommentDto) => {
  return useQuery({
    queryKey: ['comments', 'list', params],
    queryFn: () => commentsApi.getComments(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useComment = (id: string) => {
  return useQuery({
    queryKey: ['comments', 'detail', id],
    queryFn: () => commentsApi.getCommentById(id),
    enabled: !!id, // Ne lance la requête que si l'ID est fourni
  });
};

// =====================================
// HOOKS POUR L'ORGANISATION CONNECTÉE
// =====================================

export const useCommentsByContent = (
  contentType: string,
  contentId: string,
  params?: { page?: number; limit?: number }
) => {
  return useQuery({
    queryKey: ['comments', 'byContent', contentType, contentId, params],
    queryFn: () => commentsApi.getCommentsByContent(contentType, contentId, params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentFormData) => commentsApi.create(data),
    onSuccess: () => {
      toast.success('Commentaire créé avec succès');
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création du commentaire');
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCommentFormData }) =>
      commentsApi.updateComment(id, data),
    onSuccess: () => {
      toast.success('Commentaire mis à jour avec succès');
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du commentaire');
    },
  });
};

export const useRemoveComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => commentsApi.removeComment(id),
    onSuccess: () => {
      toast.success('Commentaire supprimé avec succès');
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression du commentaire');
    },
  });
};