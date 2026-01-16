/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
// src/app/hopitals/dashboard/page.tsx
'use client';

import { useMemo } from 'react';
import { 
  Users, Megaphone, FileText, Star, 
  TrendingUp, Eye, Heart, Share2, 
  Plus, ArrowRight, Loader2 
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getCloudinaryImageUrl } from '@/lib/cloudinary';

// Hooks réels
import { useOrganizationProfile, useOrganizationMembers } from '@/hooks/useOrganizations';
import { useAdviceStats } from '@/hooks/useAdvices';
import { useMyAnnouncementsList } from '@/hooks/useAnnouncements';
import { StatsCard } from '@/components/dashboard/StatsCard';

// Composants locauxs

export default function OverviewPage() {
  // 1. Fetch des données réelles
  const { data: profile, isLoading: profileLoading } = useOrganizationProfile();
  const { data: stats, isLoading: statsLoading } = useAdviceStats();
  const { data: members } = useOrganizationMembers();
  const { data: recentAnnouncements } = useMyAnnouncementsList({ limit: 3 });

  const isLoading = profileLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 text-teal-600 animate-spin mb-4" />
        <p className="text-gray-500 animate-pulse">Chargement de vos statistiques...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header de bienvenue */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Content de vous revoir, {profile?.name} ! 👋
          </h1>
          <p className="text-gray-500">
            Voici ce qui se passe sur votre plateforme aujourd&apos;hui.
          </p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/hopitals/dashboard/announcements/create"
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-xl hover:bg-teal-700 transition-all shadow-sm shadow-teal-200"
          >
            <Plus size={18} />
            <span className="font-medium text-sm">Nouvelle Annonce</span>
          </Link>
        </div>
      </div>

      {/* Grille de Statistiques Réelles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Vues totales"
          value={stats?.totalViews || 0}
          icon={<Eye size={22} />}
          color="blue"
          description="Impact de vos contenus"
        />
        <StatsCard
          title="Réactions"
          value={stats?.totalReactions || 0}
          icon={<Heart size={22} />}
          color="red"
          description="Engagement citoyen"
        />
        <StatsCard
          title="Partages"
          value={stats?.totalShares || 0}
          icon={<Share2 size={22} />}
          color="purple"
          description="Portée de vos conseils"
        />
        <StatsCard
          title="Membres équipe"
          value={members?.length || 0}
          icon={<Users size={22} />}
          color="teal"
          description="Personnel actif"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne Gauche : Activité Réelle (Annonces) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Megaphone size={18} className="text-teal-600" />
                Annonces récentes
              </h3>
              <Link href="/hopitals/dashboard/announcements" className="text-sm text-teal-600 font-medium hover:underline">
                Voir tout
              </Link>
            </div>
           <div className="divide-y divide-gray-50">
          {recentAnnouncements?.data.length ? (
            recentAnnouncements.data.map((ann) => (
              <div key={ann.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* On utilise l'image mise en avant si elle existe, sinon la lettre */}
                  {ann.featuredImage ? (
                    <img 
                    src={getCloudinaryImageUrl(ann.featuredImage, { width: 100, height: 100, crop: 'fill' })}
                      alt="" 
                      className="w-12 h-12 rounded-xl object-cover shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 font-bold text-lg">
                      {ann.title.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 line-clamp-1">{ann.title}</p>
                    <p className="text-sm text-gray-500">
                      {/* Correction TS : On utilise publishedAt ou startDate */}
                      {ann.publishedAt 
                        ? `Publié le ${new Date(ann.publishedAt).toLocaleDateString()}` 
                        : `Débute le ${new Date(ann.startDate).toLocaleDateString()}`
                      }
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <Users size={16} className="text-gray-400" />
                    {ann.registeredCount} inscrits
                  </div>
                  {/* Petit badge de statut fonctionnel */}
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    ann.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {ann.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-400">
              Aucune annonce publiée pour le moment.
            </div>
          )}
        </div>
          </div>
        </div>

        {/* Colonne Droite : Etat de l'Organisation */}
        <div className="space-y-6">
          <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-teal-400">
              <TrendingUp size={18} />
              Statut Vérification
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Document de licence</span>
                {profile?.licenseDocument ? (
                  <span className="text-green-400 bg-green-400/10 px-2 py-0.5 rounded text-xs">Soumis</span>
                ) : (
                  <span className="text-red-400 bg-red-400/10 px-2 py-0.5 rounded text-xs">Manquant</span>
                )}
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Vérification plateforme</span>
                {profile?.isVerified ? (
                  <span className="text-teal-400 font-bold flex items-center gap-1">
                     Certifié
                  </span>
                ) : (
                  <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded text-xs">En attente</span>
                )}
              </div>
            </div>
            {!profile?.isVerified && (
              <button className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white text-xs py-2 rounded-lg transition-all border border-white/10">
                Compléter mon dossier
              </button>
            )}
          </div>

          {/* Tips Rapides */}
          <div className="bg-teal-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-bold mb-2">Conseil Santé</h4>
              <p className="text-sm text-teal-100 leading-relaxed">
                Les articles avec des images de couverture professionnelles reçoivent 40% plus de vues. Pensez à illustrer vos articles !
              </p>
            </div>
            <FileText className="absolute -bottom-4 -right-4 h-24 w-24 text-teal-500 opacity-30 rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
}