'use client';

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Star, Share2, Heart, MessageCircle, Bookmark, Home, Target, Calendar, Eye, 
  TrendingUp, AlertTriangle, Flame, CheckCircle, Info, ChevronRight, Sparkles, 
  Lock, ThumbsUp, Reply, User, Loader2, X, Send,
  MoreVertical,
  Check
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 

// API & Hooks
import { advicesApi } from '@/lib/api-endponts'; 
import { reactionsApi } from '@/lib/api-endponts';
import { commentsApi } from '@/lib/api-endponts';
import { Advice, Priority, AdviceStatus } from '@/types/advice';
import { Comment, CreateCommentDto, PaginatedCommentsResponse } from '@/types/comment';
import { ContentType, ReactionType } from '@/types/reaction';

// ✅ HOOKS OPTIMISÉS
import { useBookmarksCheck, useToggleBookmark } from '@/hooks/useBookmarks'; 

// Utilities
import { getCategoryIcon, getCategoryColor } from '@/components/home/utils/category-utils';

// ✅ SECURITÉ : Import de DOMPurify (À installer: npm install dompurify)
// import DOMPurify from 'dompurify';

// ==========================================
// PAGE PRINCIPALE
// ==========================================

export default function AdviceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const adviceId = params.id as string;
  const queryClient = useQueryClient();

  // États UI
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // États Interaction
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const viewIncrementedRef = useRef(false);

  // Authentification
  useEffect(() => {
    const checkAuth = () => {
      try { const storage = localStorage.getItem('auth-storage'); if (!storage) { setIsAuthenticated(false); return; } const { state } = JSON.parse(storage); setIsAuthenticated(!!state.token); } catch { setIsAuthenticated(false); }
    };
    checkAuth();
    const handleStorage = () => checkAuth();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // ==========================================
  // DATA FETCHING
  // ==========================================

  // 1. Conseil Principal
  const { data: advice, isLoading: isAdviceLoading } = useQuery<Advice>({
    queryKey: ['advices', 'detail', adviceId],
    queryFn: () => advicesApi.getAdviceById(adviceId),
    enabled: !!adviceId,
  });

  // 2. Incrémentation Vues (Mutation)
  const viewMutation = useMutation({
    mutationFn: (id: string) => advicesApi.viewAdvice(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['advices', 'detail', adviceId] }); },
    onError: () => {}
  });
  
  useEffect(() => {
    if (advice?.id && !viewIncrementedRef.current) {
      viewMutation.mutate(advice.id);
      viewIncrementedRef.current = true;
    }
  }, [advice?.id, viewMutation]);

  // 3. Conseils Similaires
  const { data: similarData } = useQuery({
    queryKey: ['advices', 'similar', advice?.categoryId],
    queryFn: () => advicesApi.getAdvices({ 
      categoryId: advice?.categoryId, 
      limit: 3, 
      status: AdviceStatus.PUBLISHED 
    }),
    enabled: !!advice?.categoryId,
  });
  const similarAdvices = similarData?.data?.filter((a: Advice) => a.id !== advice?.id) || [];

  // 4. Commentaires
  const { data: commentsData, isLoading: isCommentsLoading } = useQuery<PaginatedCommentsResponse>({
    queryKey: ['comments', 'content', ContentType.ADVICE, adviceId],
    queryFn: () => commentsApi.getCommentsByContent(ContentType.ADVICE, adviceId, { page: 1, limit: 20 }),
    enabled: !!adviceId,
  });
  const comments = commentsData?.data || [];

  // ==========================================
  // ✅ OPTIMISATION CHECKMANY (BOOKMARKS)
  // ==========================================
  
  const adviceIdsToCheck = useMemo(() => {
    const ids = [adviceId, ...similarAdvices.map(a => a.id)];
    return ids;
  }, [adviceId, similarAdvices]);

  const { data: bookmarksMap } = useBookmarksCheck(
    ContentType.ADVICE,
    adviceIdsToCheck,
    isAuthenticated
  );

  const isBookmarked = bookmarksMap?.[adviceId] || false;
  const toggleBookmark = useToggleBookmark();

  // ==========================================
  // MUTATIONS
  // ==========================================

  const addCommentMutation = useMutation({
    mutationFn: (data: CreateCommentDto) => commentsApi.create(data),
    onSuccess: () => {
      setNewComment('');
      setReplyContent('');
      setReplyingTo(null);
      queryClient.invalidateQueries({ queryKey: ['comments', 'content', ContentType.ADVICE, adviceId] });
      toast('Commentaire publié !');
    },
    onError: () => toast.error('Erreur lors de la publication')
  });

  const toggleReaction = useMutation({
    mutationFn: (id: string) => reactionsApi.create({ contentType: ContentType.ADVICE, contentId: id, type: ReactionType.LIKE }),
    onSuccess: () => { 
      setIsLiked(true); 
      queryClient.invalidateQueries({ queryKey: ['advices', 'detail', adviceId] }); 
      toast('J\'aime enregistré !'); 
    }
  });

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleLike = () => {
    if (!isAuthenticated) { setIsLoginPromptOpen(true); return; }
    if (!advice) return;
    toggleReaction.mutate(advice.id);
  };

  const handleBookmark = () => {
    if (!isAuthenticated) { setIsLoginPromptOpen(true); return; }
    if (!advice) return;
    toggleBookmark.mutate(ContentType.ADVICE, advice.id, isBookmarked);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { setIsLoginPromptOpen(true); return; }
    if (!newComment.trim()) return;
    addCommentMutation.mutate({
      contentType: ContentType.ADVICE,
      contentId: adviceId,
      content: newComment
    });
  };

  const handleReply = (parentId: string) => {
    if (!isAuthenticated) { setIsLoginPromptOpen(true); return; }
    if (!replyContent.trim()) { toast.error("Le message est vide."); return; }
    
    addCommentMutation.mutate({
      contentType: ContentType.ADVICE,
      contentId: adviceId,
      content: replyContent,
      parentCommentId: parentId
    });
  };

  const handleShare = (platform?: string) => {
    if (platform === 'copy') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      toast('Lien copié !');
    } else {
      toast('Partage bientôt disponible');
    }
    setShowShareOptions(false);
  };

  // Helpers
  const getPriorityInfo = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT: return { color: '#E53935', bgColor: '#FFEBEE', label: 'Urgent', icon: AlertTriangle };
      case Priority.HIGH: return { color: '#FF6F00', bgColor: '#FFF3E0', label: 'Haute', icon: Flame };
      case Priority.MEDIUM: return { color: '#FFA000', bgColor: '#FFF8E1', label: 'Moyenne', icon: TrendingUp };
      case Priority.LOW: return { color: '#43A047', bgColor: '#E8F5E9', label: 'Basse', icon: CheckCircle };
      default: return { color: '#757575', bgColor: '#F5F5F5', label: 'Normale', icon: Info };
    }
  };

  const formatStats = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // ✅ CORRECTION LISIBILITÉ
  // On n'utilise plus de regex fragile. On utilise la classe Tailwind 'prose'.
  // Si le HTML est propre (<p>, <ul>...), 'prose' gère les marges, la taille et la couleur automatiquement.
  const renderContent = (htmlContent: string) => {
    // return DOMPurify.sanitize(htmlContent); // Idéalement en prod
    return htmlContent;
  };

  if (isAdviceLoading || !advice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  const priorityInfo = getPriorityInfo(advice.priority);
  const PriorityIcon = priorityInfo.icon;
  const localReactionCount = isLiked ? (advice.reactionsCount + 1) : advice.reactionsCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          
          <h1 className="text-base sm:text-lg font-semibold text-gray-900">Détail du conseil</h1>
          
          <div className="flex items-center space-x-2">
            <button onClick={handleLike} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Star className={`h-5 w-5 text-gray-700 ${isLiked ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </button>
            <button onClick={() => setShowShareOptions(true)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Share2 className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="px-4 sm:px-6 py-6 max-w-4xl mx-auto">
        {/* Icon and Title */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-4xl sm:text-5xl shadow-lg">
            {advice.icon || '💡'}
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            {advice.title}
          </h1>
          
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-400 to-teal-400 mx-auto rounded-full"></div>
        </motion.section>
        
        {/* Content */}
<motion.section
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.1 }}
  className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100"
>
  {/* ✅ CONTENEUR OPTIMISÉ POUR LA LECTURE */}
  <div className="max-w-3xl mx-auto px-4 sm:px-6">
    {/* 
      ✅ MAGIC CLASS 'PROSE' :
      - prose-blue : Met les liens et titres en bleu.
      - prose-lg : Taille de police confortable sur Desktop.
      - sm:prose-xl : Taille de police confortable (plus grosse) sur Mobile.
      - leading-loose : Ajoute de l'air entre les lignes pour la lisibilité.
      
      ATTENTION : On utilise 'advice.content' DIRECTEMENT.
      Problème résolu : Le HTML original est respecté, ce qui garantit que les paragraphes <p> fonctionnent.
    */}
    <div className="prose prose-blue prose-lg sm:prose-xl leading-loose text-slate-800">
      {/* 
         Optionnel : Si ton HTML vient d'un éditeur et contient déjà des classes sales, 
         Tailwind les nettoiera automatiquement pour appliquer son propre style.
      */}
      <div dangerouslySetInnerHTML={{ __html: advice.content || '' }} />
    </div>
  </div>
          
          {/* Tip Box */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-teal-50 border-l-4 border-blue-500 rounded-xl shadow-sm">
            <div className="flex items-start">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mr-3 sm:mr-4 shadow-md">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center text-sm sm:text-base">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-500" />
                  CONSEIL PRATIQUE
                </h4>
                <p className="text-blue-800 text-sm sm:text-base">
                  Gardez une bouteille d&apos;eau près de vous et buvez régulièrement, même sans soif.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
        
        {/* Information Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200 shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-center p-3 bg-white rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-3">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Publié par</p>
                <p className="font-medium text-gray-900 text-sm sm:text-base">{advice.organization?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-white rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mr-3">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Public cible</p>
                <p className="font-medium text-gray-900 text-sm sm:text-base">{advice.targetAudience?.join(', ')}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-white rounded-xl shadow-sm">
              {(() => {
                const IconComponent = priorityInfo.icon;
                return (
                  <>
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mr-3">
                      <IconComponent className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Priorité</p>
                      <p className="font-medium text-sm sm:text-base" style={{ color: priorityInfo.color }}>{priorityInfo.label}</p>
                    </div>
                  </>
                );
              })()}
            </div>
            
            <div className="flex items-center p-3 bg-white rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mr-3">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Publié le</p>
                <p className="font-medium text-gray-900 text-sm sm:text-base">{formatDate(advice.publishedAt!)}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-white rounded-xl shadow-sm sm:col-span-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mr-3">
                <Eye className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Statistiques</p>
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  👁️ {formatStats(advice.viewsCount)} • ❤️ {formatStats(localReactionCount)} • 💬 {comments.length}
                </p>
              </div>
            </div>
          </div>
        </motion.section>
        
        {/* Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 mb-6 sm:mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center shadow-sm ${
              isLiked 
                ? 'bg-gradient-to-r from-red-50 to-pink-50 text-red-600 border border-red-200' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Heart className={`h-5 w-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
            {formatStats(localReactionCount)}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCommentInput(!showCommentInput)}
            className="flex-1 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center justify-center shadow-sm"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            {comments.length}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBookmark}
            className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center shadow-sm ${
              isBookmarked 
                ? 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-600 border border-amber-200' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Bookmark className={`h-5 w-5 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
            {isBookmarked ? 'Sauv.' : 'Save'}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowShareOptions(true)}
            className="flex-1 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center justify-center shadow-sm"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </motion.button>
        </motion.section>
        
        {/* Comment Input */}
        <AnimatePresence>
          {showCommentInput && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100"
            >
              <form onSubmit={handleAddComment}>
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Partagez votre avis..."
                      disabled={!isAuthenticated}
                      className={`w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm sm:text-base ${!isAuthenticated ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                      rows={3}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs sm:text-sm text-gray-500">
                        {newComment.length}/500 caractères
                      </span>
                      <button
                        type="submit"
                        disabled={addCommentMutation.isPending || !newComment.trim()}
                        className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center text-sm sm:text-base ${
                          newComment.trim() && !addCommentMutation.isPending
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Send className="h-4 w-4 mr-1 sm:mr-2" />
                        {addCommentMutation.isPending ? 'Envoi...' : 'Publier'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </motion.section>
          )}
        </AnimatePresence>
        
        {/* Comments */}
        {comments.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
              Commentaires ({comments.length})
            </h3>
            
            <div className="space-y-4 sm:space-y-6">
              {isCommentsLoading ? (
                <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
              ) : comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-100 pb-4 sm:pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mr-3">
                        {comment.user?.avatar ? <img src={comment.user.avatar} className="w-full h-full rounded-full" /> : <User className="h-5 w-5 text-gray-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{comment.user?.firstName || 'Utilisateur'} {comment.user?.lastName}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{formatDate(comment.createdAt)}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                  
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <button className="flex items-center text-gray-600 hover:text-red-600 transition-colors text-sm sm:text-base">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {comment.reactionsCount || 0}
                    </button>
                    <button 
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="flex items-center text-gray-600 hover:text-blue-600 transition-colors text-sm sm:text-base"
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Répondre
                    </button>
                  </div>

                  {/* Réponse */}
                  {replyingTo === comment.id && (
                    <div className="mt-4 bg-blue-50 p-4 rounded-xl">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="w-full p-2 border border-blue-200 rounded-lg text-sm mb-2"
                        placeholder="Répondre..."
                        rows={2}
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setReplyingTo(null)} className="text-xs text-gray-500">Annuler</button>
                        <button onClick={() => handleReply(comment.id)} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Répondre</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}
        
        {/* Similar Advices */}
        {similarAdvices.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
              Conseils similaires
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {similarAdvices.map((similarAdvice) => (
                <motion.div
                  key={similarAdvice.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  onClick={() => router.push(`/conseils/${similarAdvice.id}`)}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-5 hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mr-3 text-xl sm:text-2xl">
                      {similarAdvice.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate text-sm sm:text-base">{similarAdvice.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{similarAdvice.organization?.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {formatStats(similarAdvice.viewsCount)}
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {formatStats(similarAdvice.reactionsCount)}
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-teal-600 transition-all text-sm sm:text-base">
                    Voir <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </main>
      
      {/* Share Modal */}
      <AnimatePresence>
        {showShareOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowShareOptions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl p-4 sm:p-6 m-4 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Partager le conseil</h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare('whatsapp')}
                  className="p-3 sm:p-4 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all flex flex-col items-center"
                >
                  <span className="text-xl sm:text-2xl mb-1">W</span>
                  <span className="text-xs sm:text-sm font-medium">WhatsApp</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare('facebook')}
                  className="p-3 sm:p-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all flex flex-col items-center"
                >
                  <span className="text-xl sm:text-2xl mb-1">F</span>
                  <span className="text-xs sm:text-sm font-medium">Facebook</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare('twitter')}
                  className="p-3 sm:p-4 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-100 transition-all flex flex-col items-center"
                >
                  <span className="text-xl sm:text-2xl mb-1">T</span>
                  <span className="text-xs sm:text-sm font-medium">Twitter</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare('linkedin')}
                  className="p-3 sm:p-4 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-all flex flex-col items-center"
                >
                  <span className="text-xl sm:text-2xl mb-1">L</span>
                  <span className="text-xs sm:text-sm font-medium">LinkedIn</span>
                </motion.button>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleShare('copy')}
                className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center text-sm sm:text-base ${
                  copiedLink 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Lien copié !
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Copier le lien
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Prompt Modal */}
      <AnimatePresence>
        {isLoginPromptOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Connexion requise</h3>
              <p className="text-gray-600 mb-6 text-sm">Vous devez être connecté pour interagir avec ce conseil.</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push('/login')}
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