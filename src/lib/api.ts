/* eslint-disable @typescript-eslint/no-explicit-any */
import { NearbyQueryDto, PublicAlert, PublicOrganization, PublicSearchResponse } from '@/types/public';
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  //headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// =====================================
// 🛰️ INTERCEPTEUR DE REQUÊTE
// =====================================
apiClient.interceptors.request.use((config) => {
  if (config.url?.includes('/refresh') || config.url?.includes('/logout')) return config;

  const orgStorage = localStorage.getItem('organization-auth-storage');
  const userStorage = localStorage.getItem('auth-storage');

  let token = null;

  // 1. On cherche d'abord l'organisation (clé 'token' dans ton store Zustand Org)
  if (orgStorage) {
    const parsedOrg = JSON.parse(orgStorage);
    token = parsedOrg.state?.token; 
  } 
  
  // 2. Sinon on cherche l'user classique (clé 'accessToken' dans ton store Zustand User)
  if (!token && userStorage) {
    const parsedUser = JSON.parse(userStorage);
    token = parsedUser.state?.accessToken;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =====================================
// 🔄 LOGIQUE DE REFRESH TOKEN
// =====================================
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Déterminer si c'est une route "Organisation" (incluant les uploads)
      const isOrgRequest = originalRequest.url?.includes('/organizations') || 
                           originalRequest.url?.includes('/announcements') ||
                           originalRequest.url?.includes('/uploads') ||
                           originalRequest.url?.includes('/advices');
      
      const refreshUrl = isOrgRequest ? '/organizations/refresh' : '/auth/refresh';
      const storageKey = isOrgRequest ? 'organization-auth-storage' : 'auth-storage';

      try {
        const storage = localStorage.getItem(storageKey);
        if (!storage) throw new Error('No storage found');
        
        const parsedStorage = JSON.parse(storage);
        const refreshToken = parsedStorage.state?.refreshToken;

        if (!refreshToken) throw new Error('No refresh token available');

        const response = await axios.post(
          `${apiClient.defaults.baseURL}${refreshUrl}`,
          { refreshToken }
        );

        const newAccessToken = response.data?.data?.accessToken || response.data?.accessToken;
        const newRefreshToken = response.data?.data?.refreshToken || response.data?.refreshToken;

        // Mise à jour du stockage avec respect des clés respectives
        if (parsedStorage.state) {
          if (isOrgRequest) {
            parsedStorage.state.token = newAccessToken; // Clé 'token' pour Org
          } else {
            parsedStorage.state.accessToken = newAccessToken; // Clé 'accessToken' pour User
          }
          
          if (newRefreshToken) parsedStorage.state.refreshToken = newRefreshToken;
          localStorage.setItem(storageKey, JSON.stringify(parsedStorage));
        }

        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        console.error("Session expirée, redirection...");
        
        // Nettoyage précis
        localStorage.removeItem(storageKey);
        
        if (typeof window !== 'undefined') {
          window.location.href = isOrgRequest ? '/auth/connexion' : '/hopitals/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// ✅ L'INTERCEPTEUR D'ERREUR SUPPLÉMENTAIRE A ÉTÉ SUPPRIMÉ ICI

// ==========================
// Déballage des réponses
// ==========================
const unwrapResponse = <T>(res: any): T => {
  if (res.status !== 200 && res.status !== 201) {
    throw new Error(`API Error: ${res.statusText}`);
  }

  if (!res.data) return ([] as unknown) as T;

  if (Array.isArray(res.data)) return res.data as T;

  if (typeof res.data === 'object' && 'data' in res.data) return res.data.data as T;

  return res.data as T;
};

// ==========================
// API Public
// ==========================
export const publicApi = {
  /**
   * Récupère les alertes sanitaires (bannière)
   */
  getAlerts: (signal?: AbortSignal): Promise<PublicAlert[]> =>
    apiClient.get('/public/alerts', { signal })
      .then((res) => unwrapResponse<PublicAlert[]>(res)),

  /**
   * Récupère les organisations proches de l'utilisateur
   */
  getNearbyOrganizations: (
    params: NearbyQueryDto,
    signal?: AbortSignal
  ): Promise<PublicOrganization[]> =>
    apiClient.get('/public/organizations/nearby', { params, signal })
      .then((res) => unwrapResponse<PublicOrganization[]>(res)),

  /**
   * Recherche globale (hôpitaux, alertes, articles)
   */
  search: (q: string, signal?: AbortSignal): Promise<PublicSearchResponse> =>
    apiClient.get('/public/search', { params: { q }, signal })
      .then((res) => unwrapResponse<PublicSearchResponse>(res)),
};
