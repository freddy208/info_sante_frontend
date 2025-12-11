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
  BookOpen,
  Tag,
  User,
  Heart,
  Share2,
  Menu,
  Home,
  Megaphone,
  Lightbulb,
  Settings,
  HelpCircle,
  LogOut,
  StarOff,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { getCloudinaryImageUrl } from '@/lib/cloudinary';
import Head from 'next/head';

// Types pour les données
interface Article {
  id: string;
  organizationId: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  thumbnailImage: string;
  categoryId: string;
  author: string;
  readingTime: number;
  tags: string[];
  viewsCount: number;
  sharesCount: number;
  commentsCount: number;
  reactionsCount: number;
  isFeatured: boolean;
  publishedAt: string;
  status: 'published' | 'draft';
  suspensionReason: string | null;
  suspendedBy: string | null;
  deletedAt: string | null;
  createdAt: string;
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

// Données mocks pour les articles
const mockArticles: Article[] = [
  {
    id: '1',
    organizationId: 'org1',
    title: 'Les 5 signes du paludisme à ne pas ignorer',
    slug: '5-signes-paludisme-ne-pas-ignorer',
    content: 'Le paludisme reste l\'une des principales causes de morbidité et de mortalité au Cameroun...',
    excerpt: 'Le paludisme reste l\'une des principales causes de morbidité et de mortalité au Cameroun. Voici les signes à ne pas ignorer.',
    featuredImage: 'malaria-prevention',
    thumbnailImage: 'malaria-signs-thumb',
    categoryId: '3',
    author: 'Dr. Kamga',
    readingTime: 5,
    tags: ['paludisme', 'symptômes', 'prévention'],
    viewsCount: 3500,
    sharesCount: 456,
    commentsCount: 89,
    reactionsCount: 245,
    isFeatured: true,
    publishedAt: '2025-03-15',
    status: 'published',
    suspensionReason: null,
    suspendedBy: null,
    deletedAt: null,
    createdAt: '2025-03-10',
    updatedAt: new Date('2025-03-15'),
    organization: {
      id: 'org1',
      name: 'Ministère de la Santé Publique',
      logo: 'ministere-sante-logo',
      phone: '+237 222 23 40 14'
    },
    category: { 
      id: '3', 
      name: 'Paludisme',
      slug: 'paludisme'
    }
  },
  {
    id: '2',
    organizationId: 'org2',
    title: 'Comment prévenir efficacement les maladies cardiovasculaires',
    slug: 'prevenir-maladies-cardiovasculaires',
    content: 'Les maladies cardiovasculaires sont la première cause de décès dans le monde...',
    excerpt: 'Les maladies cardiovasculaires sont la première cause de décès dans le monde. Voici comment les prévenir.',
    featuredImage: 'child-vaccination',
    thumbnailImage: 'cardiovascular-prevention-thumb',
    categoryId: '8',
    author: 'Dr. Tchamba',
    readingTime: 7,
    tags: ['cœur', 'prévention', 'santé'],
    viewsCount: 2800,
    sharesCount: 312,
    commentsCount: 56,
    reactionsCount: 189,
    isFeatured: false,
    publishedAt: '2025-03-14',
    status: 'published',
    suspensionReason: null,
    suspendedBy: null,
    deletedAt: null,
    createdAt: '2025-03-08',
    updatedAt: new Date('2025-03-14'),
    organization: {
      id: 'org2',
      name: 'Hôpital Central de Yaoundé',
      logo: 'hcy-logo',
      phone: '+237 222 23 14 52'
    },
    category: { 
      id: '8', 
      name: 'Hypertension',
      slug: 'hypertension'
    }
  },
  {
    id: '3',
    organizationId: 'org3',
    title: 'Nutrition équilibrée : les bases d\'une alimentation saine',
    slug: 'nutrition-equilibree-bases-alimentation-saine',
    content: 'Une alimentation équilibrée est essentielle pour maintenir une bonne santé...',
    excerpt: 'Une alimentation équilibrée est essentielle pour maintenir une bonne santé. Découvrez les bases.',
    featuredImage: 'covid-symptoms',
    thumbnailImage: 'balanced-nutrition-thumb',
    categoryId: '5',
    author: 'Dr. Ngo',
    readingTime: 6,
    tags: ['nutrition', 'alimentation', 'santé'],
    viewsCount: 0,
    sharesCount: 0,
    commentsCount: 0,
    reactionsCount: 0,
    isFeatured: false,
    publishedAt: '',
    status: 'draft',
    suspensionReason: null,
    suspendedBy: null,
    deletedAt: null,
    createdAt: '2025-03-12',
    updatedAt: new Date('2025-03-12'),
    organization: {
      id: 'org3',
      name: 'Institut de Nutrition et de Technologie Alimentaire',
      logo: 'inta-logo',
      phone: '+237 222 23 56 78'
    },
    category: { 
      id: '5', 
      name: 'Nutrition Infantile',
      slug: 'nutrition-infantile'
    }
  },
  {
    id: '4',
    organizationId: 'org4',
    title: 'Vaccination COVID-19 : ce que vous devez savoir',
    slug: 'vaccination-covid-19-ce-que-vous-devez-savoir',
    content: 'La vaccination contre le COVID-19 reste un enjeu majeur de santé publique...',
    excerpt: 'La vaccination contre le COVID-19 reste un enjeu majeur de santé publique. Voici ce que vous devez savoir.',
    featuredImage: 'prenatal-care',
    thumbnailImage: 'covid-vaccination-thumb',
    categoryId: '1',
    author: 'Dr. Mbarga',
    readingTime: 5,
    tags: ['COVID-19', 'vaccination', 'santé publique'],
    viewsCount: 4200,
    sharesCount: 523,
    commentsCount: 98,
    reactionsCount: 312,
    isFeatured: true,
    publishedAt: '2025-03-10',
    status: 'published',
    suspensionReason: null,
    suspendedBy: null,
    deletedAt: null,
    createdAt: '2025-03-05',
    updatedAt: new Date('2025-03-10'),
    organization: {
      id: 'org4',
      name: 'Centre de Vaccination de Douala',
      logo: 'cvd-logo',
      phone: '+237 222 23 45 67'
    },
    category: { 
      id: '1', 
      name: 'Vaccination',
      slug: 'vaccination'
    }
  },
  {
    id: '5',
    organizationId: 'org5',
    title: 'Santé mentale : comment prendre soin de son bien-être psychologique',
    slug: 'sante-mentale-prendre-soin-bien-etre-psychologique',
    content: 'La santé mentale est aussi importante que la santé physique...',
    excerpt: 'La santé mentale est aussi importante que la santé physique. Voici comment prendre soin de votre bien-être psychologique.',
    featuredImage: 'medicinal-plants',
    thumbnailImage: 'mental-health-thumb',
    categoryId: '10',
    author: 'Dr. Etame',
    readingTime: 8,
    tags: ['santé mentale', 'bien-être', 'psychologie'],
    viewsCount: 1900,
    sharesCount: 234,
    commentsCount: 67,
    reactionsCount: 156,
    isFeatured: false,
    publishedAt: '2025-03-08',
    status: 'published',
    suspensionReason: null,
    suspendedBy: null,
    deletedAt: null,
    createdAt: '2025-03-02',
    updatedAt: new Date('2025-03-08'),
    organization: {
      id: 'org5',
      name: 'Centre de Santé Mentale de Yaoundé',
      logo: 'csm-logo',
      phone: '+237 222 23 78 90'
    },
    category: { 
      id: '10', 
      name: 'Hygiène',
      slug: 'hygiene'
    }
  },
  {
    id: '6',
    organizationId: 'org6',
    title: 'Diabète : les symptômes qui doivent alerter',
    slug: 'diabete-symptomes-qui-doivent-alerter',
    content: 'Le diabète est une maladie chronique qui affecte des millions de personnes...',
    excerpt: 'Le diabète est une maladie chronique qui affecte des millions de personnes. Voici les symptômes qui doivent alerter.',
    featuredImage: 'local-foods',
    thumbnailImage: 'diabetes-symptoms-thumb',
    categoryId: '7',
    author: 'Dr. Tchamda',
    readingTime: 6,
    tags: ['diabète', 'symptômes', 'santé'],
    viewsCount: 2300,
    sharesCount: 289,
    commentsCount: 45,
    reactionsCount: 178,
    isFeatured: false,
    publishedAt: '2025-03-05',
    status: 'published',
    suspensionReason: null,
    suspendedBy: null,
    deletedAt: null,
    createdAt: '2025-02-28',
    updatedAt: new Date('2025-03-05'),
    organization: {
      id: 'org6',
      name: 'Centre de Diabétologie de Douala',
      logo: 'cdd-logo',
      phone: '+237 222 23 45 89'
    },
    category: { 
      id: '7', 
      name: 'Diabète',
      slug: 'diabete'
    }
  },
  {
    id: '7',
    organizationId: 'org7',
    title: 'Cancer du sein : l\'importance du dépistage précoce',
    slug: 'cancer-sein-importance-depistage-precoce',
    content: 'Le cancer du sein est le cancer le plus fréquent chez la femme...',
    excerpt: 'Le cancer du sein est le cancer le plus fréquent chez la femme. Découvrez l\'importance du dépistage précoce.',
    featuredImage: 'malaria-prevention',
    thumbnailImage: 'breast-cancer-screening-thumb',
    categoryId: '6',
    author: 'Dr. Essomba',
    readingTime: 7,
    tags: ['cancer', 'dépistage', 'santé féminine'],
    viewsCount: 3100,
    sharesCount: 412,
    commentsCount: 78,
    reactionsCount: 234,
    isFeatured: true,
    publishedAt: '2025-03-01',
    status: 'published',
    suspensionReason: null,
    suspendedBy: null,
    deletedAt: null,
    createdAt: '2025-02-25',
    updatedAt: new Date('2025-03-01'),
    organization: {
      id: 'org7',
      name: 'Centre de Cancérologie de Yaoundé',
      logo: 'ccy-logo',
      phone: '+237 222 23 67 90'
    },
    category: { 
      id: '6', 
      name: 'Cancer',
      slug: 'cancer'
    }
  },
  {
    id: '8',
    organizationId: 'org8',
    title: 'Planification familiale : les méthodes de contraception disponibles',
    slug: 'planification-familiale-methodes-contraception-disponibles',
    content: 'La planification familiale permet aux couples de décider du nombre d\'enfants...',
    excerpt: 'La planification familiale permet aux couples de décider du nombre d\'enfants. Découvrez les méthodes de contraception disponibles.',
    featuredImage: 'child-vaccination',
    thumbnailImage: 'family-planning-thumb',
    categoryId: '9',
    author: 'Dr. Ntoumi',
    readingTime: 6,
    tags: ['planification familiale', 'contraception', 'santé reproductive'],
    viewsCount: 1700,
    sharesCount: 198,
    commentsCount: 34,
    reactionsCount: 123,
    isFeatured: false,
    publishedAt: '2025-02-28',
    status: 'published',
    suspensionReason: null,
    suspendedBy: null,
    deletedAt: null,
    createdAt: '2025-02-22',
    updatedAt: new Date('2025-02-28'),
    organization: {
      id: 'org8',
      name: 'Centre de Planification Familiale de Douala',
      logo: 'cpfd-logo',
      phone: '+237 222 23 45 12'
    },
    category: { 
      id: '9', 
      name: 'Planification Familiale',
      slug: 'planification-familiale'
    }
  }
];

// Mock categories
const mockCategories = [
  { 
    id: '1', 
    name: 'Vaccination', 
    slug: 'vaccination',
    description: 'Campagnes de vaccination pour enfants et adultes',
    icon: '💉',
    color: '#10b981',
    parentId: null,
    order: 1,
    isActive: true, 
    announcementsCount: 25, 
    articlesCount: 12,
    advicesCount: 8,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-08-10')
  },
  { 
    id: '2', 
    name: 'Dépistage VIH/SIDA', 
    slug: 'depistage-vih',
    description: 'Campagnes de dépistage du VIH/SIDA',
    icon: '🔬',
    color: '#3b82f6',
    parentId: null,
    order: 2,
    isActive: true, 
    announcementsCount: 18, 
    articlesCount: 10,
    advicesCount: 15,
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-08-12')
  },
  { 
    id: '3', 
    name: 'Paludisme', 
    slug: 'paludisme',
    description: 'Prévention et traitement du paludisme',
    icon: '🦟',
    color: '#f59e0b',
    parentId: null,
    order: 3,
    isActive: true, 
    announcementsCount: 32, 
    articlesCount: 15,
    advicesCount: 20,
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-08-05')
  },
  { 
    id: '4', 
    name: 'Santé Maternelle', 
    slug: 'sante-maternelle',
    description: 'Soins prénatals et postnatals',
    icon: '🤰',
    color: '#ec4899',
    parentId: null,
    order: 4,
    isActive: true, 
    announcementsCount: 15, 
    articlesCount: 8,
    advicesCount: 12,
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date('2023-08-08')
  },
  { 
    id: '5', 
    name: 'Nutrition Infantile', 
    slug: 'nutrition-infantile',
    description: 'Alimentation équilibrée pour les enfants',
    icon: '👶',
    color: '#8b5cf6',
    parentId: null,
    order: 5,
    isActive: true, 
    announcementsCount: 20, 
    articlesCount: 14,
    advicesCount: 18,
    createdAt: new Date('2023-05-12'),
    updatedAt: new Date('2023-08-15')
  },
  { 
    id: '6', 
    name: 'Cancer', 
    slug: 'cancer',
    description: 'Dépistage et prévention des cancers',
    icon: '🎗️',
    color: '#ef4444',
    parentId: null,
    order: 6,
    isActive: true, 
    announcementsCount: 12, 
    articlesCount: 9,
    advicesCount: 7,
    createdAt: new Date('2023-06-18'),
    updatedAt: new Date('2023-08-20')
  },
  { 
    id: '7', 
    name: 'Diabète', 
    slug: 'diabete',
    description: 'Prévention et gestion du diabète',
    icon: '🩸',
    color: '#6366f1',
    parentId: null,
    order: 7,
    isActive: true, 
    announcementsCount: 10, 
    articlesCount: 6,
    advicesCount: 9,
    createdAt: new Date('2023-07-22'),
    updatedAt: new Date('2023-08-18')
  },
  { 
    id: '8', 
    name: 'Hypertension', 
    slug: 'hypertension',
    description: 'Prévention et traitement de l\'hypertension',
    icon: '❤️',
    color: '#f97316',
    parentId: null,
    order: 8,
    isActive: true, 
    announcementsCount: 14, 
    articlesCount: 7,
    advicesCount: 11,
    createdAt: new Date('2023-08-01'),
    updatedAt: new Date('2023-08-25')
  },
  { 
    id: '9', 
    name: 'Planification Familiale', 
    slug: 'planification-familiale',
    description: 'Méthodes de contraception et conseil',
    icon: '👨‍👩‍👧‍👦',
    color: '#14b8a6',
    parentId: null,
    order: 9,
    isActive: true, 
    announcementsCount: 22, 
    articlesCount: 11,
    advicesCount: 16,
    createdAt: new Date('2023-08-05'),
    updatedAt: new Date('2023-08-22')
  },
  { 
    id: '10', 
    name: 'Hygiène', 
    slug: 'hygiene',
    description: 'Pratiques d\'hygiène pour la santé',
    icon: '🧼',
    color: '#84cc16',
    parentId: null,
    order: 10,
    isActive: true, 
    announcementsCount: 16, 
    articlesCount: 13,
    advicesCount: 14,
    createdAt: new Date('2023-08-10'),
    updatedAt: new Date('2023-08-28')
  }
];

// Fonction pour formater les nombres
const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Fonction pour obtenir la couleur du statut
const getStatusColor = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Fonction pour obtenir l'icône du statut
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'published':
      return <CheckCircle className="h-4 w-4" />;
    case 'draft':
      return <Clock className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

// Fonction pour obtenir le texte du statut
const getStatusText = (status: string) => {
  switch (status) {
    case 'published':
      return 'Publié';
    case 'draft':
      return 'Brouillon';
    default:
      return 'Inconnu';
  }
};

// Composant pour la carte de statistiques (amélioré)
function StatsCard({ title, value, color, icon, trend }: { 
  title: string; 
  value: string | number; 
  color: string; 
  icon: React.ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
}) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 relative overflow-hidden"
    >
      {/* Arrière-plan dégradé subtil */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 ${color}`}></div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm font-medium ${trend.isUp ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isUp ? (
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {trend.value}% ce mois
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${color} shadow-sm`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

// Composant pour le menu d'actions (amélioré)
function ActionMenu({ article, onView, onEdit, onDuplicate, onDelete, onToggleFeature, onToggleStatus }: { 
  article: Article; 
  onView: () => void; 
  onEdit: () => void; 
  onDuplicate: () => void; 
  onDelete: () => void; 
  onToggleFeature: () => void; 
  onToggleStatus: () => void; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <MoreVertical className="h-5 w-5 text-gray-500" />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-10 overflow-hidden"
          >
            <div className="py-2">
              <motion.button
                whileHover={{ backgroundColor: "#f9fafb" }}
                onClick={() => { onView(); setIsOpen(false); }}
                className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                  <Eye className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Voir</p>
                  <p className="text-xs text-gray-500">Afficher l&apos;article complet</p>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ backgroundColor: "#f9fafb" }}
                onClick={() => { onEdit(); setIsOpen(false); }}
                className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-gray-100 text-gray-600">
                  <Edit className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Modifier</p>
                  <p className="text-xs text-gray-500">Éditer le contenu</p>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ backgroundColor: "#f9fafb" }}
                onClick={() => { onDuplicate(); setIsOpen(false); }}
                className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-purple-100 text-purple-600">
                  <Copy className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Dupliquer</p>
                  <p className="text-xs text-gray-500">Créer une copie</p>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ backgroundColor: "#f9fafb" }}
                onClick={() => { onToggleFeature(); setIsOpen(false); }}
                className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors"
              >
                <div className={`p-1.5 rounded-lg ${article.isFeatured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'}`}>
                  {article.isFeatured ? <Star className="h-4 w-4 fill-current" /> : <Star className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {article.isFeatured ? 'Retirer de la vedette' : 'Mettre en vedette'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {article.isFeatured ? 'Ne plus mettre en avant' : 'Afficher en page d\'accueil'}
                  </p>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ backgroundColor: "#f9fafb" }}
                onClick={() => { onToggleStatus(); setIsOpen(false); }}
                className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors"
              >
                <div className={`p-1.5 rounded-lg ${article.status === 'published' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                  {article.status === 'draft' ? <Upload className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {article.status === 'draft' ? 'Publier' : 'Archiver'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {article.status === 'draft' ? 'Rendre l\'article public' : 'Retirer de la publication'}
                  </p>
                </div>
              </motion.button>
              
              <div className="border-t border-gray-100 my-2"></div>
              
              <motion.button
                whileHover={{ backgroundColor: "#fef2f2" }}
                onClick={() => { onDelete(); setIsOpen(false); }}
                className="w-full text-left px-4 py-3 flex items-center gap-3 text-red-600 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-red-100">
                  <Trash2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Supprimer</p>
                  <p className="text-xs text-red-500">Cette action est irréversible</p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Composant pour l'état vide (amélioré)
function EmptyState({ onCreateArticle }: { onCreateArticle: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 text-center"
    >
      <div className="w-32 h-32 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full mx-auto mb-8 flex items-center justify-center shadow-lg">
        <BookOpen className="h-16 w-16 text-teal-600" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucun article pour le moment</h3>
      
      <p className="text-gray-600 mb-10 max-w-md mx-auto text-lg">
        Créez votre premier article pour informer la communauté sur les sujets de santé qui vous tiennent à cœur.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateArticle}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-2xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg"
        >
          <Plus className="h-6 w-6 mr-3" />
          Créer mon premier article
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center px-8 py-4 bg-white text-teal-600 font-bold rounded-2xl border-2 border-teal-200 hover:bg-teal-50 transition-all"
        >
          <Sparkles className="h-6 w-6 mr-3" />
          Voir des exemples
        </motion.button>
      </div>
    </motion.div>
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
            <h1 className="text-2xl font-bold text-gray-900">Mes articles</h1>
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

// Composant pour la carte d'article (nouveau)
function ArticleCard({ article, onSelect, onView, onEdit, onDuplicate, onDelete, onToggleFeature, onToggleStatus }: {
  article: Article;
  onSelect: () => void;
  onView: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleFeature: () => void;
  onToggleStatus: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative">
        <img
          src={getCloudinaryImageUrl(article.featuredImage, { width: 800, height: 400, crop: 'fill' })}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
        {article.isFeatured && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center">
            <Star className="h-3 w-3 mr-1 fill-current" />
            Vedette
          </div>
        )}
        <div className="absolute top-4 right-4">
          <input
            type="checkbox"
            checked={false}
            onChange={onSelect}
            className="w-5 h-5 text-teal-600 bg-white border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
          />
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
            {getStatusIcon(article.status)}
            <span className="ml-1">{getStatusText(article.status)}</span>
          </span>
          <span className="text-xs text-gray-500">{article.readingTime} min de lecture</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img
              src="https://ui-avatars.com/api/?name=John+Doe&background=random"
              alt={article.author}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-sm text-gray-700">{article.author}</span>
          </div>
          <span className="text-sm text-gray-500">{article.publishedAt || '-'}</span>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {formatNumber(article.viewsCount)}
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              {formatNumber(article.reactionsCount)}
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              {article.commentsCount}
            </div>
          </div>
          
          <ActionMenu
            article={article}
            onView={onView}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            onToggleFeature={onToggleFeature}
            onToggleStatus={onToggleStatus}
          />
        </div>
      </div>
    </motion.div>
  );
}


// Page principale
export default function ArticlesManagementPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'views' | 'comments'>('recent');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('articles');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Mock user data
  const user = {
    name: 'Dr. Kamga',
    avatar: 'https://res.cloudinary.com/duqsblvzm/image/upload/v1668467350/doctor-avatar_z4s8i5.jpg',
    role: 'Administrateur',
    hospital: 'Hôpital Général',
    email: 'dr.kamga@hospitalgeneral.cm'
  };
  
  // Mock notifications
  const notifications = [
    { id: 1, title: 'Nouveau commentaire sur votre article', time: 'Il y a 5 minutes', action: 'Voir' },
    { id: 2, title: 'Votre article a été approuvé', time: 'Il y a 1 heure', action: 'Voir' },
    { id: 3, title: 'Nouvelle statistique disponible', time: 'Il y a 3 heures', action: 'Voir' }
  ];
  
  // Nombre d'éléments par page
  const itemsPerPage = viewMode === 'grid' ? 9 : 10;
  
  // Calculer les statistiques
  const stats = useMemo(() => {
    const total = articles.length;
    const published = articles.filter(a => a.status === 'published').length;
    const draft = articles.filter(a => a.status === 'draft').length;
    const totalViews = articles.reduce((sum, a) => sum + a.viewsCount, 0);
    
    return { total, published, draft, totalViews };
  }, [articles]);
  
  // Filtrer et trier les articles
  const filteredArticles = useMemo(() => {
    let filtered = [...articles];
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filtrer par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(article => article.status === filterStatus);
    }
    
    // Filtrer par catégorie
    if (filterCategory !== 'all') {
      filtered = filtered.filter(article => article.categoryId === filterCategory);
    }
    
    // Trier
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sortBy === 'views') {
      filtered.sort((a, b) => b.viewsCount - a.viewsCount);
    } else if (sortBy === 'comments') {
      filtered.sort((a, b) => b.commentsCount - a.commentsCount);
    }
    
    return filtered;
  }, [articles, searchTerm, filterStatus, filterCategory, sortBy]);
  
  // Paginer les résultats
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredArticles.slice(startIndex, endIndex);
  }, [filteredArticles, currentPage, itemsPerPage]);
  
  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  
  // Gérer la sélection d'articles
  const handleSelectArticle = (articleId: string) => {
    setSelectedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };
  
  // Gérer la sélection de tous les articles
  const handleSelectAll = () => {
    if (selectedArticles.length === paginatedArticles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(paginatedArticles.map(a => a.id));
    }
  };
  
  // Gérer la suppression d'articles
  const handleDeleteArticles = () => {
    setIsLoading(true);
    
    // Simuler une suppression
    setTimeout(() => {
      setArticles(prev => prev.filter(a => !selectedArticles.includes(a.id)));
      setSelectedArticles([]);
      setIsLoading(false);
      toast.success(`${selectedArticles.length} article(s) supprimé(s) avec succès`);
    }, 1000);
  };
  
  // Gérer la duplication d'articles
  const handleDuplicateArticles = () => {
    setIsLoading(true);
    
    // Simuler une duplication
    setTimeout(() => {
      const duplicatedArticles = articles
        .filter(a => selectedArticles.includes(a.id))
        .map(a => ({ ...a, id: `${a.id}-copy`, title: `${a.title} (copie)`, status: 'draft' as const }));
      
      setArticles(prev => [...prev, ...duplicatedArticles]);
      setSelectedArticles([]);
      setIsLoading(false);
      toast.success(`${selectedArticles.length} article(s) dupliqué(s) avec succès`);
    }, 1000);
  };
  
  // Gérer le changement de statut d'articles
  const handleChangeStatus = (newStatus: 'published' | 'draft') => {
    setIsLoading(true);
    
    // Simuler un changement de statut
    setTimeout(() => {
      setArticles(prev => 
        prev.map(a => 
          selectedArticles.includes(a.id) 
            ? { ...a, status: newStatus, publishedAt: newStatus === 'published' ? new Date().toLocaleDateString() : '' }
            : a
        )
      );
      setSelectedArticles([]);
      setIsLoading(false);
      toast.success(`Statut mis à jour avec succès`);
    }, 1000);
  };
  
  // Gérer le basculement de la vedette
  const handleToggleFeature = (articleId: string) => {
    setArticles(prev => 
      prev.map(a => 
        a.id === articleId 
          ? { ...a, isFeatured: !a.isFeatured }
          : a
      )
    );
    toast.success('Article mis à jour avec succès');
  };
  
  // Gérer le changement de statut individuel
  const handleToggleStatus = (articleId: string) => {
    setArticles(prev => 
      prev.map(a => 
        a.id === articleId 
          ? { 
              ...a, 
              status: a.status === 'draft' ? 'published' : 'draft', 
              publishedAt: a.status === 'draft' ? new Date().toLocaleDateString() : '' 
            }
          : a
      )
    );
    toast.success('Article mis à jour avec succès');
  };
  
  // Gérer la suppression individuelle
  const handleDeleteArticle = (articleId: string) => {
    setArticles(prev => prev.filter(a => a.id !== articleId));
    toast.success('Article supprimé avec succès');
  };
  
  // Gérer la vue d'un article
  const handleViewArticle = (articleId: string) => {
    router.push(`/dashboard/articles/${articleId}`);
  };
  
  // Gérer l'édition d'un article
  const handleEditArticle = (articleId: string) => {
    router.push(`/dashboard/articles/${articleId}/edit`);
  };
  
  // Gérer la création d'un article
  const handleCreateArticle = () => {
    router.push('/articles/creation');
  };
  
  // Afficher ou masquer les actions groupées
  useEffect(() => {
    setShowBulkActions(selectedArticles.length > 0);
  }, [selectedArticles]);
  
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
  
  return (
    <>
      <Head>
        <title>Gestion des articles - Hôpital Général</title>
        <meta name="description" content="Gérez vos articles de santé et d'information" />
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

          {/* Contenu de la page des articles */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {/* En-tête de la page avec boutons d'action */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mes articles</h1>
                <p className="text-gray-600 mt-1">Gérez et publiez vos articles de santé</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Grille
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Liste
                  </button>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateArticle}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-2xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Nouvel article
                </motion.button>
              </div>
            </div>
            
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard 
                title="Total" 
                value={stats.total} 
                color="bg-blue-100 text-blue-600" 
                icon={<FileText className="h-6 w-6" />}
                trend={{ value: 12, isUp: true }}
              />
              <StatsCard 
                title="Publiés" 
                value={stats.published} 
                color="bg-green-100 text-green-600" 
                icon={<CheckCircle className="h-6 w-6" />}
                trend={{ value: 8, isUp: true }}
              />
              <StatsCard 
                title="Brouillons" 
                value={stats.draft} 
                color="bg-yellow-100 text-yellow-600" 
                icon={<Clock className="h-6 w-6" />}
                trend={{ value: 3, isUp: false }}
              />
              <StatsCard 
                title="Vues" 
                value={formatNumber(stats.totalViews)} 
                color="bg-purple-100 text-purple-600" 
                icon={<Eye className="h-6 w-6" />}
                trend={{ value: 24, isUp: true }}
              />
            </div>
            
            {/* Filters and search */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un article..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="published">Publiés</option>
                    <option value="draft">Brouillons</option>
                  </select>
                  
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="all">Toutes catégories</option>
                    {mockCategories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="recent">Plus récents</option>
                    <option value="views">Plus vus</option>
                    <option value="comments">Plus commentés</option>
                  </select>
                </div>
              </div>
              
              {/* Bulk actions */}
              <AnimatePresence>
                {showBulkActions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl overflow-hidden"
                  >
                    <div className="flex items-center mb-4 sm:mb-0">
                      <span className="text-sm font-medium text-gray-700">
                        {selectedArticles.length} article{selectedArticles.length > 1 ? 's' : ''} sélectionné{selectedArticles.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDeleteArticles}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-2xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-4 w-4 inline mr-2" />
                        Supprimer
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDuplicateArticles}
                        disabled={isLoading}
                        className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-2xl hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Copy className="h-4 w-4 inline mr-2" />
                        Dupliquer
                      </motion.button>
                      
                      {selectedArticles.every(id => articles.find(a => a.id === id)?.status === 'draft') && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleChangeStatus('published')}
                          disabled={isLoading}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-2xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Upload className="h-4 w-4 inline mr-2" />
                          Publier
                        </motion.button>
                      )}
                      
                      {selectedArticles.every(id => articles.find(a => a.id === id)?.status === 'published') && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleChangeStatus('draft')}
                          disabled={isLoading}
                          className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-2xl hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Archive className="h-4 w-4 inline mr-2" />
                          Archiver
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Articles grid/list */}
            {paginatedArticles.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {paginatedArticles.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        onSelect={() => handleSelectArticle(article.id)}
                        onView={() => handleViewArticle(article.id)}
                        onEdit={() => handleEditArticle(article.id)}
                        onDuplicate={() => {
                          setSelectedArticles([article.id]);
                          handleDuplicateArticles();
                        }}
                        onDelete={() => handleDeleteArticle(article.id)}
                        onToggleFeature={() => handleToggleFeature(article.id)}
                        onToggleStatus={() => handleToggleStatus(article.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-8">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left">
                              <input
                                type="checkbox"
                                checked={selectedArticles.length === paginatedArticles.length}
                                onChange={handleSelectAll}
                                className="rounded-2xl border-gray-300 text-teal-600 focus:ring-teal-500"
                              />
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Article</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Catégorie</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Date</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Statut</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Stats</th>
                            <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {paginatedArticles.map((article, index) => (
                            <motion.tr 
                              key={article.id} 
                              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                              <td className="px-6 py-4">
                                <input
                                  type="checkbox"
                                  checked={selectedArticles.includes(article.id)}
                                  onChange={() => handleSelectArticle(article.id)}
                                  className="rounded-2xl border-gray-300 text-teal-600 focus:ring-teal-500"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-12 w-12">
                                    <img
                                      src={getCloudinaryImageUrl(article.featuredImage, { width: 80, height: 80, crop: 'fill' })}
                                      alt={article.title}
                                      className="h-12 w-12 rounded-2xl object-cover"
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="flex items-center">
                                      <h4 className="text-sm font-medium text-gray-900">{article.title}</h4>
                                      {article.isFeatured && <Star className="h-4 w-4 text-yellow-500 ml-2 fill-current" />}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                      Par {article.author} • {article.readingTime} min de lecture
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-sm text-gray-900">{article.category.name}</span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">{article.publishedAt || '-'}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
                                  {getStatusIcon(article.status)}
                                  <span className="ml-1">{getStatusText(article.status)}</span>
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <Eye className="h-4 w-4 mr-1" />
                                    {formatNumber(article.viewsCount)}
                                  </div>
                                  <div className="flex items-center">
                                    <Heart className="h-4 w-4 mr-1" />
                                    {formatNumber(article.reactionsCount)}
                                  </div>
                                  <div className="flex items-center">
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    {article.commentsCount}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <ActionMenu
                                  article={article}
                                  onView={() => handleViewArticle(article.id)}
                                  onEdit={() => handleEditArticle(article.id)}
                                  onDuplicate={() => {
                                    setSelectedArticles([article.id]);
                                    handleDuplicateArticles();
                                  }}
                                  onDelete={() => handleDeleteArticle(article.id)}
                                  onToggleFeature={() => handleToggleFeature(article.id)}
                                  onToggleStatus={() => handleToggleStatus(article.id)}
                                />
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
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
                            <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredArticles.length)}</span> sur{' '}
                            <span className="font-medium">{filteredArticles.length}</span> articles
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
                )}
              </>
            ) : (
              <EmptyState onCreateArticle={handleCreateArticle} />
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
            <div className="bg-white rounded-2xl p-6 flex flex-col items-center shadow-xl">
              <RefreshCw className="h-8 w-8 text-teal-600 animate-spin mb-4" />
              <span className="text-gray-700 font-medium">Chargement...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}