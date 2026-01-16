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

  if (orgStorage) {
    const parsedOrg = JSON.parse(orgStorage);
    token = parsedOrg.state?.token; 
  } 
  
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

    // Ne rien faire si ce n'est pas une 401 ou si c'est une route publique
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // 1. DÉTECTION DU CONTEXTE (Est-ce qu'on a une session existante ?)
    const orgStorage = localStorage.getItem('organization-auth-storage');
    const userStorage = localStorage.getItem('auth-storage');
    
    let isOrg = false;
    let hasSession = false;
    let storageKey = '';

    if (orgStorage && JSON.parse(orgStorage).state?.token) {
      isOrg = true;
      hasSession = true;
      storageKey = 'organization-auth-storage';
    } else if (userStorage && JSON.parse(userStorage).state?.accessToken) {
      hasSession = true;
      storageKey = 'auth-storage';
    }

    // 🛑 NAVIGATION LIBRE : Si aucune session n'existe, on ne redirige pas !
    if (!hasSession) {
      return Promise.reject(error);
    }

    // 2. GESTION DU REFRESH
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return apiClient(originalRequest);
      }).catch(err => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshUrl = isOrg ? '/organizations/refresh' : '/auth/refresh';

    try {
      const storage = localStorage.getItem(storageKey);
      const parsedStorage = JSON.parse(storage || '{}');
      const refreshToken = parsedStorage.state?.refreshToken;

      if (!refreshToken) throw new Error('No refresh token');

      const response = await axios.post(`${apiClient.defaults.baseURL}${refreshUrl}`, { refreshToken });
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data?.data || response.data;

      // Mise à jour du stockage
      if (parsedStorage.state) {
        if (isOrg) parsedStorage.state.token = newAccessToken;
        else parsedStorage.state.accessToken = newAccessToken;
        if (newRefreshToken) parsedStorage.state.refreshToken = newRefreshToken;
        localStorage.setItem(storageKey, JSON.stringify(parsedStorage));
      }

      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      processQueue(null, newAccessToken);
      
      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);

    } catch (refreshError) {
      processQueue(refreshError, null);
      
      // La session a vraiment expiré : Nettoyage et redirection appropriée
      localStorage.removeItem(storageKey);
      if (typeof window !== 'undefined') {
        // Redirection logique : 
        // - Si c'était une org -> login organisation (/hopitals/login)
        // - Si c'était un user -> login citoyen (/auth/connexion)
        window.location.href = isOrg ? '/hopitals/login' : '/auth/connexion';
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
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
