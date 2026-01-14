/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { announcementsApi } from '@/lib/api-endponts';
import { 
  Announcement, 
  CreateAnnouncementDto, 
  UpdateAnnouncementDto, 
  QueryAnnouncementDto,
  PaginatedAnnouncementsResponse,
  RegisterAnnouncementDto
} from '@/types/announcement';
import { toast } from 'react-hot-toast';
import { 
  CreateAnnouncementFormData, 
  UpdateAnnouncementFormData, 
  QueryAnnouncementFormData
} from '@/lib/validations/announcement';

const normalizeAnnouncementParams = (
  params?: QueryAnnouncementDto
): QueryAnnouncementDto => ({
  page: params?.page ?? 1,
  limit: params?.limit ?? 20,
  categoryId: params?.categoryId || undefined,
  search: params?.search || undefined,
  isFree: params?.isFree ?? undefined,
  hasCapacity: params?.hasCapacity ?? undefined,
});


// ==========================================
// HOOKS POUR LA LECTURE (Public)
// ==========================================

// ✅ CORRECTION ICI : On utilise QueryAnnouncementDto (le type backend)
// et non QueryAnnouncementFormData (le type Zod)
export const useAnnouncementsList = (params?: QueryAnnouncementDto) => {
  const normalizedParams = normalizeAnnouncementParams(params);

  return useQuery<PaginatedAnnouncementsResponse, Error>({
    queryKey: ['announcements', 'list', normalizedParams],
    queryFn: () => announcementsApi.getAnnouncements(normalizedParams),
    staleTime: 1000 * 60 * 5,
  });
};


export const useAnnouncement = (idOrSlug: string) => {
  return useQuery<Announcement, Error>({
    queryKey: ['announcements', 'detail', idOrSlug],
    queryFn: () => announcementsApi.getAnnouncementById(idOrSlug),
    enabled: !!idOrSlug, // Ne lance la requête que si l'ID est fourni
  });
};

// ✅ AJOUT : Hook d'inscription
export const useRegisterAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RegisterAnnouncementDto }) => 
      announcementsApi.register(id, data),
    
    onSuccess: (_, { id }) => {
      toast.success('Inscription réussie !');
      // 1. Invalider la liste pour mettre à jour les compteurs (places dispo)
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      // 2. Invalider le détail de l'annonce spécifique
      queryClient.invalidateQueries({ queryKey: ['announcements', 'detail', id] });
    },
    
    onError: (error: any) => {
      // Gestion des erreurs backend (ex: plus de places)
      const message = error.response?.data?.message || "Erreur lors de l'inscription";
      toast.error(message);
    },
  });
};

// ==========================================
// HOOKS POUR L'ORGANISATION CONNECTÉE
// ==========================================

// ✅ CORRECTION ICI : On utilise QueryAnnouncementDto aussi pour les requêtes privées
export const useMyAnnouncementsList = (params?: QueryAnnouncementDto) => {
  const normalizedParams = normalizeAnnouncementParams(params);

  return useQuery<PaginatedAnnouncementsResponse, Error>({
    queryKey: ['announcements', 'my', normalizedParams],
    queryFn: () => announcementsApi.getMyAnnouncements(normalizedParams),
    staleTime: 1000 * 60 * 5,
  });
};


// ==========================================
// HOOKS POUR LES MUTATIONS (CRUD)
// ==========================================

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAnnouncementDto) => announcementsApi.create(data),
    onSuccess: () => {
      toast.success('Annonce créée avec succès');
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création de l\'annonce');
    },
  });
};

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAnnouncementDto }) =>
      announcementsApi.updateAnnouncement(id, data),
    onSuccess: () => {
      toast.success('Annonce mise à jour avec succès');
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'annonce');
    },
  });
};

export const usePublishAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => announcementsApi.publishAnnouncement(id),
    onSuccess: () => {
      toast.success('Annonce publiée avec succès');
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la publication de l\'annonce');
    },
  });
};

export const useRemoveAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => announcementsApi.removeAnnouncement(id),
    onSuccess: () => {
      toast.success('Annonce supprimée avec succès');
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression de l\'annonce');
    },
  });
};