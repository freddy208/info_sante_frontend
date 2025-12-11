/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Bell, 
  User, 
  Home, 
  Megaphone, 
  FileText, 
  Lightbulb, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut, 
  TrendingUp, 
  Eye, 
  MessageCircle, 
  ChevronRight, 
  AlertCircle,
  Calendar,
  Clock,
  Activity,
  Heart,
  Filter,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  Star,
  Menu
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getCloudinaryImageUrl } from '@/lib/cloudinary';
import Head from 'next/head';

// Données mockées pour le dashboard (inchangées)
const mockDashboardData = {
  user: {
    name: 'Dr. Kamga',
    avatar: 'https://res.cloudinary.com/duqsblvzm/image/upload/v1765043225/ministere-sante-logo.png',
    role: 'Administrateur',
    hospital: 'Hôpital Général',
    email: 'dr.kamga@hospitalgeneral.cm'
  },
  stats: {
    subscribers: {
      count: 2145,
      change: 124,
      percentage: 6.1,
      trend: 'up'
    },
    campaigns: {
      count: 23,
      change: 3,
      trend: 'up'
    },
    articles: {
      count: 78,
      change: 5,
      trend: 'up'
    },
    rating: {
      count: 4.8,
      reviews: 230,
      trend: 'stable'
    }
  },
  activities: [
    {
      id: 1,
      type: 'review',
      title: 'Marie K. a laissé un avis ⭐⭐⭐⭐⭐',
      time: 'Il y a 2 heures',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: 'MessageSquare',
      action: 'Voir l\'avis'
    },
    {
      id: 2,
      type: 'subscriber',
      title: '12 nouveaux abonnés',
      time: 'Il y a 5 heures',
      date: new Date(Date.now() - 5 * 60 * 60 * 1000),
      icon: 'Users',
      action: 'Voir les abonnés'
    },
    {
      id: 3,
      type: 'article',
      title: 'Article publié: "Les 5 signes..."',
      time: 'Il y a 1 jour',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      icon: 'FileText',
      action: 'Voir l\'article'
    },
    {
      id: 4,
      type: 'campaign',
      title: 'Campagne publiée: "Vaccination..."',
      time: 'Hier à 14:30',
      date: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
      icon: 'Megaphone',
      action: 'Voir la campagne'
    },
    {
      id: 5,
      type: 'views',
      title: '23 vues sur votre dernière campagne',
      time: 'Hier à 10:00',
      date: new Date(Date.now() - 1.8 * 24 * 60 * 60 * 1000),
      icon: 'Eye',
      action: 'Voir les statistiques'
    }
  ],
  pendingActions: [
    {
      id: 1,
      title: '3 avis en attente de réponse',
      action: 'Répondre',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Mettre à jour vos horaires d\'ouverture',
      action: 'Mettre à jour',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Vérifier les informations de contact',
      action: 'Vérifier',
      priority: 'low'
    }
  ],
  campaigns: [
    {
      id: 1,
      title: 'Vaccination rougeole',
      type: 'Gratuit',
      date: '15 Mars 2025',
      status: 'active',
      icon: '💉',
      views: 1200,
      comments: 45
    },
    {
      id: 2,
      title: 'Dépistage VIH',
      type: 'Gratuit',
      date: '10 Mars 2025',
      status: 'active',
      icon: '🔬',
      views: 856,
      comments: 23
    },
    {
      id: 3,
      title: 'Don de sang',
      type: 'Gratuit',
      date: '05 Mars 2025',
      status: 'completed',
      icon: '❤️',
      views: 2100,
      comments: 67
    },
    {
      id: 4,
      title: 'Campagne diabète',
      type: 'Payant',
      date: '28 Février 2025',
      status: 'active',
      icon: '🩸',
      views: 945,
      comments: 31
    },
    {
      id: 5,
      title: 'Sensibilisation hypertension',
      type: 'Gratuit',
      date: '20 Février 2025',
      status: 'completed',
      icon: '❤️',
      views: 1876,
      comments: 52
    }
  ],
  performanceData: [
    { day: 1, views: 320, engagements: 45 },
    { day: 2, views: 450, engagements: 62 },
    { day: 3, views: 380, engagements: 51 },
    { day: 4, views: 520, engagements: 78 },
    { day: 5, views: 490, engagements: 65 },
    { day: 6, views: 610, engagements: 89 },
    { day: 7, views: 580, engagements: 76 },
    { day: 8, views: 670, engagements: 92 },
    { day: 9, views: 720, engagements: 105 },
    { day: 10, views: 690, engagements: 98 },
    { day: 11, views: 750, engagements: 112 },
    { day: 12, views: 820, engagements: 125 },
    { day: 13, views: 790, engagements: 118 },
    { day: 14, views: 860, engagements: 132 },
    { day: 15, views: 920, engagements: 145 },
    { day: 16, views: 890, engagements: 138 },
    { day: 17, views: 950, engagements: 152 },
    { day: 18, views: 1020, engagements: 165 },
    { day: 19, views: 990, engagements: 158 },
    { day: 20, views: 1050, engagements: 172 },
    { day: 21, views: 1120, engagements: 185 },
    { day: 22, views: 1090, engagements: 178 },
    { day: 23, views: 1160, engagements: 192 },
    { day: 24, views: 1130, engagements: 185 },
    { day: 25, views: 1200, engagements: 198 },
    { day: 26, views: 1170, engagements: 191 },
    { day: 27, views: 1240, engagements: 205 },
    { day: 28, views: 1210, engagements: 198 },
    { day: 29, views: 1280, engagements: 212 },
    { day: 30, views: 1250, engagements: 205 }, // Correction : "ambitions" remplacé par "engagements"
    { day: 31, views: 1320, engagements: 218 }
  ]
};

// Fonction pour obtenir l'icône correspondante (inchangée)
const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'MessageSquare': return <MessageSquare className="h-5 w-5 text-teal-600" />;
    case 'Users': return <Users className="h-5 w-5 text-teal-600" />;
    case 'FileText': return <FileText className="h-5 w-5 text-teal-600" />;
    case 'Megaphone': return <Megaphone className="h-5 w-5 text-teal-600" />;
    case 'Eye': return <Eye className="h-5 w-5 text-teal-600" />;
    default: return <Activity className="h-5 w-5 text-teal-600" />;
  }
};

// Fonction pour obtenir la classe de couleur en fonction de la couleur (inchangée)
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

// Composant pour la barre latérale (amélioré pour le responsive)
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

// Composant pour l'en-tête (amélioré pour le responsive)
function Header({ user, notifications, toggleSidebar }: { 
  user: typeof mockDashboardData.user; 
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
            <h1 className="text-2xl font-bold text-gray-900">Vue d&apos;ensemble</h1>
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

// Composant pour les cartes de statistiques (amélioré avec des bordures arrondies)
function StatsCard({ 
  title, 
  value, 
  change, 
  percentage, 
  trend, 
  icon, 
  color 
}: { 
  title: string; 
  value: number; 
  change: number; 
  percentage?: number; 
  trend: 'up' | 'down' | 'stable'; 
  icon: React.ReactNode; 
  color: string; 
}) {
  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4 bg-gray-300 rounded-full"></div>;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${getColorClass(color, 'bg')}`}>
          <div className={getColorClass(color, 'text')}>{icon}</div>
        </div>
        <div className={`flex items-center space-x-1 text-sm font-medium ${getTrendColor()}`}>
          {getTrendIcon()}
          <span>{change > 0 ? `+${change}` : change} ce mois</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</h3>
      <p className="text-sm text-gray-500">{title}</p>
      {percentage && (
        <div className={`mt-2 text-xs font-medium ${getTrendColor()}`}>
          {trend === 'up' ? '+' : ''}{percentage}%
        </div>
      )}
    </motion.div>
  );
}

// Composant pour la timeline d'activité (amélioré avec des bordures arrondies)
function ActivityTimeline({ activities }: { 
  activities: Array<{
    id: number;
    type: string;
    title: string;
    time: string;
    date: Date;
    icon: string;
    action: string;
  }>
}) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    return 'Il y a quelques minutes';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getIcon(activity.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-xs text-gray-500 mt-1">{formatTime(activity.date)}</p>
            </div>
            <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              {activity.action}
            </button>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full text-center text-sm font-medium text-teal-600 hover:text-teal-700">
        Voir tout →
      </button>
    </div>
  );
}

// Composant pour les actions rapides (amélioré avec des bordures arrondies)
function QuickActions() {
  const actions = [
    { title: 'Nouvelle campagne', icon: Megaphone, color: 'teal' },
    { title: 'Nouvel article', icon: FileText, color: 'blue' },
    { title: 'Nouveau conseil', icon: Lightbulb, color: 'yellow' },
    { title: 'Voir mon profil', icon: User, color: 'purple' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className={`p-2 rounded-xl ${getColorClass(action.color, 'bg')} mb-2`}>
                <Icon className={`h-5 w-5 ${getColorClass(action.color, 'text')}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">{action.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Composant pour les actions en attente (amélioré avec des bordures arrondies)
function PendingActions({ actions }: { 
  actions: Array<{
    id: number;
    title: string;
    action: string;
    priority: 'high' | 'medium' | 'low';
  }>
}) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-4 mb-6">
      <div className="flex items-center mb-3">
        <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
        <h3 className="font-medium text-gray-900">Actions requises</h3>
      </div>
      <div className="space-y-3">
        {actions.map((action) => (
          <div key={action.id} className="flex items-center justify-between">
            <p className="text-sm text-gray-700">{action.title}</p>
            <button className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(action.priority)}`}>
              {action.action}
            </button>
          </div>
        ))}
      </div>
      <button className="mt-3 text-sm font-medium text-amber-700 hover:text-amber-800">
        Tout gérer →
      </button>
    </div>
  );
}

// Composant pour le graphique de performance (amélioré avec des bordures arrondies)
function PerformanceChart({ data }: { 
  data: Array<{ day: number; views: number; engagements: number }> 
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performances ce mois</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
            labelStyle={{ color: '#334155', fontWeight: 'bold' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="views" 
            stroke="#00796B" 
            strokeWidth={2}
            dot={{ fill: '#00796B', r: 4 }}
            activeDot={{ r: 6 }}
            name="Vues"
          />
          <Line 
            type="monotone" 
            dataKey="engagements" 
            stroke="#FF6F00" 
            strokeWidth={2}
            dot={{ fill: '#FF6F00', r: 4 }}
            activeDot={{ r: 6 }}
            name="Engagements"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 flex flex-col sm:flex-row justify-between text-sm text-gray-600 gap-2">
        <div>
          <span className="font-medium">Total vues:</span> 12,456 (+23% vs mois dernier)
        </div>
        <div>
          <span className="font-medium">Engagements:</span> 2,341 (+15% vs mois dernier)
        </div>
      </div>
    </div>
  );
}

// Composant pour le tableau des campagnes récentes (amélioré pour le responsive)
function RecentCampaigns({ campaigns }: { 
  campaigns: Array<{
    id: number;
    title: string;
    type: string;
    date: string;
    status: string;
    icon: string;
    views: number;
    comments: number;
  }>
}) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">🟢 Active</span>;
      case 'completed':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">⚫ Terminée</span>;
      case 'scheduled':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">🟡 Planifiée</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inconnue</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Campagnes récentes</h3>
        <button className="text-sm font-medium text-teal-600 hover:text-teal-700">
          Voir toutes →
        </button>
      </div>
      
      {/* Version desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titre
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{campaign.icon}</span>
                    <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{campaign.type}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{campaign.date}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {getStatusBadge(campaign.status)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <div className="flex items-center text-gray-500">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{campaign.views}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span>{campaign.comments}</span>
                    </div>
                    <button className="text-teal-600 hover:text-teal-700">
                      Voir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Version mobile */}
      <div className="sm:hidden space-y-4">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <span className="text-lg mr-2">{campaign.icon}</span>
              <h4 className="text-sm font-medium text-gray-900">{campaign.title}</h4>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">{campaign.type}</span>
              {getStatusBadge(campaign.status)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{campaign.date}</span>
              <div className="flex items-center space-x-3">
                <div className="flex items-center text-gray-500">
                  <Eye className="h-4 w-4 mr-1" />
                  <span className="text-xs">{campaign.views}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span className="text-xs">{campaign.comments}</span>
                </div>
                <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">
                  Voir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Composant principal du dashboard (amélioré pour le responsive)
export default function HospitalDashboard() {
  const [activeMenu, setActiveMenu] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Simuler le chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Extraire les données mockées
  const { user, stats, activities, pendingActions, campaigns, performanceData } = mockDashboardData;

  // Calculer les notifications
  const notifications = useMemo(() => {
    return pendingActions.map(action => ({
      id: action.id,
      title: action.title,
      time: 'Maintenant',
      action: action.action
    }));
  }, [pendingActions]);

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

  // Fonction pour basculer la sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <p className="mt-2 text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Tableau de bord - Hôpital Général</title>
        <meta name="description" content="Tableau de bord administrateur pour l'Hôpital Général" />
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

          {/* Contenu du dashboard */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {/* Grille de statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatsCard
                title="Abonnés"
                value={stats.subscribers.count}
                change={stats.subscribers.change}
                percentage={stats.subscribers.percentage}
                trend={normalizeTrend(stats.subscribers.trend)}
                icon={<Users className="h-6 w-6" />}
                color="teal"
              />
              <StatsCard
                title="Campagnes"
                value={stats.campaigns.count}
                change={stats.campaigns.change}
                trend={normalizeTrend(stats.campaigns.trend)}
                icon={<Megaphone className="h-6 w-6" />}
                color="blue"
              />
              <StatsCard
                title="Articles"
                value={stats.articles.count}
                change={stats.articles.change}
                trend={normalizeTrend(stats.articles.trend)}
                icon={<FileText className="h-6 w-6" />}
                color="purple"
              />
              <StatsCard
                title="Note moyenne"
                value={stats.rating.count}
                change={stats.rating.reviews}
                trend={normalizeTrend(stats.rating.trend)}
                icon={<Star className="h-6 w-6" />}
                color="yellow"
              />
            </div>

            {/* Actions en attente */}
            <PendingActions
              actions={pendingActions.map(a => ({
                  ...a,
                  priority: normalizePriority(a.priority)
              }))}
            />

            {/* Deux colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Colonne de gauche (60%) */}
              <div className="lg:col-span-2 space-y-6">
                <ActivityTimeline activities={activities} />
                <PerformanceChart data={performanceData} />
              </div>

              {/* Colonne de droite (40%) */}
              <div className="space-y-6">
                <QuickActions />
              </div>
            </div>

            {/* Tableau des campagnes récentes */}
            <RecentCampaigns campaigns={campaigns} />
          </main>
        </div>
      </div>
    </>
  );
}

function normalizeTrend(value: string): "up" | "stable" | "down" {
  const v = value.toLowerCase();

  if (v.includes("up") || v.includes("increase") || v.includes("positive"))
    return "up";

  if (v.includes("down") || v.includes("decrease") || v.includes("negative"))
    return "down";

  return "stable";
}

function normalizePriority(value: string): "high" | "medium" | "low" {
  const v = value.toLowerCase();

  if (v.includes("high") || v.includes("urgent") || v.includes("critique")) {
    return "high";
  }

  if (v.includes("medium") || v.includes("moyen")) {
    return "medium";
  }

  return "low";
}