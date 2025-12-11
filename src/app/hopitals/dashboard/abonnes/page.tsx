/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Bell,
  BellOff,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Mail,
  Calendar,
  TrendingUp,
  User,
  MapPin,
  MessageSquare,
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
  Smartphone,
  MessageSquare as MessageIcon,
  Link,
  Info
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

// Types pour les données
interface Follower {
  id: string;
  name: string;
  email: string;
  avatar: string;
  city: string;
  region: string;
  followDate: Date;
  isActive: boolean;
  interests: string[];
  notificationsEnabled: boolean;
  lastActivity: Date;
}

// Types pour le modal de notification
interface NotificationData {
  recipients: 'all' | 'selected' | 'enabled';
  types: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  title: string;
  message: string;
  link: string;
}

// Données mocks pour les abonnés
const mockFollowers: Follower[] = [
  {
    id: '1',
    name: 'Marie K.',
    email: 'marie.k@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    city: 'Douala',
    region: 'Littoral',
    followDate: new Date('2025-03-23T10:30:00'),
    isActive: true,
    interests: ['Maternité', 'Vaccination'],
    notificationsEnabled: true,
    lastActivity: new Date('2025-03-23T14:20:00')
  },
  {
    id: '2',
    name: 'Paul N.',
    email: 'paul.n@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    city: 'Yaoundé',
    region: 'Centre',
    followDate: new Date('2025-03-23T09:15:00'),
    isActive: true,
    interests: ['Pédiatrie', 'Nutrition'],
    notificationsEnabled: false,
    lastActivity: new Date('2025-03-23T11:45:00')
  },
  {
    id: '3',
    name: 'Sophie M.',
    email: 'sophie.m@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    city: 'Douala',
    region: 'Littoral',
    followDate: new Date('2025-03-22T16:45:00'),
    isActive: true,
    interests: ['Vaccination', 'Santé mentale'],
    notificationsEnabled: true,
    lastActivity: new Date('2025-03-23T08:30:00')
  },
  {
    id: '4',
    name: 'Jean P.',
    email: 'jean.p@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    city: 'Bafoussam',
    region: 'Ouest',
    followDate: new Date('2025-03-22T14:20:00'),
    isActive: false,
    interests: ['Diabète', 'Hypertension'],
    notificationsEnabled: true,
    lastActivity: new Date('2025-03-20T19:15:00')
  },
  {
    id: '5',
    name: 'Catherine L.',
    email: 'catherine.l@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    city: 'Garoua',
    region: 'Nord',
    followDate: new Date('2025-03-21T11:30:00'),
    isActive: true,
    interests: ['Maternité', 'Nutrition'],
    notificationsEnabled: true,
    lastActivity: new Date('2025-03-23T12:45:00')
  }
];

// Données mocks pour le graphique de croissance
const mockGrowthData = [
  { month: 'Avr 2024', subscribers: 1650, event: null },
  { month: 'Mai 2024', subscribers: 1720, event: null },
  { month: 'Juin 2024', subscribers: 1780, event: null },
  { month: 'Juil 2024', subscribers: 1850, event: null },
  { month: 'Août 2024', subscribers: 1890, event: null },
  { month: 'Sep 2024', subscribers: 1920, event: null },
  { month: 'Oct 2024', subscribers: 1960, event: null },
  { month: 'Nov 2024', subscribers: 1980, event: 'Article populaire' },
  { month: 'Déc 2024', subscribers: 2020, event: null },
  { month: 'Jan 2025', subscribers: 2050, event: null },
  { month: 'Fév 2025', subscribers: 2100, event: null },
  { month: 'Mar 2025', subscribers: 2145, event: 'Campagne virale' }
];

// Données mocks pour la démographie
const mockCityData = [
  { name: 'Douala', value: 65, color: '#14b8a6' },
  { name: 'Yaoundé', value: 20, color: '#10b981' },
  { name: 'Autres', value: 15, color: '#059669' }
];

const mockInterestData = [
  { name: 'Maternité', value: 45, color: '#ec4899' },
  { name: 'Pédiatrie', value: 38, color: '#f472b6' },
  { name: 'Vaccination', value: 32, color: '#f9a8d4' },
  { name: 'Nutrition', value: 28, color: '#fbcfe8' }
];

// Fonction pour formater les nombres
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

// Fonction pour formater la date relative
const getRelativeTime = (date: Date) => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInHours < 1) {
    return 'Il y a quelques minutes';
  } else if (diffInHours < 24) {
    return `Il y a ${diffInHours}h`;
  } else if (diffInDays === 1) {
    return 'Il y a 1 jour';
  } else {
    return `Il y a ${diffInDays} jours`;
  }
};

// Composant pour la carte de statistiques
function StatsCard({ title, value, subtitle, color, icon }: { 
  title: string; 
  value: string; 
  subtitle?: string; 
  color: string; 
  icon: React.ReactNode; 
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function Avatar({ 
  name, 
  size = 'md', 
  className = '' 
}: { 
  name: string; 
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  // Extraire les initiales du nom
  const getInitials = (name: string) => {
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return names.map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Générer une couleur de fond cohérente basée sur le nom
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500'
    ];
    
    // Générer un index basé sur le nom pour toujours obtenir la même couleur
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
  };

  // Définir les tailles
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-20 h-20 text-2xl'
  };

  const initials = getInitials(name);
  const avatarColor = getAvatarColor(name);
  const sizeClass = sizeClasses[size];

  return (
    <div 
      className={`${sizeClass} ${avatarColor} rounded-full flex items-center justify-center text-white font-semibold shadow-md ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
}


// Composant pour la carte d'abonné
function FollowerCard({ 
  follower, 
  onViewProfile, 
  onToggleNotifications, 
  onSendMessage,
  isSelected, 
  onSelect 
}: { 
  follower: Follower; 
  onViewProfile: () => void; 
  onToggleNotifications: () => void; 
  onSendMessage: () => void;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300 ${isSelected ? 'ring-2 ring-teal-500' : ''}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded-lg mr-4"
        />
        
            <Avatar 
            name={follower.name} 
            size="md" 
            className="mr-4" 
          />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-semibold text-gray-900">{follower.name}</h3>
            <div className="flex items-center space-x-1">
              <button
                onClick={onToggleNotifications}
                className={`p-1.5 rounded-lg ${follower.notificationsEnabled ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-500'} transition-colors`}
                title={follower.notificationsEnabled ? 'Désactiver les notifications' : 'Activer les notifications'}
              >
                {follower.notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </button>
              <button
                onClick={onSendMessage}
                className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                title="Envoyer un message"
              >
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <MapPin className="h-3 w-3 mr-1" />
            {follower.city}, {follower.region}
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            Abonné {getRelativeTime(follower.followDate)}
          </div>
        </div>
        
        <button
          onClick={onViewProfile}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors ml-4"
          title="Voir le profil"
        >
          <User className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}

// Composant pour le modal de notification
// Composant pour le modal de notification
function NotificationModal({ 
  isOpen, 
  onClose, 
  onSend, 
  selectedCount, 
  totalCount, 
  enabledCount,
  isLoading 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSend: (data: NotificationData) => void; 
  selectedCount: number;
  totalCount: number;
  enabledCount: number;
  isLoading: boolean;
}) {
  const [notificationData, setNotificationData] = useState<NotificationData>({
    recipients: 'all',
    types: {
      push: true,
      email: true,
      sms: false
    },
    title: '',
    message: '',
    link: ''
  });

  const getRecipientCount = () => {
    switch (notificationData.recipients) {
      case 'all':
        return totalCount;
      case 'selected':
        return selectedCount;
      case 'enabled':
        return enabledCount;
      default:
        return 0;
    }
  };

  const handleSend = () => {
    if (!notificationData.title.trim()) {
      toast.error('Veuillez saisir un titre');
      return;
    }
    if (!notificationData.message.trim()) {
      toast.error('Veuillez saisir un message');
      return;
    }
    onSend(notificationData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Envoyer une notification</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Destinataires */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Destinataires</label>
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="recipients"
                    checked={notificationData.recipients === 'all'}
                    onChange={() => setNotificationData(prev => ({ ...prev, recipients: 'all' }))}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded-lg mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Tous les abonnés</span>
                    <span className="text-sm text-gray-500 ml-2">({formatNumber(totalCount)})</span>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="recipients"
                    checked={notificationData.recipients === 'selected'}
                    onChange={() => setNotificationData(prev => ({ ...prev, recipients: 'selected' }))}
                    disabled={selectedCount === 0}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded-lg mr-3 disabled:opacity-50"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Abonnés sélectionnés</span>
                    <span className="text-sm text-gray-500 ml-2">({formatNumber(selectedCount)})</span>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="recipients"
                    checked={notificationData.recipients === 'enabled'}
                    onChange={() => setNotificationData(prev => ({ ...prev, recipients: 'enabled' }))}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded-lg mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Abonnés avec notifications activées</span>
                    <span className="text-sm text-gray-500 ml-2">({formatNumber(enabledCount)})</span>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Type de notification */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Type de notification</label>
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={notificationData.types.push}
                    onChange={(e) => setNotificationData(prev => ({
                      ...prev,
                      types: { ...prev.types, push: e.target.checked }
                    }))}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded-lg mr-3"
                  />
                  <div className="flex items-center">
                    <Smartphone className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Notification push</span>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={notificationData.types.email}
                    onChange={(e) => setNotificationData(prev => ({
                      ...prev,
                      types: { ...prev.types, email: e.target.checked }
                    }))}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded-lg mr-3"
                  />
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Email</span>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={notificationData.types.sms}
                    onChange={(e) => setNotificationData(prev => ({
                      ...prev,
                      types: { ...prev.types, sms: e.target.checked }
                    }))}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded-lg mr-3"
                  />
                  <div className="flex items-center">
                    <MessageIcon className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">SMS</span>
                    <span className="text-xs text-amber-600 ml-2">(payant)</span>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={notificationData.title}
                onChange={(e) => setNotificationData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Nouvelle campagne de vaccination"
                maxLength={100}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Max 100 caractères • {notificationData.title.length}/100
              </p>
            </div>
            
            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={notificationData.message}
                onChange={(e) => setNotificationData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Nous organisons une campagne de vaccination contre la rougeole le 15 Mars. Inscrivez-vous dès maintenant!"
                maxLength={500}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Max 500 caractères • {notificationData.message.length}/500
              </p>
            </div>
            
            {/* Lien */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lien (optionnel)
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={notificationData.link}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="/campaigns/vaccination-rougeole"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Aperçu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Aperçu:</label>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    HG
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{notificationData.title || 'Titre de la notification'}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {notificationData.message || 'Message de la notification...'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Il y a quelques secondes</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Avertissement */}
            <div className="bg-red-50 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-800">
                  ⚠️ Cette notification sera envoyée à {formatNumber(getRecipientCount())} abonnés. 
                  Elle ne peut pas être annulée.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="px-6 py-2.5 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer maintenant
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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
            <h1 className="text-2xl font-bold text-gray-900">Mes abonnés</h1>
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
export default function FollowersPage() {
  const router = useRouter();
  const [followers, setFollowers] = useState<Follower[]>(mockFollowers);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'active'>('recent');
  const [selectedFollowers, setSelectedFollowers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('subscribers');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  
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
    { id: 1, title: 'Nouvel abonné', time: 'Il y a 5 minutes', action: 'Voir' },
    { id: 2, title: 'Campagne terminée', time: 'Il y a 1 heure', action: 'Voir' },
    { id: 3, title: 'Nouvelle statistique disponible', time: 'Il y a 3 heures', action: 'Voir' }
  ];
  
  // Nombre d'éléments par page
  const itemsPerPage = 10;
  
  // Calculer les statistiques
  const stats = useMemo(() => {
    const total = followers.length;
    const active = followers.filter(f => f.isActive).length;
    const notificationsEnabled = followers.filter(f => f.notificationsEnabled).length;
    const thisMonth = followers.filter(f => {
      const now = new Date();
      const followDate = new Date(f.followDate);
      return followDate.getMonth() === now.getMonth() && followDate.getFullYear() === now.getFullYear();
    }).length;
    
    return { total, active, notificationsEnabled, thisMonth };
  }, [followers]);
  
  // Filtrer et trier les abonnés
  const filteredFollowers = useMemo(() => {
    let filtered = [...followers];
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(follower => 
        follower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        follower.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        follower.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        follower.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Trier
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.followDate).getTime() - new Date(a.followDate).getTime());
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.followDate).getTime() - new Date(b.followDate).getTime());
    } else if (sortBy === 'active') {
      filtered.sort((a, b) => {
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return 0;
      });
    }
    
    return filtered;
  }, [followers, searchTerm, sortBy]);
  
  // Paginer les résultats
  const paginatedFollowers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredFollowers.slice(startIndex, endIndex);
  }, [filteredFollowers, currentPage]);
  
  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredFollowers.length / itemsPerPage);
  
  // Gérer la sélection d'abonnés
  const handleSelectFollower = (followerId: string) => {
    setSelectedFollowers(prev => 
      prev.includes(followerId) 
        ? prev.filter(id => id !== followerId)
        : [...prev, followerId]
    );
  };
  
  // Gérer la sélection de tous les abonnés
  const handleSelectAll = () => {
    if (selectedFollowers.length === paginatedFollowers.length) {
      setSelectedFollowers([]);
    } else {
      setSelectedFollowers(paginatedFollowers.map(f => f.id));
    }
  };
  
  // Gérer l'envoi de notifications
  const handleSendNotification = (data: NotificationData) => {
    setIsLoading(true);
    
    // Simuler l'envoi de notifications
    setTimeout(() => {
      setIsLoading(false);
      setShowNotificationModal(false);
      setSelectedFollowers([]);
      toast.success('Notification envoyée avec succès');
    }, 2000);
  };
  
  // Gérer le basculement des notifications pour un abonné
  const handleToggleNotifications = (followerId: string) => {
    setFollowers(prev => 
      prev.map(f => 
        f.id === followerId 
          ? { ...f, notificationsEnabled: !f.notificationsEnabled }
          : f
      )
    );
    toast.success('Préférence de notification mise à jour');
  };
  
  // Gérer l'envoi d'un message à un abonné
  const handleSendMessage = (followerId: string) => {
    const follower = followers.find(f => f.id === followerId);
    if (follower) {
      toast.success(`Message envoyé à ${follower.name}`);
    }
  };
  
  // Gérer la vue du profil d'un abonné
  const handleViewProfile = (followerId: string) => {
    const follower = followers.find(f => f.id === followerId);
    if (follower) {
      router.push(`/dashboard/abonnes/${followerId}`);
    }
  };
  
  // Afficher ou masquer les actions groupées
  useEffect(() => {
    setShowBulkActions(selectedFollowers.length > 0);
  }, [selectedFollowers]);
  
  // Fonction pour basculer la sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Custom tooltip pour le graphique de croissance
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">{`${formatNumber(payload[0].value)} abonnés`}</p>
          {payload[0].payload.event && (
            <p className="text-xs text-teal-600 mt-1">{payload[0].payload.event}</p>
          )}
        </div>
      );
    }
    return null;
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
          {/* Header avec statistiques */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes abonnés</h1>
            <p className="text-base text-gray-600">
              {formatNumber(stats.total)} abonnés • +{stats.thisMonth} ce mois
            </p>
          </div>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard 
              title="Total" 
              value={formatNumber(stats.total)} 
              color="bg-gray-100 text-gray-600" 
              icon={<Users className="h-6 w-6" />} 
            />
            <StatsCard 
              title="Actifs" 
              value={formatNumber(stats.active)} 
              subtitle={`${Math.round((stats.active / stats.total) * 100)}% du total`}
              color="bg-green-100 text-green-600" 
              icon={<CheckCircle className="h-6 w-6" />} 
            />
            <StatsCard 
              title="Notifications activées" 
              value={formatNumber(stats.notificationsEnabled)} 
              subtitle={`${Math.round((stats.notificationsEnabled / stats.total) * 100)}% du total`}
              color="bg-blue-100 text-blue-600" 
              icon={<Bell className="h-6 w-6" />} 
            />
            <StatsCard 
              title="Nouveaux ce mois" 
              value={formatNumber(stats.thisMonth)} 
              subtitle={`Moyenne: ${(stats.thisMonth / 30).toFixed(1)}/jour`}
              color="bg-teal-100 text-teal-600" 
              icon={<TrendingUp className="h-6 w-6" />} 
            />
          </div>
          
          {/* Growth chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-teal-600" />
              Croissance des abonnés
            </h3>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSubscribers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="subscribers" 
                    stroke="#14b8a6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorSubscribers)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">Taux de croissance</p>
                <p className="text-xl font-bold text-gray-900">+6.1% ce mois</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">Moyenne d&apos;abonnements</p>
                <p className="text-xl font-bold text-gray-900">4.1 par jour</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">Pic</p>
                <p className="text-xl font-bold text-gray-900">23 Mars 2025 (+45)</p>
              </div>
            </div>
          </div>
          
          {/* Filters and search */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un abonné..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="recent">Plus récents</option>
                  <option value="oldest">Plus anciens</option>
                  <option value="active">Plus actifs</option>
                </select>
              </div>
            </div>
            
            {/* Bulk actions */}
            {showBulkActions && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700">
                    {selectedFollowers.length} sélectionné{selectedFollowers.length > 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowNotificationModal(true)}
                    disabled={isLoading}
                    className="px-3 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4 inline mr-1" />
                    Envoyer notification
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Followers table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedFollowers.length === paginatedFollowers.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded-lg mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    {selectedFollowers.length} de {paginatedFollowers.length} sélectionné{selectedFollowers.length > 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="text-sm text-gray-500">
                  Affichage de 1-{Math.min(itemsPerPage, filteredFollowers.length)} sur {filteredFollowers.length} abonnés
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {paginatedFollowers.map((follower) => (
                <FollowerCard
                  key={follower.id}
                  follower={follower}
                  onViewProfile={() => handleViewProfile(follower.id)}
                  onToggleNotifications={() => handleToggleNotifications(follower.id)}
                  onSendMessage={() => handleSendMessage(follower.id)}
                  isSelected={selectedFollowers.includes(follower.id)}
                  onSelect={() => handleSelectFollower(follower.id)}
                />
              ))}
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Affichage de {(currentPage - 1) * itemsPerPage + 1} à{' '}
                  {Math.min(currentPage * itemsPerPage, filteredFollowers.length)} sur{' '}
                  {filteredFollowers.length} abonnés
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
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
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          currentPage === pageNum
                            ? 'bg-teal-600 text-white'
                            : 'border border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cities pie chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-teal-600" />
                Villes
              </h3>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockCityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                          `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                        }

                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockCityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Interests bar chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-teal-600" />
                Centres d&apos;intérêt
              </h3>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockInterestData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#ec4899" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        onSend={handleSendNotification}
        selectedCount={selectedFollowers.length}
        totalCount={stats.total}
        enabledCount={stats.notificationsEnabled}
        isLoading={isLoading}
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 flex items-center">
            <RefreshCw className="h-5 w-5 text-teal-600 animate-spin mr-2" />
            <span>Chargement...</span>
          </div>
        </div>
      )}
    </div>
  );
}