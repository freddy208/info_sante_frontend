/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadsApi } from '@/lib/api-endponts';
import { 
  Media, 
  UploadImageDto, 
  UploadDocumentDto,
  PaginatedMediasResponse,
  ContentType
} from '@/types/upload';
import { toast } from 'react-hot-toast';
import { 
  UploadImageFormData, 
  UploadDocumentFormData
} from '@/lib/validations/upload';

// =====================================
// HOOKS POUR LA LECTURE (public)
// =====================================

export const useMedia = (id: string) => {
  return useQuery({
    queryKey: ['uploads', 'detail', id],
    queryFn: () => uploadsApi.getMediaById(id),
    enabled: !!id, // Ne lance la requête que si l'ID est fourni
  });
};

// =====================================
// HOOKS POUR L'UTILISATEUR CONNECTÉ
// =====================================

export const useMyUploadsList = (params?: {
  page?: number;
  limit?: number;
  contentType?: ContentType;
}) => {
  return useQuery({
    queryKey: ['uploads', 'my', params],
    queryFn: () => uploadsApi.getMyUploads(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, data }: { file: File; data: UploadImageFormData }) =>
      uploadsApi.uploadImage(file, data),
    onSuccess: () => {
      toast.success('Image uploadée avec succès');
      queryClient.invalidateQueries({ queryKey: ['uploads'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'upload de l\'image');
    },
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, data }: { file: File; data: UploadDocumentFormData }) =>
      uploadsApi.uploadDocument(file, data),
    onSuccess: () => {
      toast.success('Document uploadé avec succès');
      queryClient.invalidateQueries({ queryKey: ['uploads'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'upload du document');
    },
  });
};

export const useRemoveMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => uploadsApi.removeMedia(id),
    onSuccess: () => {
      toast.success('Média supprimé avec succès');
      queryClient.invalidateQueries({ queryKey: ['uploads'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression du média');
    },
  });
};