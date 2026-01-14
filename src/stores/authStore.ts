/* eslint-disable @typescript-eslint/no-unused-vars */
 
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthResponse, User } from '@/types';

function isJwtExpired(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (authData: AuthResponse) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: ({ accessToken, user }) => {
        set({ user, accessToken, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        // ✅ CORRECTION : Ne PAS utiliser localStorage.removeItem ici.
        // Le middleware 'persist' gère automatiquement la suppression du storage.
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      storage: typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined,
      onRehydrateStorage: () => (state) => {
        // Vérification de l'expiration au chargement
        //if (state?.accessToken && isJwtExpired(state.accessToken)) {
          //state.logout();
        //}
      },
    }
  )
);