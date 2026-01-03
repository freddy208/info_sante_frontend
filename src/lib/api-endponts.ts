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
import { GeocodeDto, GeocodeResult, ReverseGeocodeDto, CreateLocationDto, UpdateLocationDto, Location } from '@/types/location';
import { CreateCommentDto, QueryCommentDto, PaginatedCommentsResponse, UpdateCommentDto, Comment } from '@/types/comment';

export const authApi = {
  register: (data: RegisterDto): Promise<AuthResponse> =>
    apiClient.post('/auth/register', data).then(res => res.data),

  login: (data: LoginDto): Promise<AuthResponse> =>
    apiClient.post('/auth/login', data).then(res => res.data),

  refreshToken: (data: RefreshTokenDto): Promise<{ accessToken: string }> =>
    apiClient.post('/auth/refresh', data).then(res => res.data),

  getProfile: (): Promise<User> =>
    apiClient.get('/auth/me').then(res => res.data),

  logout: (): Promise<{ message: string }> =>
    apiClient.post('/auth/logout').then(res => res.data),
};

// =====================================
// 📂 CATEGORIES API
// =====================================

export const categoriesApi = {
  getCategories: (params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    includeChildren?: boolean;
    parentOnly?: boolean;
  }): Promise<PaginatedCategoriesResponse> =>
    apiClient.get('/categories', { params }).then(res => res.data),

  getCategoryByIdentifier: (identifier: string): Promise<Category> =>
    apiClient.get(`/categories/${identifier}`).then(res => res.data),

  createCategory: (data: CreateCategoryDto): Promise<Category> =>
    apiClient.post('/categories', data).then(res => res.data),

  updateCategory: (id: string, data: UpdateCategoryDto): Promise<Category> =>
    apiClient.patch(`/categories/${id}`, data).then(res => res.data),

  removeCategory: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/categories/${id}`).then(res => res.data),

  activateCategory: (id: string): Promise<Category> =>
    apiClient.patch(`/categories/${id}/activate`).then(res => res.data),
};

// =====================================
// 🏥 ORGANIZATIONS API
// =====================================

export const organizationsApi = {
  register: (data: RegisterOrganizationDto): Promise<OrganizationAuthResponse> =>
    apiClient.post('/organizations/register', data).then(res => res.data),

  login: (data: LoginOrganizationDto): Promise<OrganizationAuthResponse> =>
    apiClient.post('/organizations/login', data).then(res => res.data),

  refreshToken: (refreshToken: string): Promise<RefreshTokenResponse> =>
    apiClient.post('/organizations/refresh', { refreshToken }).then(res => res.data),

  getProfile: (): Promise<Organization> =>
    apiClient.get('/organizations/me').then(res => res.data),

  updateProfile: (data: UpdateOrganizationDto): Promise<Organization> =>
    apiClient.patch('/organizations/me', data).then(res => res.data),

  updatePassword: (data: UpdatePasswordDto): Promise<{ message: string }> =>
    apiClient.patch('/organizations/me/password', data).then(res => res.data),

  // ✅ CORRECTION : Ajout de page et limit pour la cohérence Backend
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

  getOrganizationById: (id: string): Promise<Organization> =>
    apiClient.get(`/organizations/${id}`).then(res => res.data),

  addMember: (data: CreateMemberDto): Promise<OrganizationMember> =>
    apiClient.post('/organizations/me/members', data).then(res => res.data),

  getMembers: (): Promise<OrganizationMember[]> =>
    apiClient.get('/organizations/me/members').then(res => res.data),

  updateMember: (id: string, data: UpdateMemberDto): Promise<OrganizationMember> =>
    apiClient.patch(`/organizations/me/members/${id}`, data).then(res => res.data),

  removeMember: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/organizations/me/members/${id}`).then(res => res.data),
};

// =====================================
// 📢 ANNOUNCEMENTS API
// =====================================

export const announcementsApi = {
  create: (data: CreateAnnouncementDto): Promise<Announcement> =>
    apiClient.post('/announcements', data).then(res => res.data),

  getAnnouncements: (params?: QueryAnnouncementDto): Promise<PaginatedAnnouncementsResponse> =>
    apiClient.get('/announcements', { params }).then(res => res.data),

  getMyAnnouncements: (params?: QueryAnnouncementDto): Promise<PaginatedAnnouncementsResponse> =>
    apiClient.get('/announcements/my', { params }).then(res => res.data),

  getAnnouncementById: (idOrSlug: string): Promise<Announcement> =>
    apiClient.get(`/announcements/${idOrSlug}`).then(res => res.data),

  updateAnnouncement: (id: string, data: UpdateAnnouncementDto): Promise<Announcement> =>
    apiClient.patch(`/announcements/${id}`, data).then(res => res.data),

  publishAnnouncement: (id: string): Promise<Announcement> =>
    apiClient.patch(`/announcements/${id}/publish`).then(res => res.data),

  removeAnnouncement: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/announcements/${id}`).then(res => res.data),
};

// =====================================
// 📰 ARTICLES API
// =====================================

export const articlesApi = {
  create: (data: CreateArticleDto): Promise<Article> =>
    apiClient.post('/articles', data).then(res => res.data),

  getArticles: (params?: QueryArticleDto): Promise<PaginatedArticlesResponse> =>
    apiClient.get('/articles', { params }).then(res => res.data),

  getMyArticles: (params?: QueryArticleDto): Promise<PaginatedArticlesResponse> =>
    apiClient.get('/articles/my', { params }).then(res => res.data),

  getArticleById: (idOrSlug: string): Promise<Article> =>
    apiClient.get(`/articles/${idOrSlug}`).then(res => res.data),

  updateArticle: (id: string, data: UpdateArticleDto): Promise<Article> =>
    apiClient.patch(`/articles/${id}`, data).then(res => res.data),

  publishArticle: (id: string): Promise<Article> =>
    apiClient.patch(`/articles/${id}/publish`).then(res => res.data),

  featureArticle: (id: string, isFeatured: boolean): Promise<Article> =>
    apiClient.patch(`/articles/${id}/feature`, { isFeatured }).then(res => res.data),

  removeArticle: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/articles/${id}`).then(res => res.data),
};

// =====================================
// 💡 ADVICES API
// =====================================

export const advicesApi = {
  create: (data: CreateAdviceDto): Promise<Advice> =>
    apiClient.post('/advices', data).then(res => res.data),

  getAdvices: (params?: QueryAdviceDto): Promise<PaginatedAdvicesResponse> =>
    apiClient.get('/advices', { params }).then(res => res.data),

  getMyAdvices: (params?: QueryAdviceDto): Promise<PaginatedAdvicesResponse> =>
    apiClient.get('/advices/my', { params }).then(res => res.data),

  getAdviceById: (id: string): Promise<Advice> =>
    apiClient.get(`/advices/${id}`).then(res => res.data),

  updateAdvice: (id: string, data: UpdateAdviceDto): Promise<Advice> =>
    apiClient.patch(`/advices/${id}`, data).then(res => res.data),

  publishAdvice: (id: string): Promise<Advice> =>
    apiClient.patch(`/advices/${id}/publish`).then(res => res.data),

  archiveAdvice: (id: string): Promise<Advice> =>
    apiClient.patch(`/advices/${id}/archive`).then(res => res.data),

  updateAdvicePriority: (id: string, priority: Priority): Promise<Advice> =>
    apiClient.patch(`/advices/${id}/priority`, { priority }).then(res => res.data),

  getAdviceStats: (): Promise<AdviceStats> =>
    apiClient.get('/advices/stats').then(res => res.data),

  removeAdvice: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/advices/${id}`).then(res => res.data),
};

// =====================================
// ☁️ UPLOADS API
// =====================================

export const uploadsApi = {
  uploadImage: (file: File, data: UploadImageDto): Promise<Media> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contentType', data.contentType);
    if (data.contentId) {
      formData.append('contentId', data.contentId);
    }
    return apiClient.post('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data);
  },

  uploadDocument: (file: File, data: UploadDocumentDto): Promise<Media> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contentType', data.contentType);
    if (data.contentId) {
      formData.append('contentId', data.contentId);
    }
    return apiClient.post('/uploads/document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data);
  },

  getMyUploads: (params?: {
    page?: number;
    limit?: number;
    contentType?: ContentType;
  }): Promise<PaginatedMediasResponse> =>
    apiClient.get('/uploads/my', { params }).then(res => res.data),

  getMediaById: (id: string): Promise<Media> =>
    apiClient.get(`/uploads/${id}`).then(res => res.data),

  removeMedia: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/uploads/${id}`).then(res => res.data),
};

// =====================================
// 📍 LOCATION API
// =====================================

export const locationsApi = {
  geocode: (params: GeocodeDto): Promise<GeocodeResult[]> =>
    apiClient.get('/location/geocode', { params }).then(res => res.data),

  reverseGeocode: (params: ReverseGeocodeDto): Promise<GeocodeResult> =>
    apiClient.get('/location/reverse-geocode', { params }).then(res => res.data),

  create: (data: CreateLocationDto): Promise<Location> =>
    apiClient.post('/location', data).then(res => res.data),

  findByContentId: (contentId: string): Promise<Location> =>
    apiClient.get(`/location/${contentId}`).then(res => res.data),

  update: (contentId: string, data: UpdateLocationDto): Promise<Location> =>
    apiClient.patch(`/location/${contentId}`, data).then(res => res.data),

  remove: (contentId: string): Promise<{ message: string }> =>
    apiClient.delete(`/location/${contentId}`).then(res => res.data),
};

// =====================================
// 💬 COMMENTS API
// =====================================

export const commentsApi = {
  create: (data: CreateCommentDto): Promise<Comment> =>
    apiClient.post('/comments', data).then(res => res.data),

  getComments: (params?: QueryCommentDto): Promise<PaginatedCommentsResponse> =>
    apiClient.get('/comments', { params }).then(res => res.data),

  getCommentById: (id: string): Promise<Comment> =>
    apiClient.get(`/comments/${id}`).then(res => res.data),

  getCommentsByContent: (
    contentType: string,
    contentId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedCommentsResponse> =>
    apiClient.get(`/comments/content/${contentType}/${contentId}`, { params }).then(res => res.data),

  updateComment: (id: string, data: UpdateCommentDto): Promise<Comment> =>
    apiClient.patch(`/comments/${id}`, data).then(res => res.data),

  removeComment: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/comments/${id}`).then(res => res.data),
};