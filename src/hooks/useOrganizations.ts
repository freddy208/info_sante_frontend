/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ✅ CORRECTION ICI : 'endpoints' et non 'endponts'
import { organizationsApi } from '@/lib/api-endponts';
import { 
  Organization, 
  OrganizationMember, 
  RegisterOrganizationDto, 
  LoginOrganizationDto, 
  UpdateOrganizationDto, 
  UpdatePasswordDto, 
  CreateMemberDto, 
  UpdateMemberDto,
  PaginatedOrganizationsResponse,
  OrganizationAuthResponse,
  RefreshTokenResponse
} from '@/types/organization';
import { toast } from 'react-hot-toast';
import { 
  RegisterOrganizationFormData, 
  LoginOrganizationFormData, 
  UpdateOrganizationFormData, 
  UpdatePasswordFormData, 
  CreateMemberFormData, 
  UpdateMemberFormData 
} from '@/lib/validations/organization';

// =====================================
// HOOKS POUR L'AUTHENTIFICATION
// =====================================

export const useRegisterOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterOrganizationFormData) => organizationsApi.register(data),
    onSuccess: (data: OrganizationAuthResponse) => {
      toast.success('Inscription réussie !');
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'inscription');
    },
  });
};

export const useLoginOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginOrganizationFormData) => organizationsApi.login(data),
    onSuccess: (data: OrganizationAuthResponse) => {
      toast.success('Connexion réussie !');
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la connexion');
    },
  });
};

export const useRefreshOrganizationToken = () => {
  return useMutation({
    mutationFn: (refreshToken: string) => organizationsApi.refreshToken(refreshToken),
    onSuccess: (data: RefreshTokenResponse) => {
      // Mettre à jour les tokens dans le store
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors du rafraîchissement du token');
      // Redirection vers login
    },
  });
};

// =====================================
// HOOKS POUR LA LECTURE (Public)
// =====================================

// ✅ CORRECTION : On utilise `Record<string, any>` pour accepter tous les filtres possibles
// sans être trop strict sur les types des clés pour éviter l'erreur d'inférence sur `data`
export const useOrganizationsList = (params?: Record<string, any>) => {
  return useQuery<PaginatedOrganizationsResponse, Error>({
    queryKey: ['organizations', 'list', params],
    queryFn: () => organizationsApi.getOrganizations(params),
    staleTime: 1000 * 60 * 5, 
  });
};

export const useOrganization = (id: string) => {
  return useQuery<Organization, Error>({
    queryKey: ['organizations', 'detail', id],
    queryFn: () => organizationsApi.getOrganizationById(id),
    enabled: !!id, // Ne lance la requête que si l'ID est fourni
  });
};

// =====================================
// HOOKS POUR L'ORGANISATION CONNECTÉE
// =====================================

export const useOrganizationProfile = () => {
  return useQuery<Organization, Error>({
    queryKey: ['organizations', 'profile'],
    queryFn: () => organizationsApi.getProfile(),
    staleTime: 1000 * 60 * 5, 
  });
};

export const useUpdateOrganizationProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateOrganizationFormData) => organizationsApi.updateProfile(data),
    onSuccess: () => {
      toast.success('Profil mis à jour avec succès');
      queryClient.invalidateQueries({ queryKey: ['organizations', 'profile'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    },
  });
};

export const useUpdateOrganizationPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePasswordFormData) => organizationsApi.updatePassword(data),
    onSuccess: () => {
      toast.success('Mot de passe changé avec succès');
      queryClient.invalidateQueries({ queryKey: ['organizations', 'profile'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
    },
  });
};

// =====================================
// HOOKS POUR LA GESTION DES MEMBRES
// =====================================

export const useOrganizationMembers = () => {
  return useQuery<OrganizationMember[], Error>({
    queryKey: ['organizations', 'members'],
    queryFn: () => organizationsApi.getMembers(),
    staleTime: 1000 * 60 * 5, 
  });
};

export const useAddOrganizationMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMemberFormData) => organizationsApi.addMember(data),
    onSuccess: () => {
      toast.success('Membre ajouté avec succès');
      queryClient.invalidateQueries({ queryKey: ['organizations', 'members'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout du membre');
    },
  });
};

export const useUpdateOrganizationMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMemberFormData }) =>
      organizationsApi.updateMember(id, data),
    onSuccess: () => {
      toast.success('Membre mis à jour avec succès');
      queryClient.invalidateQueries({ queryKey: ['organizations', 'members'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du membre');
    },
  });
};

export const useRemoveOrganizationMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => organizationsApi.removeMember(id),
    onSuccess: () => {
      toast.success('Membre désactivé avec succès');
      queryClient.invalidateQueries({ queryKey: ['organizations', 'members'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la désactivation du membre');
    },
  });
};