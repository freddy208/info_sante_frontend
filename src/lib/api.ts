// src/lib/api.ts
import { NearbyQueryDto, PublicAlert, PublicOrganization, PublicSearchResponse } from '@/types/public';
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
apiClient.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    const { state } = JSON.parse(authStorage);
    if (state.token) {
      config.headers.Authorization = `Bearer ${state.token}`;
    }
  }
  return config;
});

// Intercepteur pour gérer les erreurs (ex: token expiré)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event('unauthorized'));
    }
    return Promise.reject(error);
  }
);



export const publicApi = {
  // ==========================================
  // 🌐 PUBLIC API (Landing Page)
  // ==========================================

  // GET /public/alerts
  getAlerts: (): Promise<PublicAlert[]> =>
    // On descend d'un niveau pour récupérer le tableau direct
    apiClient.get('/public/alerts').then((res) => res.data.data),

  // GET /public/organizations/nearby
  getNearbyOrganizations: (params: NearbyQueryDto): Promise<PublicOrganization[]> =>
    apiClient.get('/public/organizations/nearby', { params }).then((res) => res.data.data),

  // GET /public/search
  search: (q: string): Promise<PublicSearchResponse> =>
    // Attention : search renvoie une réponse structurée, pas juste un tableau
    // Donc ici on garde res.data, qui correspond à PublicSearchResponse
    apiClient.get('/public/search', { params: { q } }).then((res) => res.data.data),
};