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
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (authData: AuthResponse) => void;
  logout: () => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: ({ user, accessToken }) => {
        if (!accessToken) return;
        set({
          user,
          token: accessToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem("auth-storage");
      },

      clearAuth: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem("auth-storage");
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),

    {
      name: "auth-storage",
      storage:
        typeof window !== "undefined"
          ? createJSONStorage(() => localStorage)
          : undefined,

      onRehydrateStorage: () => (state) => {
        // Déconnexion auto si token expiré
        if (state?.token && isJwtExpired(state.token)) {
          state.clearAuth();
        }

        // Déconnexion via événement global 401
        window.addEventListener("unauthorized", () => {
          console.log("Token expiré → logout automatique");
          state?.clearAuth();
        });
      },
    }
  )
);
