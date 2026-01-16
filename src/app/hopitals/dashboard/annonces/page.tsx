/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Plus, Edit, Eye, Trash2, Calendar, 
  MessageSquare, Upload, RefreshCw, CheckCircle, 
  Clock, FileText, Megaphone, ChevronLeft, ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { getAnnouncementImageUrl, getCloudinaryImageUrl } from '@/lib/cloudinary';

// HOOKS & TYPES RÉELS
import { 
  useMyAnnouncementsList, 
  usePublishAnnouncement, 
  useRemoveAnnouncement 
} from '@/hooks/useAnnouncements';
import { AnnouncementStatus, PaginatedAnnouncementsResponse } from '@/types/announcement';

export default function CampaignsManagementPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // 1. FETCHING DATA
  // On force le typage de la réponse pour éviter les erreurs sur 'meta'
  const { data, isLoading: isDataLoading } = useMyAnnouncementsList({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    status: filterStatus === 'all' ? undefined : (filterStatus as any),
  }) as { data: PaginatedAnnouncementsResponse | undefined, isLoading: boolean };

  const announcements = data?.data || [];
  const meta = data?.meta;

  // 2. MUTATIONS
  const publishMutation = usePublishAnnouncement();
  const removeMutation = useRemoveAnnouncement();

  const handlePublish = async (id: string) => {
    try {
      await publishMutation.mutateAsync(id);
      toast.success("Annonce publiée !");
    } catch (e) { toast.error("Erreur de publication"); }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer cette annonce ?")) {
      try {
        await removeMutation.mutateAsync(id);
        toast.success("Annonce supprimée");
      } catch (e) { toast.error("Erreur de suppression"); }
    }
  };

  const getStatusStyle = (status: AnnouncementStatus) => {
    switch (status) {
      case AnnouncementStatus.PUBLISHED: return 'bg-green-100 text-green-700 border-green-200';
      case AnnouncementStatus.DRAFT: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Annonces</h1>
          <p className="text-gray-500">Gérez vos campagnes et communications santé.</p>
        </div>
        <button 
          onClick={() => router.push('/hopitals/dashboard/annonces/creation')}
          className="bg-teal-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center hover:bg-teal-700 transition-all shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" /> Nouvelle annonce
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total</p>
            <h3 className="text-2xl font-bold">{meta?.total || 0}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FileText size={24}/></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 font-medium">Publiées</p>
            <h3 className="text-2xl font-bold text-green-600">
              {announcements.filter(a => a.status === AnnouncementStatus.PUBLISHED).length}
            </h3>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><CheckCircle size={24}/></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 font-medium">Brouillons</p>
            <h3 className="text-2xl font-bold text-yellow-600">
              {announcements.filter(a => a.status === AnnouncementStatus.DRAFT).length}
            </h3>
          </div>
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl"><Clock size={24}/></div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500" 
            placeholder="Rechercher par titre..." 
          />
        </div>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-teal-500 cursor-pointer"
        >
          <option value="all">Tous les statuts</option>
          <option value={AnnouncementStatus.PUBLISHED}>Publiées</option>
          <option value={AnnouncementStatus.DRAFT}>Brouillons</option>
        </select>
      </div>

      {/* Table Section */}
      {isDataLoading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <RefreshCw className="animate-spin h-10 w-10 text-teal-600" />
          <p className="text-gray-500 font-medium">Chargement de vos données...</p>
        </div>
      ) : announcements.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Annonce</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Engagement</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {announcements.map((ann) => (
                  <tr key={ann.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={getAnnouncementImageUrl(ann.featuredImage || '', { width: 100, height: 100, crop: 'thumb' })} 
                          className="h-12 w-12 rounded-xl object-cover shadow-sm"
                          alt={ann.title} 
                        />
                        <div>
                          <p className="font-bold text-gray-900 line-clamp-1">{ann.title}</p>
                          <p className="text-xs text-gray-500 flex items-center mt-0.5">
                            <Calendar className="h-3 w-3 mr-1" /> 
                            Début : {new Date(ann.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(ann.status)}`}>
                        {ann.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4 text-gray-500">
                        <div className="flex items-center text-sm"><Eye size={16} className="mr-1.5"/> {ann.viewsCount}</div>
                        <div className="flex items-center text-sm"><MessageSquare size={16} className="mr-1.5"/> {ann.commentsCount || 0}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-1">
                        <button onClick={() => router.push(`/annonces/${ann.id}`)} title="Voir" className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"><Eye size={18}/></button>
                        <button onClick={() => router.push(`/annonces/edition/${ann.id}`)} title="Modifier" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18}/></button>
                        {ann.status === AnnouncementStatus.DRAFT && (
                          <button onClick={() => handlePublish(ann.id)} title="Publier" className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"><Upload size={18}/></button>
                        )}
                        <button onClick={() => handleDelete(ann.id)} title="Supprimer" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
              <p className="text-sm text-gray-500 font-medium">Page {meta.page} sur {meta.totalPages}</p>
              <div className="flex space-x-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-2 border bg-white rounded-lg disabled:opacity-30 hover:border-teal-500 hover:text-teal-600 transition-all shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  disabled={currentPage === meta.totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="p-2 border bg-white rounded-lg disabled:opacity-30 hover:border-teal-500 hover:text-teal-600 transition-all shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
          <Megaphone className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">Aucune annonce trouvée</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">Vous n&apos;avez pas encore publié d&apos;annonces ou aucun résultat ne correspond à votre recherche.</p>
          <button onClick={() => router.push('/hopitals/dashboard/annonces/creation')} className="mt-8 bg-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-md">
            Créer ma première annonce
          </button>
        </motion.div>
      )}

      {/* Mutation Overlay */}
      {(publishMutation.isPending || removeMutation.isPending) && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-[2px] z-[100] flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-2xl border border-teal-50 flex items-center gap-4">
            <RefreshCw className="animate-spin text-teal-600 h-6 w-6" />
            <span className="font-bold text-gray-800">Mise à jour de vos annonces...</span>
          </div>
        </div>
      )}
    </div>
  );
}