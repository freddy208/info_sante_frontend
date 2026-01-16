'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Edit, Eye, MoreVertical, ChevronLeft, ChevronRight,
  Trash2, Copy, Archive, Upload, CheckCircle, Clock, 
  FileText, Lightbulb, Grid, List, Heart, Share2, Target, RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Hooks et Types
import { 
  useMyAdvicesList, 
  useRemoveAdvice, 
  usePublishAdvice, 
  useArchiveAdvice,
  useAdviceStats 
} from '@/hooks/useAdvices';
import { Advice, Priority, AdviceStatus, TargetAudience } from '@/types/advice';

// --- Fonctions utilitaires ---
const formatNumber = (num: number) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const getPriorityStyles = (priority: Priority) => {
  switch (priority) {
    case Priority.URGENT: return 'bg-red-100 text-red-800 border-red-200';
    case Priority.HIGH: return 'bg-orange-100 text-orange-800 border-orange-200';
    case Priority.MEDIUM: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case Priority.LOW: return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityLabel = (priority: Priority) => {
  const labels = { [Priority.URGENT]: 'Urgent', [Priority.HIGH]: 'Élevée', [Priority.MEDIUM]: 'Moyenne', [Priority.LOW]: 'Basse' };
  return labels[priority] || priority;
};

// --- Composants Internes ---

function ActionMenu({ 
  advice, 
  onDelete, 
  onToggleStatus 
}: { 
  advice: Advice; 
  onDelete: () => void; 
  onToggleStatus: () => void; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="relative">
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} 
        className={`p-2 rounded-xl transition-all ${isOpen ? 'bg-teal-600 text-white' : 'hover:bg-gray-100 text-gray-500'}`}
      >
        <MoreVertical className="h-5 w-5" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 z-[70] py-2 overflow-hidden"
            >
              <button onClick={() => router.push(`/dashboard/conseils/${advice.id}`)} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-gray-50">
                <Eye className="h-4 w-4 text-blue-500" /> Voir les détails
              </button>
              <button onClick={() => router.push(`/dashboard/conseils/${advice.id}/edit`)} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-gray-50">
                <Edit className="h-4 w-4 text-gray-500" /> Modifier
              </button>
              <button onClick={() => { onToggleStatus(); setIsOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-gray-50">
                {advice.status === AdviceStatus.PUBLISHED ? <Archive className="h-4 w-4 text-orange-500" /> : <Upload className="h-4 w-4 text-green-500" />}
                {advice.status === AdviceStatus.PUBLISHED ? 'Archiver' : 'Publier'}
              </button>
              <div className="border-t my-1" />
              <button onClick={() => { onDelete(); setIsOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-red-50 text-red-600 font-medium">
                <Trash2 className="h-4 w-4" /> Supprimer
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Page Principale ---

export default function AdviceManagementPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Hooks API
  const { data: advicesData, isLoading } = useMyAdvicesList({ 
    page: currentPage, 
    limit: 9, 
    search: searchTerm 
  });
  const { data: stats } = useAdviceStats();
  
  const removeAdvice = useRemoveAdvice();
  const publishAdvice = usePublishAdvice();
  const archiveAdvice = useArchiveAdvice();

  const advices = advicesData?.data || [];
  const meta = advicesData?.meta;

  const handleDelete = async (id: string) => {
    if (window.confirm('Supprimer ce conseil définitivement ?')) {
      await removeAdvice.mutateAsync(id);
    }
  };

  const handleToggleStatus = async (advice: Advice) => {
    if (advice.status === AdviceStatus.PUBLISHED) {
      await archiveAdvice.mutateAsync(advice.id);
    } else {
      await publishAdvice.mutateAsync(advice.id);
    }
  };
  const displayStats = useMemo(() => {
  // On utilise les stats de l'API s'ils existent, sinon on calcule sur la liste actuelle
  return {
    total: stats?.total ?? advices.length,
    published: stats?.published ?? advices.filter(a => a.status === AdviceStatus.PUBLISHED).length,
    views: stats?.totalViews ?? advices.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0),
    reactions: stats?.totalReactions ?? advices.reduce((acc, curr) => acc + (curr.reactionsCount || 0), 0),
  };
}, [stats, advices]);

  return (
    <div className="space-y-8 p-4 pb-24 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Conseils Santé</h1>
          <p className="text-gray-500">Diffusez des messages de prévention et de bien-être</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white border rounded-xl p-1 flex shadow-sm">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-teal-50 text-teal-600' : 'text-gray-400'}`}><Grid className="h-5 w-5" /></button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-teal-50 text-teal-600' : 'text-gray-400'}`}><List className="h-5 w-5" /></button>
          </div>
          <button 
            onClick={() => router.push('/dashboard/conseils/create')}
            className="bg-teal-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all"
          >
            <Plus className="h-5 w-5" /> Nouveau
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {[
    { label: 'Total', val: displayStats.total, icon: <Lightbulb />, color: 'text-blue-600 bg-blue-50' },
    { label: 'Publiés', val: displayStats.published, icon: <CheckCircle />, color: 'text-green-600 bg-green-50' },
    { label: 'Vues', val: formatNumber(displayStats.views), icon: <Eye />, color: 'text-purple-600 bg-purple-50' },
    { label: 'Réactions', val: formatNumber(displayStats.reactions), icon: <Heart />, color: 'text-red-600 bg-red-50' },
  ].map((s, i) => (
    <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase">{s.label}</p>
        <p className="text-2xl font-bold text-gray-900">{s.val}</p>
      </div>
      <div className={`p-3 rounded-xl ${s.color}`}>{s.icon}</div>
    </div>
  ))}
</div>

      {/* Search & Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Rechercher un conseil..." 
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-50 outline-none focus:border-teal-500 transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <RefreshCw className="h-10 w-10 text-teal-600 animate-spin" />
          <p className="text-gray-400 font-medium">Chargement des conseils...</p>
        </div>
      ) : advices.length > 0 ? (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {advices.map((advice) => (
            <motion.div 
              key={advice.id} layout
              className={`bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all relative border-l-8 ${
                advice.priority === Priority.URGENT ? 'border-l-red-500' : 'border-l-teal-500'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner">
                  {advice.icon || '💡'}
                </div>
                <ActionMenu 
                  advice={advice} 
                  onDelete={() => handleDelete(advice.id)} 
                  onToggleStatus={() => handleToggleStatus(advice)} 
                />
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase border ${getPriorityStyles(advice.priority)}`}>
                    {getPriorityLabel(advice.priority)}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-gray-100 text-gray-600">
                    {advice.category?.name}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-2">{advice.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{advice.content?.substring(0, 100)}...</p>
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                <div className="flex gap-3">
                  <div className="flex items-center gap-1 text-gray-400 text-xs font-bold">
                    <Eye className="h-3.5 w-3.5" /> {formatNumber(advice.viewsCount)}
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs font-bold">
                    <Heart className="h-3.5 w-3.5" /> {formatNumber(advice.reactionsCount)}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-teal-600 bg-teal-50 px-2 py-1 rounded-lg text-[10px] font-black uppercase">
                   <Target className="h-3 w-3" /> {advice.targetAudience?.[0] || 'Tous'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
          <Lightbulb className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">Aucun conseil trouvé</h3>
          <p className="text-gray-500 mt-2 mb-6">Commencez par créer votre premier message de santé.</p>
          <button onClick={() => router.push('/dashboard/conseils/create')} className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold">Créer un conseil</button>
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-8">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-3 rounded-2xl border bg-white disabled:opacity-30 hover:bg-gray-50 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-bold text-sm bg-white px-6 py-3 rounded-2xl border">
            Page {currentPage} / {meta.totalPages}
          </span>
          <button 
            disabled={currentPage === meta.totalPages} 
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-3 rounded-2xl border bg-white disabled:opacity-30 hover:bg-gray-50 transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}