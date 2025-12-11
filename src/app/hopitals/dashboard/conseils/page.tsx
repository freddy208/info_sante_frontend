/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
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
  Lightbulb,
  Menu,
  Home,
  Megaphone,
  Settings,
  HelpCircle,
  LogOut,
  Grid,
  List,
  Heart,
  Share2,
  Target,
  Flag,
  User
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Enums pour les conseils
enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

enum AdviceStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

enum TargetAudience {
  ALL = 'ALL',
  CHILDREN = 'CHILDREN',
  YOUTH = 'YOUTH',
  ADULTS = 'ADULTS',
  ELDERLY = 'ELDERLY',
  PREGNANT_WOMEN = 'PREGNANT_WOMEN'
}

// Types pour les données
interface Advice {
  id: string;
  organizationId: string;
  categoryId: string;
  title: string;
  content: string;
  icon: string;
  reactionsCount: number;
  priority: Priority;
  targetAudience: TargetAudience[];
  viewsCount: number;
  sharesCount: number;
  isActive: boolean;
  publishedAt: Date;
  status: AdviceStatus;
  createdAt: Date;
  updatedAt: Date;
  organization: {
    id: string;
    name: string;
    logo: string;
    phone: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

// Données mocks pour les conseils
const mockAdvices: Advice[] = [
  {
    id: '1',
    organizationId: 'org1',
    categoryId: '1',
    title: 'Buvez au moins 2 litres d\'eau par jour',
    content: 'L\'hydratation est essentielle pour maintenir votre santé. En période de chaleur ou lors d\'activités physiques, augmentez votre consommation d\'eau.',
    icon: '💧',
    reactionsCount: 1245,
    priority: Priority.HIGH,
    targetAudience: [TargetAudience.ALL],
    viewsCount: 3542,
    sharesCount: 234,
    isActive: true,
    publishedAt: new Date('2025-08-01'),
    status: AdviceStatus.PUBLISHED,
    createdAt: new Date('2025-07-25'),
    updatedAt: new Date('2025-08-01'),
    organization: {
      id: 'org1',
      name: 'MINSANTÉ Cameroun',
      logo: 'minsante-logo',
      phone: '+237 222 23 40 14'
    },
    category: {
      id: '1',
      name: 'Hydratation',
      slug: 'hydratation'
    }
  },
  {
    id: '2',
    organizationId: 'org2',
    categoryId: '2',
    title: 'Prenez vos médicaments aux heures prescrites',
    content: 'Respecter les horaires de prise de médicaments améliore leur efficacité. Utilisez des rappels si nécessaire.',
    icon: '💊',
    reactionsCount: 456,
    priority: Priority.MEDIUM,
    targetAudience: [TargetAudience.ADULTS, TargetAudience.ELDERLY],
    viewsCount: 1820,
    sharesCount: 89,
    isActive: true,
    publishedAt: new Date('2025-07-28'),
    status: AdviceStatus.PUBLISHED,
    createdAt: new Date('2025-07-20'),
    updatedAt: new Date('2025-07-28'),
    organization: {
      id: 'org2',
      name: 'Hôpital Général Douala',
      logo: 'hgd-logo',
      phone: '+237 233 42 11 31'
    },
    category: {
      id: '2',
      name: 'Médicaments',
      slug: 'medicaments'
    }
  },
  {
    id: '3',
    organizationId: 'org3',
    categoryId: '3',
    title: 'Mangez 5 fruits et légumes par jour',
    content: 'Variez les couleurs pour bénéficier de différents nutriments essentiels. Privilégiez les produits locaux et de saison.',
    icon: '🍎',
    reactionsCount: 823,
    priority: Priority.LOW,
    targetAudience: [TargetAudience.ALL],
    viewsCount: 2100,
    sharesCount: 156,
    isActive: true,
    publishedAt: new Date('2025-07-25'),
    status: AdviceStatus.PUBLISHED,
    createdAt: new Date('2025-07-18'),
    updatedAt: new Date('2025-07-25'),
    organization: {
      id: 'org3',
      name: 'MINSANTÉ',
      logo: 'minsante-logo',
      phone: '+237 222 23 40 14'
    },
    category: {
      id: '3',
      name: 'Nutrition',
      slug: 'nutrition'
    }
  },
  {
    id: '4',
    organizationId: 'org4',
    categoryId: '4',
    title: 'Lavez-vous les mains régulièrement',
    content: 'Le lavage des mains au savon pendant au moins 20 secondes élimine 99% des germes. Faites-le avant de manger et après être allé aux toilettes.',
    icon: '🧼',
    reactionsCount: 2100,
    priority: Priority.URGENT,
    targetAudience: [TargetAudience.ALL],
    viewsCount: 4560,
    sharesCount: 423,
    isActive: true,
    publishedAt: new Date('2025-07-22'),
    status: AdviceStatus.PUBLISHED,
    createdAt: new Date('2025-07-15'),
    updatedAt: new Date('2025-07-22'),
    organization: {
      id: 'org4',
      name: 'OMS',
      logo: 'oms-logo',
      phone: '+237 222 23 45 67'
    },
    category: {
      id: '4',
      name: 'Hygiène',
      slug: 'hygiene'
    }
  },
  {
    id: '5',
    organizationId: 'org5',
    categoryId: '5',
    title: 'Faites 30 minutes d\'exercice par jour',
    content: 'L\'activité physique régulière renforce votre système immunitaire et améliore votre santé mentale. Marche, course, natation : choisissez ce que vous aimez!',
    icon: '🏃',
    reactionsCount: 678,
    priority: Priority.MEDIUM,
    targetAudience: [TargetAudience.ADULTS],
    viewsCount: 1890,
    sharesCount: 123,
    isActive: true,
    publishedAt: new Date('2025-07-20'),
    status: AdviceStatus.PUBLISHED,
    createdAt: new Date('2025-07-12'),
    updatedAt: new Date('2025-07-20'),
    organization: {
      id: 'org5',
      name: 'Centre Sportif National',
      logo: 'csn-logo',
      phone: '+237 233 42 22 33'
    },
    category: {
      id: '5',
      name: 'Sport',
      slug: 'sport'
    }
  },
  {
    id: '6',
    organizationId: 'org6',
    categoryId: '6',
    title: 'Dormez 7-8 heures par nuit',
    content: 'Un sommeil de qualité est essentiel pour la récupération physique et mentale. Évitez les écrans avant de dormir et créez un environnement propice au repos.',
    icon: '😴',
    reactionsCount: 945,
    priority: Priority.MEDIUM,
    targetAudience: [TargetAudience.ADULTS, TargetAudience.ELDERLY],
    viewsCount: 2340,
    sharesCount: 167,
    isActive: true,
    publishedAt: new Date('2025-07-18'),
    status: AdviceStatus.PUBLISHED,
    createdAt: new Date('2025-07-10'),
    updatedAt: new Date('2025-07-18'),
    organization: {
      id: 'org6',
      name: 'Clinique du Sommeil',
      logo: 'sleep-clinic-logo',
      phone: '+237 233 42 33 44'
    },
    category: {
      id: '6',
      name: 'Sommeil',
      slug: 'sommeil'
    }
  },
  {
    id: '7',
    organizationId: 'org7',
    categoryId: '7',
    title: 'Évitez le tabac et l\'alcool',
    content: 'Le tabac et l\'alcool sont des facteurs de risque majeurs pour de nombreuses maladies. Réduisez ou éliminez leur consommation pour préserver votre santé.',
    icon: '🚭',
    reactionsCount: 567,
    priority: Priority.HIGH,
    targetAudience: [TargetAudience.YOUTH, TargetAudience.ADULTS],
    viewsCount: 1560,
    sharesCount: 98,
    isActive: true,
    publishedAt: new Date('2025-07-15'),
    status: AdviceStatus.PUBLISHED,
    createdAt: new Date('2025-07-08'),
    updatedAt: new Date('2025-07-15'),
    organization: {
      id: 'org7',
      name: 'Centre de Prévention des Addictions',
      logo: 'cpa-logo',
      phone: '+237 233 42 55 66'
    },
    category: {
      id: '7',
      name: 'Addictions',
      slug: 'addictions'
    }
  },
  {
    id: '8',
    organizationId: 'org8',
    categoryId: '8',
    title: 'Protégez-vous du soleil',
    content: 'Utilisez une crème solaire avec un indice de protection élevé, portez un chapeau et des lunettes de soleil, et évitez les heures les plus chaudes de la journée.',
    icon: '☀️',
    reactionsCount: 789,
    priority: Priority.MEDIUM,
    targetAudience: [TargetAudience.ALL],
    viewsCount: 1780,
    sharesCount: 145,
    isActive: true,
    publishedAt: new Date('2025-07-12'),
    status: AdviceStatus.PUBLISHED,
    createdAt: new Date('2025-07-05'),
    updatedAt: new Date('2025-07-12'),
    organization: {
      id: 'org8',
      name: 'Centre de Dermatologie',
      logo: 'cd-logo',
      phone: '+237 233 42 77 88'
    },
    category: {
      id: '8',
      name: 'Protection Solaire',
      slug: 'protection-solaire'
    }
  },
  {
    id: '9',
    organizationId: 'org9',
    categoryId: '9',
    title: 'Consultez régulièrement un médecin',
    content: 'Les examens de prévention permettent de détecter les maladies à un stade précoce. Suivez les recommandations de votre médecin en fonction de votre âge et de vos antécédents.',
    icon: '🩺',
    reactionsCount: 432,
    priority: Priority.HIGH,
    targetAudience: [TargetAudience.ADULTS, TargetAudience.ELDERLY],
    viewsCount: 1230,
    sharesCount: 76,
    isActive: true,
    publishedAt: new Date('2025-07-10'),
    status: AdviceStatus.PUBLISHED,
    createdAt: new Date('2025-07-03'),
    updatedAt: new Date('2025-07-10'),
    organization: {
      id: 'org9',
      name: 'Hôpital Général Yaoundé',
      logo: 'hgy-logo',
      phone: '+237 233 42 99 00'
    },
    category: {
      id: '9',
      name: 'Prévention',
      slug: 'prevention'
    }
  },
  {
    id: '10',
    organizationId: 'org10',
    categoryId: '10',
    title: 'Gérez votre stress',
    content: 'Le stress chronique peut affecter votre santé physique et mentale. Pratiquez des techniques de relaxation comme la méditation, le yoga ou la respiration profonde.',
    icon: '🧘',
    reactionsCount: 876,
    priority: Priority.MEDIUM,
    targetAudience: [TargetAudience.ADULTS],
    viewsCount: 2100,
    sharesCount: 189,
    isActive: true,
    publishedAt: new Date('2025-07-08'),
    status: AdviceStatus.PUBLISHED,
    createdAt: new Date('2025-07-01'),
    updatedAt: new Date('2025-07-08'),
    organization: {
      id: 'org10',
      name: 'Centre de Santé Mentale',
      logo: 'csm-logo',
      phone: '+237 233 42 11 22'
    },
    category: {
      id: '10',
      name: 'Santé Mentale',
      slug: 'sante-mentale'
    }
  },
  {
    id: '11',
    organizationId: 'org11',
    categoryId: '11',
    title: 'Limitez les aliments transformés',
    content: 'Les aliments transformés sont souvent riches en sel, sucre et graisses saturées. Privilégiez les aliments frais et non transformés pour une alimentation saine.',
    icon: '🥗',
    reactionsCount: 654,
    priority: Priority.LOW,
    targetAudience: [TargetAudience.ALL],
    viewsCount: 1450,
    sharesCount: 112,
    isActive: true,
    publishedAt: new Date('2025-07-05'),
    status: AdviceStatus.PUBLISHED,
    createdAt: new Date('2025-06-28'),
    updatedAt: new Date('2025-07-05'),
    organization: {
      id: 'org11',
      name: 'Institut de Nutrition',
      logo: 'in-logo',
      phone: '+237 233 42 33 44'
    },
    category: {
      id: '11',
      name: 'Alimentation Saine',
      slug: 'alimentation-saine'
    }
  },
  {
    id: '12',
    organizationId: 'org12',
    categoryId: '12',
    title: 'Maintenez un poids santé',
    content: 'Un poids excessif augmente le risque de nombreuses maladies chroniques. Combinez une alimentation équilibrée et une activité physique régulière pour maintenir un poids santé.',
    icon: '⚖️',
    reactionsCount: 543,
    priority: Priority.MEDIUM,
    targetAudience: [TargetAudience.ADULTS],
    viewsCount: 1890,
    sharesCount: 134,
    isActive: true,
    publishedAt: new Date('2025-07-03'),
    status: AdviceStatus.PUBLISHED,
    createdAt: new Date('2025-06-25'),
    updatedAt: new Date('2025-07-03'),
    organization: {
      id: 'org12',
      name: 'Centre de Perte de Poids',
      logo: 'cpw-logo',
      phone: '+237 233 42 55 66'
    },
    category: {
      id: '12',
      name: 'Poids Santé',
      slug: 'poids-sante'
    }
  }
];

// Mock categories
const mockCategories = [
  { 
    id: '1', 
    name: 'Hydratation', 
    slug: 'hydratation',
    icon: '💧',
    color: '#3b82f6'
  },
  { 
    id: '2', 
    name: 'Médicaments', 
    slug: 'medicaments',
    icon: '💊',
    color: '#ef4444'
  },
  { 
    id: '3', 
    name: 'Nutrition', 
    slug: 'nutrition',
    icon: '🍎',
    color: '#10b981'
  },
  { 
    id: '4', 
    name: 'Hygiène', 
    slug: 'hygiene',
    icon: '🧼',
    color: '#84cc16'
  },
  { 
    id: '5', 
    name: 'Sport', 
    slug: 'sport',
    icon: '🏃',
    color: '#f59e0b'
  },
  { 
    id: '6', 
    name: 'Sommeil', 
    slug: 'sommeil',
    icon: '😴',
    color: '#6366f1'
  },
  { 
    id: '7', 
    name: 'Addictions', 
    slug: 'addictions',
    icon: '🚭',
    color: '#ec4899'
  },
  { 
    id: '8', 
    name: 'Protection Solaire', 
    slug: 'protection-solaire',
    icon: '☀️',
    color: '#f97316'
  },
  { 
    id: '9', 
    name: 'Prévention', 
    slug: 'prevention',
    icon: '🩺',
    color: '#14b8a6'
  },
  { 
    id: '10', 
    name: 'Santé Mentale', 
    slug: 'sante-mentale',
    icon: '🧘',
    color: '#8b5cf6'
  },
  { 
    id: '11', 
    name: 'Alimentation Saine', 
    slug: 'alimentation-saine',
    icon: '🥗',
    color: '#22c55e'
  },
  { 
    id: '12', 
    name: 'Poids Santé', 
    slug: 'poids-sante',
    icon: '⚖️',
    color: '#a855f7'
  }
];

// Fonction pour obtenir l'URL de l'image Cloudinary
const getCloudinaryImageUrl = (imageId: string, options: { width?: number; height?: number; crop?: string } = {}) => {
  const { width = 400, height = 300, crop = 'fill' } = options;
  return `https://res.cloudinary.com/demo/image/upload/w_${width},h_${height},c_${crop}/${imageId}.jpg`;
};

// Fonction pour formater les nombres
const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Fonction pour obtenir la couleur de la priorité
const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case Priority.URGENT:
      return 'bg-red-100 text-red-800 border-red-200';
    case Priority.HIGH:
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case Priority.MEDIUM:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case Priority.LOW:
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Fonction pour obtenir le texte de la priorité
const getPriorityText = (priority: Priority) => {
  switch (priority) {
    case Priority.URGENT:
      return 'Urgent';
    case Priority.HIGH:
      return 'Élevée';
    case Priority.MEDIUM:
      return 'Moyenne';
    case Priority.LOW:
      return 'Basse';
    default:
      return 'Inconnue';
  }
};

// Fonction pour obtenir la couleur de la bordure de la carte selon la priorité
const getPriorityBorderColor = (priority: Priority) => {
  switch (priority) {
    case Priority.URGENT:
      return 'border-l-red-500';
    case Priority.HIGH:
      return 'border-l-orange-500';
    case Priority.MEDIUM:
      return 'border-l-yellow-500';
    case Priority.LOW:
      return 'border-l-green-500';
    default:
      return 'border-l-gray-500';
  }
};

// Composant pour la carte de statistiques
function StatsCard({ title, value, color, icon }: { title: string; value: string | number; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Composant pour la carte de conseil en vue grille
function AdviceCard({ advice, onView, onEdit, onDuplicate, onDelete, onToggleStatus }: { 
  advice: Advice; 
  onView: () => void; 
  onEdit: () => void; 
  onDuplicate: () => void; 
  onDelete: () => void; 
  onToggleStatus: () => void; 
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 ${getPriorityBorderColor(advice.priority)}`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl">
            {advice.icon}
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(advice.priority)}`}>
              {getPriorityText(advice.priority)}
            </span>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2">{advice.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{advice.content}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-gray-500" />
            <span className="text-xs text-gray-500">
              {advice.targetAudience.length === 1 && advice.targetAudience[0] === TargetAudience.ALL ? 'Tout public' : 
               advice.targetAudience.length === 1 ? advice.targetAudience[0] : 
               'Public ciblé'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">{advice.category.name}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {formatNumber(advice.viewsCount)}
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              {formatNumber(advice.reactionsCount)}
            </div>
            <div className="flex items-center">
              <Share2 className="h-4 w-4 mr-1" />
              {formatNumber(advice.sharesCount)}
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={onView}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Voir"
            >
              <Eye className="h-4 w-4 text-gray-500" />
            </button>
            <button
              onClick={onEdit}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Modifier"
            >
              <Edit className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Menu d'actions */}
      {isMenuOpen && (
        <div className="absolute right-6 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
          <button
            onClick={() => { onView(); setIsMenuOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Voir
          </button>
          <button
            onClick={() => { onEdit(); setIsMenuOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Modifier
          </button>
          <button
            onClick={() => { onDuplicate(); setIsMenuOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Dupliquer
          </button>
          <button
            onClick={() => { onToggleStatus(); setIsMenuOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
          >
            {advice.status === AdviceStatus.PUBLISHED ? <Archive className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
            {advice.status === AdviceStatus.PUBLISHED ? 'Archiver' : 'Publier'}
          </button>
          <button
            onClick={() => { onDelete(); setIsMenuOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </button>
        </div>
      )}
    </motion.div>
  );
}

// Composant pour la carte de conseil en vue liste
function AdviceListItem({ advice, onView, onEdit, onDuplicate, onDelete, onToggleStatus, isSelected, onSelect }: { 
  advice: Advice; 
  onView: () => void; 
  onEdit: () => void; 
  onDuplicate: () => void; 
  onDelete: () => void; 
  onToggleStatus: () => void; 
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
        
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl mr-4">
          {advice.icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-gray-900">{advice.title}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(advice.priority)}`}>
              {getPriorityText(advice.priority)}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{advice.content}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {formatNumber(advice.viewsCount)}
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                {formatNumber(advice.reactionsCount)}
              </div>
              <div className="flex items-center">
                <Share2 className="h-4 w-4 mr-1" />
                {formatNumber(advice.sharesCount)}
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-500">{advice.category.name}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={onView}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Voir"
              >
                <Eye className="h-4 w-4 text-gray-500" />
              </button>
              <button
                onClick={onEdit}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Modifier"
              >
                <Edit className="h-4 w-4 text-gray-500" />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Plus d'options"
              >
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour l'état vide
function EmptyState({ onCreateAdvice }: { onCreateAdvice: () => void }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-12 text-center">
      <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
        <Lightbulb className="h-12 w-12 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun conseil pour le moment</h3>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Créez votre premier conseil pour informer la communauté sur les bonnes pratiques de santé.
      </p>
      
      <button
        onClick={onCreateAdvice}
        className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-medium rounded-2xl hover:bg-teal-700 transition-colors"
      >
        <Plus className="h-5 w-5 mr-2" />
        Créer mon premier conseil
      </button>
      
      <button className="mt-4 text-teal-600 hover:text-teal-700 font-medium">
        Voir des exemples →
      </button>
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
            <h1 className="text-2xl font-bold text-gray-900">Mes conseils santé</h1>
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
export default function AdviceManagementPage() {
  const router = useRouter();
  const [advices, setAdvices] = useState<Advice[]>(mockAdvices);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'views' | 'reactions'>('recent');
  const [selectedAdvices, setSelectedAdvices] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('advice');
  
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
    { id: 1, title: 'Nouveau like sur votre conseil', time: 'Il y a 5 minutes', action: 'Voir' },
    { id: 2, title: 'Votre conseil a été approuvé', time: 'Il y a 1 heure', action: 'Voir' },
    { id: 3, title: 'Nouvelle statistique disponible', time: 'Il y a 3 heures', action: 'Voir' }
  ];
  
  // Nombre d'éléments par page
  const itemsPerPage = 9; // Pour la vue grille (3x3)
  
  // Calculer les statistiques
  const stats = useMemo(() => {
    const total = advices.length;
    const published = advices.filter(a => a.status === AdviceStatus.PUBLISHED).length;
    const totalViews = advices.reduce((sum, a) => sum + a.viewsCount, 0);
    const totalLikes = advices.reduce((sum, a) => sum + a.reactionsCount, 0);
    
    return { total, published, totalViews, totalLikes };
  }, [advices]);
  
  // Filtrer et trier les conseils
  const filteredAdvices = useMemo(() => {
    let filtered = [...advices];
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(advice => 
        advice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advice.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrer par catégorie
    if (filterCategory !== 'all') {
      filtered = filtered.filter(advice => advice.categoryId === filterCategory);
    }
    
    // Filtrer par priorité
    if (filterPriority !== 'all') {
      filtered = filtered.filter(advice => advice.priority === filterPriority);
    }
    
    // Trier
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sortBy === 'views') {
      filtered.sort((a, b) => b.viewsCount - a.viewsCount);
    } else if (sortBy === 'reactions') {
      filtered.sort((a, b) => b.reactionsCount - a.reactionsCount);
    }
    
    return filtered;
  }, [advices, searchTerm, filterCategory, filterPriority, sortBy]);
  
  // Paginer les résultats
  const paginatedAdvices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAdvices.slice(startIndex, endIndex);
  }, [filteredAdvices, currentPage]);
  
  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredAdvices.length / itemsPerPage);
  
  // Gérer la sélection de conseils
  const handleSelectAdvice = (adviceId: string) => {
    setSelectedAdvices(prev => 
      prev.includes(adviceId) 
        ? prev.filter(id => id !== adviceId)
        : [...prev, adviceId]
    );
  };
  
  // Gérer la sélection de tous les conseils
  const handleSelectAll = () => {
    if (selectedAdvices.length === paginatedAdvices.length) {
      setSelectedAdvices([]);
    } else {
      setSelectedAdvices(paginatedAdvices.map(a => a.id));
    }
  };
  
  // Gérer la suppression de conseils
  const handleDeleteAdvices = () => {
    setIsLoading(true);
    
    // Simuler une suppression
    setTimeout(() => {
      setAdvices(prev => prev.filter(a => !selectedAdvices.includes(a.id)));
      setSelectedAdvices([]);
      setIsLoading(false);
      toast.success(`${selectedAdvices.length} conseil(s) supprimé(s) avec succès`);
    }, 1000);
  };
  
  // Gérer la duplication de conseils
  const handleDuplicateAdvices = () => {
    setIsLoading(true);
    
    // Simuler une duplication
    setTimeout(() => {
      const duplicatedAdvices = advices
        .filter(a => selectedAdvices.includes(a.id))
        .map(a => ({ ...a, id: `${a.id}-copy`, title: `${a.title} (copie)`, status: AdviceStatus.DRAFT }));
      
      setAdvices(prev => [...prev, ...duplicatedAdvices]);
      setSelectedAdvices([]);
      setIsLoading(false);
      toast.success(`${selectedAdvices.length} conseil(s) dupliqué(s) avec succès`);
    }, 1000);
  };
  
  // Gérer le changement de statut de conseils
  const handleChangeStatus = (newStatus: AdviceStatus) => {
    setIsLoading(true);
    
    // Simuler un changement de statut
    setTimeout(() => {
      setAdvices(prev => 
        prev.map(a => 
          selectedAdvices.includes(a.id) 
            ? { ...a, status: newStatus, publishedAt: newStatus === AdviceStatus.PUBLISHED ? new Date() : a.publishedAt }
            : a
        )
      );
      setSelectedAdvices([]);
      setIsLoading(false);
      toast.success(`Statut mis à jour avec succès`);
    }, 1000);
  };
  
  // Gérer la vue d'un conseil
  const handleViewAdvice = (adviceId: string) => {
    router.push(`/dashboard/conseils/${adviceId}`);
  };
  
  // Gérer l'édition d'un conseil
  const handleEditAdvice = (adviceId: string) => {
    router.push(`/dashboard/conseils/${adviceId}/edit`);
  };
  
  // Gérer la création d'un conseil
  const handleCreateAdvice = () => {
    router.push('/dashboard/conseils/create');
  };
  
  // Gérer la suppression individuelle
  const handleDeleteAdvice = (adviceId: string) => {
    setAdvices(prev => prev.filter(a => a.id !== adviceId));
    toast.success('Conseil supprimé avec succès');
  };
  
  // Gérer le changement de statut individuel
  const handleToggleStatus = (adviceId: string) => {
    setAdvices(prev => 
      prev.map(a => 
        a.id === adviceId 
          ? { 
              ...a, 
              status: a.status === AdviceStatus.PUBLISHED ? AdviceStatus.ARCHIVED : AdviceStatus.PUBLISHED, 
              publishedAt: a.status === AdviceStatus.DRAFT ? new Date() : a.publishedAt 
            }
          : a
      )
    );
    toast.success('Conseil mis à jour avec succès');
  };
  
  // Afficher ou masquer les actions groupées
  useEffect(() => {
    setShowBulkActions(selectedAdvices.length > 0);
  }, [selectedAdvices]);
  
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
          {/* Header avec bouton de création */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Mes conseils santé</h1>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl ${viewMode === 'grid' ? 'bg-teal-100 text-teal-600' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
                title="Vue grille"
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl ${viewMode === 'list' ? 'bg-teal-100 text-teal-600' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
                title="Vue liste"
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={handleCreateAdvice}
                className="inline-flex items-center px-4 py-2 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nouveau conseil
              </button>
            </div>
          </div>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard 
              title="Total" 
              value={stats.total} 
              color="bg-gray-100 text-gray-600" 
              icon={<Lightbulb className="h-6 w-6" />} 
            />
            <StatsCard 
              title="Publiés" 
              value={stats.published} 
              color="bg-green-100 text-green-600" 
              icon={<CheckCircle className="h-6 w-6" />} 
            />
            <StatsCard 
              title="Vues" 
              value={formatNumber(stats.totalViews)} 
              color="bg-blue-100 text-blue-600" 
              icon={<Eye className="h-6 w-6" />} 
            />
            <StatsCard 
              title="Likes" 
              value={formatNumber(stats.totalLikes)} 
              color="bg-red-100 text-red-600" 
              icon={<Heart className="h-6 w-6" />} 
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
                    placeholder="Rechercher un conseil..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">Toutes catégories</option>
                  {mockCategories.map(category => (
                    <option key={category.id} value={category.id}>{category.icon} {category.name}</option>
                  ))}
                </select>
                
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">Toutes priorités</option>
                  <option value={Priority.URGENT}>Urgent</option>
                  <option value={Priority.HIGH}>Élevée</option>
                  <option value={Priority.MEDIUM}>Moyenne</option>
                  <option value={Priority.LOW}>Basse</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="recent">Plus récents</option>
                  <option value="views">Plus vus</option>
                  <option value="reactions">Plus aimés</option>
                </select>
              </div>
            </div>
            
            {/* Filtres de catégorie en pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterCategory === 'all' 
                    ? 'bg-teal-100 text-teal-700 border border-teal-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                Tous
              </button>
              {mockCategories.slice(0, 6).map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFilterCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filterCategory === category.id 
                      ? 'bg-teal-100 text-teal-700 border border-teal-300' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
            
            {/* Bulk actions */}
            {showBulkActions && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700">
                    {selectedAdvices.length} sélectionné{selectedAdvices.length > 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteAdvices}
                    disabled={isLoading}
                    className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4 inline mr-1" />
                    Supprimer
                  </button>
                  
                  <button
                    onClick={handleDuplicateAdvices}
                    disabled={isLoading}
                    className="px-3 py-1.5 bg-gray-600 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Copy className="h-4 w-4 inline mr-1" />
                    Dupliquer
                  </button>
                  
                  {selectedAdvices.every(id => advices.find(a => a.id === id)?.status === AdviceStatus.DRAFT) && (
                    <button
                      onClick={() => handleChangeStatus(AdviceStatus.PUBLISHED)}
                      disabled={isLoading}
                      className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload className="h-4 w-4 inline mr-1" />
                      Publier
                    </button>
                  )}
                  
                  {selectedAdvices.every(id => advices.find(a => a.id === id)?.status === AdviceStatus.PUBLISHED) && (
                    <button
                      onClick={() => handleChangeStatus(AdviceStatus.ARCHIVED)}
                      disabled={isLoading}
                      className="px-3 py-1.5 bg-yellow-600 text-white text-sm font-medium rounded-xl hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Archive className="h-4 w-4 inline mr-1" />
                      Archiver
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Advices grid or list */}
          {paginatedAdvices.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {paginatedAdvices.map((advice) => (
                    <AdviceCard
                      key={advice.id}
                      advice={advice}
                      onView={() => handleViewAdvice(advice.id)}
                      onEdit={() => handleEditAdvice(advice.id)}
                      onDuplicate={() => {
                        setSelectedAdvices([advice.id]);
                        handleDuplicateAdvices();
                      }}
                      onDelete={() => handleDeleteAdvice(advice.id)}
                      onToggleStatus={() => handleToggleStatus(advice.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {selectedAdvices.length > 0 && (
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={selectedAdvices.length === paginatedAdvices.length}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded-lg mr-2"
                      />
                      <span className="text-sm text-gray-600">
                        {selectedAdvices.length} de {paginatedAdvices.length} sélectionné{selectedAdvices.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                  
                  {paginatedAdvices.map((advice) => (
                    <AdviceListItem
                      key={advice.id}
                      advice={advice}
                      onView={() => handleViewAdvice(advice.id)}
                      onEdit={() => handleEditAdvice(advice.id)}
                      onDuplicate={() => {
                        setSelectedAdvices([advice.id]);
                        handleDuplicateAdvices();
                      }}
                      onDelete={() => handleDeleteAdvice(advice.id)}
                      onToggleStatus={() => handleToggleStatus(advice.id)}
                      isSelected={selectedAdvices.includes(advice.id)}
                      onSelect={() => handleSelectAdvice(advice.id)}
                    />
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredAdvices.length)}</span> sur{' '}
                  <span className="font-medium">{filteredAdvices.length}</span> conseils
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
            </>
          ) : (
            <EmptyState onCreateAdvice={handleCreateAdvice} />
          )}
        </main>
      </div>
      
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