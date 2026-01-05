/* eslint-disable @typescript-eslint/no-explicit-any */
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

// ==========================================
// FONCTION DE SÉCURITÉ POUR DÉBALLER LES RÉPONSES
// ==========================================
// Gère le cas où NestJS renvoie { data: [...] } (Wrapper) ou [...] direct
// Et gère le cas où une erreur 400 renvoie un objet d'erreur au lieu du tableau
const unwrapResponse = (res: any) => {
  // 1. Si la réponse est une erreur HTTP (400, 500...), on laisse l'erreur se propager
  // ou on vérifie si c'est un objet d'erreur
  if (res.status !== 200 && res.status !== 201) {
    throw new Error(`API Error: ${res.statusText}`);
  }

  // 2. Si la réponse est vide, on retourne un tableau vide par sécurité
  if (!res.data) return [];

  // 3. Cas standard : La réponse est directement ce qu'on veut (Tableau ou Objet Search)
  if (Array.isArray(res.data)) return res.data;
  
  // 4. Cas Wrapper : La réponse est enveloppée dans { data: [...] }
  if (typeof res.data === 'object' && 'data' in res.data) {
    return res.data.data;
  }

  // 5. Fallback : On retourne la donnée brute
  return res.data;
};

export const publicApi = {
  // GET /public/alerts
  getAlerts: (): Promise<PublicAlert[]> =>
    apiClient.get('/public/alerts').then(unwrapResponse),

  // GET /public/organizations/nearby
  getNearbyOrganizations: (params: NearbyQueryDto): Promise<PublicOrganization[]> =>
    apiClient.get('/public/organizations/nearby', { params }).then(unwrapResponse),

  // GET /public/search (Note: search retourne un objet structuré { status, data }, pas un tableau direct)
  search: (q: string): Promise<PublicSearchResponse> =>
    apiClient.get('/public/search', { params: { q } }).then((res) => unwrapResponse(res)),
};