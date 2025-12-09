/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api-endponts';
import { useAuthStore } from '@/stores/authStore';
import { LoginFormData, RegisterFormData } from '@/lib/validations/auth';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { login: loginStore, logout: logoutStore, setLoading } = useAuthStore();

  const handleAuthSuccess = (authData: any) => {
    if (!authData?.accessToken) {
      throw new Error("Token manquant ou invalide");
    }

    loginStore(authData);
    queryClient.invalidateQueries({ queryKey: ['profile'] });
  };

  const mutationConfig = {
    onMutate: () => setLoading(true),
    onSuccess: handleAuthSuccess,
    onError: (error: any) => {
      console.error("Auth error:", error.response?.data?.message || error.message);
    },
    onSettled: () => setLoading(false),
  };

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    ...mutationConfig,
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) => authApi.register(data),
    ...mutationConfig,
  });

  const logout = () => {
    logoutStore();
    queryClient.clear();
  };

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
  };
};
