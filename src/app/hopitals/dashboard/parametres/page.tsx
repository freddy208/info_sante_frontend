/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  User,
  Shield,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Mail,
  Calendar,
  TrendingUp,
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
  Edit,
  Plus,
  Minus,
  Eye,
  Bell,
  BellOff,
  Globe,
  Smartphone,
  Monitor,
  Key,
  Lock,
  UserPlus,
  ShieldCheck,
  Clock as ClockIcon,
  Languages,
  Moon,
  Sun,
  Info,
  MoreVertical,
  EyeOff,
  MessageSquare
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { TeamMember, Role, InviteMemberModalProps } from '@/types/team';

// Type pour les permissions
type Permission = 'content' | 'carte' | 'view';


interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  weeklyReport: boolean;
  securityAlerts: boolean;
  systemUpdates: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  ipWhitelist: string[];
  loginAttempts: number;
  passwordExpiry: number;
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'fr' | 'en';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timezone: string;
}

// Données mocks pour l'équipe
const mockTeamMembers: TeamMember[] = [
  {
      id: '1',
      name: 'Dr. Jean Kamga',
      email: 'jean.kamga@hospitalgeneral.cm',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      role: 'admin',
      permissions: ['content'],
      isActive: true,
      lastActive: new Date('2025-03-23T14:30:00'),
      updated: new Date('2025-03-23T14:30:00')
  },
  {
    id: '2',
    name: 'Dr. Marie Mbarga',
    email: 'marie.mbarga@hospitalgeneral.cm',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    role: 'admin',
    permissions: ['content'],
    isActive: true,
    lastActive: new Date('2025-03-23T16:45:00'),
    updated: new Date('2023-02-20T10:30:00')
  },
  {
    id: '3',
    name: 'Dr. Paul Tchamda',
    email: 'paul.tchamda@hospitalgeneral.cm',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    role: 'editor',
    permissions: ['content', 'view', 'carte'],
    isActive: true,
    lastActive: new Date('2025-03-23T11:20:00'),
    updated: new Date('2023-03-10T14:15:00')
  },
  {
    id: '4',
    name: 'Dr. Sophie Ngo',
    email: 'sophie.ngo@hospitalgeneral.cm',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    role: 'editor',
    permissions: ['content', 'view'],
    isActive: false,
    lastActive: new Date('2025-03-20T09:30:00'),
    updated: new Date('2023-04-05T16:45:00')
  },
  {
    id: '5',
    name: 'Dr. Robert Etame',
    email: 'robert.etame@hospitalgeneral.cm',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    role: 'viewer',
    permissions: ['view'],
    isActive: true,
    // Donnée corrigée
    lastActive: new Date('2025-03-23T08:15:00'),
    updated: new Date('2023-05-12T11:30:00')
  }
];

// Fonction pour formater la date
const formatDate = (date: Date, format: string = 'DD/MM/YYYY') => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };
  
  if (format === 'MM/DD/YYYY') {
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } else if (format === 'YYYY-MM-DD') {
    return new Intl.DateTimeFormat('en-CA', { ...options, year: 'numeric' }).format(date);
  }
  
  return new Intl.DateTimeFormat('fr-FR', options).format(date);
};

// Fonction pour formater l'heure
// Fonction pour formater l'heure améliorée
const formatTime = (date: Date) => {
  // Vérifier si la date est valide
  if (!date || isNaN(date.getTime())) {
    return 'N/A';
  }
  
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Composant pour la carte de membre d'équipe
function TeamMemberCard({ 
  member, 
  onEdit, 
  onToggleStatus,
  onDelete 
}: { 
  member: TeamMember; 
  onEdit: () => void; 
  onToggleStatus: () => void;
  onDelete: () => void;
}) {
  const [showActions, setShowActions] = useState(false);
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700';
      case 'editor':
        return 'bg-blue-100 text-blue-700';
      case 'viewer':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'editor':
        return 'Éditeur';
      case 'viewer':
        return 'Lecteur';
      default:
        return 'Membre';
    }
  };
  
type Permission = 'content' | 'carte' | 'view';

const getPermissionText = (permissions: Permission[]) => {
  // Si l'utilisateur a tous les droits
  if (permissions.includes('content')) return 'Tous les droits';
  
  // Mapping des permissions vers leur nom lisible
  const permissionMap: Record<Permission, string> = {
    content: 'Contenu',
    carte: 'Cartes',
    view: 'Vue seule',
  };
  
  // On transforme la liste de permissions en texte
  return permissions.map(p => permissionMap[p] || p).join(', ');
};


  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div>
            <div className="flex items-center mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(member.role)}`}>
                {getRoleText(member.role)}
              </span>
            </div>
            <p className="text-sm text-gray-600">{member.email}</p>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Membre depuis {formatDate(member.updated)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-1" />
          <span>Dernière activité: {formatTime(member.lastActive)}</span>
        </div>
        
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          member.isActive 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {member.isActive ? 'Actif' : 'Inactif'}
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Permissions:</p>
        <p className="text-sm text-gray-800">{getPermissionText(member.permissions)}</p>
      </div>
      
      <div className="flex items-center justify-between">
        <button
          onClick={onEdit}
          className="flex items-center px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors"
        >
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </button>
        
        <button
          onClick={onToggleStatus}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
            member.isActive 
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {member.isActive ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
          {member.isActive ? 'Désactiver' : 'Activer'}
        </button>
        
        <button
          onClick={onDelete}
          className="flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer
        </button>
      </div>
      
      {/* Actions menu */}
      {showActions && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
          <button
            onClick={() => { onEdit(); setShowActions(false); }}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Modifier
          </button>
          <button
            onClick={() => { onToggleStatus(); setShowActions(false); }}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
          >
            {member.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {member.isActive ? 'Désactiver' : 'Activer'}
          </button>
          <button
            onClick={() => { onDelete(); setShowActions(false); }}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
}

 function InviteMemberModal({ isOpen, onClose, onSubmit }: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("viewer");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Inviter un membre</h2>
        
        <input
          type="email"
          placeholder="Email du membre"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-xl"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="w-full px-4 py-2 mb-4 border rounded-xl"
        >
          <option value="admin">Admin</option>
          <option value="editor">Éditeur</option>
          <option value="viewer">Lecteur</option>
        </select>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border"
          >
            Annuler
          </button>

          <button
            onClick={() => {
              onSubmit(email, role);
              setEmail("");
              setRole("viewer");
            }}
            className="px-4 py-2 rounded-xl bg-teal-600 text-white"
          >
            Inviter
          </button>
        </div>
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
    toast.success('Déconnexion réussie');
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
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all">
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
            <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
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
export default function SettingsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('settings');
  const [activeTab, setActiveTab] = useState<'account' | 'team' | 'notifications' | 'security' | 'appearance'>('account');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // États pour les paramètres
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    weeklyReport: true,
    securityAlerts: true,
    systemUpdates: false
  });
  
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 8,
    ipWhitelist: [],
    loginAttempts: 5,
    passwordExpiry: 90
  });
  
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
    theme: 'auto',
    language: 'fr',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Africa/Douala'
  });
  
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
    { id: 1, title: 'Nouveau membre dans l\'équipe', time: 'Il y a 5 minutes', action: 'Voir' },
    { id: 2, title: 'Paramètres de sécurité mis à jour', time: 'Il y a 1 heure', action: 'Voir' },
    { id: 3, title: 'Rapport hebdomadaire disponible', time: 'Il y a 3 heures', action: 'Voir' }
  ];
  
  // Fonction pour gérer l'ajout d'un membre
  const handleAddMember = () => {
    setShowInviteModal(true);
  };
  
  // Fonction pour gérer la modification d'un membre
  const handleEditMember = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (member) {
      toast(`Modification du membre ${member.name} à implémenter`);
    }
  };
  
  // Fonction pour gérer le statut d'un membre
  const handleToggleMemberStatus = (memberId: string) => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === memberId 
          ? { ...member, isActive: !member.isActive }
          : member
      )
    );
    
    const member = teamMembers.find(m => m.id === memberId);
    if (member) {
      toast.success(`Membre ${member.name} ${member.isActive ? 'activé' : 'désactivé'} avec succès`);
    }
  };
  
  // Fonction pour supprimer un membre
  const handleDeleteMember = (memberId: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== memberId));
    toast.success('Membre supprimé avec succès');
  };
  
  // Fonction pour sauvegarder les paramètres du compte
  const handleSaveAccountSettings = () => {
    setIsLoading(true);
    
    // Simuler la sauvegarde
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Paramètres du compte sauvegardés avec succès');
    }, 1000);
  };
  
  // Fonction pour sauvegarder les paramètres de notification
  const handleSaveNotificationSettings = () => {
    setIsLoading(true);
    
    // Simuler la sauvegarde
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Paramètres de notification sauvegardés avec succès');
    }, 1000);
  };
  
  // Fonction pour sauvegarder les paramètres de sécurité
  const handleSaveSecuritySettings = () => {
    setIsLoading(true);
    
    // Simuler la sauvegarde
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Paramètres de sécurité sauvegardés avec succès');
    }, 1000);
  };
  
  // Fonction pour sauvegarder les paramètres d'apparence
  const handleSaveAppearanceSettings = () => {
    setIsLoading(true);
    
    // Simuler la sauvegarde
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Paramètres d\'apparence sauvegardés avec succès');
    }, 1000);
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
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          </div>
          
          {/* Tabs navigation */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center border-b border-gray-100">
              {[
                { id: 'account', label: 'Compte', icon: User },
                { id: 'team', label: 'Équipe', icon: Users },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'security', label: 'Sécurité', icon: Shield },
                { id: 'appearance', label: 'Apparence', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id 
                      ? 'text-teal-700 border-b-2 border-teal-600' 
                      : 'text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className={`h-5 w-5 mr-2 ${activeTab === tab.id ? 'text-teal-600' : 'text-gray-500'}`} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tab content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-6 w-6 mr-2 text-teal-600" />
                    Informations du compte
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email du compte
                    </label>
                    <div className="flex items-center">
                      <input
                        type="email"
                        defaultValue={user.email}
                        readOnly
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom d&apos;utilisateur
                    </label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      readOnly
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl bg-gray-50"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de compte
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        defaultValue="Hôpital Public"
                        readOnly
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro d&apos;agrément
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        defaultValue="AGR-2023-MINSANTE-001"
                        readOnly
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <button
                    onClick={handleSaveAccountSettings}
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Sauvegarde en cours...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Sauvegarder les modifications
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Users className="h-6 w-6 mr-2 text-teal-600" />
                    Gestion de l&apos;équipe
                  </h3>
                  
                  <button
                    onClick={handleAddMember}
                    className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Inviter un membre
                  </button>
                </div>
                
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <TeamMemberCard
                      key={member.id}
                      member={member}
                      onEdit={() => handleEditMember(member.id)}
                      onToggleStatus={() => handleToggleMemberStatus(member.id)}
                      onDelete={() => handleDeleteMember(member.id)}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Bell className="h-6 w-6 mr-2 text-teal-600" />
                    Paramètres de notification
                  </h3>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      Notifications par email
                    </label>
                    <button
                      onClick={() => setNotificationSettings(prev => ({ ...prev, email: !prev.email }))}
                      className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                        notificationSettings.email 
                          ? 'bg-teal-600' 
                          : 'bg-gray-200'
                      }`}
                    >
                      <div className={`absolute inset-0 rounded-full transition-colors ${
                        notificationSettings.email ? 'bg-teal-600' : 'bg-gray-300'
                      }`}>
                        <div className={`transform transition-transform ${notificationSettings.email ? 'translate-x-5' : 'translate-x-0'}`}>
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      Notifications push
                    </label>
                    <button
                      onClick={() => setNotificationSettings(prev => ({ ...prev, push: !prev.push }))}
                      className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                        notificationSettings.push 
                          ? 'bg-teal-600' 
                          : 'bg-gray-200'
                      }`}
                    >
                      <div className={`absolute inset-0 rounded-full transition-colors ${
                        notificationSettings.push 
                          ? 'bg-teal-600' 
                          : 'bg-gray-300'
                      }`}>
                        <div className={`transform transition-transform ${notificationSettings.push ? 'translate-x-5' : 'translate-x-0'}`}>
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      Notifications SMS
                    </label>
                    <button
                      onClick={() => setNotificationSettings(prev => ({ ...prev, sms: !prev.sms }))}
                      className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                        notificationSettings.sms 
                          ? 'bg-teal-600' 
                          : 'bg-gray-200'
                      }`}
                    >
                      <div className={`absolute inset-0 rounded-full transition-colors ${
                        notificationSettings.sms 
                          ? 'bg-teal-600' 
                          : 'bg-gray-300'
                      }`}>
                        <div className={`transform transition-transform ${notificationSettings.sms ? 'translate-x-5' : 'translate-x-0'}`}>
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      Rapport hebdomadaire
                    </label>
                    <button
                      onClick={() => setNotificationSettings(prev => ({ ...prev, weeklyReport: !prev.weeklyReport }))}
                      className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                        notificationSettings.weeklyReport 
                          ? 'bg-teal-600' 
                          : 'bg-gray-200'
                      }`}
                    >
                      <div className={`absolute inset-0 rounded-full transition-colors ${
                        notificationSettings.weeklyReport 
                          ? 'bg-teal-600' 
                          : 'bg-gray-300'
                      }`}>
                        <div className={`transform transition-transform ${notificationSettings.weeklyReport ? 'translate-x-5' : 'translate-x-0'}`}>
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      Alertes de sécurité
                    </label>
                    <button
                      onClick={() => setNotificationSettings(prev => ({ ...prev, securityAlerts: !prev.securityAlerts }))}
                      className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                        notificationSettings.securityAlerts 
                          ? 'bg-teal-600' 
                          : 'bg-gray-200'
                      }`}
                    >
                      <div className={`absolute inset-0 rounded-full transition-colors ${
                        notificationSettings.securityAlerts 
                          ? 'bg-teal-600' 
                          : 'bg-gray-300'
                      }`}>
                        <div className={`transform transition-transform ${notificationSettings.securityAlerts ? 'translate-x-5' : 'translate-x-0'}`}>
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      Mises à jour système
                    </label>
                    <button
                      onClick={() => setNotificationSettings(prev => ({ ...prev, systemUpdates: !prev.systemUpdates }))}
                      className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                        notificationSettings.systemUpdates 
                          ? 'bg-teal-600' 
                          : 'bg-gray-200'
                      }`}
                    >
                      <div className={`absolute inset-0 rounded-full transition-colors ${
                        notificationSettings.systemUpdates 
                          ? 'bg-teal-600' 
                          : 'bg-gray-300'
                      }`}>
                        <div className={`transform transition-transform ${notificationSettings.systemUpdates ? 'translate-x-5' : 'translate-x-0'}`}>
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <button
                    onClick={handleSaveNotificationSettings}
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Sauvegarde en cours...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Sauvegarder les modifications
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Shield className="h-6 w-6 mr-2 text-teal-600" />
                    Sécurité
                  </h3>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      Authentification à deux facteurs
                    </label>
                    <button
                      onClick={() => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))}
                      className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                        securitySettings.twoFactorAuth 
                          ? 'bg-teal-600' 
                          : 'bg-gray-200'
                      }`}
                    >
                      <div className={`absolute inset-0 rounded-full transition-colors ${
                        securitySettings.twoFactorAuth 
                          ? 'bg-teal-600' 
                          : 'bg-gray-300'
                      }`}>
                        <div className={`transform transition-transform ${securitySettings.twoFactorAuth ? 'translate-x-5' : 'translate-x-0'}`}>
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Délai d&apos;expiration du mot de passe
                    </label>
                    <select
                      value={securitySettings.passwordExpiry}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) }))}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value={30}>30 jours</option>
                      <option value={60}>60 jours</option>
                      <option value={90}>90 jours</option>
                      <option value={180}>180 jours</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Limite de tentatives de connexion
                    </label>
                    <input
                      type="number"
                      value={securitySettings.loginAttempts}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAttempts: parseInt(e.target.value) }))}
                      min="1"
                      max="10"
                      className="w-24 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Liste blanche d&apos;IP autorisées
                    </label>
                    <button
                      onClick={() => setSecuritySettings(prev => ({ ...prev, ipWhitelist: [] }))}
                      className="text-sm text-teal-600 hover:text-teal-700"
                    >
                      Vider et gérer
                    </button>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <button
                    onClick={handleSaveSecuritySettings}
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Sauvegarde en cours...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Sauvegarder les modifications
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Settings className="h-6 w-6 mr-2 text-teal-600" />
                    Apparence
                  </h3>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Thème
                    </label>
                    <select
                      value={appearanceSettings.theme}
                      onChange={(e) => setAppearanceSettings(prev => ({ ...prev, theme: e.target.value as any }))}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="auto">Automatique</option>
                      <option value="light">Clair</option>
                      <option value="dark">Sombre</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Langue
                    </label>
                    <select
                      value={appearanceSettings.language}
                      onChange={(e) => setAppearanceSettings(prev => ({ ...prev, language: e.target.value as any }))}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Format de date
                    </label>
                    <select
                      value={appearanceSettings.dateFormat}
                      onChange={(e) => setAppearanceSettings(prev => ({ ...prev, dateFormat: e.target.value as any }))}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="DD/MM/YYYY">JJ/MM/AAAA</option>
                      <option value="MM/DD/YYYY">MM/JJ/AAAA</option>
                      <option value="YYYY-MM-DD">AAAA-MM-JJ</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Fuseau horaire
                    </label>
                    <select
                      value={appearanceSettings.timezone}
                      onChange={(e) => setAppearanceSettings(prev => ({ ...prev, timezone: e.target.value }))}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Africa/Douala">Afrique/Douala (GMT+1)</option>
                      <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                      <option value="America/New_York">Amérique/New York (GMT-4)</option>
                    </select>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <button
                    onClick={handleSaveAppearanceSettings}
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Sauvegarde en cours...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Sauvegarder les modifications
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {/* Danger zone */}
            <div className="mt-8 p-6 bg-red-50 rounded-2xl border-l-4 border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                <AlertCircle className="h-6 w-6 mr-2 text-red-600" />
                Zone de danger
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-red-900 font-medium mb-1">Désactiver le compte</p>
                    <p className="text-red-800 text-sm">
                      Votre profil sera masqué mais vos données seront conservées. 
                      Pour supprimer définitivement votre compte, contactez l&apos;administrateur.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-red-900 font-medium mb-1">Supprimer le compte</p>
                    <p className="text-red-800 text-sm">
                      Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  className="px-6 py-2 bg-white text-red-600 border border-red-200 rounded-xl font-medium hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Désactiver
                </button>
                
                <button
                  className="px-6 py-2 bg-red-600 text-white border border-red-200 rounded-xl font-medium hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Invite member modal */}
      {/* Invite member modal */}
<InviteMemberModal
  isOpen={showInviteModal}
  onClose={() => setShowInviteModal(false)}
  onSubmit={(email, role) => {  // role est déjà du type Role
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      avatar: `https://randomuser.me/api/portraits/${Math.floor(Math.random() * 10)}.jpg`,
      role,
      permissions: role === 'admin'
        ? ['content']
        : role === 'editor'
          ? ['content', 'carte', 'view']
          : ['view'],
      isActive: true,
      lastActive: new Date(),
      updated: new Date(),
    };

    setTeamMembers(prev => [...prev, newMember]);
    setShowInviteModal(false);
    toast.success(`Invitation envoyée à ${email} avec succès`);
  }}
/>

{/* Loading overlay */}
{isLoading && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-4 flex items-center">
      <RefreshCw className="h-5 w-5 text-teal-600 animate-spin mr-2" />
      <span>Sauvegarde en cours...</span>
    </div>
  </div>
) }
</div>
)}
