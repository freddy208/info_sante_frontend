'use client';

 
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useMemo, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Search, Filter, Star, ChevronDown, X, Calendar, Clock,
  Eye, MessageCircle, Heart, Grid, List, ChevronRight, Loader2,
  Bookmark, Share2, Check, Zap, Info, Lock, User, FileText
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// API & Types
import { articlesApi } from '@/lib/api-endponts';
import { categoriesApi } from '@/lib/api-endponts';
import { reactionsApi } from '@/lib/api-endponts';
import {
  Article,
  ArticleStatus,
  QueryArticleDto,
  PaginatedArticlesResponse,
} from '@/types/article';
import { Category, PaginatedCategoriesResponse } from '@/types/category';
import { ContentType, ReactionType } from '@/types/reaction';

// Utilities
import { getCategoryIcon, getCategoryColor } from '@/components/home/utils/category-utils';
import { getCloudinaryImageUrl } from '@/lib/cloudinary';

// ✅ HOOKS OPTIMISÉS
import { useBookmarksCheck, useToggleBookmark } from '@/hooks/useBookmarks'; // Utilise checkMany en interne
import { useReactionStats } from '@/hooks/useReactions';

// ==========================================
// 🛑 HOOK DEBOUNCE
// ==========================================
function useDebounce(value: string, delay: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// ==========================================
// SOUS-COMPOSANTS
// ==========================================

// --- CARTE LISTE ---
function ArticleCard({
  article,
  isBookmarked,
  onBookmarkToggle,
  onLike,
  isAuthenticated,
  onLoginPrompt,
}: {
  article: Article;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  onLike: () => void;
  isAuthenticated: boolean;
  onLoginPrompt: () => void;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();

  const handleViewArticle = () => router.push(`/articles/${article.slug || article.id}`);

  const handleShare = () => {
    const url = `${window.location.origin}/articles/${article.slug}`;
    if (navigator.share) navigator.share({ title: article.title, url });
    else { navigator.clipboard.writeText(url); toast('Lien copié !', { icon: '📋' }); }
  };

  const handleBookmarkClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); e.stopPropagation();
    if (!isAuthenticated) return onLoginPrompt();
    onBookmarkToggle();
  };

  const handleLikeClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); e.stopPropagation();
    if (!isAuthenticated) return onLoginPrompt();
    setIsLiked(!isLiked); // Optimistic UI
    onLike();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row cursor-pointer group"
      onClick={handleViewArticle}
    >
      {/* Image */}
      <div className="relative w-full sm:w-48 sm:h-40 h-56 shrink-0">
        <img
          src={getCloudinaryImageUrl(article.featuredImage, { width: 400, height: 300, crop: 'fill' })}
          alt={article.title}
          className="w-full h-full object-cover"
          loading="lazy" // ✅ Lazy loading pour les listes
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className={`inline-flex items-center px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded-full bg-linear-to-r ${getCategoryColor(article.category?.name || '')} text-white shadow-sm`}>
            {getCategoryIcon(article.category?.name)} {article.category?.name}
          </span>
          {article.isFeatured && (
            <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-amber-400 text-white shadow-sm">
              <Star className="h-2.5 w-2.5 mr-0.5" /> Vedette
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="absolute bottom-3 right-3 flex space-x-1.5">
          <button onClick={handleBookmarkClick} className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors" aria-label="Favori">
            <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} />
          </button>
          <button onClick={handleShare} className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white">
            <Share2 className="h-3.5 w-3.5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Meta */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-xs font-medium text-teal-600 uppercase tracking-wide">{article.category?.name}</span>
            <div className="flex items-center text-gray-400"><Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" /><span className="text-xs">{article.readingTime || 5} min</span></div>
          </div>

          {/* Titre */}
          <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-snug line-clamp-2 mb-2">{article.title}</h3>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{article.excerpt}</p>

          {/* Author & Org */}
          <div className="flex items-center mb-4">
            <div className="relative w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2.5">
              {article.organization?.logo ? <img src={article.organization.logo} alt="Logo" className="w-full h-full object-cover rounded-full" /> : <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />}
              {article.organization?.isVerified && <div className="absolute -bottom-0.5 -right-0.5 bg-blue-500 rounded-full p-0.5 sm:p-1 border border-white"><Check className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-white" /></div>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">{article.author || article.organization?.name}</p>
              <p className="text-[10px] sm:text-xs text-gray-500">{article.organization?.name}</p>
            </div>
            <div className="text-[10px] sm:text-xs text-gray-500">{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
          <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center hover:text-gray-700 transition-colors"><Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />{formatNumber(article.viewsCount)}</div>
            <div className="flex items-center hover:text-gray-700 transition-colors"><MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />{article.commentsCount}</div>
            <button onClick={handleLikeClick} className={`flex items-center space-x-1 transition-all duration-200 ${isLiked ? 'text-red-500 scale-110' : 'hover:text-red-500'}`}>
              <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{formatNumber(article.reactionsCount)}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// --- CARTE GRILLE (Même logique optimisée) ---
function ArticleGridCard({
  article,
  isBookmarked,
  onBookmarkToggle,
  onLike,
  isAuthenticated,
  onLoginPrompt,
}: {
  article: Article;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  onLike: () => void;
  isAuthenticated: boolean;
  onLoginPrompt: () => void;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();

  const handleViewArticle = () => router.push(`/articles/${article.slug || article.id}`);
  const handleBookmarkClick = (e: MouseEvent<HTMLButtonElement>) => { e.preventDefault(); e.stopPropagation(); if (!isAuthenticated) return onLoginPrompt(); onBookmarkToggle(); };
  const handleLikeClick = (e: MouseEvent<HTMLButtonElement>) => { e.preventDefault(); e.stopPropagation(); if (!isAuthenticated) return onLoginPrompt(); setIsLiked(!isLiked); onLike(); };

  return (
    <motion.article initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -5 }} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <div className="relative h-40 sm:h-48">
        <img src={getCloudinaryImageUrl(article.featuredImage, { width: 400, height: 300, crop: 'fill' })} alt={article.title} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full bg-linear-to-r ${getCategoryColor(article.category?.name || '')} text-white shadow-sm`}>{getCategoryIcon(article.category?.name)}</span>
          {article.isFeatured && <Star className="h-3 w-3 text-amber-500 fill-current shadow-sm" />}
        </div>
        <button onClick={handleBookmarkClick} className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all"><Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} /></button>
      </div>
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 mb-2">{article.title}</h3>
        <div className="flex items-center mb-3">
          <div className="relative w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2">{article.organization?.logo ? <img src={article.organization.logo} className="w-full h-full object-cover rounded-full" /> : <User className="h-3 w-3 text-gray-400" />}</div>
          <div className="flex-1 min-w-0"><p className="text-xs font-medium text-gray-900 truncate">{article.author}</p></div>
        </div>
        <div className="mt-auto pt-3 border-t border-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2"><div className="flex items-center"><Clock className="h-3 w-3 mr-1" />{article.readingTime} min</div><div className="flex items-center"><Eye className="h-3 w-3 mr-1" />{formatNumber(article.viewsCount)}</div></div>
          <button onClick={handleViewArticle} className="w-full py-1.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full hover:bg-teal-100 transition-colors flex items-center justify-center">Lire l&apos;article</button>
        </div>
      </div>
    </motion.article>
  );
}

// --- BARRE DE RECHERCHE & FILTRES ---
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
    <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input type="text" placeholder="Rechercher un article..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
            {searchTerm && <button onClick={() => onSearchChange('')} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>}
          </div>
          <button onClick={onOpenFilters} className="flex items-center px-4 py-2 bg-linear-to-r from-teal-500 to-teal-600 text-white text-sm font-medium rounded-full hover:from-teal-600 hover:to-teal-700 shadow-md">
            <Filter className="h-4 w-4 mr-2" /> Filtres {activeFiltersCount > 0 && <span className="ml-2 bg-white text-teal-600 text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">{activeFiltersCount}</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- ÉTAT VIDE ---
function EmptyState({ onResetFilters, searchTerm }: { onResetFilters: () => void; searchTerm: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4"><FileText className="h-10 w-10 text-gray-400" /></div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun article trouvé</h3>
      <p className="text-gray-600 mb-6 max-w-md">{searchTerm ? `Aucun résultat pour "${searchTerm}". Essayez d'autres mots-clés.` : "Aucun article ne correspond à vos critères actuels."}</p>
      <button onClick={onResetFilters} className="px-6 py-2.5 bg-white text-teal-600 font-medium rounded-full border border-teal-600 hover:bg-teal-50 transition-colors flex items-center"><X className="h-4 w-4 mr-2" /> Réinitialiser les filtres</button>
    </div>
  );
}

// ==========================================
// PAGE PRINCIPALE
// ==========================================

export default function ArticlesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryIdParam = searchParams.get('categoryId');
  const searchParam = searchParams.get('search');

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [filters, setFilters] = useState<{ category?: string; readingTime?: string; date?: string }>({});
  const queryClient = useQueryClient();

  // Auth Check
  useEffect(() => {
    const checkAuthStatus = () => {
      try { const authStorage = localStorage.getItem('auth-storage'); if (!authStorage) { setIsAuthenticated(false); return; } const { state } = JSON.parse(authStorage); setIsAuthenticated(!!state.token); } catch { setIsAuthenticated(false); }
    };
    checkAuthStatus();
    const handleStorageChange = () => checkAuthStatus();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync URL -> State
  useEffect(() => {
    if (categoryIdParam) setFilters(prev => ({ ...prev, category: categoryIdParam }));
    if (searchParam) setSearchTerm(searchParam);
  }, [categoryIdParam, searchParam]);

  // DATA FETCHING
  
  // 1. CATÉGORIES (Static mostly)
  const { data: categoriesResponse } = useQuery<PaginatedCategoriesResponse>({
    queryKey: ['categories'], queryFn: () => categoriesApi.getCategories({ isActive: true }), staleTime: 1000 * 60 * 10,
  });
  const categories = categoriesResponse?.data || [];

  // 2. ARTICLES (Server side filtering only: search, category, page)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const queryDto = useMemo<QueryArticleDto>(() => ({
    page, limit: 12, status: ArticleStatus.PUBLISHED,
    ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
    ...(filters.category && { categoryId: filters.category }),
  }), [page, debouncedSearchTerm, filters.category]);

  const { data: articlesResponse, isLoading, isFetching } = useQuery<PaginatedArticlesResponse>({
    queryKey: ['articles', 'list', queryDto],
    queryFn: () => articlesApi.getArticles(queryDto),
    placeholderData: (previousData) => previousData,
  });

  const articles = articlesResponse?.data || [];
  const meta = articlesResponse?.meta;
  const totalPages = meta?.totalPages || 1;

  // ✅ OPTIMISATION CRITIQUE : CheckMany pour Favoris
  const articleIds = useMemo(() => articles.map(a => a.id), [articles]);
  const { data: bookmarksMap } = useBookmarksCheck(ContentType.ARTICLE, articleIds, isAuthenticated);

  // CLIENT-SIDE FILTERING (Date, ReadingTime)
  const displayArticles = useMemo(() => {
    let filtered = [...articles];
    if (filters.readingTime === 'short') filtered = filtered.filter(a => (a.readingTime || 0) < 5);
    else if (filters.readingTime === 'medium') filtered = filtered.filter(a => (a.readingTime || 0) >= 5 && (a.readingTime || 0) <= 10);
    else if (filters.readingTime === 'long') filtered = filtered.filter(a => (a.readingTime || 0) > 10);

    const now = new Date();
    if (filters.date === 'week') { const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); filtered = filtered.filter(a => new Date(a.publishedAt || now) >= weekAgo); }
    else if (filters.date === 'month') { const monthAgo = new Date(now.setMonth(now.getMonth() - 1)); filtered = filtered.filter(a => new Date(a.publishedAt || now) >= monthAgo); }
    else if (filters.date === 'year') { const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1)); filtered = filtered.filter(a => new Date(a.publishedAt || now) >= yearAgo); }

    return filtered;
  }, [articles, filters]);

  // ✅ CORRECTION COMPTEUR : Affiche le réel nombre filtré si filtres client actifs
  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined).length;
  const totalDisplayCount = activeFiltersCount > 0 && (filters.readingTime || filters.date) ? displayArticles.length : (meta?.total || 0);

  // MUTATIONS
  const toggleBookmark = useToggleBookmark();
  const toggleLikeMutation = useMutation({
    mutationFn: (contentId: string) => reactionsApi.create({ contentType: ContentType.ARTICLE, contentId, type: ReactionType.LIKE }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['articles'] }); toast('J\'aime enregistré !'); },
  });

  // HANDLERS
  const handleResetFilters = () => { setFilters({}); setSearchTerm(''); setPage(1); };
  const handleBookmarkToggle = (contentId: string) => toggleBookmark.mutate(ContentType.ARTICLE, contentId, !!bookmarksMap?.[contentId]);
  const handleLike = (contentId: string) => toggleLikeMutation.mutate(contentId);
  const handleLoadMore = () => { if (page < totalPages) setPage(p => p + 1); };

  // MODAL FILTRES
  const FiltersModal = () => {
    if (!isFiltersModalOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
        <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">Filtrer</h3><button onClick={() => setIsFiltersModalOpen(false)}><X className="h-6 w-6 text-gray-500" /></button></div>
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-sm text-gray-700">Catégories</h4>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setFilters({ ...filters, category: undefined })} className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${!filters.category ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Toutes</button>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => setFilters({ ...filters, category: cat.id })} className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${filters.category === cat.id ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>{getCategoryIcon(cat.name)} {cat.name}</button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-sm text-gray-700">Temps de lecture</h4>
            <div className="flex gap-2">
              {[
                { id: 'short', label: 'Rapide (< 5 min)' }, 
                { id: 'medium', label: 'Moyen (5-10 min)' }, 
                { id: 'long', label: 'Long (> 10 min)' }
              ].map(t => (
                <button key={t.id} onClick={() => setFilters({ ...filters, readingTime: filters.readingTime === t.id ? undefined : t.id })} className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${filters.readingTime === t.id ? 'bg-teal-50 border-teal-600 text-teal-700' : 'bg-white text-gray-600'}`}>{t.label}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={handleResetFilters} className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium transition-colors hover:bg-gray-50">Effacer</button>
            <button onClick={() => setIsFiltersModalOpen(false)} className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors">Voir les résultats</button>
          </div>
        </motion.div>
      </div>
    );
  };

  // RENDU
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors"><ArrowLeft className="h-5 w-5 text-gray-700" /></button>
          <h1 className="text-lg font-semibold text-gray-900">Articles de Santé</h1>
          <div className="w-9" />
        </div>
      </header>

      <FiltersBar activeFiltersCount={activeFiltersCount} onOpenFilters={() => setIsFiltersModalOpen(true)} searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <div className="px-4 py-3 max-w-7xl mx-auto flex justify-between items-center">
        <span className="text-sm text-gray-600">{totalDisplayCount} article{totalDisplayCount !== 1 && 's'} trouvé{totalDisplayCount !== 1 && 's'}</span>
        <div className="flex bg-gray-200 rounded-lg p-1">
          <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}><List className="h-4 w-4" /></button>
          <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}><Grid className="h-4 w-4" /></button>
        </div>
      </div>

      <main className="pb-20 max-w-7xl mx-auto px-4 sm:px-6">
        {isLoading && page === 1 ? (
          <div className="flex flex-col items-center justify-center py-20"><Loader2 className="h-8 w-8 text-teal-600 animate-spin mb-4" /><span className="text-gray-500">Chargement...</span></div>
        ) : displayArticles.length > 0 ? (
          <>
            {viewMode === 'list' ? (
              <div className="space-y-6">
                <AnimatePresence>{displayArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} isBookmarked={!!bookmarksMap?.[article.id]} onBookmarkToggle={() => handleBookmarkToggle(article.id)} onLike={() => handleLike(article.id)} isAuthenticated={isAuthenticated} onLoginPrompt={() => setIsLoginPromptOpen(true)} />
                ))}</AnimatePresence>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence>{displayArticles.map((article) => (
                  <ArticleGridCard key={article.id} article={article} isBookmarked={!!bookmarksMap?.[article.id]} onBookmarkToggle={() => handleBookmarkToggle(article.id)} onLike={() => handleLike(article.id)} isAuthenticated={isAuthenticated} onLoginPrompt={() => setIsLoginPromptOpen(true)} />
                ))}</AnimatePresence>
              </div>
            )}

            {page < totalPages && (
              <div className="flex justify-center mt-10">
                <button onClick={handleLoadMore} disabled={isFetching} className="px-8 py-3 bg-white text-teal-600 font-medium rounded-full border border-teal-600 hover:bg-teal-50 transition-all flex items-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {isFetching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Charger plus d&apos;articles
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState onResetFilters={handleResetFilters} searchTerm={searchTerm} />
        )}
      </main>

      <FiltersModal />

      <AnimatePresence>
        {isLoginPromptOpen && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Lock className="h-8 w-8 text-gray-600" /></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Connexion requise</h3>
              <p className="text-gray-600 mb-6">Vous devez être connecté pour interagir avec cet article.</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => (window.location.href = '/login')} className="w-full py-2.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700">Se connecter</button>
                <button onClick={() => setIsLoginPromptOpen(false)} className="w-full py-2.5 bg-white text-gray-700 border border-gray-300 rounded-xl font-bold hover:bg-gray-50">Annuler</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatNumber(num: number): string {
  if (!num) return '0';
  return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
}