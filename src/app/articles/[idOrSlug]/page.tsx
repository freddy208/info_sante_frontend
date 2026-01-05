/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Share2,
  Heart,
  MessageCircle,
  Bookmark,
  Clock,
  Eye,
  User,
  X,
  Send,
  Loader2,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Check,
  Info,
  ChevronRight,
  Calendar,
  FileText,
  Lock,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// API & Hooks
import { articlesApi } from '@/lib/api-endponts';
import { categoriesApi } from '@/lib/api-endponts';
import { bookmarksApi } from '@/lib/api-endponts';
import { reactionsApi } from '@/lib/api-endponts';
import { commentsApi } from '@/lib/api-endponts';
import {
  Article,
  ArticleStatus,
  PaginatedArticlesResponse,
} from '@/types/article';
import { Category, PaginatedCategoriesResponse } from '@/types/category';
import { Comment, PaginatedCommentsResponse } from '@/types/comment';
import { ContentType, ReactionType } from '@/types/reaction';

// Utilities
import { getCategoryIcon, getCategoryColor } from '@/components/home/utils/category-utils';
import { getCloudinaryImageUrl } from '@/lib/cloudinary';

// ✅ IMPORT DES HOOKS
// J'ai supprimé useBookmarksList qui causait le crash (401/429) et ajouté useIsBookmarked
import { useViewArticle } from '@/hooks/useArticles';
import { useIsBookmarked, useToggleBookmark } from '@/hooks/useBookmarks'; 

// ==========================================
// HELPER COMPONENTS
// ==========================================

// --- LOGIN PROMPT MODAL (Identique à la page Annonce) ---
function LoginPromptModal({ isOpen, onClose, onLogin }: { isOpen: boolean; onClose: () => void; onLogin: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-6 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="h-8 w-8 text-gray-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Connexion requise</h3>
        <p className="text-gray-600 mb-6">Vous devez être connecté pour effectuer cette action.</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onLogin}
            className="w-full py-2.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700"
          >
            Se connecter
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-white text-gray-700 border border-gray-300 rounded-xl font-bold hover:bg-gray-50"
          >
            Annuler
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// --- COMMENT ITEM ---
function CommentItem({
  comment,
  onLike,
  isAuthenticated,
  onLoginPrompt,
}: {
  comment: Comment;
  onLike: (id: string) => void;
  isAuthenticated: boolean;
  onLoginPrompt: () => void;
}) {
  return (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
            <User className="h-4 w-4 text-gray-500" />
          </div>
          <div>
            <div className="flex items-center">
              <span className="font-medium text-sm text-gray-900">
                {comment.user?.firstName || 'Anonyme'}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-700 text-sm mb-3 leading-relaxed whitespace-pre-wrap">
        {comment.content}
      </p>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={() => isAuthenticated ? onLike(comment.id) : onLoginPrompt()}
          className="flex items-center text-gray-500 hover:text-red-600 transition-colors text-sm"
        >
          <Heart className="h-3 w-3 mr-1" />
          {comment.reactionsCount || 0}
        </button>
      </div>
    </div>
  );
}

// --- RELATED ARTICLE CARD ---
function RelatedArticleCard({ article, onRead }: { article: Article; onRead: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onRead}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={getCloudinaryImageUrl(article.featuredImage, { width: 400, height: 200, crop: 'fill' })}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className={`absolute top-2 left-2 px-2 py-1 bg-linear-to-r ${getCategoryColor(article.category?.name || '')} text-white text-[10px] font-bold rounded-full`}>
          {getCategoryIcon(article.category?.name)} {article.category?.name}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col justify-between">
        <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-teal-600 transition-colors">
          {article.title}
        </h3>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{article.readingTime} min</span>
          </div>
          <div className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            <span>{article.viewsCount || 0}</span>
          </div>
        </div>

        <button className="w-full py-2 border border-teal-600 text-teal-600 rounded-lg text-xs font-medium hover:bg-teal-50 transition-colors">
          Lire l&apos;article
        </button>
      </div>
    </motion.div>
  );
}

// ==========================================
// PAGE PRINCIPALE
// ==========================================

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  // ✅ CORRECTION : Cast explicite
  const idOrSlug = params.idOrSlug as string;

  // États UI
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const viewIncrementedRef = useRef(false);

  // Authentification
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (!authStorage) {
          setIsAuthenticated(false);
          return;
        }
        const { state } = JSON.parse(authStorage);
        setIsAuthenticated(!!state.token);
      } catch {
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // ==========================================
  // DATA FETCHING & VIEW COUNT
  // ==========================================

  // 1. Article Principal
  const { data: article, isLoading: isLoadingArticle, isError: isArticleError } = useQuery<Article>({
    queryKey: ['article', 'detail', idOrSlug],
    queryFn: () => articlesApi.getArticleById(idOrSlug || ''),
    enabled: !!idOrSlug,
  });

  // ✅ FONCTION : Incrémenter les vues
  // Si useViewArticle n'existe pas dans vos hooks, remplacez par une mutation classique
  const viewMutation = useViewArticle();

  useEffect(() => {
    if (article?.id && !viewIncrementedRef.current) {
      viewMutation.mutate(article.id);
      viewIncrementedRef.current = true;
    }
  }, [article?.id, viewMutation]);

  // 2. Articles Similaires
  const { data: relatedData } = useQuery<PaginatedArticlesResponse>({
    queryKey: ['articles', 'related', article?.categoryId],
    queryFn: () => articlesApi.getArticles({
      categoryId: article?.categoryId,
      limit: 4,
      status: ArticleStatus.PUBLISHED,
      excludeId: article?.id
    }),
    enabled: !!article?.categoryId,
  });
  const relatedArticles = relatedData?.data || [];

  // 3. Commentaires
  const { data: commentsData } = useQuery<PaginatedCommentsResponse>({
    queryKey: ['comments', article?.id],
    queryFn: () => commentsApi.getCommentsByContent('ARTICLE', article!.id, { limit: 20 }),
    enabled: !!article?.id,
  });
  const comments = commentsData?.data || [];

// ==========================================
// 4. FAVORIS (CRITICAL FIX)
// ==========================================
  
  // ❌ ANCIEN LOGIQUE (Cause du crash 401/429)
  // const { data: bookmarksResponse } = useBookmarksList({ limit: 50 });
  // const bookmarkedIds = new Set(bookmarksResponse?.data.map(b => b.contentId) || []);
  // const isBookmarked = !!article && bookmarkedIds.has(article.id);

  // ✅ NOUVELLE LOGIQUE (Solution)
  // Utiliser useIsBookmarked évite d'appeler l'API si l'utilisateur n'est pas connecté,
  // et ne demande qu'un élément spécifique au lieu de toute la liste.
  const { data: bookmarkCheck } = useIsBookmarked(
    ContentType.ARTICLE, 
    article?.id || '', 
    isAuthenticated
  );

  const isBookmarked = bookmarkCheck?.isBookmarked || false;
  const toggleBookmark = useToggleBookmark();

  // 5. Catégories
  const { data: categoriesResponse } = useQuery<PaginatedCategoriesResponse>({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getCategories({ isActive: true }),
  });

  // ==========================================
  // MUTATIONS
  // ==========================================

  // Like / Unlike
  const likeMutation = useMutation({
    mutationFn: () => {
      if (!article) throw new Error('Article non chargé');
      return reactionsApi.create({
        contentType: ContentType.ARTICLE,
        contentId: article.id,
        type: ReactionType.LIKE,
      });
    },
    onSuccess: () => {
      setIsLiked(true);
      queryClient.invalidateQueries({ queryKey: ['article', 'detail', idOrSlug] });
      toast('J\'aime enregistré !', { icon: '❤️' });
    },
    onError: (err: any) => {
      setIsLiked(false);
      console.error(err);
    }
  });

  // Commentaire
  const submitCommentMutation = useMutation({
    mutationFn: (content: string) => {
      if (!article) throw new Error('Article non chargé');
      return commentsApi.create({
        contentType: ContentType.ARTICLE,
        contentId: article.id,
        content
      });
    },
    onSuccess: () => {
      setNewComment('');
      setShowCommentInput(false);
      queryClient.invalidateQueries({ queryKey: ['comments', article?.id] });
      toast('Commentaire publié !', { icon: '✅' });
    }
  });

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleLike = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    if (!article) return;
    
    if (isLiked) {
      setIsLiked(false);
    } else {
      likeMutation.mutate();
      setIsLiked(true);
    }
  };

  const handleBookmark = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    if (!article) return;
    toggleBookmark.mutate(ContentType.ARTICLE, article.id, isBookmarked);
  };

  const handleShare = (platform?: string) => {
    if (!article) return;
    const url = `${window.location.origin}/articles/${article.slug}`;
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      toast('Lien copié !', { icon: '📋' });
    } else if (platform && navigator.share) {
      navigator.share({ title: article.title, url });
    } else {
      setShowShareModal(true);
    }
  };

  const handleFollow = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setIsFollowing(!isFollowing);
    toast(isFollowing ? 'Suivi arrêté !' : 'Abonné avec succès !');
  };

  const handleOpenCommentInput = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setShowCommentInput(true);
    setTimeout(() => {
      document.getElementById('comment-input-area')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    if (!newComment.trim()) return;
    submitCommentMutation.mutate(newComment);
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderContent = (htmlContent: string) => {
    return htmlContent
      .replace(/<h2>/g, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">')
      .replace(/<h3>/g, '<h3 class="text-xl font-bold text-gray-900 mt-6 mb-3 border-b border-gray-200 pb-2">')
      .replace(/<p>/g, '<p class="text-base text-gray-700 leading-7 mb-4">')
      .replace(/<ul>/g, '<ul class="list-disc list-inside mb-4 space-y-2">')
      .replace(/<li>/g, '<li class="text-gray-700"><span class="text-teal-600 mr-2">•</span><span>')
      .replace(/<\/li>/g, '</span></li>');
  };

  // Loading & Error States
  if (isLoadingArticle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
        <span className="ml-3 text-gray-600">Chargement de l&apos;article...</span>
      </div>
    );
  }

  if (isArticleError || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Article non trouvé</h1>
        <p className="text-gray-600 mb-6">L&apos;article demandé n&apos;existe pas ou a été supprimé.</p>
        <button onClick={() => router.back()} className="px-6 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700">
          Retour aux articles
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER SCROLL AWARE */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrollY > 100 ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className={`p-2 rounded-full transition-all duration-300 ${
              scrollY > 100 ? 'hover:bg-gray-100' : 'hover:bg-white/20'
            }`}
            aria-label="Retour"
          >
            <ArrowLeft className={`h-5 w-5 ${scrollY > 100 ? 'text-gray-700' : 'text-white'}`} />
          </button>
          
          <h1 className="text-base sm:text-lg font-semibold text-gray-900">Article</h1>
          
          <div className="flex items-center space-x-2">
             <button
              onClick={handleBookmark}
              className={`p-2 rounded-full transition-all duration-300 ${
                scrollY > 100 ? 'hover:bg-gray-100' : 'hover:bg-white/20'
              }`}
              aria-label="Favori"
            >
              <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-yellow-500 text-yellow-500' : scrollY > 100 ? 'text-gray-700' : 'text-white'}`} />
            </button>
            
            <button
              onClick={() => handleShare('')}
              className={`p-2 rounded-full transition-all duration-300 ${
                scrollY > 100 ? 'hover:bg-gray-100' : 'hover:bg-white/20'
              }`}
              aria-label="Partager"
            >
              <Share2 className={`h-5 w-5 ${scrollY > 100 ? 'text-gray-700' : 'text-white'}`} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* HERO IMAGE */}
      <section className="relative h-56 sm:h-64 md:h-96 overflow-hidden">
        <img
          src={getCloudinaryImageUrl(article.featuredImage, { width: 1200, height: 630, crop: 'fill' })}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
        
        <div className="absolute bottom-8 left-4 sm:left-8">
          <div className={`inline-flex items-center px-3 sm:px-4 py-1.5 bg-linear-to-r ${getCategoryColor(article.category?.name || '')} text-white rounded-full shadow-lg mb-3`}>
            {getCategoryIcon(article.category?.name)} <span className="ml-2 text-xs sm:text-sm font-bold uppercase">{article.category?.name}</span>
          </div>
          
          <div className="flex items-center text-white/90">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span className="text-xs sm:text-sm font-medium">{article.readingTime || 5} min de lecture</span>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="bg-white rounded-t-3xl -mt-6 relative shadow-lg pb-24 sm:pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6"
          >
            {article.title}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-50 rounded-2xl p-4 sm:p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 shadow-md">
                <User className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base sm:text-lg">{article.author || article.organization?.name}</p>
                <p className="text-sm text-gray-600">{article.organization?.name}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center bg-white px-3 py-1.5 rounded-full shadow-sm">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-teal-600" />
                {new Date(article.publishedAt || '').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center bg-white px-3 py-1.5 rounded-full shadow-sm">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-teal-600" />
                {(article.viewsCount || 0).toLocaleString()} vues
              </div>
              {article.organization?.isVerified && (
                 <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-full shadow-sm">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-blue-600" />
                    Source vérifiée
                  </div>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-16 sm:top-20 bg-white border-b border-gray-100 py-4 mb-8 z-20"
          >
            <div className="flex items-center justify-center gap-4 sm:gap-8">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-6 py-2 rounded-full border transition-all ${
                  isLiked ? 'bg-red-50 border-red-200 text-red-600' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600'
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="font-medium text-sm sm:text-base">{article.reactionsCount || 0}</span>
              </button>

              <button
                onClick={handleOpenCommentInput}
                className="flex items-center gap-2 px-6 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium text-sm sm:text-base">{comments.length}</span>
              </button>

              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 px-6 py-2 rounded-full border transition-all ${
                  isBookmarked ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700'
                }`}
              >
                <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                <span className="font-medium text-sm sm:text-base">{isBookmarked ? 'Sauvegardé' : 'Sauvegarder'}</span>
              </button>

              <button
                onClick={() => handleShare('')}
                className="p-2 rounded-full bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-200 transition-all"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </motion.div>

          <AnimatePresence>
            {showCommentInput && (
              <motion.div 
                id="comment-input-area"
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mb-8 bg-teal-50/50 p-4 rounded-xl border border-teal-100"
              >
                <form onSubmit={handleCommentSubmit}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <textarea
                        autoFocus
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Écrivez votre commentaire ici..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white mb-3 text-sm"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowCommentInput(false)}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium text-sm"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          disabled={!newComment.trim() || submitCommentMutation.isPending}
                          className="px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-lg font-medium text-sm disabled:opacity-50 flex items-center"
                        >
                          {submitCommentMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : 'Publier'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-sm sm:prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: renderContent(article.content) }}
          />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="py-6 border-t border-b border-gray-100 mb-12"
          >
            <div className="flex flex-wrap gap-2">
              {(article.tags || []).map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-12"
          >
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Avertissement médical</h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Cet article est fourni à titre informatif uniquement et ne constitue pas un avis médical professionnel. 
                  Toujours consultez un médecin qualifié pour des diagnostics ou des traitements spécifiques.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="border-t border-b border-gray-100 pt-12 pb-12 mb-12"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mr-4 border-2 border-teal-200">
                  {article.organization?.logo ? (
                    <img src={article.organization.logo} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <User className="h-8 w-8 text-teal-600" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{article.organization?.name}</p>
                  {article.organization?.isVerified && (
                    <p className="text-xs font-medium text-blue-600 mt-1 flex items-center">
                      <Check className="h-3 w-3 mr-1" /> Organisme vérifié par nos équipes
                    </p>
                  )}
                </div>
              </div>
              
              <button
                onClick={handleFollow}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  isFollowing 
                    ? 'bg-gray-100 text-gray-700' 
                    : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md'
                }`}
              >
                {isFollowing ? 'Suivi' : 'Suivre'}
              </button>
            </div>
          </motion.div>

          {relatedArticles.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Articles similaires</h2>
                <button 
                  onClick={() => router.push('/articles')}
                  className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center"
                >
                  Voir tout <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <RelatedArticleCard 
                    key={relatedArticle.id} 
                    article={relatedArticle}
                    onRead={() => router.push(`/articles/${relatedArticle.slug}`)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            id="comments-section"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Commentaires ({comments.length})</h2>
            </div>

            <div className="space-y-6">
              {comments.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-200">
                  <MessageCircle className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Aucun commentaire pour le moment. Soyez le premier à donner votre avis !</p>
                  <button 
                    onClick={handleOpenCommentInput}
                    className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700"
                  >
                    Écrire un commentaire
                  </button>
                </div>
              ) : (
                comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onLike={() => {
                      toast('Like commentaire fonctionnel ! (API non fournie pour cet exemple)');
                    }}
                    isAuthenticated={isAuthenticated}
                    onLoginPrompt={() => setShowLoginModal(true)}
                  />
                ))
              )}
            </div>
          </motion.div>

        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 sm:hidden">
        <div className="flex items-center justify-around py-3 px-4">
          <button
            onClick={handleLike}
            className="flex flex-col items-center text-gray-600"
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
            <span className="text-xs mt-1">{article.reactionsCount || 0}</span>
          </button>
          
          <button
            onClick={handleOpenCommentInput}
            className="flex flex-col items-center text-gray-600"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs mt-1">{comments.length}</span>
          </button>
          
          <button
            onClick={handleBookmark}
            className="flex flex-col items-center"
          >
            <Bookmark className={`h-5 w-5 ${isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} />
            <span className="text-xs mt-1">{isBookmarked ? 'Sauve' : 'Sauve'}</span>
          </button>

          <button
            onClick={() => handleShare('')}
            className="flex flex-col items-center text-gray-600"
          >
            <Share2 className="h-5 w-5" />
            <span className="text-xs mt-1">Partager</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Partager</h3>
                <button onClick={() => setShowShareModal(false)}><X className="h-6 w-6 text-gray-500" /></button>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                <button onClick={() => handleShare('whatsapp')} className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.59.35 3.1 1.03 4.44.49 0 .89.12 1.75.26 2.57l-1.36 1.39c-.26.26-.6.38-.96.38-.72 0-1.64-.59-2.87-1.37l-1.39-1.36C6.1 19.34 2.5 15.44 2.5 10.24V4h2.25l2.26 2.25zm0-4l-3.1 3.16c-.25.26-.6.39-.96.39-.72 0-1.62-.6-2.86-1.36L8.9 9.64C6.02 7.56 2.5 4 2.5 0v2.08l7.29-7.29c.63-.63.96-1.44.96-2.31 0-.9-.36-1.72-.96-2.37l-1.37-1.37C6.1 19.34 2.5 15.44 2.5 10.24V4z"/></svg>
                  </div>
                  <span className="text-xs font-medium text-gray-700">WhatsApp</span>
                </button>
                <button onClick={() => handleShare('facebook')} className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                    <Facebook className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Facebook</span>
                </button>
                <button onClick={() => handleShare('twitter')} className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center mb-2">
                    <Twitter className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Twitter</span>
                </button>
                <button onClick={() => handleShare('linkedin')} className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center mb-2">
                    <Linkedin className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">LinkedIn</span>
                </button>
              </div>

              <button
                onClick={() => handleShare('copy')}
                className={`w-full py-3 rounded-xl flex items-center justify-center font-medium transition-all ${
                  copiedLink 
                    ? 'bg-green-100 text-green-700 border-green-200' 
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Lien copié !
                  </>
                ) : (
                  <>
                    <Link2 className="h-5 w-5 mr-2" />
                    Copier le lien
                  </>
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <LoginPromptModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLogin={() => router.push('/login')} 
      />
    </div>
  );
}
