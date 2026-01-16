/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useMemo } from 'react';
import { 
  MessageSquare, Search, Filter, Reply, Trash2, EyeOff, 
  ChevronRight, MoreVertical, Send, User, Calendar, 
  FileText, Megaphone, Lightbulb, CheckCircle2, Clock,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

// Hooks réels
import { 
  useCommentsList, 
  useCreateComment, 
  useUpdateComment, 
  useRemoveComment 
} from '@/hooks/useComments';
import { useOrganizationProfile } from '@/hooks/useOrganizations';
import { CommentStatus } from '@/types/comment';
import { motion } from 'framer-motion';

// Types de contenu pour filtrage
type ContentTab = 'ALL' | 'ARTICLE' | 'ANNOUNCEMENT' | 'ADVICE';

export default function InteractionsPage() {
  const [activeTab, setActiveTab] = useState<ContentTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // 1. Données de l'organisation pour identifier ses propres réponses
  const { data: profile } = useOrganizationProfile();

  // 2. Récupération des commentaires (On filtre par contentType si pas 'ALL')
  const { data: commentsData, isLoading, refetch } = useCommentsList({
    page: 1,
    limit: 50,
    contentType: activeTab === 'ALL' ? undefined : activeTab,
    search: searchQuery || undefined
  });

  // 3. Mutations
  const createReply = useCreateComment();
  const updateComment = useUpdateComment();
  const removeComment = useRemoveComment();

  // 4. Logique de réponse
  const handleSendReply = async (parentComment: any) => {
    if (!replyContent.trim()) return;

    try {
      await createReply.mutateAsync({
        content: replyContent,
        contentId: parentComment.contentId,
        contentType: parentComment.contentType,
        parentCommentId: parentComment.id
      });
      setReplyContent('');
      setReplyTo(null);
      refetch();
    } catch (error) {
      // Le toast est déjà géré dans le hook
    }
  };

  // 5. Logique de modération
  const toggleVisibility = async (comment: any) => {
    const newStatus = comment.status === CommentStatus.VISIBLE ? CommentStatus.HIDDEN : CommentStatus.VISIBLE;
    await updateComment.mutateAsync({
      id: comment.id,
      data: { status: newStatus }
    });
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Supprimer définitivement ce commentaire ?')) {
      await removeComment.mutateAsync(id);
      refetch();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header & Statistiques Rapides */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="text-teal-600" />
            Centre d&apos;interactions
          </h1>
          <p className="text-gray-500">Gérez les commentaires et répondez à votre communauté.</p>
        </div>
      </div>

      {/* Barre de Filtres */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <TabButton active={activeTab === 'ALL'} onClick={() => setActiveTab('ALL')} label="Tous" />
            <TabButton active={activeTab === 'ARTICLE'} onClick={() => setActiveTab('ARTICLE')} label="Articles" icon={<FileText className="w-4 h-4" />} />
            <TabButton active={activeTab === 'ANNOUNCEMENT'} onClick={() => setActiveTab('ANNOUNCEMENT')} label="Annonces" icon={<Megaphone className="w-4 h-4" />} />
            <TabButton active={activeTab === 'ADVICE'} onClick={() => setActiveTab('ADVICE')} label="Conseils" icon={<Lightbulb className="w-4 h-4" />} />
          </div>

          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Rechercher un commentaire..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Liste des Commentaires */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12"><RefreshCw className="animate-spin text-teal-600" /></div>
        ) : commentsData?.data.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed p-12 text-center text-gray-500">
            Aucun commentaire trouvé.
          </div>
        ) : (
          commentsData?.data.map((comment) => (
            <div key={comment.id} className={`bg-white rounded-2xl border transition-all ${comment.status === CommentStatus.HIDDEN ? 'opacity-60 grayscale' : 'shadow-sm hover:shadow-md'}`}>
              <div className="p-6">
                {/* Header Commentaire */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border-2 border-white shadow-sm">
                      {comment.user?.avatar ? <img src={comment.user.avatar} className="rounded-full" /> : comment.user?.firstName?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {comment.user ? `${comment.user.firstName} ${comment.user.lastName}` : 'Utilisateur anonyme'}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1 uppercase font-semibold text-teal-600">
                          {getContentIcon(comment.contentType)} {comment.contentType}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {format(new Date(comment.createdAt), 'dd MMMM yyyy', { locale: fr })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleVisibility(comment)}
                      className={`p-2 rounded-lg transition-colors ${comment.status === CommentStatus.HIDDEN ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-100 text-gray-400'}`}
                      title={comment.status === CommentStatus.HIDDEN ? "Rendre visible" : "Masquer"}
                    >
                      <EyeOff className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(comment.id)}
                      className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Contenu */}
                <p className="text-gray-700 text-sm leading-relaxed mb-4 pl-1">
                  {comment.content}
                </p>

                {/* Actions & Réponses */}
                <div className="flex items-center gap-6 pt-4 border-t">
                  <button 
                    onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                    className="flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
                  >
                    <Reply className="w-4 h-4" /> 
                    {replyTo === comment.id ? 'Annuler' : 'Répondre'}
                  </button>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <CheckCircle2 className={`w-3 h-3 ${comment.repliesCount > 0 ? 'text-green-500' : 'text-gray-300'}`} />
                    {comment.repliesCount > 0 ? `${comment.repliesCount} réponse(s)` : 'Pas encore de réponse'}
                  </span>
                </div>

                {/* Zone de saisie Réponse */}
                {replyTo === comment.id && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 pt-4">
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <textarea 
                          autoFocus
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 min-h-[80px]"
                          placeholder="Écrivez votre réponse en tant qu'organisation..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                        />
                      </div>
                      <button 
                        disabled={!replyContent.trim() || createReply.isPending}
                        onClick={() => handleSendReply(comment)}
                        className="bg-teal-600 text-white p-3 rounded-xl self-end hover:bg-teal-700 disabled:opacity-50 transition-all shadow-lg shadow-teal-100"
                      >
                        {createReply.isPending ? <RefreshCw className="animate-spin" /> : <Send className="w-5 h-5" />}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Affichage des réponses existantes (si présentes) */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 space-y-3 pl-8 border-l-2 border-gray-100">
                    {comment.replies.map((reply: any) => (
                      <div key={reply.id} className="bg-gray-50 p-3 rounded-xl text-sm relative">
                        <div className="flex justify-between items-center mb-1">
                           <span className="font-bold text-teal-700 flex items-center gap-1 text-xs">
                             <CheckCircle2 className="w-3 h-3" /> Votre réponse
                           </span>
                           <span className="text-[10px] text-gray-400">{format(new Date(reply.createdAt), 'dd/MM HH:mm')}</span>
                        </div>
                        <p className="text-gray-600 italic font-medium leading-tight">&quot;{reply.content}&quot;</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

function TabButton({ active, onClick, label, icon }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${active ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
    >
      {icon}
      {label}
    </button>
  );
}

function getContentIcon(type: string) {
  switch (type) {
    case 'ARTICLE': return <FileText className="w-3 h-3" />;
    case 'ANNOUNCEMENT': return <Megaphone className="w-3 h-3" />;
    case 'ADVICE': return <Lightbulb className="w-3 h-3" />;
    default: return null;
  }
}