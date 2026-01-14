/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useMemo, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Star, ChevronDown, X, Clock,
  Eye, MessageCircle, Heart, Grid, List,
  Bookmark, Share2, Check, Lock, User, FileText,
  RefreshCw // ✅ IMPORT MANQUANT
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Composants & Stores
import Navbar from '@/components/shared/Navbar';
import { useAuthStore } from '@/stores/authStore';

// API & Types
import { articlesApi } from '@/lib/api-endponts';
import { Article, ArticleStatus, QueryArticleDto, PaginatedArticlesResponse } from '@/types/article';
import { ContentType } from '@/types/reaction';

// Utilities
import { getCategoryIcon, getCategoryColor } from '@/components/home/utils/category-utils';
import { getCloudinaryImageUrl } from '@/lib/cloudinary';
import { useBookmarksCheck, useToggleBookmark } from '@/hooks/useBookmarks';

// ==========================================
// 🃏 COMPOSANT CARTE ARTICLE
// ==========================================
function ArticleCard({
  article,
  isBookmarked,
  onBookmarkToggle,
  isAuthenticated,
  onLoginPrompt,
}: {
  article: Article;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  isAuthenticated: boolean;
  onLoginPrompt: () => void;
}) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false); 

  const handleBookmarkClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); e.stopPropagation();
    if (!isAuthenticated) return onLoginPrompt();
    onBookmarkToggle();
  };

  const handleShare = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); e.stopPropagation();
    const url = `${window.location.origin}/articles/${article.slug || article.id}`;
    navigator.clipboard.writeText(url);
    toast.success('Lien copié !');
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row cursor-pointer group"
      onClick={() => router.push(`/articles/${article.slug || article.id}`)}
    >
      {/* Image */}
      <div className="relative w-full sm:w-64 h-56 sm:h-auto shrink-0 overflow-hidden">
        <img
          src={getCloudinaryImageUrl(article.featuredImage, { width: 500, height: 400, crop: 'fill' })}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full bg-linear-to-r ${getCategoryColor(article.category?.name || '')} text-white shadow-md`}>
            {getCategoryIcon(article.category?.name)} {article.category?.name}
          </span>
          {article.isFeatured && (
            <span className="inline-flex items-center px-2 py-1 text-[10px] font-bold rounded-full bg-amber-400 text-white shadow-sm">
              <Star className="h-2.5 w-2.5 mr-1 fill-current" /> VEDETTE
            </span>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center text-gray-400 text-xs">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{article.readingTime || 5} min de lecture</span>
          </div>
          <div className="flex gap-1">
            <button onClick={handleBookmarkClick} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
            </button>
            <button onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 text-lg sm:text-xl leading-tight line-clamp-2 mb-2 group-hover:text-teal-600 transition-colors">
          {article.title}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {article.excerpt}
        </p>

        {/* Auteur */}
        <div className="flex items-center mb-4 mt-auto">
          <div className="relative w-10 h-10 shrink-0">
            {article.organization?.logo ? (
              <img src={article.organization.logo} className="w-full h-full object-cover rounded-full border border-gray-100" alt="org" />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center"><User className="h-5 w-5 text-gray-400" /></div>
            )}
            {article.organization?.isVerified && (
              <div className="absolute -bottom-0.5 -right-0.5 bg-blue-500 rounded-full p-0.5 border-2 border-white">
                <Check className="h-2 w-2 text-white" />
              </div>
            )}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-bold text-gray-900 truncate">{article.author || article.organization?.name}</p>
            <p className="text-xs text-gray-500 truncate">{article.organization?.name}</p>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center"><Eye className="h-4 w-4 mr-1" /> {article.viewsCount || 0}</div>
            <div className="flex items-center"><MessageCircle className="h-4 w-4 mr-1" /> {article.commentsCount || 0}</div>
            <div className={`flex items-center ${isLiked ? 'text-red-500' : ''}`}><Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} /> {article.reactionsCount || 0}</div>
          </div>
          <span className="text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform flex items-center">
            LIRE <ChevronDown className="h-4 w-4 ml-1 -rotate-90" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

// ==========================================
// 🚀 PAGE PRINCIPALE
// ==========================================
export default function ArticlesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // ✅ DÉFINITION DE LA FONCTION QUI MANQUAIT
  const handleResetSearch = () => {
    setSearchTerm(''); // Réinitialise l'état local
    router.push('/articles'); // Nettoie l'URL (retire ?search=...)
  };

  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const categoryId = searchParams.get('categoryId') || undefined;

  // Query Fetching
  const queryDto: QueryArticleDto = useMemo(() => ({
    page,
    limit: 10,
    search: searchParams.get('search') || undefined,
    categoryId,
    status: ArticleStatus.PUBLISHED,
  }), [page, searchParams.get('search'), categoryId]);

  const { data: articlesResponse, isLoading } = useQuery<PaginatedArticlesResponse>({
    queryKey: ['articles', 'list', queryDto],
    queryFn: () => articlesApi.getArticles(queryDto),
  });

  const articles = articlesResponse?.data || [];
  const meta = articlesResponse?.meta;

  // Favoris Logic
  const articleIds = useMemo(() => articles.map(a => a.id), [articles]);
  const { data: bookmarksMap } = useBookmarksCheck(ContentType.ARTICLE, articleIds, isAuthenticated);
  const toggleBookmark = useToggleBookmark();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20 md:pt-28 pb-10">
        {/* Header & Recherche */}
        <div className="max-w-7xl mx-auto px-4 mb-8">
           <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FileText className="mr-3 text-teal-600" /> CENTRE D&apos;ACTUALITÉS SANTÉ
                </h1>
                
                {/* ✅ BOUTON RÉINITIALISER (Visible seulement si une recherche est en cours) */}
                {searchParams.get('search') && (
                  <button 
                    onClick={handleResetSearch}
                    className="text-sm font-medium text-teal-600 hover:text-teal-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors"
                  >
                    <X className="h-4 w-4" /> Réinitialiser
                  </button>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Chercher un sujet, une maladie, un conseil..." 
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500 transition-all outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && router.push(`?search=${searchTerm}`)}
                  />
                </div>
                <button 
                  onClick={() => router.push(`?search=${searchTerm}`)}
                  className="bg-teal-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-100"
                >
                  Rechercher
                </button>
              </div>
           </div>
        </div>

        <main className="max-w-7xl mx-auto px-4">
          
          {/* Stats Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-gray-500 font-bold text-sm uppercase tracking-widest">
              {meta?.total || 0} RÉSULTATS DISPONIBLES
            </h2>
            {/* Boutons Vue */}
            <div className="flex bg-gray-200 rounded-lg p-1 shadow-inner">
               <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-500'}`}><List className="h-4 w-4" /></button>
               <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-500'}`}><Grid className="h-4 w-4" /></button>
            </div>
          </div>

          {/* Loader */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-xl" />)}
            </div>
          ) : articles.length > 0 ? (
            // Liste des articles
            <div className={viewMode === 'list' ? 'space-y-6' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
              {articles.map(article => (
                <ArticleCard 
                  key={article.id}
                  article={article}
                  isBookmarked={!!bookmarksMap?.[article.id]}
                  onBookmarkToggle={() => toggleBookmark.mutate(ContentType.ARTICLE, article.id, !!bookmarksMap?.[article.id])}
                  isAuthenticated={isAuthenticated}
                  onLoginPrompt={() => setIsLoginPromptOpen(true)}
                />
              ))}
            </div>
          ) : (
            // ✅ ÉTAT VIDE (Message de recherche infructueuse + Bouton reset)
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun article trouvé</h3>
              <p className="text-gray-500 mb-8 max-w-md">
                Nous n&apos;avons trouvé aucun article correspondant à votre recherche &quot;<strong className="text-gray-800">{searchTerm}</strong>&quot;.
              </p>
              
              <button 
                onClick={handleResetSearch}
                className="bg-white text-teal-700 border border-teal-200 hover:bg-teal-50 px-8 py-3.5 rounded-xl font-bold transition-all flex items-center gap-2 mx-auto w-fit"
              >
                <RefreshCw className="h-4 w-4" /> Retour aux articles
              </button>
            </div>
          )}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && articles.length > 0 && (
            <div className="flex justify-center mt-12 gap-2">
               {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
                 <button
                   key={p}
                   onClick={() => router.push(`?page=${p}${searchTerm ? `&search=${searchTerm}` : ''}`)}
                   className={`w-10 h-10 rounded-lg font-bold transition-all ${page === p ? 'bg-teal-600 text-white shadow-lg' : 'bg-white text-gray-400 hover:bg-teal-50'}`}
                 >
                   {p}
                 </button>
               ))}
            </div>
          )}
        </main>
      </div>

      {/* Modale de connexion */}
      <AnimatePresence>
        {isLoginPromptOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6"><Lock className="h-10 w-10 text-teal-600" /></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Accès réservé</h3>
              <p className="text-gray-500 mb-8">Connectez-vous pour sauvegarder vos articles favoris et ne rien rater.</p>
              <div className="space-y-3">
                <button onClick={() => router.push('/auth/connexion')} className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold shadow-lg shadow-teal-100 hover:bg-teal-700 transition-all">Se connecter</button>
                <button onClick={() => setIsLoginPromptOpen(false)} className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-all">Plus tard</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}