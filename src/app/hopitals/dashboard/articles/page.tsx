/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Edit, Eye, MoreVertical, ChevronLeft, ChevronRight,
  Trash2, Star, Archive, Upload, CheckCircle, Clock, 
  FileText, BookOpen, MessageSquare, RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { getCloudinaryImageUrl } from '@/lib/cloudinary';

// Imports des hooks corrigés
import { 
  useMyArticlesList, 
  useRemoveArticle, 
  usePublishArticle, 
  useFeatureArticle 
} from '@/hooks/useArticles';

// Types
import { Article } from '@/types/article';

const formatNumber = (num: number) => {
  if (!num) return '0';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'PUBLISHED':
      return { color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle className="h-4 w-4" />, label: 'Publié' };
    case 'DRAFT':
      return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Clock className="h-4 w-4" />, label: 'Brouillon' };
    case 'ARCHIVED':
      return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: <Archive className="h-4 w-4" />, label: 'Archivé' };
    default:
      return { color: 'bg-gray-100 text-gray-800', icon: <Clock className="h-4 w-4" />, label: status };
  }
};

function ActionMenu({ article, onDelete, onToggleFeature, onToggleStatus }: { 
  article: Article; 
  onDelete: () => void; 
  onToggleFeature: () => void; 
  onToggleStatus: () => void; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
        <MoreVertical className="h-5 w-5 text-gray-500" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-200 z-[110] py-2"
            >
              <button onClick={() => router.push(`/articles/${article.id}`)} className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50">
                <Eye className="h-4 w-4 text-blue-500" /> Voir l&apos;article
              </button>
              <button onClick={() => router.push(`/dashboard/articles/${article.id}/edit`)} className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50">
                <Edit className="h-4 w-4 text-gray-500" /> Modifier
              </button>
              <button onClick={() => { onToggleFeature(); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50">
                <Star className={`h-4 w-4 ${article.isFeatured ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} /> 
                {article.isFeatured ? 'Retirer vedette' : 'Mettre en vedette'}
              </button>
              <button onClick={() => { onToggleStatus(); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50">
                {article.status === 'DRAFT' ? <Upload className="h-4 w-4 text-green-500" /> : <Archive className="h-4 w-4 text-orange-500" />}
                {article.status === 'DRAFT' ? 'Publier' : 'Archiver'}
              </button>
              <div className="border-t my-1" />
              <button onClick={() => { onDelete(); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-red-50 text-red-600">
                <Trash2 className="h-4 w-4" /> Supprimer
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ArticlesManagementPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useMyArticlesList({ page: currentPage, limit: 12, search: searchTerm });
  const removeArticle = useRemoveArticle();
  const publishArticle = usePublishArticle();
  const featureArticle = useFeatureArticle();

  // ✅ CORRECTION 1 : Accès à 'data' au lieu de 'items'
  const articles = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages || 1;

  const handleDelete = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet article ?')) {
      try {
        await removeArticle.mutateAsync(id);
      } catch (error) { /* Toast géré dans le hook */ }
    }
  };

  const handleToggleStatus = async (article: Article) => {
    try {
      // ✅ CORRECTION 2 : Le hook usePublishArticle attend uniquement l'ID (string)
      await publishArticle.mutateAsync(article.id);
    } catch (error) { /* Erreur gérée */ }
  };

  const handleToggleFeature = async (article: Article) => {
    try {
      // ✅ CORRECTION 3 : Le hook useFeatureArticle attend { id, isFeatured }
      await featureArticle.mutateAsync({ 
        id: article.id, 
        isFeatured: !article.isFeatured 
      });
    } catch (error) { /* Erreur gérée */ }
  };

  return (
    <div className="space-y-8 p-4 pb-30 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mes Articles</h1>
          <p className="text-gray-500">Gérez vos publications et contenus éducatifs</p>
        </div>
        <button 
          onClick={() => router.push('/dashboard/articles/create')}
          className="bg-teal-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-teal-700 transition-all shadow-lg shadow-teal-100"
        >
          <Plus className="h-5 w-5" /> Nouvel Article
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Articles</p>
            <p className="text-3xl font-bold text-gray-900">{meta?.total || 0}</p>
          </div>
          <div className="bg-teal-50 p-4 rounded-2xl">
            <FileText className="text-teal-600 h-6 w-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Vues totales</p>
            <p className="text-3xl font-bold text-gray-900">{formatNumber(articles.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0))}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl">
            <Eye className="text-blue-600 h-6 w-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">En vedette</p>
            <p className="text-3xl font-bold text-gray-900">{articles.filter(a => a.isFeatured).length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-2xl">
            <Star className="text-yellow-500 h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-teal-500" />
        <input 
          type="text" 
          placeholder="Rechercher par titre..." 
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-50 outline-none focus:border-teal-500 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <RefreshCw className="h-10 w-10 text-teal-600 animate-spin" />
          <p className="text-gray-400 font-medium">Chargement de vos articles...</p>
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article: Article) => (
            <motion.div 
              key={article.id} 
              layout
              className="bg-white rounded-4xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={getCloudinaryImageUrl(article.featuredImage)} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt={article.title}
                />
                <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm backdrop-blur-md ${getStatusStyles(article.status).color}`}>
                  <span className="flex items-center gap-1">
                    {getStatusStyles(article.status).icon}
                    {getStatusStyles(article.status).label}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 px-2 py-1 rounded-md">
                    {article.category?.name || 'Général'}
                  </span>
                  <ActionMenu 
                    article={article} 
                    onDelete={() => handleDelete(article.id)}
                    onToggleFeature={() => handleToggleFeature(article)}
                    onToggleStatus={() => handleToggleStatus(article)}
                  />
                </div>
                
                <h3 className="font-bold text-gray-900 line-clamp-2 mb-4 text-lg leading-snug h-14 group-hover:text-teal-700 transition-colors">
                  {article.title}
                </h3>
                
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Eye className="h-4 w-4" />
                      <span className="text-xs font-bold">{formatNumber(article.viewsCount)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-xs font-bold">{article.commentsCount || 0}</span>
                    </div>
                  </div>
                  {article.isFeatured && (
                    <div className="bg-yellow-50 p-1.5 rounded-lg">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
          <div className="bg-white w-20 h-20 rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-10 w-10 text-gray-200" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun article trouvé</h3>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto">Commencez à partager votre expertise en créant votre premier article dès maintenant.</p>
          <button 
            onClick={() => router.push('/dashboard/articles/create')}
            className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-black transition-all"
          >
            Créer un article
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-8">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p - 1)} 
            className="p-3 border border-gray-200 rounded-2xl disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="bg-white border border-gray-200 px-6 py-3 rounded-2xl font-bold text-sm">
            Page {currentPage} <span className="text-gray-300 mx-2">/</span> {totalPages}
          </div>
          
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(p => p + 1)} 
            className="p-3 border border-gray-200 rounded-2xl disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}