/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Calendar,
  TrendingUp,
  User,
  MapPin,
  Menu,
  Home,
  Megaphone,
  FileText,
  Lightbulb,
  Settings,
  HelpCircle,
  LogOut,
  BarChart3,
  Users,
  X,
  RefreshCw,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Send,
  Eye,
  MessageSquare,
  Smartphone,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Activity,
  Target,
  Zap,
  Shield,
  Monitor,
  Tablet,
  ArrowUp,
  ArrowDown,
  Minus,
  Bell,
  Star
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar,
  ComposedChart,
  Legend
} from 'recharts';

// Types pour les données
interface TimeRange {
  value: string;
  label: string;
}

interface MetricCard {
  title: string;
  value: string;
  delta: number;
  deltaText: string;
  icon: React.ReactNode;
  color: string;
}

interface Campaign {
  id: string;
  title: string;
  views: number;
  engagements: number;
}

interface Article {
  id: string;
  title: string;
  views: number;
  likes: number;
}

interface TrafficSource {
  name: string;
  value: number;
  percentage: number;
  subSources?: { name: string; value: number; percentage: number }[];
}

interface DeviceData {
  name: string;
  value: number;
  percentage: number;
}

// Données mocks pour les métriques
const mockMetrics: MetricCard[] = [
  {
    title: 'Vues totales',
    value: '45.2K',
    delta: 23,
    deltaText: 'vs période précédente',
    icon: <Eye className="h-6 w-6" />,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Abonnés',
    value: '2,145',
    delta: 6.1,
    deltaText: 'vs période précédente',
    icon: <Users className="h-6 w-6" />,
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'Campagnes',
    value: '23',
    delta: 0,
    deltaText: 'Stable',
    icon: <Megaphone className="h-6 w-6" />,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    title: 'Note moyenne',
    value: '4.8',
    delta: 0.1,
    deltaText: 'vs période précédente',
    icon: <Star className="h-6 w-6" />,
    color: 'bg-amber-100 text-amber-600'
  }
];

// Données mocks pour le graphique d'évolution
const mockTrafficData = [
  { date: '01/03', profileViews: 1200, campaignViews: 450, newFollowers: 12 },
  { date: '02/03', profileViews: 1350, campaignViews: 520, newFollowers: 15 },
  { date: '03/03', profileViews: 1100, campaignViews: 480, newFollowers: 8 },
  { date: '04/03', profileViews: 1400, campaignViews: 550, newFollowers: 18 },
  { date: '05/03', profileViews: 1600, campaignViews: 600, newFollowers: 22 },
  { date: '06/03', profileViews: 1500, campaignViews: 580, newFollowers: 20 },
  { date: '07/03', profileViews: 1700, campaignViews: 620, newFollowers: 25 },
  { date: '08/03', profileViews: 1650, campaignViews: 590, newFollowers: 19 },
  { date: '09/03', profileViews: 1800, campaignViews: 650, newFollowers: 28 },
  { date: '10/03', profileViews: 1750, campaignViews: 630, newFollowers: 24 },
  { date: '11/03', profileViews: 1900, campaignViews: 700, newFollowers: 30 },
  { date: '12/03', profileViews: 1850, campaignViews: 680, newFollowers: 27 },
  { date: '13/03', profileViews: 2000, campaignViews: 750, newFollowers: 32 },
  { date: '14/03', profileViews: 1950, campaignViews: 720, newFollowers: 29 },
  { date: '15/03', profileViews: 2100, campaignViews: 800, newFollowers: 35 },
  { date: '16/03', profileViews: 2050, campaignViews: 780, newFollowers: 33 },
  { date: '17/03', profileViews: 2200, campaignViews: 850, newFollowers: 38 },
  { date: '18/03', profileViews: 2150, campaignViews: 820, newFollowers: 36 },
  { date: '19/03', profileViews: 2300, campaignViews: 900, newFollowers: 40 },
  { date: '20/03', profileViews: 2250, campaignViews: 880, newFollowers: 38 },
  { date: '21/03', profileViews: 2400, campaignViews: 950, newFollowers: 45 },
  { date: '22/03', profileViews: 2350, campaignViews: 920, newFollowers: 42 },
  { date: '23/03', profileViews: 2500, campaignViews: 1000, newFollowers: 48 },
  { date: '24/03', profileViews: 2450, campaignViews: 980, newFollowers: 46 },
  { date: '25/03', profileViews: 2600, campaignViews: 1050, newFollowers: 52 },
  { date: '26/03', profileViews: 2550, campaignViews: 1020, newFollowers: 49 },
  { date: '27/03', profileViews: 2700, campaignViews: 1100, newFollowers: 55 },
  { date: '28/03', profileViews: 2650, campaignViews: 1080, newFollowers: 53 },
  /*{ date: '29/03', profileViews: 2800, profileViews: 1150, newFollowers: 58 },*/
  { date: '30/03', profileViews: 2750, campaignViews: 1120, newFollowers: 56 }
];

// Données mocks pour les campagnes performantes
const mockTopCampaigns: Campaign[] = [
  { id: '1', title: 'Vaccination rougeole - Enfants', views: 1200, engagements: 45 },
  { id: '2', title: 'Campagne de dépistage gratuit du cancer du sein', views: 856, engagements: 23 },
  { id: '3', title: 'Distribution de moustiquaires imprégnées', views: 2100, engagements: 67 }
];

// Données mocks pour les articles populaires
const mockTopArticles: Article[] = [
  { id: '1', title: 'Les 5 signes du paludisme à ne pas ignorer', views: 3500, likes: 456 },
  { id: '2', title: 'Comment prévenir efficacement les maladies cardiovasculaires', views: 2800, likes: 312 },
  { id: '3', title: 'Nutrition équilibrée : les bases d\'une alimentation saine', views: 1650, likes: 189 }
];

// Données mocks pour les sources de trafic
const mockTrafficSources: TrafficSource[] = [
  { 
    name: 'Direct', 
    value: 15822, 
    percentage: 35,
    subSources: [
      { name: 'Signets', value: 6329, percentage: 40 },
      { name: 'URL directe', value: 4747, percentage: 30 },
      { name: 'Autres', value: 4746, percentage: 30 }
    ]
  },
  { 
    name: 'Recherche Google', 
    value: 12656, 
    percentage: 28,
    subSources: [
      { name: 'Organique', value: 8859, percentage: 70 },
      { name: 'Payante', value: 3797, percentage: 30 }
    ]
  },
  { 
    name: 'Réseaux sociaux', 
    value: 9944, 
    percentage: 22,
    subSources: [
      { name: 'Facebook', value: 4475, percentage: 45 },
      { name: 'Instagram', value: 2486, percentage: 25 },
      { name: 'Twitter', value: 1989, percentage: 20 },
      { name: 'LinkedIn', value: 994, percentage: 10 }
    ]
  },
  { 
    name: 'Sites référents', 
    value: 6778, 
    percentage: 15,
    subSources: [
      { name: 'Partenaires santé', value: 3389, percentage: 50 },
      { name: 'Annuaires médicaux', value: 2033, percentage: 30 },
      { name: 'Blogs santé', value: 1356, percentage: 20 }
    ]
  }
];

// Données mocks pour les appareils
const mockDevices: DeviceData[] = [
  { name: 'Mobile', value: 30736, percentage: 68 },
  { name: 'Desktop', value: 10848, percentage: 24 },
  { name: 'Tablette', value: 3612, percentage: 8 }
];

// Données mocks pour les navigateurs
const mockBrowsers = [
  { name: 'Chrome', value: 23472, percentage: 52 },
  { name: 'Safari', value: 12656, percentage: 28 },
  { name: 'Firefox', value: 5408, percentage: 12 },
  { name: 'Edge', value: 2268, percentage: 5 },
  { name: 'Autres', value: 1292, percentage: 3 }
];

// Données mocks pour l'âge
const mockAgeData = [
  { range: '18-24', value: 15 },
  { range: '25-34', value: 35 },
  { range: '35-44', value: 28 },
  { range: '45-54', value: 15 },
  { range: '55-64', value: 5 },
  { range: '65+', value: 2 }
];

// Couleurs pour les graphiques
const COLORS = {
  primary: '#00796B',
  secondary: '#FF6F00',
  tertiary: '#9C27B0',
  quaternary: '#4CAF50',
  quinary: '#FFC107',
  direct: '#2196F3',
  search: '#4CAF50',
  social: '#9C27B0',
  referral: '#FF9800',
  mobile: '#4CAF50',
  desktop: '#2196F3',
  tablet: '#9C27B0',
  chrome: '#4285F4',
  safari: '#FF9800',
  firefox: '#FF5722',
  edge: '#0078D4'
};

// Fonction pour formater les nombres
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

// Fonction pour obtenir la couleur du delta
const getDeltaColor = (delta: number) => {
  if (delta > 0) return 'text-green-600';
  if (delta < 0) return 'text-red-600';
  return 'text-gray-600';
};

// Fonction pour obtenir l'icône du delta
const getDeltaIcon = (delta: number) => {
  if (delta > 0) return <ArrowUp className="h-4 w-4" />;
  if (delta < 0) return <ArrowDown className="h-4 w-4" />;
  return <Minus className="h-4 w-4" />;
};

// Composant pour la carte de métrique
function MetricCard({ metric }: { metric: MetricCard }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
          <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm font-medium flex items-center ${getDeltaColor(metric.delta)}`}>
              {getDeltaIcon(metric.delta)}
              <span className="ml-1">{metric.delta > 0 ? '+' : ''}{metric.delta}%</span>
            </span>
            <span className="text-xs text-gray-500 ml-2">{metric.deltaText}</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${metric.color}`}>
          {metric.icon}
        </div>
      </div>
    </div>
  );
}

// Composant pour le sélecteur de période
function TimeRangeSelector({ 
  timeRange, 
  setTimeRange, 
  onExport 
}: { 
  timeRange: string; 
  setTimeRange: (range: string) => void; 
  onExport: (format: string) => void; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  
  const timeRanges: TimeRange[] = [
    { value: 'today', label: 'Aujourd\'hui' },
    { value: '7days', label: '7 derniers jours' },
    { value: '30days', label: '30 derniers jours' },
    { value: '3months', label: '3 derniers mois' },
    { value: '6months', label: '6 derniers mois' },
    { value: '1year', label: '1 an' },
    { value: 'custom', label: 'Personnalisé' }
  ];
  
  const exportFormats = [
    { value: 'excel', label: 'Excel' },
    { value: 'csv', label: 'CSV' },
    { value: 'pdf', label: 'PDF' }
  ];
  
  const currentRange = timeRanges.find(range => range.value === timeRange);
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <Calendar className="h-5 w-5 text-gray-500 mr-2" />
          <span className="text-gray-700">{currentRange?.label || 'Derniers 30 jours'}</span>
          <ChevronDown className="h-5 w-5 text-gray-500 ml-2" />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10 overflow-hidden">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => {
                  setTimeRange(range.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                  timeRange === range.value ? 'bg-teal-50 text-teal-700' : ''
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="relative">
        <button
          onClick={() => setIsExportOpen(!isExportOpen)}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <Download className="h-5 w-5 text-gray-500 mr-2" />
          <span className="text-gray-700">Exporter les données</span>
          <ChevronDown className="h-5 w-5 text-gray-500 ml-2" />
        </button>
        
        {isExportOpen && (
          <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10 overflow-hidden">
            {exportFormats.map((format) => (
              <button
                key={format.value}
                onClick={() => {
                  onExport(format.value);
                  setIsExportOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50"
              >
                {format.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Composant pour le graphique d'évolution du trafic
function TrafficOverviewChart() {
  const [visibleSeries, setVisibleSeries] = useState({
    profileViews: true,
    campaignViews: true,
    newFollowers: true
  });
  
  const toggleSeries = (series: string) => {
    setVisibleSeries(prev => ({
      ...prev,
      [series]: !prev[series as keyof typeof prev]
    }));
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2 text-teal-600" />
        Évolution du trafic
      </h3>
      
      <div className="h-96 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={mockTrafficData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }} 
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
              onClick={(e) => {
                if (e && e.value) {
                  toggleSeries(e.value);
                }
              }}
            />
            
            {visibleSeries.profileViews && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="profileViews"
                stroke={COLORS.primary}
                strokeWidth={2}
                dot={{ fill: COLORS.primary, r: 4 }}
                activeDot={{ r: 6 }}
                name="Vues profil"
              />
            )}
            
            {visibleSeries.campaignViews && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="campaignViews"
                stroke={COLORS.secondary}
                strokeWidth={2}
                dot={{ fill: COLORS.secondary, r: 4 }}
                activeDot={{ r: 6 }}
                name="Vues campagnes"
              />
            )}
            
            {visibleSeries.newFollowers && (
              <Bar
                yAxisId="right"
                dataKey="newFollowers"
                fill={COLORS.tertiary}
                radius={[4, 4, 0, 0]}
                name="Nouveaux abonnés"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => toggleSeries('profileViews')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            visibleSeries.profileViews 
              ? 'bg-teal-100 text-teal-700' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Vues profil
        </button>
        <button
          onClick={() => toggleSeries('campaignViews')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            visibleSeries.campaignViews 
              ? 'bg-teal-100 text-teal-700' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Vues campagnes
        </button>
        <button
          onClick={() => toggleSeries('newFollowers')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            visibleSeries.newFollowers 
              ? 'bg-teal-100 text-teal-700' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Abonnés
        </button>
      </div>
    </div>
  );
}

// Composant pour la performance de contenu
function ContentPerformance() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top campaigns */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-teal-600" />
          Performances des campagnes
        </h3>
        
        <div className="space-y-4">
          {mockTopCampaigns.map((campaign, index) => (
            <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 line-clamp-1">{campaign.title}</h4>
                <div className="flex items-center mt-1">
                  <Eye className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600">{formatNumber(campaign.views)}</span>
                  <MessageSquare className="h-4 w-4 text-gray-500 ml-3 mr-1" />
                  <span className="text-sm text-gray-600">{campaign.engagements}</span>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-4 text-center text-teal-600 hover:text-teal-700 font-medium text-sm">
          Voir tout →
        </button>
      </div>
      
      {/* Audience demographics */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-teal-600" />
          Démographie de l&apos;audience
        </h3>
        
        <div className="space-y-6">
          {/* Cities */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Villes</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Douala', value: 65, fill: COLORS.primary },
                      { name: 'Yaoundé', value: 20, fill: COLORS.secondary },
                      { name: 'Bafoussam', value: 8, fill: COLORS.tertiary },
                      { name: 'Autres', value: 7, fill: COLORS.quaternary }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                            `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                            }

                    labelLine={false}
                  >
                    {mockTrafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.primary} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Age */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Âge (estimé)</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockAgeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="value" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour les métriques d'engagement
function EngagementMetrics() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Activity className="h-5 w-5 mr-2 text-teal-600" />
        Métriques d&apos;engagement
      </h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">34.2%</div>
          <div className="text-sm text-gray-600 mb-1">Taux de rebond</div>
          <div className="flex items-center justify-center">
            <span className="text-sm text-green-600 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" />
              5.1%
            </span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">2m 34s</div>
          <div className="text-sm text-gray-600 mb-1">Temps moyen</div>
          <div className="flex items-center justify-center">
            <span className="text-sm text-red-600 flex items-center">
              <ArrowDown className="h-4 w-4 mr-1" />
              12%
            </span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">3.2</div>
          <div className="text-sm text-gray-600 mb-1">Pages/session</div>
          <div className="flex items-center justify-center">
            <span className="text-sm text-green-600 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" />
              0.3
            </span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">12.8%</div>
          <div className="text-sm text-gray-600 mb-1">Taux de conversion</div>
          <div className="flex items-center justify-center">
            <span className="text-sm text-green-600 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" />
              2.3%
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-3 bg-gray-50 rounded-xl">
        <p className="text-xs text-gray-600">
          Conversion = Nouveaux abonnés / Vues de profil
        </p>
      </div>
    </div>
  );
}

// Composant pour les sources de trafic
function TrafficSources() {
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Globe className="h-5 w-5 mr-2 text-teal-600" />
        Sources de trafic
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut chart */}
        <div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockTrafficSources.map(source => ({ name: source.name, value: source.value, fill: COLORS[source.name.toLowerCase() as keyof typeof COLORS] || COLORS.primary }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                        `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                        }

                  labelLine={false}
                >
                  {mockTrafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS] || COLORS.primary} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Detailed breakdown */}
        <div className="space-y-4">
          {mockTrafficSources.map((source) => (
            <div key={source.name} className="border-b border-gray-100 pb-4 last:border-0">
              <button
                onClick={() => setExpandedSource(expandedSource === source.name ? null : source.name)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3" 
                    style={{ backgroundColor: COLORS[source.name.toLowerCase() as keyof typeof COLORS] || COLORS.primary }}
                  />
                  <span className="font-medium text-gray-900">{source.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">{formatNumber(source.value)}</span>
                  <span className="text-sm text-gray-500">({source.percentage}%)</span>
                  <ChevronDown className={`h-4 w-4 text-gray-500 ml-2 transition-transform ${expandedSource === source.name ? 'rotate-180' : ''}`} />
                </div>
              </button>
              
              <AnimatePresence>
                {expandedSource === source.name && source.subSources && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 ml-7 space-y-2"
                  >
                    {source.subSources.map((subSource) => (
                      <div key={subSource.name} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{subSource.name}</span>
                        <div className="flex items-center">
                          <span className="text-gray-600 mr-2">{formatNumber(subSource.value)}</span>
                          <span className="text-gray-500">({subSource.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Composant pour les appareils et navigateurs
function DevicesAndBrowsers() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Devices */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Smartphone className="h-5 w-5 mr-2 text-teal-600" />
          Appareils
        </h3>
        
        <div className="space-y-3 mb-4">
          {mockDevices.map((device) => (
            <div key={device.name} className="flex items-center justify-between">
              <div className="flex items-center">
                {device.name === 'Mobile' && <Smartphone className="h-5 w-5 text-gray-500 mr-2" />}
                {device.name === 'Desktop' && <Monitor className="h-5 w-5 text-gray-500 mr-2" />}
                {device.name === 'Tablette' && <Tablet className="h-5 w-5 text-gray-500 mr-2" />}
                <span className="text-gray-700">{device.name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">{formatNumber(device.value)}</span>
                <span className="text-sm text-gray-500">({device.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockDevices} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Browsers */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Globe className="h-5 w-5 mr-2 text-teal-600" />
          Navigateurs
        </h3>
        
        <div className="space-y-3 mb-4">
          {mockBrowsers.map((browser) => (
            <div key={browser.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-3" 
                  style={{ backgroundColor: COLORS[browser.name.toLowerCase() as keyof typeof COLORS] || COLORS.primary }}
                />
                <span className="text-gray-700">{browser.name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">{formatNumber(browser.value)}</span>
                <span className="text-sm text-gray-500">({browser.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockBrowsers} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Composant pour les insights et recommandations
function InsightsAndRecommendations() {
  return (
    <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-2xl shadow-sm border-l-4 border-teal-600 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Zap className="h-5 w-5 mr-2 text-teal-600" />
        Insights & Recommandations
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
          <div>
            <p className="text-gray-900 font-medium">Excellente progression des abonnés (+6.1%)</p>
            <p className="text-sm text-gray-700">Votre stratégie de contenu attire efficacement de nouveaux abonnés.</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
          <div>
            <p className="text-gray-900 font-medium">Taux d&apos;engagement en hausse (+2.3%)</p>
            <p className="text-sm text-gray-700">Les utilisateurs interagissent davantage avec votre contenu.</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
          <div>
            <p className="text-gray-900 font-medium">Temps moyen de session en baisse (-8%)</p>
            <p className="text-sm text-gray-700">Les utilisateurs quittent peut-être trop rapidement votre site.</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-white bg-opacity-70 rounded-xl">
        <h4 className="text-gray-900 font-medium mb-3 flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-amber-600" />
          Recommandations
        </h4>
        
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-teal-600 mr-2">•</span>
            <span>Publiez plus d&apos;articles interactifs pour augmenter le temps de session</span>
          </li>
          <li className="flex items-start">
            <span className="text-teal-600 mr-2">•</span>
            <span>Optimisez vos campagnes pour mobile (68% des utilisateurs)</span>
          </li>
          <li className="flex items-start">
            <span className="text-teal-600 mr-2">•</span>
            <span>Répondez à tous les avis en attente (3 en attente)</span>
          </li>
          <li className="flex items-start">
            <span className="text-teal-600 mr-2">•</span>
            <span>Activez les notifications push (conversion +25%)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// Composant pour la barre latérale
function Sidebar({ activeMenu, setActiveMenu }: { 
  activeMenu: string; 
  setActiveMenu: (menu: string) => void 
}) {
  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Home, path: '/hopitals/dashboard' },
    { id: 'announcements', label: 'Annonces', icon: Megaphone, path: '/hopitals/dashboard/annonces' },
    { id: 'articles', label: 'Articles', icon: FileText, path: '/hopitals/dashboard/articles' },
    { id: 'advice', label: 'Conseils', icon: Lightbulb, path: '/hopitals/dashboard/conseils' },
    { id: 'subscribers', label: 'Abonnés', icon: Users, path: '/hopitals/dashboard/abonnes' },
    { id: 'reviews', label: 'Avis', icon: MessageSquare, path: '/hopitals/dashboard/avis' },
    { id: 'statistics', label: 'Statistiques', icon: BarChart3, path: '/hopitals/dashboard/statistiques' },
    { id: 'settings', label: 'Paramètres', icon: Settings, path: '/hopitals/dashboard/parametres' }
  ];

  const router = useRouter();

  const handleLogout = () => {
    toast.success('Déconnexion réussie');
    router.push('/auth/connexion');
  };

      const handleHelp = () => {
    router.push('/hopitals/dashboard/aide');
  };
  const handleMenuClick = (itemId: string, path: string) => {
    setActiveMenu(itemId);
    router.push(path);
  };

  return (
    <div className="w-64 bg-white h-full shadow-md flex flex-col rounded-r-2xl">
      {/* Logo et nom de l'hôpital */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
            HG
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Hôpital Général</h2>
            <p className="text-xs text-gray-500">Espace administrateur</p>
          </div>
        </div>
      </div>

      {/* Menu de navigation */}
      <nav className="flex-1 p-4 overflow-y-auto" role="navigation" aria-label="Menu principal">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id, item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-600 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-teal-600' : 'text-gray-500'}`} />
                  <span className={`font-medium ${isActive ? 'text-teal-700' : 'text-gray-700'}`}>
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Section d'aide et déconnexion */}
      <div className="p-4 border-t border-gray-100">
        <button onClick={handleHelp}
         className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all">
          <HelpCircle className="h-5 w-5 text-gray-500" />
          <span className="font-medium">Aide</span>
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
}

// Composant pour l'en-tête
function Header({ user, notifications, toggleSidebar }: { 
  user: any; 
  notifications: Array<{ id: number; title: string; time: string; action: string }>;
  toggleSidebar: () => void;
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 px-4 sm:px-6 py-4 rounded-b-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Bouton pour afficher/masquer la sidebar sur mobile */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Afficher le menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="hidden md:block">
            <h1 className="text-2xl font-bold text-gray-900">Statistiques & Analyses</h1>
            <p className="text-gray-500">Bonjour, {user.name}! 👋</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Bouton de recherche */}
          <div className="hidden sm:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Bouton de notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" aria-hidden="true"></span>
              )}
            </button>

            {/* Menu des notifications */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div key={notification.id} className="p-4 hover:bg-gray-50 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Aucune notification
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-gray-50">
                    <button className="text-sm font-medium text-teal-600 hover:text-teal-700">
                      Voir toutes les notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Menu utilisateur */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Menu utilisateur"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </button>

            {/* Menu utilisateur */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="py-2">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Mon profil</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Paramètres</span>
                    </button>
                  </div>
                  <div className="py-2 border-t border-gray-100">
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                      <LogOut className="h-4 w-4" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

// Page principale
export default function StatisticsPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('30days');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('statistics');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock user data
  const user = {
    name: 'Dr. Kamga',
    avatar: 'https://res.cloudinary.com/duqsblvzm/image/upload/v1765043225/ministere-sante-logo.png',
    role: 'Administrateur',
    hospital: 'Hôpital Général',
    email: 'dr.kamga@hospitalgeneral.cm'
  };
  
  // Mock notifications
  const notifications = [
    { id: 1, title: 'Nouveau rapport de statistiques disponible', time: 'Il y a 5 minutes', action: 'Voir' },
    { id: 2, title: 'Tendance d\'engagement en hausse', time: 'Il y a 1 heure', action: 'Voir' },
    { id: 3, title: 'Objectif mensuel atteint', time: 'Il y a 3 heures', action: 'Voir' }
  ];
  
  // Fonction pour gérer l'export des données
  const handleExport = (format: string) => {
    setIsLoading(true);
    
    // Simuler un export
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Export des données au format ${format.toUpperCase()} réussi`);
    }, 1500);
  };
  
  // Fonction pour basculer la sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-30 transition-transform duration-300 ease-in-out h-full`}>
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      </div>
      
      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          user={user} 
          notifications={notifications} 
          toggleSidebar={toggleSidebar} 
        />
        
        {/* Main content */}
        <main className="flex-1 overflow-x-auto overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {/* Header with time range selector */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Statistiques & Analyses</h1>
          </div>
          
          <TimeRangeSelector 
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            onExport={handleExport}
          />
          
          {/* Key metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {mockMetrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </div>
          
          {/* Traffic overview */}
          <TrafficOverviewChart />
          
          {/* Content performance and audience demographics */}
          <ContentPerformance />
          
          {/* Engagement metrics */}
          <EngagementMetrics />
          
          {/* Traffic sources */}
          <TrafficSources />
          
          {/* Devices and browsers */}
          <DevicesAndBrowsers />
          
          {/* Insights and recommendations */}
          <InsightsAndRecommendations />
        </main>
      </div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 flex items-center">
            <RefreshCw className="h-5 w-5 text-teal-600 animate-spin mr-2" />
            <span>Export en cours...</span>
          </div>
        </div>
      )}
    </div>
  );
}