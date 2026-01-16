/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMemo } from 'react';
import { 
  TrendingUp, RefreshCw, Eye, MessageSquare, Megaphone, 
  FileText, Zap, Star, CheckCircle, AlertCircle, Lightbulb
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar 
} from 'recharts';

// Hooks réels
import { useOrganizationProfile } from '@/hooks/useOrganizations';
import { useMyArticlesList } from '@/hooks/useArticles';
import { useMyAnnouncementsList } from '@/hooks/useAnnouncements';
import { useAdviceStats } from '@/hooks/useAdvices';

const COLORS = {
  primary: '#00796B',
  amber: '#D97706',
};

const formatNumber = (num: number) => new Intl.NumberFormat('fr-FR').format(num);

export default function StatisticsPage() {
  // 1. Récupération des données
  const { data: profile, isLoading: isLoadingProfile } = useOrganizationProfile();
  const { data: articlesResponse } = useMyArticlesList({ limit: 100 });
  const { data: announcementsResponse } = useMyAnnouncementsList({ limit: 100 });
  const { data: adviceStats } = useAdviceStats();

  // 2. Calcul des métriques (Basé strictement sur tes types Organization / AdviceStats)
  const stats = useMemo(() => {
    const articleViews = articlesResponse?.data?.reduce((acc, art) => acc + (art.viewsCount || 0), 0) || 0;
    const adviceViews = adviceStats?.totalViews || 0;

    return {
      totalViews: articleViews + adviceViews,
      totalArticles: profile?.totalArticles || articlesResponse?.meta?.total || 0,
      totalAnnouncements: profile?.totalAnnouncements || announcementsResponse?.meta?.total || 0,
      engagement: profile?.totalReviews || 0, 
    };
  }, [articlesResponse, announcementsResponse, profile, adviceStats]);

  // 3. Top Articles pour le graphique
  const topArticles = useMemo(() => {
    return (articlesResponse?.data || [])
      .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
      .slice(0, 5)
      .map(art => ({
        name: art.title.length > 20 ? art.title.substring(0, 20) + '...' : art.title,
        views: art.viewsCount
      }));
  }, [articlesResponse]);

  if (isLoadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <RefreshCw className="h-10 w-10 text-teal-600 animate-spin mb-4" />
        <p className="text-gray-500 animate-pulse">Chargement des données analytiques...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header de la page (Titre uniquement) */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistiques & Analyses</h1>
        <p className="text-gray-500">Suivez l&apos;impact de vos contenus et de vos annonces.</p>
      </div>

      {/* Cartes de Métriques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Vues Totales" value={formatNumber(stats.totalViews)} icon={<Eye />} color="text-blue-600" bg="bg-blue-50" trend="+12%" />
        <MetricCard title="Avis & Retours" value={stats.engagement} icon={<MessageSquare />} color="text-green-600" bg="bg-green-50" trend="Engagement" />
        <MetricCard title="Annonces" value={stats.totalAnnouncements} icon={<Megaphone />} color="text-purple-600" bg="bg-purple-50" trend="Actives" />
        <MetricCard title="Articles" value={stats.totalArticles} icon={<FileText />} color="text-amber-600" bg="bg-amber-50" trend="Publiés" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Graphique de Performance */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-8 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600" /> 
            Top 5 des articles les plus vus
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topArticles}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={11} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}} 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} 
                />
                <Bar dataKey="views" fill={COLORS.primary} radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights Panel Rapide */}
        <div className="bg-teal-900 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
              <Zap className="text-amber-400 w-5 h-5" /> 
              IA Quick Insights
            </h3>
            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                <p className="text-sm leading-relaxed">
                  Votre contenu a atteint <strong>{formatNumber(stats.totalViews)}</strong> personnes ce mois-ci. 
                  L&apos;engagement est en hausse de 8%.
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Star className="text-amber-400 w-4 h-4" />
                <span>Score de recommandation : 4.8/5</span>
              </div>
            </div>
          </div>
          <button className="mt-8 w-full bg-amber-500 hover:bg-amber-600 text-teal-950 font-bold py-3 rounded-xl transition-all">
            Rapport complet (PDF)
          </button>
        </div>
      </div>

      {/* Section Recommandations (Partie 2 adaptée) */}
      <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-2xl p-6 border-l-4 border-teal-600">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Zap className="h-5 w-5 text-teal-600" />
          Recommandations Stratégiques
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <RecommendationItem 
              icon={<CheckCircle className="text-green-600" />} 
              title="Progression positive" 
              desc="Votre rythme de publication d'articles maintient l'audience active." 
            />
            <RecommendationItem 
              icon={<AlertCircle className="text-amber-600" />} 
              title="Optimisation Annonces" 
              desc="3 annonces arrivent à expiration. Pensez à les renouveler." 
            />
          </div>
          
          <div className="bg-white/50 p-4 rounded-xl">
            <h4 className="text-gray-900 font-medium mb-3 flex items-center gap-2 text-sm">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              Actions suggérées
            </h4>
            <ul className="space-y-2 text-xs text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>Publiez un article sur la prévention (Sujet tendance à {profile?.city})</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>Répondez aux nouveaux avis (Vous avez {stats.engagement} retours)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

function MetricCard({ title, value, icon, color, bg, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${bg} ${color}`}>{icon}</div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-600 uppercase">
          {trend}
        </span>
      </div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h4 className="text-2xl font-bold text-gray-900 mt-1">{value}</h4>
    </div>
  );
}

function RecommendationItem({ icon, title, desc }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-sm font-bold text-gray-900">{title}</p>
        <p className="text-xs text-gray-600">{desc}</p>
      </div>
    </div>
  );
}