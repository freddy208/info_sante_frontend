/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Bookmark, Share2, ThumbsUp, Eye,
  MessageCircle, Heart, ChevronDown, X, Clock,
  User, FileText, Calendar, Lock, Star, Loader2,
  Check, Navigation, Facebook, Twitter, Linkedin, Link2,
  Send
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Composants & Stores
import Navbar from '@/components/shared/Navbar';
import { useAuthStore } from '@/stores/authStore';

// API & Hooks
import { articlesApi } from '@/lib/api-endponts';
import { commentsApi } from '@/lib/api-endponts';
import { reactionsApi } from '@/lib/api-endponts';

import { useViewArticle } from '@/hooks/useArticles';
import { useBookmarksCheck, useToggleBookmark, useIsBookmarked } from '@/hooks/useBookmarks';
import { useReactionStats, useToggleReaction } from '@/hooks/useReactions';
import { useCommentsByContent, useCreateComment } from '@/hooks/useComments';

// Types
import { Article, ArticleStatus } from '@/types/article';
import { ContentType, ReactionType } from '@/types/reaction';

// Utils
import { getCategoryIcon, getCategoryColor } from '@/components/home/utils/category-utils';
import { getCloudinaryImageUrl } from '@/lib/cloudinary';

// ==========================================
// SOUS-COMPOSANTS
// ==========================================

function HeroImageSection({
  article,
  isBookmarked,
  onBookmarkToggle,
  onShare,
  isAuthenticated,
  onLoginPrompt,
}: {
  article: Article;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  onShare: () => void;
  isAuthenticated: boolean;
  onLoginPrompt: () => void;
}) {
  const handleBookmarkClick = () => {
    if (!isAuthenticated) {
      onLoginPrompt();
      return;
    }
    onBookmarkToggle();
  };

  const catColorClass = article.category
    ? getCategoryColor(article.category.name)
    : 'from-gray-400 to-gray-600';
  const catIcon = article.category ? getCategoryIcon(article.category) : '🏥';

  return (
    <div className="relative w-full h-[60vh] min-h-80 sm:h-[70vh]">
      <img
        src={getCloudinaryImageUrl(article.featuredImage, { width: 1920, height: 1080, crop: 'fill' })}
        alt={article.title}
        className="w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent"></div>

      <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20">
        <button
          onClick={() => window.history.back()}
          className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex space-x-3">
          <button
            onClick={handleBookmarkClick}
            className={`p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 ${isBookmarked ? 'text-yellow-300' : ''}`}
          >
            <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={onShare}
            className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </header>

      {article.category && (
        <div className="absolute top-1/4 left-4 md:left-8 z-10 -translate-y-1/2">
          <div className={`bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 px-4 py-2 inline-flex items-center bg-linear-to-br ${catColorClass}`}>
            <span className="text-xl mr-2">{catIcon}</span>
            <span className="text-white font-bold text-sm sm:text-base drop-shadow-md">{article.category.name}</span>
          </div>
        </div>
      )}

      {article.isFeatured && (
        <div className="absolute bottom-4 right-4 md:right-8 z-30">
          <div className="bg-amber-400 backdrop-blur-sm bg-opacity-90 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg">
            <span className="text-sm sm:text-base mr-2">⭐</span>
            <span className="text-white font-medium text-sm sm:text-base">À LA UNE</span>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 z-10">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg leading-tight">
          {article.title}
        </h1>
        <p className="text-sm sm:text-base text-white/90 max-w-3xl line-clamp-2 drop-shadow">
          {article.excerpt}
        </p>
      </div>
    </div>
  );
}

function ContentSection({
  article,
  onLikeClick,
  isLiked,
  likeCount,
}: {
  article: Article;
  onLikeClick: () => void;
  isLiked: boolean;
  likeCount: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-12 relative z-20">
      <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl">

        {/* Organisation */}
        <section className="mb-8 pb-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden shrink-0 border border-gray-200">
              {article.organization?.logo ? (
                <img
                  src={getCloudinaryImageUrl(article.organization.logo, { width: 200, height: 200 })}
                  alt={article.organization.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center"><User className="h-4 w-4 mr-1 text-teal-600" /> {article.organization?.name}</span>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-fit">
              Voir le profil
            </button>
          </div>
        </section>

        {/* Stats Actions */}
        <section className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-gray-50 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full text-blue-600">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{article.viewsCount}</p>
              <p className="text-xs text-gray-600">Vues</p>
            </div>
          </div>

          <button
            onClick={onLikeClick}
            className={`flex items-center gap-3 px-4 py-2 rounded-full transition-colors ${isLiked ? 'bg-red-100 text-red-600' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
          >
            <ThumbsUp className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium hidden sm:inline">J&apos;aime</span>
            <span className="text-xl font-bold">{likeCount}</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-full text-pink-600">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{article.commentsCount}</p>
              <p className="text-xs text-gray-600">Commentaires</p>
            </div>
          </div>
        </section>

        {/* Auteur & Date */}
        <section className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-3">
               <User className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{article.author || 'Rédaction'}</p>
              <p className="text-xs text-gray-600">{article.organization?.name}</p>
            </div>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'Non publié'}
            </span>
            <span className="mx-2">•</span>
            <Clock className="h-4 w-4 mr-2" />
            <span>{article.readingTime || 5} min de lecture</span>
          </div>
        </section>

        {/* Contenu (HTML) */}
        <section className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-gray-700" /> Contenu
          </h3>
          <div 
            className={`prose prose-sm sm:prose-lg max-w-none relative ${isExpanded ? '' : 'line-clamp-20'}`}
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />
          {!isExpanded && (
             <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white to-transparent pointer-events-none"></div>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 px-6 py-3 bg-white text-teal-700 font-medium rounded-xl border border-teal-200 hover:bg-teal-50 transition-colors flex items-center mx-auto"
          >
             {isExpanded ? 'Réduire' : 'Lire la suite'}
             <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </section>
      </div>
    </div>
  );
}

function CommentsSection({
  contentId,
  isAuthenticated,
  onLoginPrompt,
}: {
  contentId: string;
  isAuthenticated: boolean;
  onLoginPrompt: () => void;
}) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  
  const queryClient = useQueryClient();

  const queryOptions = useMemo(() => ({ limit: 10 }), []);
  const { data: commentsResponse, isLoading } = useCommentsByContent(
    ContentType.ARTICLE,
    contentId,
    queryOptions
  );
  const comments = commentsResponse?.data || [];
  const createMutation = useCreateComment();

  const handleSubmit = () => {
    if (!isAuthenticated) {
      onLoginPrompt();
      return;
    }
    if (!newComment.trim()) return;
    createMutation.mutate(
      { contentType: ContentType.ARTICLE, contentId: contentId, content: newComment }, 
      { 
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['comments', 'content', ContentType.ARTICLE, contentId],
          });
          setNewComment('');
        },
      }
    );
  };

  const handleReplySubmit = (parentId: string) => {
    if (!isAuthenticated) {
      onLoginPrompt();
      return;
    }
    if (!replyContent.trim()) return;
    createMutation.mutate(
      { contentType: ContentType.ARTICLE, contentId: contentId, content: replyContent, parentCommentId: parentId }, 
      { 
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['comments', 'content', ContentType.ARTICLE, contentId],
          });
          setReplyContent('');
          setReplyingTo(null);
        },
      }
    );
  };

  const getInitials = (user: any) => {
    if (!user) return 'U';
    const first = user.firstName ? user.firstName[0].toUpperCase() : '';
    const last = user.lastName ? user.lastName[0].toUpperCase() : '';
    return (first + last) || user.firstName?.substring(0, 1).toUpperCase() || 'U';
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 mb-8">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <MessageCircle className="h-6 w-6 mr-2 text-blue-600" /> Commentaires ({comments.length})
        </h2>

        <div className="bg-gray-50 rounded-2xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
              Moi
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={isAuthenticated ? "Ajouter un commentaire..." : "Connectez-vous pour commenter"}
                disabled={!isAuthenticated}
                className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm ${!isAuthenticated ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || !newComment.trim() || !isAuthenticated}
                  className="px-6 py-2.5 bg-linear-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-bold"
                >
                  {createMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />} Publier
                </button>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 text-teal-600 animate-spin" /></div>
        ) : comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0 overflow-hidden border border-gray-300">
                    {comment.user?.avatar ? (
                      <img
                        src={getCloudinaryImageUrl(comment.user.avatar, { width: 100, height: 100 })}
                        alt={comment.user.firstName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-gray-500">{getInitials(comment.user)}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-sm">
                        {comment.user ? `${comment.user.firstName} ${comment.user.lastName}` : 'Utilisateur inconnu'}
                      </h3>
                      <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>

                    <button
                      onClick={() => setReplyingTo(comment.id)}
                      className="mt-3 text-xs font-medium text-gray-500 hover:text-teal-600 flex items-center"
                    >
                      <MessageCircle className="h-3 w-3 mr-1" /> Répondre
                    </button>

                    {replyingTo === comment.id && (
                      <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="w-full text-sm p-2 bg-white border rounded mb-2"
                          placeholder="Répondre..."
                          rows={2}
                        />
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setReplyingTo(null)} className="text-xs text-gray-500">Annuler</button>
                          <button onClick={() => handleReplySubmit(comment.id)} className="px-3 py-1 bg-teal-600 text-white rounded text-xs disabled:opacity-50">
                            Répondre
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 ml-6 md:ml-12 pl-4 border-l-2 border-gray-200 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 overflow-hidden border border-gray-200">
                          {reply.user?.avatar ? (
                            <img
                              src={getCloudinaryImageUrl(reply.user.avatar, { width: 50, height: 50 })}
                              alt={reply.user.firstName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] font-bold text-gray-500">{getInitials(reply.user)}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-bold text-gray-800 text-xs">
                              {reply.user ? `${reply.user.firstName} ${reply.user.lastName}` : 'Utilisateur'}
                            </h4>
                            <span className="text-[10px] text-gray-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <MessageCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucun commentaire pour le moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function SimilarArticles({
  currentCategoryId,
  currentId,
  bookmarkMap,
}: {
  currentCategoryId?: string;
  currentId: string;
  bookmarkMap: Record<string, boolean>;
}) {
  const queryParams = useMemo(
    () => ({
      categoryId: currentCategoryId,
      limit: 3,
      status: ArticleStatus.PUBLISHED,
    }),
    [currentCategoryId]
  );

  const { data: response } = useQuery({
    queryKey: ['articles', 'list', queryParams],
    queryFn: () => articlesApi.getArticles(queryParams),
  });

  const similar = response?.data?.filter((a) => a.id !== currentId) || [];

  if (!similar.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 mt-12">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Articles similaires</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {similar.map((campaign) => {
          const isBookmarked = bookmarkMap[campaign.id] || false;
          return (
            <div
              key={campaign.id}
              onClick={() => (window.location.href = `/articles/${campaign.slug}`)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="h-40 relative">
                <img
                  src={campaign.thumbnailImage || campaign.featuredImage}
                  alt={campaign.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center text-xs font-medium text-gray-700">
                  <span className="mr-1">{getCategoryIcon(campaign.category)}</span>
                  {campaign.category?.name}
                </div>
                {isBookmarked && <Bookmark className="absolute top-3 right-3 h-4 w-4 text-yellow-500 fill-current drop-shadow-md" />}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{campaign.title}</h3>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                   <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-600">
                     {campaign.readingTime || 5} min
                   </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ==========================================
// PAGE PRINCIPALE
// ==========================================

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Utilisation de l'ID ou du Slug
  const idOrSlug = (params.idOrSlug || '') as string;

  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // ==========================================
  // LOGIQUE D'AUTHENTIFICATION
  // ==========================================
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

  // ==========================================
  // DATA FETCHING
  // ==========================================
  
  // 1. Article Détaillé
  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: ['articles', 'detail', idOrSlug],
    queryFn: () => articlesApi.getArticleById(idOrSlug),
    enabled: !!idOrSlug,
  });

  // 2. Incrémentation des vues (Hook Optimisé)
  const viewMutation = useViewArticle();

  useEffect(() => {
    if (article?.id) {
      viewMutation.mutate(article.id);
    }
  }, [article?.id, viewMutation]);

  // 3. Gestion des Favoris
  const { data: bookmarkCheck } = useIsBookmarked(ContentType.ARTICLE, article?.id || '', isAuthenticated);
  const toggleBookmark = useToggleBookmark();

  // 4. Récupération des Similaires pour le checkMany
  const queryParams = useMemo(
    () => ({
      categoryId: article?.categoryId,
      limit: 3,
      status: ArticleStatus.PUBLISHED,
    }),
    [article?.categoryId]
  );

  const { data: similarResponse } = useQuery({
    queryKey: ['articles', 'list', queryParams],
    queryFn: () => articlesApi.getArticles(queryParams),
    enabled: !!article?.categoryId,
  });

  const similarIds = useMemo(() => {
    const list = similarResponse?.data?.filter((a) => a.id !== article?.id) || [];
    return list.map((a) => a.id);
  }, [similarResponse, article?.id]);

  // Fusion pour le check par lot
  const allIdsToCheck = useMemo(() => {
    const ids = [...similarIds];
    if (article?.id) ids.push(article.id);
    return ids;
  }, [similarIds, article?.id]);

  const { data: bookmarksMap } = useBookmarksCheck(ContentType.ARTICLE, allIdsToCheck, isAuthenticated);

  // État dérivé
  const isBookmarked = bookmarkCheck?.isBookmarked || false;

  // ==========================================
  // RÉACTIONS
  // ==========================================
  const { data: stats } = useReactionStats(ContentType.ARTICLE, article?.id || '', !!article?.id);
  const toggleReaction = useToggleReaction();

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      setIsLoginPromptOpen(true);
      return;
    }
    toggleReaction.mutate(
      { contentType: ContentType.ARTICLE, contentId: article!.id, type: ReactionType.LIKE },
      { onSuccess: (data) => setIsLiked(!!data) }
    );
  };

  const handleBookmarkToggle = () => {
    if (!isAuthenticated) {
      setIsLoginPromptOpen(true);
      return;
    }
    toggleBookmark.mutate(ContentType.ARTICLE, article!.id, isBookmarked);
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) navigator.share({ title: article!.title, url });
    else {
      navigator.clipboard.writeText(url);
      toast.success('Lien copié !');
    }
  };

  const likeCount = stats?.LIKE || 0;

  // ==========================================
  // RENDERING
  // ==========================================

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-teal-600" /></div>;
  if (error || !article) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><h2 className="text-2xl">Article non trouvé</h2></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* ✅ NAVBAR */}
      <Navbar />
      
      {/* ✅ MAIN WRAPPER (PT-16 pour décaler le Hero et le contenu en dessous de la Navbar fixe) */}
      <main className="pt-16 md:pt-20">

        <HeroImageSection
          article={article}
          isBookmarked={isBookmarked}
          onBookmarkToggle={handleBookmarkToggle}
          onShare={handleShare}
          isAuthenticated={isAuthenticated}
          onLoginPrompt={() => setIsLoginPromptOpen(true)}
        />
      
        {/* ✅ WRAPPER CONTENU (PT-24 pour ajouter de l'espace entre le Hero et le contenu) */}
        <div className="w-full pt-24 sm:pt-28">
          <ContentSection
            article={article}
            onLikeClick={handleLikeClick}
            isLiked={isLiked}
            likeCount={likeCount}
          />
          <CommentsSection
            contentId={article.id}
            isAuthenticated={isAuthenticated}
            onLoginPrompt={() => setIsLoginPromptOpen(true)}
          />

          {/* ✅ ARTICLES SIMILAIRES */}
          <SimilarArticles
            currentCategoryId={article.categoryId}
            currentId={article.id}
            bookmarkMap={bookmarksMap || {}}
          />
        </div>
      </main>

      {/* FOOTER MOBILE (OPTIONNEL : BOUTON D'ACTIONS RAPIDES) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-3 sm:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-around">
          <button
            onClick={handleLikeClick}
            className={`flex flex-col items-center ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-[10px] mt-1">{likeCount}</span>
          </button>
          <button
            onClick={() => document.getElementById('comment-input-area')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
            className="flex flex-col items-center text-gray-600"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-[10px] mt-1">{article.commentsCount}</span>
          </button>
          <button
            onClick={handleBookmarkToggle}
            className="flex flex-col items-center text-gray-600"
          >
            <Bookmark className={`h-5 w-5 ${isBookmarked ? 'text-yellow-500 fill-current' : ''}`} />
            <span className="text-[10px] mt-1">Fav</span>
          </button>
          <button onClick={handleShare} className="flex flex-col items-center text-gray-600">
            <Share2 className="h-5 w-5" />
            <span className="text-[10px] mt-1">Partage</span>
          </button>
        </div>
      </div>

      {/* Modales */}
      <AnimatePresence>
        {isLoginPromptOpen && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Connexion requise</h3>
              <p className="text-gray-600 mb-6">Vous devez être connecté pour effectuer cette action.</p>
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
