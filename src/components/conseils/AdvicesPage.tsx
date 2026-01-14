/* eslint-disable react-hooks/exhaustive-deps */
'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useMemo, useEffect, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Search, Filter, Star, ChevronDown, X, MapPin,
  Calendar, Clock, Users, Eye, MessageCircle, Heart, Grid, List,
  ChevronRight, Loader2, Bookmark, Share2, Check, Sparkles,
  TrendingUp, AlertTriangle, Lock, LogIn, Flame, Info,
  FilterIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// API & Types
import { advicesApi, reactionsApi } from '@/lib/api-endponts';
import { categoriesApi } from '@/lib/api-endponts';
import {
  Advice,
  AdviceStatus,
  Priority,
  TargetAudience,
  QueryAdviceDto,
  PaginatedAdvicesResponse,
} from '@/types/advice';
import { Category, PaginatedCategoriesResponse } from '@/types/category';
import { ContentType, ReactionType } from '@/types/reaction';

// Composants & Hooks
import Navbar from '@/components/shared/Navbar';
import { getCategoryIcon, getCategoryColor } from '@/components/home/utils/category-utils';
import { useBookmarksCheck, useToggleBookmark } from '@/hooks/useBookmarks';

// ==========================================
// UTILITAIRES
// ==========================================

function useDebounce(value: string, delay?: number): string {
  const [debouncedValue, setDebouncedValue] = useState<string>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay || 500);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// ==========================================
// SOUS-COMPOSANTS
// ==========================================

function AdviceCard({
  advice,
  isBookmarked,
  isLiked,
  onBookmarkToggle,
  onLikeToggle,
  isAuthenticated,
  onLoginPrompt,
  onClick
}: {
  advice: Advice;
  isBookmarked: boolean;
  isLiked: boolean;
  onBookmarkToggle: () => void;
  onLikeToggle: () => void;
  isAuthenticated: boolean;
  onLoginPrompt: () => void;
  onClick?: () => void;
}) {
  const router = useRouter();

  // Nettoyage simple de l'excerpt
  const excerpt =
    advice.content && advice.content.length > 100
      ? advice.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...'
      : advice.content?.substring(0, 100).replace(/<[^>]*>/g, '') || '';

  const handleViewDetails = () => {
    const slug = (advice as any).slug || advice.id;
    router.push(`/conseils/${slug}`);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/conseils/${advice.id}`;
    if (navigator.share) navigator.share({ title: advice.title, url });
    else {
      navigator.clipboard.writeText(url);
      toast('Lien copié !', { icon: '📋' });
    }
  };

  const handleBookmarkClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return onLoginPrompt();
    onBookmarkToggle();
  };

  const handleLikeClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return onLoginPrompt();
    onLikeToggle();
  };

  const getPriorityInfo = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT:
        return { label: 'Urgent', color: 'text-red-600 bg-red-50 border-red-200', icon: AlertTriangle };
      case Priority.HIGH:
        return { label: 'Haute', color: 'text-orange-600 bg-orange-50 border-orange-200', icon: Flame };
      case Priority.MEDIUM:
        return { label: 'Moyenne', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: TrendingUp };
      default:
        return { label: 'Normale', color: 'text-gray-600 bg-gray-50 border-gray-200', icon: Info };
    }
  };

  const priorityInfo = getPriorityInfo(advice.priority);
  const PriorityIcon = priorityInfo.icon;

  return (
    <motion.div
      onClick={onClick || handleViewDetails}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer relative"
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-xl sm:text-2xl border border-gray-100 shadow-sm">
                {advice.icon || '💡'}
              </div>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full bg-linear-to-r ${getCategoryColor(
                    advice.category?.name || '',
                  )} text-white shadow-sm`}
                >
                  {getCategoryIcon(advice.category?.name)} {advice.category?.name}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full border ${priorityInfo.color}`}
                >
                  <PriorityIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" /> {priorityInfo.label}
                </span>
              </div>
            </div>

            <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight mb-2 line-clamp-2">
              {advice.title}
            </h3>
            {excerpt && <p className="text-gray-600 text-sm line-clamp-2 mb-3">{excerpt}</p>}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Users className="h-3.5 w-3.5 mr-1 text-teal-600" />
            {advice.organization?.name}
          </div>
          {advice.publishedAt && (
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1 text-teal-600" />
              {new Date(advice.publishedAt).toLocaleDateString('fr-FR')}
            </div>
          )}
          <div className="flex items-center">
            <Eye className="h-3.5 w-3.5 mr-1 text-teal-600" />
            {advice.viewsCount}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button
              onClick={handleLikeClick}
              className={`flex items-center text-sm transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              <span>{advice.reactionsCount}</span>
            </button>
            <button onClick={handleViewDetails} className="flex items-center text-gray-400 hover:text-blue-500 transition-colors text-sm">
              <MessageCircle className="h-4 w-4 mr-1" />
            </button>
            <button onClick={handleShare} className="flex items-center text-gray-400 hover:text-green-500 transition-colors text-sm">
              <Share2 className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">{advice.sharesCount || 0}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleBookmarkClick} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
            </button>
            <button
              onClick={handleViewDetails}
              className="text-teal-600 text-sm font-medium flex items-center hover:text-teal-700"
            >
              Voir plus <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FiltersBar({
  activeFiltersCount,
  onOpenFilters,
  searchTerm,
  onSearchChange,
}: {
  activeFiltersCount: number;
  onOpenFilters: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}) {
  return (
    <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un conseil (ex: diabète, sommeil)..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={onOpenFilters}
            className="flex items-center px-4 py-2.5 bg-linear-to-r from-teal-500 to-teal-600 text-white text-sm font-medium rounded-full hover:from-teal-600 hover:to-teal-700 shadow-md"
          >
            <Filter className="h-4 w-4 mr-2" /> Filtres{' '}
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-white text-teal-600 text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  onResetFilters,
  searchTerm,
}: {
  onResetFilters: () => void;
  searchTerm: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Search className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun conseil trouvé</h3>
      <p className="text-gray-600 mb-6 max-w-md">
        {searchTerm
          ? `Aucun résultat pour "${searchTerm}". Essayez d'autres mots-clés.`
          : "Aucun conseil ne correspond à vos critères actuels."}
      </p>
      <button
        onClick={onResetFilters}
        className="px-6 py-2.5 bg-white text-teal-600 font-medium rounded-full border border-teal-600 hover:bg-teal-50 transition-colors flex items-center"
      >
        <X className="h-4 w-4 mr-2" /> Réinitialiser les filtres
      </button>
    </div>
  );
}

// ==========================================
// PAGE PRINCIPALE
// ==========================================

export default function AdvicesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // États UI
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [likedAdviceIds, setLikedAdviceIds] = useState<Set<string>>(new Set());

  // ==========================================
  // LOGIQUE D'AUTHENTIFICATION
  // ==========================================
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (!authStorage) {
          setIsAuthenticated(false);
          return;
        }
        const { state } = JSON.parse(authStorage);
        setIsAuthenticated(!!state.accessToken);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuthStatus();

    const handleStorageChange = () => checkAuthStatus();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Filtres
  const [filters, setFilters] = useState<{
    category?: string;
    priority?: Priority;
    targetAudience?: TargetAudience;
  }>({});

  // ==========================================
  // DATA FETCHING
  // ==========================================

  // 1. Catégories
  const { data: categoriesResponse } = useQuery<PaginatedCategoriesResponse>({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getCategories({ isActive: true }),
    staleTime: 1000 * 60 * 10,
  });
  const categories = categoriesResponse?.data || [];

  // 2. Query DTO
  const queryDto = useMemo<QueryAdviceDto>(() => {
    const dto: QueryAdviceDto = {
      page,
      limit: 10,
      status: AdviceStatus.PUBLISHED,
    };
    if (debouncedSearchTerm) dto.search = debouncedSearchTerm;
    if (filters.category) dto.categoryId = filters.category;
    if (filters.priority) dto.priority = filters.priority;
    if (filters.targetAudience) dto.targetAudience = [filters.targetAudience];
    return dto;
  }, [page, debouncedSearchTerm, filters]);

  // 3. Récupération des Conseils
  const { data: advicesResponse, isLoading, isFetching } =
    useQuery<PaginatedAdvicesResponse>({
      queryKey: ['advices', 'list', queryDto],
      queryFn: () => advicesApi.getAdvices(queryDto),
      placeholderData: (previousData) => previousData,
    });

  const advices = advicesResponse?.data || [];
  const meta = advicesResponse?.meta;
  const totalPages = meta?.totalPages || 1;

  // ==========================================
  // ✅ OPTIMISATION CHECKMANY (BOOKMARKS)
  // ==========================================
  const adviceIds = useMemo(() => advices.map((a) => a.id), [advices]);

  const { data: bookmarksMap } = useBookmarksCheck(
    ContentType.ADVICE,
    adviceIds,
    isAuthenticated
  );

  // ==========================================
  // MUTATIONS
  // ==========================================
  const toggleBookmark = useToggleBookmark();

  const likeMutation = useMutation({
    mutationFn: (adviceId: string) =>
      reactionsApi.create({
        contentType: ContentType.ADVICE,
        contentId: adviceId,
        type: ReactionType.LIKE,
      }),
    onMutate: (adviceId) => {
      setLikedAdviceIds((prev) => new Set(prev).add(adviceId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advices'] });
      toast('Conseil liké !', { icon: '❤️' });
    },
    onError: (error, adviceId) => {
      setLikedAdviceIds((prev) => {
        const next = new Set(prev);
        next.delete(adviceId);
        return next;
      });
      console.error(error);
    },
  });

  // Handlers
  const handleBookmarkToggle = (adviceId: string) => {
    if (!isAuthenticated) {
      setIsLoginPromptOpen(true);
      return;
    }
    toggleBookmark.mutate(ContentType.ADVICE, adviceId, !!bookmarksMap?.[adviceId]);
  };

  const handleLikeToggle = (adviceId: string) => {
    if (!isAuthenticated) {
      setIsLoginPromptOpen(true);
      return;
    }
    if (likedAdviceIds.has(adviceId)) return;
    likeMutation.mutate(adviceId);
  };

  const handleResetFilters = () => {
    setFilters({});
    setSearchTerm('');
    setPage(1);
  };

  const handleLoadMore = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const activeFiltersCount = Object.values(filters).filter((v) => v !== undefined).length;

  // ==========================================
  // COMPOSANTS MODALES
  // ==========================================
  const FiltersModal = () => {
    if (!isFiltersModalOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Filtrer les conseils</h3>
            <button onClick={() => setIsFiltersModalOpen(false)}>
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-sm text-gray-700">Catégories</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilters({ ...filters, category: undefined })}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm border transition-colors ${!filters.category
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Toutes
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilters({ ...filters, category: cat.id })}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm border transition-colors ${filters.category === cat.id
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {getCategoryIcon(cat.name)} {cat.name}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-sm text-gray-700">Priorité</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(Priority).map((priority) => (
                <button
                  key={priority}
                  onClick={() =>
                    setFilters({ ...filters, priority: filters.priority === priority ? undefined : priority })
                  }
                  className={`py-2 rounded-lg text-xs sm:text-sm border transition-colors ${filters.priority === priority
                      ? 'bg-teal-50 border-teal-600 text-teal-700'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={handleResetFilters}
              className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium transition-colors hover:bg-gray-50"
            >
              Effacer
            </button>
            <button
              onClick={() => setIsFiltersModalOpen(false)}
              className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors"
            >
              Voir les résultats
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ✅ NAVBAR */}
      <Navbar />

      {/* ✅ MAIN WRAPPER (PT-16 pour éviter le recouvrement) */}
      <main className="pt-16 md:pt-20">
        
        {/* Hero Section */}
        <section className="bg-linear-to-r from-teal-600 to-teal-400 px-4 py-8 sm:py-12 mb-4">
          <div className="text-center text-white">
            <h1 className="text-3xl sm:text-4xl font-black mb-3 flex items-center justify-center">
              <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 mr-3" /> Conseils Santé
            </h1>
            <p className="text-base sm:text-lg font-medium text-white/90 max-w-2xl mx-auto">
              Des astuces pratiques et recommandations pour prendre soin de votre santé au quotidien.
            </p>
          </div>
        </section>

        <FiltersBar
          activeFiltersCount={activeFiltersCount}
          onOpenFilters={() => setIsFiltersModalOpen(true)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Stats & View Toggle */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            <span className="font-bold text-gray-900">{meta?.total || 0}</span> conseil
            {meta?.total !== 1 && 's'}
          </span>
          <div className="flex bg-gray-200 rounded-lg p-1 shadow-inner">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
          {isLoading && page === 1 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-teal-600 animate-spin mb-4" />
              <span className="text-gray-500">Chargement des conseils...</span>
            </div>
          ) : advices.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {advices.map((advice) => (
                    <motion.div
                      key={advice.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: advice.id.length * 0.05 }}
                    >
                      <AdviceCard
                        advice={advice}
                        isBookmarked={!!bookmarksMap?.[advice.id]}
                        isLiked={likedAdviceIds.has(advice.id)}
                        onBookmarkToggle={() => handleBookmarkToggle(advice.id)}
                        onLikeToggle={() => handleLikeToggle(advice.id)}
                        isAuthenticated={isAuthenticated}
                        onLoginPrompt={() => setIsLoginPromptOpen(true)}
                        onClick={() => router.push(`/conseils/${advice.id}`)}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {advices.map((advice) => (
                      <motion.div
                        key={advice.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        layout
                      >
                        <AdviceCard
                          advice={advice}
                          isBookmarked={!!bookmarksMap?.[advice.id]}
                          isLiked={likedAdviceIds.has(advice.id)}
                          onBookmarkToggle={() => handleBookmarkToggle(advice.id)}
                          onLikeToggle={() => handleLikeToggle(advice.id)}
                          isAuthenticated={isAuthenticated}
                          onLoginPrompt={() => setIsLoginPromptOpen(true)}
                          onClick={() => router.push(`/conseils/${advice.id}`)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {page < totalPages && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    disabled={isFetching}
                    className="px-8 py-3 bg-white text-teal-600 font-medium rounded-full border border-teal-600 hover:bg-teal-50 transition-all flex items-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFetching ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}{' '}
                    Charger plus de conseils
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState onResetFilters={handleResetFilters} searchTerm={searchTerm} />
          )}
        </div>
      </main>

      <FiltersModal />

      {/* Modale Connexion */}
      <AnimatePresence>
        {isLoginPromptOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Connexion requise</h3>
              <p className="text-gray-600 mb-6">
                Vous devez être connecté pour interagir avec les conseils.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => (window.location.href = '/auth/connexion')}
                  className="w-full py-2.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700"
                >
                  Se connecter
                </button>
                <button
                  onClick={() => setIsLoginPromptOpen(false)}
                  className="w-full py-2.5 bg-white text-gray-700 border border-gray-300 rounded-xl font-bold hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
