/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useQueryClient } from '@tanstack/react-query';

// ✅ CORRECTION ICI : 'endpoints' et non 'endponts'
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
import { useMutation } from '@tanstack/react-query';
import { organizationsApi } from '@/lib/api-endponts'; // Note: vérifiez le nom du fichier 'api-endpoints.ts' vs 'api-endponts.ts' dans votre import
import { toast } from 'react-hot-toast';
// Importez votre gestionnaire de stockage de tokens (exemple localStorage ou store Zustand)
// import { saveAuthTokens } from '@/lib/auth-store'; 

export const useRegisterOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterOrganizationFormData) => organizationsApi.register(data),
    onSuccess: (data: OrganizationAuthResponse) => {
      // ✅ CRITIQUE : Sauvegarder les tokens ici
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      
      // Si vous utilisez un store: saveAuthTokens(data);

      toast.success('Inscription réussie !');
      queryClient.invalidateQueries({ queryKey: ['organizations', 'profile'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de l'inscription");
    },
  });
};

export const useLoginOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginOrganizationFormData) => organizationsApi.login(data),
    onSuccess: (data: OrganizationAuthResponse) => {
      // ✅ CRITIQUE : Sauvegarder les tokens ici
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      
      toast.success('Connexion réussie !');
      queryClient.invalidateQueries({ queryKey: ['organizations', 'profile'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de la connexion");
    },
  });
};

export const useRefreshOrganizationToken = () => {
  return useMutation({
    mutationFn: (refreshToken: string) => organizationsApi.refreshToken(refreshToken),
    onSuccess: (data: RefreshTokenResponse) => {
      // ✅ IMPORTANT : Mettre à jour les tokens
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
    },
    onError: (error: any) => {
      // Si le refresh échoue, forcer la déconnexion
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login'; // Redirection
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