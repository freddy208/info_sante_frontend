/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Organization, OrganizationAuthResponse } from '@/types/organization';

function isJwtExpired(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

interface OrganizationAuthState {
  organization: Organization | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (authData: OrganizationAuthResponse) => void;
  logout: () => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  updateTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
}

export const useOrganizationAuthStore = create<OrganizationAuthState>()(
  persist(
    (set, get) => ({
      organization: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: ({ organization, accessToken, refreshToken }) => {
        if (!accessToken) return;
        set({
          organization,
          token: accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({ 
          organization: null, 
          token: null, 
          refreshToken: null, 
          isAuthenticated: false 
        });
        localStorage.removeItem("organization-auth-storage");
      },

      clearAuth: () => {
        set({ 
          organization: null, 
          token: null, 
          refreshToken: null, 
          isAuthenticated: false 
        });
        localStorage.removeItem("organization-auth-storage");
      },

      setLoading: (loading) => set({ isLoading: loading }),

      updateTokens: ({ accessToken, refreshToken }) => {
        set({ 
          token: accessToken, 
          refreshToken 
        });
      },
    }),

    {
      name: "organization-auth-storage",
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