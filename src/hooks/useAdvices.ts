/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { advicesApi } from '@/lib/api-endponts'; // Attention à la coquille ici dans ton import : "endponts" vs "endpoints" ?
import { 
  Advice, 
  CreateAdviceDto, 
  UpdateAdviceDto, 
  QueryAdviceDto,
  Priority,
  PaginatedAdvicesResponse
} from '@/types/advice';
import { toast } from 'react-hot-toast';
import { 
  CreateAdviceFormData, 
  UpdateAdviceFormData, 
  QueryAdviceFormData
} from '@/lib/validations/advice'; // Assure-toi que ces types Zod matchent les DTOs ci-dessus

const normalizeAdviceParams = (
  params?: QueryAdviceDto
): QueryAdviceDto => ({
  page: params?.page ?? 1,
  limit: params?.limit ?? 20,
  categoryId: params?.categoryId || undefined,
  organizationId: params?.organizationId || undefined,
  search: params?.search || undefined,
  status: params?.status ?? undefined,
  priority: params?.priority ?? undefined,
  isActive: params?.isActive ?? undefined,
  targetAudience: params?.targetAudience?.length
    ? params.targetAudience
    : undefined,
});


// =====================================
// HOOKS POUR LA LECTURE (public)
// =====================================

export const useAdvicesList = (params?: QueryAdviceDto) => {
  const normalizedParams = normalizeAdviceParams(params);

  return useQuery<PaginatedAdvicesResponse, Error>({
    queryKey: ['advices', 'list', normalizedParams],
    queryFn: () => advicesApi.getAdvices(normalizedParams),
    staleTime: 1000 * 60 * 5,
  });
};


export const useAdvice = (id: string) => {
  return useQuery({
    queryKey: ['advices', 'detail', id],
    queryFn: () => advicesApi.getAdviceById(id),
    enabled: !!id,
  });
};

// =====================================
// HOOKS POUR L'ORGANISATION CONNECTÉE
// =====================================

export const useMyAdvicesList = (params?: QueryAdviceDto) => {
  const normalizedParams = normalizeAdviceParams(params);

  return useQuery<PaginatedAdvicesResponse, Error>({
    queryKey: ['advices', 'my', normalizedParams],
    queryFn: () => advicesApi.getMyAdvices(normalizedParams),
    staleTime: 1000 * 60 * 5,
  });
};


export const useAdviceStats = () => {
  return useQuery({
    queryKey: ['advices', 'stats'],
    queryFn: () => advicesApi.getAdviceStats(),
    staleTime: 1000 * 60 * 10,
  });
};

export const useCreateAdvice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdviceFormData) => advicesApi.create(data),
    onSuccess: () => {
      toast.success('Conseil créé avec succès');
      queryClient.invalidateQueries({ queryKey: ['advices'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création du conseil');
    },
  });
};

export const useUpdateAdvice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdviceFormData }) =>
      advicesApi.updateAdvice(id, data),
    onSuccess: (_, variables) => {
      toast.success('Conseil mis à jour avec succès');
      // Invalide la liste ET le détail spécifique
      queryClient.invalidateQueries({ queryKey: ['advices'] });
      queryClient.invalidateQueries({ queryKey: ['advices', 'detail', variables.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du conseil');
    },
  });
};

export const usePublishAdvice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => advicesApi.publishAdvice(id),
    onSuccess: () => {
      toast.success('Conseil publié avec succès');
      queryClient.invalidateQueries({ queryKey: ['advices'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la publication du conseil');
    },
  });
};

export const useArchiveAdvice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => advicesApi.archiveAdvice(id),
    onSuccess: () => {
      toast.success('Conseil archivé avec succès');
      queryClient.invalidateQueries({ queryKey: ['advices'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'archivage du conseil');
    },
  });
};

export const useUpdateAdvicePriority = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, priority }: { id: string; priority: Priority }) =>
      advicesApi.updateAdvicePriority(id, priority),
    onSuccess: () => {
      toast.success('Priorité mise à jour');
      queryClient.invalidateQueries({ queryKey: ['advices'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour de la priorité');
    },
  });
};

export const useRemoveAdvice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => advicesApi.removeAdvice(id),
    onSuccess: () => {
      toast.success('Conseil supprimé avec succès');
      queryClient.invalidateQueries({ queryKey: ['advices'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression du conseil');
    },
  });
};
// À ajouter dans useAdvices.ts
export const useViewAdvice = () => {
  return useMutation({
    mutationFn: (id: string) => advicesApi.viewAdvice(id),
    // Pas de toast ici pour ne pas déranger l'utilisateur lors d'une simple lecture
    onError: (error: any) => console.error("Erreur vue:", error),
  });
};