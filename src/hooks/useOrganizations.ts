/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
      toast.success('Inscription réussie');
      // Stocker les tokens dans le store d'authentification
      // useAuthStore.getState().login(data);
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
      toast.success('Connexion réussie');
      // Stocker les tokens dans le store d'authentification
      // useAuthStore.getState().login(data);
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
      // Mettre à jour les tokens dans le store d'authentification
      // useAuthStore.getState().updateTokens(data);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors du rafraîchissement du token');
      // Déconnecter l'utilisateur en cas d'erreur
      // useAuthStore.getState().logout();
    },
  });
};

// =====================================
// HOOKS POUR LA LECTURE (public)
// =====================================

export const useOrganizationsList = (params?: {
  type?: string;
  city?: string;
  region?: string;
  isVerified?: boolean;
  status?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['organizations', 'list', params],
    queryFn: () => organizationsApi.getOrganizations(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useOrganization = (id: string) => {
  return useQuery({
    queryKey: ['organizations', 'detail', id],
    queryFn: () => organizationsApi.getOrganizationById(id),
    enabled: !!id, // Ne lance la requête que si l'ID est fourni
  });
};

// =====================================
// HOOKS POUR L'ORGANISATION CONNECTÉE
// =====================================

export const useOrganizationProfile = () => {
  return useQuery({
    queryKey: ['organizations', 'profile'],
    queryFn: () => organizationsApi.getProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutes
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
      toast.error(error.response?.data?.message || 'Erreur lors du changement du mot de passe');
    },
  });
};

// =====================================
// HOOKS POUR LA GESTION DES MEMBRES
// =====================================

export const useOrganizationMembers = () => {
  return useQuery({
    queryKey: ['organizations', 'members'],
    queryFn: () => organizationsApi.getMembers(),
    staleTime: 1000 * 60 * 5, // 5 minutes
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