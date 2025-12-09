/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { locationsApi } from '@/lib/api-endponts';
import { 
  Location, 
  CreateLocationDto, 
  UpdateLocationDto, 
  GeocodeDto, 
  GeocodeResult,
  ReverseGeocodeDto
} from '@/types/location';
import { toast } from 'react-hot-toast';
import { 
  CreateLocationFormData, 
  UpdateLocationFormData,
  GeocodeFormData,
  ReverseGeocodeFormData
} from '@/lib/validations/location';

// =====================================
// HOOKS POUR LA LECTURE (public)
// =====================================

export const useGeocode = (address: string) => {
  return useQuery({
    queryKey: ['locations', 'geocode', address],
    queryFn: () => locationsApi.geocode({ address }),
    enabled: !!address, // Ne lance la requête que si l'adresse est fournie
    staleTime: 1000 * 60 * 60, // 1 heure
  });
};

export const useReverseGeocode = (latitude: number, longitude: number) => {
  return useQuery({
    queryKey: ['locations', 'reverse-geocode', latitude, longitude],
    queryFn: () => locationsApi.reverseGeocode({ latitude, longitude }),
    enabled: !!(latitude === undefined || longitude === undefined), // Ne lance la requête que si les coordonnées sont fournies
    staleTime: 1000 * 60 * 60, // 1 heure
  });
};

export const useLocation = (contentId: string) => {
  return useQuery({
    queryKey: ['locations', 'detail', contentId],
    queryFn: () => locationsApi.findByContentId(contentId),
    enabled: !!contentId, // Ne lance la requête que si l'ID est fourni
  });
};

// =====================================
// HOOKS POUR L'ORGANISATION CONNECTÉE
// =====================================

export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLocationFormData) => locationsApi.create(data),
    onSuccess: () => {
      toast.success('Localisation créée avec succès');
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création de la localisation');
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contentId, data }: { contentId: string; data: UpdateLocationFormData }) =>
      locationsApi.update(contentId, data),
    onSuccess: () => {
      toast.success('Localisation mise à jour avec succès');
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour de la localisation');
    },
  });
};

export const useRemoveLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentId: string) => locationsApi.remove(contentId),
    onSuccess: () => {
      toast.success('Localisation supprimée avec succès');
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression de la localisation');
    },
  });
};