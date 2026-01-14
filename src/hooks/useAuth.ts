/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useAuth.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api-endponts';
import { useAuthStore } from '@/stores/authStore';
import { LoginDto, RegisterDto, AuthResponse } from '@/types';
import { useCallback } from 'react';

/**
 * Throttle simple (anti double-click / spam login)
 */
const throttle = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  limit = 3000
): T => {
  let lastCall = 0;

  return (async (...args: any[]) => {
    const now = Date.now();
    if (now - lastCall < limit) return;
    lastCall = now;
    return fn(...args);
  }) as T;
};

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { login: loginStore, logout: logoutStore } = useAuthStore();

  const handleAuthSuccess = (authData: AuthResponse) => {
    if (!authData?.accessToken) {
      throw new Error('Token manquant');
    }

    console.log('✅ Auth success, storing data:', authData);
    
    // Appeler le store pour mettre à jour l'état
    loginStore(authData);
    
    // Invalider les queries pour forcer le rechargement
    queryClient.invalidateQueries({ queryKey: ['profile'] });

    // Force un petit délai pour que le store se mette à jour
    setTimeout(() => {
      console.log('🔄 State après login:', useAuthStore.getState());
    }, 100);
  };

  const loginMutation = useMutation({
    mutationFn: throttle((data: LoginDto) => authApi.login(data)),
    onSuccess: handleAuthSuccess,
  });

  const registerMutation = useMutation({
    mutationFn: throttle((data: RegisterDto) => authApi.register(data)),
    onSuccess: handleAuthSuccess,
  });

  const logout = useCallback(async () => {
    try {
      // Appeler l'API de déconnexion
      await authApi.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion API:', error);
    } finally {
      // Toujours nettoyer le state local
      logoutStore();
      queryClient.clear();
    }
  }, [logoutStore, queryClient]);

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
  };
};