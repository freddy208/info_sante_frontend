/* eslint-disable @typescript-eslint/no-explicit-any */
import { NearbyQueryDto, PublicAlert, PublicOrganization, PublicSearchResponse } from '@/types/public';
import axios from 'axios';

// Instance de base
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: { indexes: null },
  withCredentials: true,
});

// ==========================
// Intercepteur JWT (Requête)
// ==========================
apiClient.interceptors.request.use((config) => {
  // Ne pas ajouter le token si on est déjà en train de refresh ou logout
  if (config.url?.includes('/auth/refresh') || config.url?.includes('/auth/logout')) {
    return config;
  }

  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    try {
      const { state } = JSON.parse(authStorage);
      if (state?.accessToken) {
        config.headers.Authorization = `Bearer ${state.accessToken}`;
      }
    } catch { /* ignore */ }
  }
  return config;
});

// ==========================
// Interceptor Réponse (Refresh)
// ==========================
apiClient.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config;

    // Si erreur 401 et qu'on n'a pas déjà tenté de retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 1. Appel au refresh via AXIOS DIRECT (pour éviter les intercepteurs de l'apiClient)
        const response = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // 2. Extraction du token selon ton TransformInterceptor NestJS
        const newAccessToken = response.data?.data?.accessToken || response.data?.accessToken;

        if (!newAccessToken) throw new Error('No token received');

        // 3. Mise à jour globale et locale
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          if (parsed.state) {
            parsed.state.accessToken = newAccessToken;
            parsed.state.isAuthenticated = true;
            localStorage.setItem('auth-storage', JSON.stringify(parsed));
          }
        }

        // 4. Relancer la requête initiale avec le nouveau token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        // Si le refresh échoue (Cookie expiré), on déconnecte vraiment
        console.error("Session expirée, redirection...");
        localStorage.removeItem('auth-storage'); // Optionnel selon ton besoin
        window.dispatchEvent(new Event('unauthorized'));
        return Promise.reject(refreshError);
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
