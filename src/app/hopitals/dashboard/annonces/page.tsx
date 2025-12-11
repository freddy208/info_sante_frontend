/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
// hopitals/dashboard/annonces
'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  BarChart3, 
  MoreVertical,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Copy,
  Calendar,
  Users,
  MessageSquare,
  TrendingUp,
  Bell,
  BellOff,
  Archive,
  Star,
  Download,
  Upload,
  RefreshCw,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Megaphone,
  Sparkles,
  Menu,
  Home,
  Lightbulb,
  Settings,
  HelpCircle,
  LogOut,
  User
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { getCloudinaryImageUrl } from '@/lib/cloudinary';

// Types pour les données (inchangés)
interface Campaign {
  id: string;
  title: string;
  type: string;
  image: string;
  startDate: string;
  status: 'active' | 'completed' | 'draft';
  views: number;
  comments: number;
  publishedAt: string;
  category: string;
  targetAudience: string[];
  isPinned: boolean;
  isFree: boolean;
  capacity?: number;
  registeredCount?: number;
}

// Données mocks pour les campagnes (inchangées)
const mockCampaigns: Campaign[] = [
{
    id: '1',
    title: 'Vaccination rougeole - Enfants',
    type: 'Vaccination',
    image: 'vaccination-campaign',
    startDate: '15 Mar 2025',
    status: 'active',
    views: 1200,
    comments: 45,
    publishedAt: '12 Mar 2025',
    category: 'Vaccination',
    targetAudience: ['Enfants', 'Nourrissons'],
    isPinned: true,
    isFree: true,
    capacity: 100,
    registeredCount: 78
  },
  {
    id: '2',
    title: 'Dépistage VIH gratuit',
    type: 'Dépistage',
    image: 'hiv-awareness',
    startDate: '10 Mar 2025',
    status: 'active',
    views: 856,
    comments: 23,
    publishedAt: '08 Mar 2025',
    category: 'Dépistage',
    targetAudience: ['Adultes', 'Jeunes'],
    isPinned: false,
    isFree: true,
    capacity: 50,
    registeredCount: 32
  },
  {
    id: '3',
    title: 'Don de sang urgent',
    type: 'Don',
    image: 'diabetes-awareness',
    startDate: '05 Mar 2025',
    status: 'completed',
    views: 2100,
    comments: 67,
    publishedAt: '01 Mar 2025',
    category: 'Don',
    targetAudience: ['Adultes'],
    isPinned: false,
    isFree: true,
    capacity: 30,
    registeredCount: 30
  },
  {
    id: '4',
    title: 'Consultation dentaire',
    type: 'Consultation',
    image: 'breast-cancer-screening',
    startDate: '01 Mar 2025',
    status: 'draft',
    views: 234,
    comments: 0,
    publishedAt: '03 Mar 2025',
    category: 'Consultation',
    targetAudience: ['Adultes', 'Enfants'],
    isPinned: false,
    isFree: false,
    capacity: 20,
    registeredCount: 5
  },
  {
    id: '5',
    title: 'Campagne de dépistage du cancer du sein',
    type: 'Dépistage',
    image: 'blood-pressure-check',
    startDate: '20 Mar 2025',
    status: 'active',
    views: 980,
    comments: 34,
    publishedAt: '15 Mar 2025',
    category: 'Dépistage',
    targetAudience: ['Femmes', 'Adultes'],
    isPinned: false,
    isFree: true,
    capacity: 40,
    registeredCount: 28
  },
  {
    id: '6',
    title: 'Journée de sensibilisation sur le diabète',
    type: 'Sensibilisation',
    image: 'diabetes-awareness',
    startDate: '25 Mar 2025',
    status: 'active',
    views: 650,
    comments: 19,
    publishedAt: '18 Mar 2025',
    category: 'Sensibilisation',
    targetAudience: ['Adultes', 'Personnes âgées'],
    isPinned: false,
    isFree: true,
    capacity: 60,
    registeredCount: 41
  },
  {
    id: '7',
    title: 'Campagne de vaccination contre la grippe',
    type: 'Vaccination',
    image: 'vaccination-campaign',
    startDate: '28 Mar 2025',
    status: 'draft',
    views: 120,
    comments: 5,
    publishedAt: '01 Apr 2025',
    category: 'Vaccination',
    targetAudience: ['Adultes', 'Personnes âgées', 'Enfants'],
    isPinned: false,
    isFree: false,
    capacity: 80,
    registeredCount: 0
  },
  {
    id: '8',
    title: 'Atelier sur la nutrition infantile',
    type: 'Atelier',
    image: 'child-nutrition',
    startDate: '30 Mar 2025',
    status: 'draft',
    views: 95,
    comments: 2,
    publishedAt: '01 Aout 2025',
    category: 'Nutrition',
    targetAudience: ['Parents', 'Enfants'],
    isPinned: false,
    isFree: true,
    capacity: 30,
    registeredCount: 0
  },
  {
    id: '9',
    title: 'Campagne de dépistage de l\'hypertension',
    type: 'vaccination-campaign',
    image: 'blood-pressure-check',
    startDate: '02 Apr 2025',
    status: 'active',
    views: 780,
    comments: 27,
    publishedAt: '20 Mar 2025',
    category: 'Dépistage',
    targetAudience: ['Adultes', 'Personnes âgées'],
    isPinned: false,
    isFree: true,
    capacity: 50,
    registeredCount: 36
  },
  {
    id: '10',
    title: 'Journée portes ouvertes du service pédiatrie',
    type: 'Visite',
    image: 'breast-cancer-screening',
    startDate: '05 Apr 2025',
    status: 'active',
    views: 430,
    comments: 15,
    publishedAt: '22 Mar 2025',
    category: 'Visite',
    targetAudience: ['Parents', 'Enfants'],
    isPinned: false,
    isFree: true,
    capacity: 40,
    registeredCount: 22
  },
  {
    id: '11',
    title: 'Campagne de vaccination contre l\'hépatite B',
    type: 'Vaccination',
    image: 'mosquito-nets',
    startDate: '08 Apr 2025',
    status: 'active',
    views: 520,
    comments: 18,
    publishedAt: '25 Mar 2025',
    category: 'Vaccination',
    targetAudience: ['Adultes', 'Adolescents'],
    isPinned: false,
    isFree: true,
    capacity: 60,
    registeredCount: 31
  },
  {
    id: '12',
    title: 'Atelier sur la santé mentale',
    type: 'Atelier',
    image: 'prenatal-care',
    startDate: '10 Apr 2025',
    status: 'draft',
    views: 75,
    comments: 1,
    publishedAt: '23 Sept 2025',
    category: 'Santé mentale',
    targetAudience: ['Adultes', 'Étudiants'],
    isPinned: false,
    isFree: true,
    capacity: 25,
    registeredCount: 0
  },
  {
    id: '13',
    title: 'Campagne de dépistage du cancer de la prostate',
    type: 'Dépistage',
    image: 'diabetes-awareness',
    startDate: '12 Apr 2025',
    status: 'active',
    views: 680,
    comments: 22,
    publishedAt: '28 Mar 2025',
    category: 'Dépistage',
    targetAudience: ['Hommes', 'Personnes âgées'],
    isPinned: false,
    isFree: true,
    capacity: 40,
    registeredCount: 27
  },
  {
    id: '14',
    title: 'Journée de consultation gratuite',
    type: 'Consultation',
    image: 'blood-pressure-check',
    startDate: '15 Apr 2025',
    status: 'active',
    views: 920,
    comments: 38,
    publishedAt: '30 Mar 2025',
    category: 'Consultation',
    targetAudience: ['Tous'],
    isPinned: false,
    isFree: true,
    capacity: 100,
    registeredCount: 84
  },
  {
    id: '15',
    title: 'Campagne de vaccination contre le HPV',
    type: 'Vaccination',
    image: 'hiv-awareness',
    startDate: '18 Apr 2025',
    status: 'draft',
    views: 110,
    comments: 3,
    publishedAt: '18 Apr 2025',
    category: 'Vaccination',
    targetAudience: ['Adolescentes', 'Jeunes femmes'],
    isPinned: false,
    isFree: false,
    capacity: 50,
    registeredCount: 0
  },
  {
    id: '16',
    title: 'Atelier sur la santé cardiaque',
    type: 'Atelier',
    image: 'child-nutrition',
    startDate: '20 Apr 2025',
    status: 'draft',
    views: 85,
    comments: 2,
    publishedAt: '27 Oct 2025',
    category: 'Santé cardiaque',
    targetAudience: ['Adultes', 'Personnes âgées'],
    isPinned: false,
    isFree: true,
    capacity: 30,
    registeredCount: 0
  },
  {
    id: '17',
    title: 'Campagne de dépistage du diabète de type 2',
    type: 'Dépistage',
    image: 'blood-pressure-check',
    startDate: '22 Apr 2025',
    status: 'active',
    views: 750,
    comments: 29,
    publishedAt: '05 Apr 2025',
    category: 'Dépistage',
    targetAudience: ['Adultes', 'Personnes âgées'],
    isPinned: false,
    isFree: true,
    capacity: 60,
    registeredCount: 42
  },
  {
    id: '18',
    title: 'Journée de sensibilisation sur l\'hygiène',
    type: 'Sensibilisation',
    image: 'diabetes-awareness',
    startDate: '25 Apr 2025',
    status: 'active',
    views: 460,
    comments: 16,
    publishedAt: '08 Apr 2025',
    category: 'Sensibilisation',
    targetAudience: ['Enfants', 'Parents'],
    isPinned: false,
    isFree: true,
    capacity: 80,
    registeredCount: 53
  },
  {
    id: '19',
    title: 'Campagne de vaccination contre la COVID-19',
    type: 'Vaccination',
    image: 'prenatal-care',
    startDate: '28 Apr 2025',
    status: 'active',
    views: 890,
    comments: 35,
    publishedAt: '10 Apr 2025',
    category: 'Vaccination',
    targetAudience: ['Adultes', 'Personnes âgées', 'Adolescents'],
    isPinned: true,
    isFree: true,
    capacity: 120,
    registeredCount: 95
  },
  {
    id: '21',
    title: 'Campagne de dépistage du cancer colorectal',
    type: 'Dépistage',
    image: 'vaccination-campaign',
    startDate: '03 May 2025',
    status: 'active',
    views: 540,
    comments: 21,
    publishedAt: '15 Apr 2025',
    category: 'Dépistage',
    targetAudience: ['Adultes', 'Personnes âgées'],
    isPinned: false,
    isFree: true,
    capacity: 40,
    registeredCount: 28
  },
  {
    id: '22',
    title: 'Journée de consultation en dermatologie',
    type: 'Consultation',
    image: 'breast-cancer-screening',
    startDate: '05 May 2025',
    status: 'active',
    views: 620,
    comments: 24,
    publishedAt: '18 Apr 2025',
    category: 'Consultation',
    targetAudience: ['Adultes', 'Enfants'],
    isPinned: false,
    isFree: true,
    capacity: 30,
    registeredCount: 19
  },
];

// Données mockées pour l'utilisateur
const mockUserData = {
  name: 'Dr. Kamga',
  avatar: 'https://res.cloudinary.com/duqsblvzm/image/upload/v1765043225/ministere-sante-logo.png',
  role: 'Administrateur',
  hospital: 'Hôpital Général',
  email: 'dr.kamga@hospitalgeneral.cm'
};

// Données mockées pour les notifications
const mockNotifications = [
  {
    id: 1,
    title: '3 avis en attente de réponse',
    time: 'Maintenant',
    action: 'Répondre'
  },
  {
    id: 2,
    title: 'Mettre à jour vos horaires d\'ouverture',
    time: 'Il y a 2 heures',
    action: 'Mettre à jour'
  },
  {
    id: 3,
    title: 'Vérifier les informations de contact',
    time: 'Hier',
    action: 'Vérifier'
  }
];

// Fonction pour obtenir la classe de couleur en fonction de la couleur
const getColorClass = (color: string, type: 'bg' | 'text' = 'bg') => {
  const colorMap: Record<string, { bg: string, text: string }> = {
    teal: { bg: 'bg-teal-100', text: 'text-teal-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600' }
  };
  
  return colorMap[color]?.[type] || colorMap.teal[type];
};

// Fonction pour formater les nombres (inchangée)
const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Fonction pour obtenir la couleur du statut (inchangée)
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'completed':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Fonction pour obtenir l'icône du statut (inchangée)
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <CheckCircle className="h-4 w-4" />;
    case 'completed':
      return <AlertCircle className="h-4 w-4" />;
    case 'draft':
      return <Clock className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

// Fonction pour obtenir le texte du statut (inchangée)
const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'completed':
      return 'Terminée';
    case 'draft':
      return 'Brouillon';
    default:
      return 'Inconnu';
  }
};

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
    router.push('/auth/login');
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
        <button
        onClick={handleHelp}
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
  user: typeof mockUserData; 
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
            <h1 className="text-2xl font-bold text-gray-900">Mes campagnes</h1>
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

// Composant pour la carte de statistiques (amélioré avec des bordures arrondies)
function StatsCard({ title, value, color, icon }: { title: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-2xl ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

// Composant pour le menu d'actions (amélioré avec des bordures arrondies)
function ActionMenu({ campaign, onView, onEdit, onDuplicate, onDelete, onTogglePin, onToggleStatus }: { 
  campaign: Campaign; 
  onView: () => void; 
  onEdit: () => void; 
  onDuplicate: () => void; 
  onDelete: () => void; 
  onTogglePin: () => void; 
  onToggleStatus: () => void; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <MoreVertical className="h-5 w-5 text-gray-500" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 mt-1 w-48 bg-white rounded-2xl shadow-lg border border-gray-200 z-10 overflow-hidden"
          >
            <button
              onClick={() => { onView(); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              <Eye className="h-4 w-4" />
              Voir
            </button>
            <button
              onClick={() => { onEdit(); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Modifier
            </button>
            <button
              onClick={() => { onDuplicate(); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              <Copy className="h-4 w-4" />
              Dupliquer
            </button>
            <button
              onClick={() => { onTogglePin(); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              {campaign.isPinned ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
              {campaign.isPinned ? 'Désépingler' : 'Épingler'}
            </button>
            <button
              onClick={() => { onToggleStatus(); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              {campaign.status === 'draft' ? <Upload className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
              {campaign.status === 'draft' ? 'Publier' : 'Archiver'}
            </button>
            <button
              onClick={() => { onDelete(); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 flex items-center gap-2 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Composant pour l'état vide (amélioré avec des bordures arrondies)
function EmptyState({ onCreateCampaign }: { onCreateCampaign: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 rounded-2xl p-12 text-center"
    >
      <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
        <Megaphone className="h-12 w-12 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune campagne pour le moment</h3>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Créez votre première campagne pour informer la communauté de vos services.
      </p>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCreateCampaign}
        className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-medium rounded-2xl hover:bg-teal-700 transition-colors"
      >
        <Plus className="h-5 w-5 mr-2" />
        Créer ma première campagne
      </motion.button>
      
      <button className="mt-4 text-teal-600 hover:text-teal-700 font-medium">
        Voir des exemples →
      </button>
    </motion.div>
  );
}

// Page principale (améliorée pour le responsive et le SEO)
export default function CampaignsManagementPage() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState('announcements');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'draft'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'views' | 'comments'>('recent');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
   const [isClient, setIsClient] = useState(false);
  
  // Nombre d'éléments par page
  const itemsPerPage = 10;
  
  // Extraire les données mockées
  const user = mockUserData;
  const notifications = mockNotifications;
  
  // Calculer les statistiques (inchangé)
  const stats = useMemo(() => {
    const total = campaigns.length;
    const active = campaigns.filter(c => c.status === 'active').length;
    const completed = campaigns.filter(c => c.status === 'completed').length;
    const draft = campaigns.filter(c => c.status === 'draft').length;
    
    return { total, active, completed, draft };
  }, [campaigns]);
  
// Correction 2 : Améliorer la fonction de tri pour garantir la stabilité
// Correction 1 : Rendre le tri déterministe en ajoutant un tri secondaire sur l'ID
const filteredCampaigns = useMemo(() => {
  let filtered = [...campaigns];
  
  // Filtrer par terme de recherche
  if (searchTerm) {
    filtered = filtered.filter(campaign => 
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Filtrer par statut
  if (filterStatus !== 'all') {
    filtered = filtered.filter(campaign => campaign.status === filterStatus);
  }
  
  // Trier avec fallback sur l'ID pour garantir la stabilité
  if (sortBy === 'recent') {
    filtered.sort((a, b) => {
      const dateA = new Date(a.publishedAt);
      const dateB = new Date(b.publishedAt);
      
      // Comparaison des dates
      const dateDiff = dateB.getTime() - dateA.getTime();
      
      // Si les dates sont identiques, utiliser l'ID comme tri secondaire
      if (dateDiff === 0) {
        return a.id.localeCompare(b.id);
      }
      
      return dateDiff;
    });
  } else if (sortBy === 'views') {
    filtered.sort((a, b) => {
      const viewDiff = b.views - a.views;
      return viewDiff === 0 ? a.id.localeCompare(b.id) : viewDiff;
    });
  } else if (sortBy === 'comments') {
    filtered.sort((a, b) => {
      const commentDiff = b.comments - a.comments;
      return commentDiff === 0 ? a.id.localeCompare(b.id) : commentDiff;
    });
  }
  
  return filtered;
}, [campaigns, searchTerm, filterStatus, sortBy]);

  
  // Paginer les résultats (inchangé)
  const paginatedCampaigns = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCampaigns.slice(startIndex, endIndex);
  }, [filteredCampaigns, currentPage]);
  
  // Calculer le nombre total de pages (inchangé)
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  
  // Gérer la sélection de campagnes (inchangé)
  const handleSelectCampaign = (campaignId: string) => {
    setSelectedCampaigns(prev => 
      prev.includes(campaignId) 
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    );
  };
  
  // Gérer la sélection de toutes les campagnes (inchangé)
  const handleSelectAll = () => {
    if (selectedCampaigns.length === paginatedCampaigns.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(paginatedCampaigns.map(c => c.id));
    }
  };
  
  // Gérer la suppression de campagnes (inchangé)
  const handleDeleteCampaigns = () => {
    setIsLoading(true);
    
    // Simuler une suppression
    setTimeout(() => {
      setCampaigns(prev => prev.filter(c => !selectedCampaigns.includes(c.id)));
      setSelectedCampaigns([]);
      setIsLoading(false);
      toast.success(`${selectedCampaigns.length} campagne(s) supprimée(s) avec succès`);
    }, 1000);
  };
  
  // Gérer la duplication de campagnes (inchangé)
  const handleDuplicateCampaigns = () => {
    setIsLoading(true);
    
    // Simuler une duplication
    setTimeout(() => {
      const duplicatedCampaigns = campaigns
        .filter(c => selectedCampaigns.includes(c.id))
        .map(c => ({ ...c, id: `${c.id}-copy`, title: `${c.title} (copie)`, status: 'draft' as const }));
      
      setCampaigns(prev => [...prev, ...duplicatedCampaigns]);
      setSelectedCampaigns([]);
      setIsLoading(false);
      toast.success(`${selectedCampaigns.length} campagne(s) dupliquée(s) avec succès`);
    }, 1000);
  };
  
  // Gérer le changement de statut de campagnes (inchangé)
  const handleChangeStatus = (newStatus: 'active' | 'draft') => {
    setIsLoading(true);
    
    // Simuler un changement de statut
    setTimeout(() => {
      setCampaigns(prev => 
        prev.map(c => 
          selectedCampaigns.includes(c.id) 
            ? { ...c, status: newStatus, publishedAt: newStatus === 'active' ? new Date().toLocaleDateString() : '' }
            : c
        )
      );
      setSelectedCampaigns([]);
      setIsLoading(false);
      toast.success(`Statut mis à jour avec succès`);
    }, 1000);
  };
  
  // Gérer le basculement de l'épingle (inchangé)
  const handleTogglePin = (campaignId: string) => {
    setCampaigns(prev => 
      prev.map(c => 
        c.id === campaignId 
          ? { ...c, isPinned: !c.isPinned }
          : c
      )
    );
    toast.success('Campagne mise à jour avec succès');
  };
  
  // Gérer le changement de statut individuel (inchangé)
  const handleToggleStatus = (campaignId: string) => {
    setCampaigns(prev => 
      prev.map(c => 
        c.id === campaignId 
          ? { 
              ...c, 
              status: c.status === 'draft' ? 'active' : 'draft', 
              publishedAt: c.status === 'draft' ? new Date().toLocaleDateString() : '' 
            }
          : c
      )
    );
    toast.success('Campagne mise à jour avec succès');
  };
  
  // Gérer la suppression individuelle (inchangé)
  const handleDeleteCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    toast.success('Campagne supprimée avec succès');
  };
  
  // Gérer la vue d'une campagne (inchangé)
  const handleViewCampaign = (campaignId: string) => {
    router.push(`/dashboard/campaigns/${campaignId}`);
  };
  
  // Gérer l'édition d'une campagne (inchangé)
  const handleEditCampaign = (campaignId: string) => {
    router.push(`/dashboard/campaigns/${campaignId}/edit`);
  };
  
  // Gérer la création d'une campagne (inchangé)
  const handleCreateCampaign = () => {
    router.push('/annonces/creation');
  };
  
  // Afficher ou masquer les actions groupées (inchangé)
  useEffect(() => {
    setShowBulkActions(selectedCampaigns.length > 0);
  }, [selectedCampaigns]);
  
  // Gérer le redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

    // AJOUTEZ CET EFFET ICI
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fonction pour basculer la sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <>
      <Head>
        <title>Gestion des campagnes - Hôpital Général</title>
        <meta name="description" content="Gérez vos campagnes de sensibilisation et de santé" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className={`${sidebarOpen ? 'block' : 'hidden'} lg:block lg:w-64 flex-shrink-0 z-40`}
            >
              <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay pour mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Contenu principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* En-tête */}
          <Header 
            user={user} 
            notifications={notifications} 
            toggleSidebar={toggleSidebar}
          />

          {/* Contenu de la page des campagnes */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {/* Bouton pour créer une nouvelle campagne */}
            <div className="flex justify-end mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateCampaign}
                className="inline-flex items-center px-4 py-2 bg-teal-600 text-white font-medium rounded-2xl hover:bg-teal-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nouvelle campagne
              </motion.button>
            </div>
            
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard 
                title="Total" 
                value={stats.total} 
                color="bg-gray-100 text-gray-600" 
                icon={<FileText className="h-6 w-6" />} 
              />
              <StatsCard 
                title="Actives" 
                value={stats.active} 
                color="bg-green-100 text-green-600" 
                icon={<CheckCircle className="h-6 w-6" />} 
              />
              <StatsCard 
                title="Terminées" 
                value={stats.completed} 
                color="bg-gray-100 text-gray-600" 
                icon={<AlertCircle className="h-6 w-6" />} 
              />
              <StatsCard 
                title="Brouillons" 
                value={stats.draft} 
                color="bg-yellow-100 text-yellow-600" 
                icon={<Clock className="h-6 w-6" />} 
              />
            </div>
            
            {/* Filters and search */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher une campagne..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="lg:hidden p-2 bg-gray-100 rounded-2xl text-gray-700 hover:bg-gray-200 transition-colors"
                    aria-label="Afficher les filtres"
                  >
                    <Filter className="h-5 w-5" />
                  </button>
                  
                  <div className={`${showMobileFilters ? 'flex' : 'hidden'} lg:flex gap-2`}>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="all">Toutes</option>
                      <option value="active">Actives</option>
                      <option value="completed">Terminées</option>
                      <option value="draft">Brouillons</option>
                    </select>
                    
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="recent">Plus récentes</option>
                      <option value="views">Plus vues</option>
                      <option value="comments">Plus commentées</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Bulk actions */}
              <AnimatePresence>
                {showBulkActions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl overflow-hidden"
                  >
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700">
                        {selectedCampaigns.length} sélectionnée{selectedCampaigns.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDeleteCampaigns}
                        disabled={isLoading}
                        className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-2xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-4 w-4 inline mr-1" />
                        Supprimer
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDuplicateCampaigns}
                        disabled={isLoading}
                        className="px-3 py-1.5 bg-gray-600 text-white text-sm font-medium rounded-2xl hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Copy className="h-4 w-4 inline mr-1" />
                        Dupliquer
                      </motion.button>
                      
                      {selectedCampaigns.every(id => campaigns.find(c => c.id === id)?.status === 'draft') && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleChangeStatus('active')}
                          disabled={isLoading}
                          className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-2xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Upload className="h-4 w-4 inline mr-1" />
                          Publier
                        </motion.button>
                      )}
                      
                      {selectedCampaigns.every(id => campaigns.find(c => c.id === id)?.status === 'active') && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleChangeStatus('draft')}
                          disabled={isLoading}
                          className="px-3 py-1.5 bg-yellow-600 text-white text-sm font-medium rounded-2xl hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Archive className="h-4 w-4 inline mr-1" />
                          Archiver
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Campaigns table */}
            {isClient && paginatedCampaigns.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedCampaigns.length === paginatedCampaigns.length}
                            onChange={handleSelectAll}
                            className="rounded-2xl border-gray-300 text-teal-600 focus:ring-teal-500"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Campagne</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Statut</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Stats</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedCampaigns.map((campaign, index) => (
                        <motion.tr 
                          key={campaign.id} 
                          className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedCampaigns.includes(campaign.id)}
                              onChange={() => handleSelectCampaign(campaign.id)}
                              className="rounded-2xl border-gray-300 text-teal-600 focus:ring-teal-500"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                <img
                                  src={getCloudinaryImageUrl(campaign.image, { width: 80, height: 80, crop: 'fill' })}
                                  alt={campaign.title}
                                  className="h-12 w-12 rounded-2xl object-cover"
                                suppressHydrationWarning
                                />
                              </div>
                              <div className="ml-4">
                                <div className="flex items-center">
                                  <h4 className="text-sm font-medium text-gray-900">{campaign.title}</h4>
                                  {campaign.isPinned && <Star className="h-4 w-4 text-yellow-500 ml-2 fill-current" />}
                                </div>
                                <p className="text-xs text-gray-500">
                                  Publiée le {campaign.publishedAt}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-900">{campaign.type}</span>
                              <span className="ml-2 text-xs text-gray-500">
                                {campaign.isFree ? 'Gratuit' : 'Payant'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{campaign.startDate}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                              {getStatusIcon(campaign.status)}
                              <span className="ml-1">{getStatusText(campaign.status)}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-3 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {formatNumber(campaign.views)}
                              </div>
                              <div className="flex items-center">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {campaign.comments}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <ActionMenu
                              campaign={campaign}
                              onView={() => handleViewCampaign(campaign.id)}
                              onEdit={() => handleEditCampaign(campaign.id)}
                              onDuplicate={() => {
                                setSelectedCampaigns([campaign.id]);
                                handleDuplicateCampaigns();
                              }}
                              onDelete={() => handleDeleteCampaign(campaign.id)}
                              onTogglePin={() => handleTogglePin(campaign.id)}
                              onToggleStatus={() => handleToggleStatus(campaign.id)}
                            />
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-2xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Précédent
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-2xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivant
                    </motion.button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredCampaigns.length)}</span> sur{' '}
                        <span className="font-medium">{filteredCampaigns.length}</span> campagnes
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-2xl shadow-sm -space-x-px" aria-label="Pagination">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-2xl border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Précédent</span>
                          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </motion.button>
                        
                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <motion.button
                              key={pageNum}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNum
                                  ? 'z-10 bg-teal-50 border-teal-500 text-teal-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </motion.button>
                          );
                        })}
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-2xl border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Suivant</span>
                          <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </motion.button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            ): isClient ? (
              <EmptyState onCreateCampaign={handleCreateCampaign} />
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 text-center">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-2xl p-4 flex items-center">
              <RefreshCw className="h-5 w-5 text-teal-600 animate-spin mr-2" />
              <span>Chargement...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}