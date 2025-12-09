import { Category, CreateCategoryDto, PaginatedCategoriesResponse, UpdateCategoryDto } from '@/types/category';
import { apiClient } from './api';
import { 
  AuthResponse, 
  LoginDto, 
  RegisterDto,
  RefreshTokenDto,
  User 
} from '@/types';
import { CreateMemberDto, LoginOrganizationDto, Organization, OrganizationAuthResponse, OrganizationMember, PaginatedOrganizationsResponse, RefreshTokenResponse, RegisterOrganizationDto, UpdateMemberDto, UpdateOrganizationDto, UpdatePasswordDto } from '@/types/organization';
import { CreateAnnouncementDto, Announcement, QueryAnnouncementDto, PaginatedAnnouncementsResponse, UpdateAnnouncementDto } from '@/types/announcement';
import { CreateArticleDto, Article, QueryArticleDto, PaginatedArticlesResponse, UpdateArticleDto } from '@/types/article';
import { CreateAdviceDto, Advice, QueryAdviceDto, PaginatedAdvicesResponse, UpdateAdviceDto, Priority, AdviceStats } from '@/types/advice';
import { ContentType, Media, PaginatedMediasResponse, UploadDocumentDto, UploadImageDto } from '@/types/upload';
import { GeocodeDto, GeocodeResult, ReverseGeocodeDto, CreateLocationDto, UpdateLocationDto } from '@/types/location';
import { CreateCommentDto, QueryCommentDto, PaginatedCommentsResponse, UpdateCommentDto } from '@/types/comment';

export const authApi = {
  // Correspond à POST /auth/register
  register: (data: RegisterDto): Promise<AuthResponse> =>
    apiClient.post('/auth/register', data).then(res => res.data),

  // Correspond à POST /auth/login
  login: (data: LoginDto): Promise<AuthResponse> =>
    apiClient.post('/auth/login', data).then(res => res.data),

  // Correspond à POST /auth/refresh
  refreshToken: (data: RefreshTokenDto): Promise<{ accessToken: string }> =>
    apiClient.post('/auth/refresh', data).then(res => res.data),

  // Correspond à GET /auth/me
  getProfile: (): Promise<User> =>
    apiClient.get('/auth/me').then(res => res.data),

  // Correspond à POST /auth/logout
  logout: (): Promise<{ message: string }> =>
    apiClient.post('/auth/logout').then(res => res.data),
  
};

// ... (votre code existant pour authApi)

// =====================================
// 📂 CATEGORIES API
// =====================================

export const categoriesApi = {
  // Correspond à GET /categories (publique)
  getCategories: (params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    includeChildren?: boolean;
    parentOnly?: boolean;
  }): Promise<PaginatedCategoriesResponse> =>
    apiClient.get('/categories', { params }).then(res => res.data),

  // Correspond à GET /categories/:identifier (publique)
  getCategoryByIdentifier: (identifier: string): Promise<Category> =>
    apiClient.get(`/categories/${identifier}`).then(res => res.data),

  // --- ROUTES ADMIN (préparées pour le dashboard) ---

  // Correspond à POST /categories (admin)
  createCategory: (data: CreateCategoryDto): Promise<Category> =>
    apiClient.post('/categories', data).then(res => res.data),

  // Correspond à PATCH /categories/:id (admin)
  updateCategory: (id: string, data: UpdateCategoryDto): Promise<Category> =>
    apiClient.patch(`/categories/${id}`, data).then(res => res.data),

  // Correspond à DELETE /categories/:id (admin)
  removeCategory: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/categories/${id}`).then(res => res.data),

  // Correspond à PATCH /categories/:id/activate (admin)
  activateCategory: (id: string): Promise<Category> =>
    apiClient.patch(`/categories/${id}/activate`).then(res => res.data),
};

// =====================================
// 🏥 ORGANIZATIONS API
// =====================================

export const organizationsApi = {
  // Correspond à POST /organizations/register (publique)
  register: (data: RegisterOrganizationDto): Promise<OrganizationAuthResponse> =>
    apiClient.post('/organizations/register', data).then(res => res.data),

  // Correspond à POST /organizations/login (publique)
  login: (data: LoginOrganizationDto): Promise<OrganizationAuthResponse> =>
    apiClient.post('/organizations/login', data).then(res => res.data),

  // Correspond à POST /organizations/refresh (publique)
  refreshToken: (refreshToken: string): Promise<RefreshTokenResponse> =>
    apiClient.post('/organizations/refresh', { refreshToken }).then(res => res.data),

  // Correspond à GET /organizations/me (protégé)
  getProfile: (): Promise<Organization> =>
    apiClient.get('/organizations/me').then(res => res.data),

  // Correspond à PATCH /organizations/me (protégé)
  updateProfile: (data: UpdateOrganizationDto): Promise<Organization> =>
    apiClient.patch('/organizations/me', data).then(res => res.data),

  // Correspond à PATCH /organizations/me/password (protégé)
  updatePassword: (data: UpdatePasswordDto): Promise<{ message: string }> =>
    apiClient.patch('/organizations/me/password', data).then(res => res.data),

  // Correspond à GET /organizations (publique)
  getOrganizations: (params?: {
    page?: number;
    limit?: number;
    type?: string;
    city?: string;
    region?: string;
    isVerified?: boolean;
    status?: string;
    search?: string;
  }): Promise<PaginatedOrganizationsResponse> =>
    apiClient.get('/organizations', { params }).then(res => res.data),

  // Correspond à GET /organizations/:id (publique)
  getOrganizationById: (id: string): Promise<Organization> =>
    apiClient.get(`/organizations/${id}`).then(res => res.data),

  // Correspond à POST /organizations/me/members (protégé)
  addMember: (data: CreateMemberDto): Promise<OrganizationMember> =>
    apiClient.post('/organizations/me/members', data).then(res => res.data),

  // Correspond à GET /organizations/me/members (protégé)
  getMembers: (): Promise<OrganizationMember[]> =>
    apiClient.get('/organizations/me/members').then(res => res.data),

  // Correspond à PATCH /organizations/me/members/:id (protégé)
  updateMember: (id: string, data: UpdateMemberDto): Promise<OrganizationMember> =>
    apiClient.patch(`/organizations/me/members/${id}`, data).then(res => res.data),

  // Correspond à DELETE /organizations/me/members/:id (protégé)
  removeMember: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/organizations/me/members/${id}`).then(res => res.data),
};
// =====================================
// 📢 ANNOUNCEMENTS API
// =====================================

export const announcementsApi = {
  // Correspond à POST /announcements (protégé)
  create: (data: CreateAnnouncementDto): Promise<Announcement> =>
    apiClient.post('/announcements', data).then(res => res.data),

  // Correspond à GET /announcements (publique)
  getAnnouncements: (params?: QueryAnnouncementDto): Promise<PaginatedAnnouncementsResponse> =>
    apiClient.get('/announcements', { params }).then(res => res.data),

  // Correspond à GET /announcements/my (protégé)
  getMyAnnouncements: (params?: QueryAnnouncementDto): Promise<PaginatedAnnouncementsResponse> =>
    apiClient.get('/announcements/my', { params }).then(res => res.data),

  // Correspond à GET /announcements/:idOrSlug (publique)
  getAnnouncementById: (idOrSlug: string): Promise<Announcement> =>
    apiClient.get(`/announcements/${idOrSlug}`).then(res => res.data),

  // Correspond à PATCH /announcements/:id (protégé)
  updateAnnouncement: (id: string, data: UpdateAnnouncementDto): Promise<Announcement> =>
    apiClient.patch(`/announcements/${id}`, data).then(res => res.data),

  // Correspond à PATCH /announcements/:id/publish (protégé)
  publishAnnouncement: (id: string): Promise<Announcement> =>
    apiClient.patch(`/announcements/${id}/publish`).then(res => res.data),

  // Correspond à DELETE /announcements/:id (protégé)
  removeAnnouncement: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/announcements/${id}`).then(res => res.data),
};
// =====================================
// 📰 ARTICLES API
// =====================================

export const articlesApi = {
  // Correspond à POST /articles (protégé)
  create: (data: CreateArticleDto): Promise<Article> =>
    apiClient.post('/articles', data).then(res => res.data),

  // Correspond à GET /articles (publique)
  getArticles: (params?: QueryArticleDto): Promise<PaginatedArticlesResponse> =>
    apiClient.get('/articles', { params }).then(res => res.data),

  // Correspond à GET /articles/my (protégé)
  getMyArticles: (params?: QueryArticleDto): Promise<PaginatedArticlesResponse> =>
    apiClient.get('/articles/my', { params }).then(res => res.data),

  // Correspond à GET /articles/:idOrSlug (publique)
  getArticleById: (idOrSlug: string): Promise<Article> =>
    apiClient.get(`/articles/${idOrSlug}`).then(res => res.data),

  // Correspond à PATCH /articles/:id (protégé)
  updateArticle: (id: string, data: UpdateArticleDto): Promise<Article> =>
    apiClient.patch(`/articles/${id}`, data).then(res => res.data),

  // Correspond à PATCH /articles/:id/publish (protégé)
  publishArticle: (id: string): Promise<Article> =>
    apiClient.patch(`/articles/${id}/publish`).then(res => res.data),

  // Correspond à PATCH /articles/:id/feature (protégé)
  featureArticle: (id: string, isFeatured: boolean): Promise<Article> =>
    apiClient.patch(`/articles/${id}/feature`, { isFeatured }).then(res => res.data),

  // Correspond à DELETE /articles/:id (protégé)
  removeArticle: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/articles/${id}`).then(res => res.data),
};

// =====================================
// 💡 ADVICES API
// =====================================

export const advicesApi = {
  // Correspond à POST /advices (protégé)
  create: (data: CreateAdviceDto): Promise<Advice> =>
    apiClient.post('/advices', data).then(res => res.data),

  // Correspond à GET /advices (publique)
  getAdvices: (params?: QueryAdviceDto): Promise<PaginatedAdvicesResponse> =>
    apiClient.get('/advices', { params }).then(res => res.data),

  // Correspond à GET /advices/my (protégé)
  getMyAdvices: (params?: QueryAdviceDto): Promise<PaginatedAdvicesResponse> =>
    apiClient.get('/advices/my', { params }).then(res => res.data),

  // Correspond à GET /advices/:id (publique)
  getAdviceById: (id: string): Promise<Advice> =>
    apiClient.get(`/advices/${id}`).then(res => res.data),

  // Correspond à PATCH /advices/:id (protégé)
  updateAdvice: (id: string, data: UpdateAdviceDto): Promise<Advice> =>
    apiClient.patch(`/advices/${id}`, data).then(res => res.data),

  // Correspond à PATCH /advices/:id/publish (protégé)
  publishAdvice: (id: string): Promise<Advice> =>
    apiClient.patch(`/advices/${id}/publish`).then(res => res.data),

  // Correspond à PATCH /advices/:id/archive (protégé)
  archiveAdvice: (id: string): Promise<Advice> =>
    apiClient.patch(`/advices/${id}/archive`).then(res => res.data),

  // Correspond à PATCH /advices/:id/priority (protégé)
  updateAdvicePriority: (id: string, priority: Priority): Promise<Advice> =>
    apiClient.patch(`/advices/${id}/priority`, { priority }).then(res => res.data),

  // Correspond à GET /advices/stats (protégé)
  getAdviceStats: (): Promise<AdviceStats> =>
    apiClient.get('/advices/stats').then(res => res.data),

  // Correspond à DELETE /advices/:id (protégé)
  removeAdvice: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/advices/${id}`).then(res => res.data),
};

// =====================================
// ☁️ UPLOADS API
// =====================================

export const uploadsApi = {
  // Correspond à POST /uploads/image (protégé)
  uploadImage: (file: File, data: UploadImageDto): Promise<Media> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contentType', data.contentType);
    if (data.contentId) {
      formData.append('contentId', data.contentId);
    }
    return apiClient.post('/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
  },

  // Correspond à POST /uploads/document (protégé)
  uploadDocument: (file: File, data: UploadDocumentDto): Promise<Media> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contentType', data.contentType);
    if (data.contentId) {
      formData.append('contentId', data.contentId);
    }
    return apiClient.post('/uploads/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
  },

  // Correspond à GET /uploads/my (protégé)
  getMyUploads: (params?: {
    page?: number;
    limit?: number;
    contentType?: ContentType;
  }): Promise<PaginatedMediasResponse> =>
    apiClient.get('/uploads/my', { params }).then(res => res.data),

  // Correspond à GET /uploads/:id (publique)
  getMediaById: (id: string): Promise<Media> =>
    apiClient.get(`/uploads/${id}`).then(res => res.data),

  // Correspond à DELETE /uploads/:id (protégé)
  removeMedia: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/uploads/${id}`).then(res => res.data),
};

// =====================================
// 📍 LOCATION API
// =====================================

export const locationsApi = {
  // Correspond à GET /location/geocode (publique)
  geocode: (params: GeocodeDto): Promise<GeocodeResult[]> =>
    apiClient.get('/location/geocode', { params }).then(res => res.data),

  // Correspond à GET /location/reverse-geocode (publique)
  reverseGeocode: (params: ReverseGeocodeDto): Promise<GeocodeResult> =>
    apiClient.get('/location/reverse-geocode', { params }).then(res => res.data),

  // Correspond à POST /location (protégé)
  create: (data: CreateLocationDto): Promise<Location> =>
    apiClient.post('/location', data).then(res => res.data),

  // Correspond à GET /location/:contentId (publique)
  findByContentId: (contentId: string): Promise<Location> =>
    apiClient.get(`/location/${contentId}`).then(res => res.data),

  // Correspond à PATCH /location/:contentId (protégé)
  update: (contentId: string, data: UpdateLocationDto): Promise<Location> =>
    apiClient.patch(`/location/${contentId}`, data).then(res => res.data),

  // Correspond à DELETE /location/:contentId (protégé)
  remove: (contentId: string): Promise<{ message: string }> =>
    apiClient.delete(`/location/${contentId}`).then(res => res.data),
};

// =====================================
// 💬 COMMENTS API
// =====================================

export const commentsApi = {
  // Correspond à POST /comments (protégé)
  create: (data: CreateCommentDto): Promise<Comment> =>
    apiClient.post('/comments', data).then(res => res.data),

  // Correspond à GET /comments (publique)
  getComments: (params?: QueryCommentDto): Promise<PaginatedCommentsResponse> =>
    apiClient.get('/comments', { params }).then(res => res.data),

  // Correspond à GET /comments/:id (publique)
  getCommentById: (id: string): Promise<Comment> =>
    apiClient.get(`/comments/${id}`).then(res => res.data),

  // Correspond à GET /comments/content/:contentType/:contentId (publique)
  getCommentsByContent: (
    contentType: string,
    contentId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedCommentsResponse> =>
    apiClient.get(`/comments/content/${contentType}/${contentId}`, { params }).then(res => res.data),

  // Correspond à PATCH /comments/:id (protégé)
  updateComment: (id: string, data: UpdateCommentDto): Promise<Comment> =>
    apiClient.patch(`/comments/${id}`, data).then(res => res.data),

  // Correspond à DELETE /comments/:id (protégé)
  removeComment: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/comments/${id}`).then(res => res.data),
};