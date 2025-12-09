/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Settings, 
  Star,
  ChevronDown,
  X,
  MapPin,
  Calendar,
  Clock,
  Users,
  Eye,
  MessageCircle,
  Heart,
  Grid,
  List,
  ChevronRight,
  Loader2,
  Bookmark,
  Share2,
  Check,
  Sparkles,
  Zap,
  Award,
  Info,
  TrendingUp
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {  Category } from '@/types/category';
import {   Organization } from '@/types/organization'
import { Announcement, AnnouncementStatus, TargetAudience } from '@/types/announcement';
import { getCloudinaryImageUrl } from '@/lib/cloudinary';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation'; // Remplacez l'import de router par celui-ci

// Schéma de validation pour les filtres
const filtersSchema = z.object({
  category: z.string().optional(),
  city: z.string().optional(),
  date: z.string().optional(),
  price: z.string().optional(),
  distance: z.string().optional(),
  organizationType: z.string().optional(),
  hasPlaces: z.boolean().optional(),
});

type FiltersFormData = z.infer<typeof filtersSchema>;

// Données mocks pour les annonces
const mockAnnouncements: Announcement[] = [
  {
   id: '1',
    organizationId: 'org1',
    title: 'Journée Nationale de Vaccination contre la Poliomyélite',
    slug: 'journee-nationale-vaccination-poliomyelite',
    content: 'Campagne nationale de vaccination contre la poliomyélite pour les enfants de 0 à 5 ans.',
    excerpt: 'Vaccinez vos enfants contre la poliomyélite dans les centres de santé de votre région.',
    featuredImage: 'vaccination-campaign',
    thumbnailImage: 'vaccination-thumb',
    categoryId: '1',
    startDate: '2025-08-15',
    endDate: '2025-08-20',
    targetAudience: [TargetAudience.INFANTS, TargetAudience.CHILDREN],
    isFree: true,
    cost: null,
    capacity: 500,
    registeredCount: 235,
    requiresRegistration: true,
    viewsCount: 1250,
    sharesCount: 87,
    commentsCount: 42,
    reactionsCount: 156,
    notificationsSent: 1200,
    isPinned: true,
    publishedAt: new Date('2025-07-20'),
    status: AnnouncementStatus.PUBLISHED,
    suspensionReason: null,
    suspendedBy: null,
    deletedAt: null,
    createdAt: new Date('2025-07-15'),
    updatedAt: new Date('2025-07-20'),
    organization: {
      id: 'org1',
      name: 'Ministère de la Santé Publique',
      logo: 'ministere-sante-logo',
      phone: '+237 222 23 40 14'
    },
    category: { 
      id: '1', 
      name: 'Vaccination',
      slug: 'vaccination'
    },
    location: { 
      id: 'loc1',
      address: 'Centre de Santé de Bonamoussadi', 
      city: 'Douala', 
      region: 'Littoral',
      latitude: 4.0483,
      longitude: 9.7043
    }
  },
{
    id: '2',
    organizationId: 'org2',
    title: 'Campagne de Dépistage Gratuit du Cancer du Sein',
    slug: 'campagne-depistage-cancer-sein',
    content: 'Campagne de dépistage gratuit du cancer du sein pour les femmes de 25 ans et plus.',
    excerpt: 'Un dépistage précoce peut sauver des vies. Venez faire votre examen gratuitement.',
    featuredImage: 'breast-cancer-screening',
    thumbnailImage: 'breast-cancer-thumb',
    categoryId: '6',
    startDate: '2025-08-18',
    endDate: '2025-08-25',
    targetAudience: [TargetAudience.ADULTS, TargetAudience.ELDERLY, TargetAudience.PREGNANT_WOMEN],
    isFree: true,
    cost: null,
    capacity: 300,
    registeredCount: 187,
    requiresRegistration: true,
    viewsCount: 980,
    sharesCount: 65,
    commentsCount: 38,
    reactionsCount: 124,
    notificationsSent: 900,
    isPinned: false,
    publishedAt: new Date('2025-07-18'),
    status: AnnouncementStatus.PUBLISHED,
    suspensionReason: null,
    suspendedBy: null,
    deletedAt: null,
    createdAt: new Date('2025-07-10'),
    updatedAt: new Date('2025-07-18'),
    organization: {
      id: 'org2',
      name: 'Association Camerounaise de Lutte contre le Cancer',
      logo: 'aclc-logo',
      phone: '+237 233 42 11 31'
    },
    category: { 
      id: '6', 
      name: 'Cancer',
      slug: 'cancer'
    },
    location: { 
      id: 'loc2',
      address: 'Hôpital Central de Yaoundé', 
      city: 'Yaoundé', 
      region: 'Centre',
      latitude: 3.8480,
      longitude: 11.5021
    }
  },
  {
    id: '3',
    organizationId: 'org1',
    title: 'Distribution de Moustiquaires Imprégnées',
    slug: 'distribution-moustiquaires-imprimes',
    content: 'Distribution gratuite de moustiquaires imprégnées pour la prévention du paludisme.',
    excerpt: 'Protégez votre famille contre le paludisme avec des moustiquaires imprégnées.',
    featuredImage: 'mosquito-nets',
    thumbnailImage: 'mosquito-nets-thumb',
    categoryId: '3',
    startDate: '2025-08-22',
    endDate: '2025-08-30',
    targetAudience: [TargetAudience.ALL],
    isFree: true,
    cost: null,
    capacity: 1000,
    registeredCount: 678,
    requiresRegistration: false,
    viewsCount: 1450,
    sharesCount: 98,
    commentsCount: 56,
    reactionsCount: 189,
    notificationsSent: 1500,
    isPinned: false,
    publishedAt: new Date('2025-07-25'),
    status: AnnouncementStatus.PUBLISHED,
    suspensionReason: null,
    suspendedBy: null,
    deletedAt: null,
    createdAt: new Date('2025-07-20'),
    updatedAt: new Date('2025-07-25'),
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
    },
    location: { 
      id: 'loc3',
      address: 'Centre de Santé de Garoua', 
      city: 'Garoua', 
      region: 'Nord',
      latitude: 9.3117,
      longitude: 13.3975
    }
  },
  {
    id: '4',
    organizationId: 'org3',
    title: 'Journées de Consultation Prénatale Gratuite',
    slug: 'journees-consultation-prenatale-gratuite',
    content: 'Consultations prénatales gratuites pour les femmes enceintes des 2ème et 3ème trimestres.',
    excerpt: 'Un suivi régulier pendant la grossesse est essentiel pour la santé de la mère et du bébé.',
    featuredImage: 'prenatal-care',
    thumbnailImage: 'prenatal-care-thumb',
    categoryId: '4',
    startDate: '2025-08-25',
    endDate: '2025-08-27',
    targetAudience: [TargetAudience.PREGNANT_WOMEN],
    isFree: true,
    cost: null,
    capacity: 200,
    registeredCount: 143,
    requiresRegistration: true,
    viewsCount: 780,
    sharesCount: 54,
    commentsCount: 32,
    reactionsCount: 98,
    notificationsSent: 750,
    isPinned: false,
    publishedAt: new Date('2025-07-28'),
    status: AnnouncementStatus.PUBLISHED,
    suspensionReason: null,
    suspendedBy: null,
    deletedAt: null,
    createdAt: new Date('2025-07-22'),
    updatedAt: new Date('2025-07-28'),
    organization: {
      id: 'org3',
      name: 'Hôpital Régional de Bafoussam',
      logo: 'hrb-logo',
      phone: '+237 233 33 12 45'
    },
    category: { 
      id: '4', 
      name: 'Santé Maternelle',
      slug: 'sante-maternelle'
    },
    location: { 
      id: 'loc4',
      address: 'Hôpital Régional de Bafoussam', 
      city: 'Bafoussam', 
      region: 'Ouest',
      latitude: 5.4769,
      longitude: 10.4182
    }
  },
   {
    id: '5',
    organizationId: 'org4',
    title: 'Séance de Sensibilisation sur le Diabète',
    slug: 'seance-sensibilisation-diabete',
    content: 'Séance de sensibilisation sur la prévention et la gestion du diabète.',
    excerpt: 'Apprenez à prévenir et à gérer le diabète pour une meilleure qualité de vie.',
    featuredImage: 'diabetes-awareness',
    thumbnailImage: 'diabetes-awareness-thumb',
    categoryId: '7',
    startDate: '2025-08-28',
    endDate: '2025-08-28',
    targetAudience: [TargetAudience.ADULTS, TargetAudience.ELDERLY],
    isFree: true,
    cost: null,
    capacity: 150,
    registeredCount: 89,
    requiresRegistration: false,
    viewsCount: 620,
    sharesCount: 42,
    commentsCount: 28,
    reactionsCount: 76,
    notificationsSent: 600,
    isPinned: false,
    publishedAt: new Date('2025-08-01'),
    status: AnnouncementStatus.PUBLISHED,
    suspensionReason: null,
    suspendedBy: null,
    deletedAt: null,
    createdAt: new Date('2025-07-30'),
    updatedAt: new Date('2025-08-01'),
    organization: {
      id: 'org4',
      name: 'Association des Diabétiques du Cameroun',
      logo: 'adc-logo',
      phone: '+237 233 42 56 78'
    },
    category: { 
      id: '7', 
      name: 'Diabète',
      slug: 'diabete'
    },
    location: { 
      id: 'loc5',
      address: 'Centre de Santé de Maroua', 
      city: 'Maroua', 
      region: 'Extrême-Nord',
      latitude: 10.5945,
      longitude: 14.3159
    }
  },
  {
    id: '6',
    organizationId: 'org5',
    title: 'Campagne de Dépistage de l\'Hypertension',
    slug: 'campagne-depistage-hypertension',
    content: 'Campagne de dépistage gratuit de l\'hypertension artérielle pour les adultes de 30 ans et plus.',
    excerpt: 'L\'hypertension est souvent silencieuse. Faites vérifier votre tension artérielle gratuitement.',
    featuredImage: 'blood-pressure-check',
    thumbnailImage: 'blood-pressure-check-thumb',
    categoryId: '8',
    startDate: '2025-09-02',
    endDate: '2025-09-05',
    targetAudience: [TargetAudience.ADULTS, TargetAudience.ELDERLY],
    isFree: true,
    cost: null,
    capacity: 400,
    registeredCount: 234,
    requiresRegistration: false,
    viewsCount: 890,
    sharesCount: 67,
    commentsCount: 41,
    reactionsCount: 112,
    notificationsSent: 850,
    isPinned: false,
    publishedAt: new Date('2025-08-05'),
    status: AnnouncementStatus.PUBLISHED,
    suspensionReason: null,
    suspendedBy: null,
    deletedAt: null,
    createdAt: new Date('2025-08-02'),
    updatedAt: new Date('2025-08-05'),
    organization: {
      id: 'org5',
      name: 'Hôpital Régional de Bamenda',
      logo: 'hrb2-logo',
      phone: '+237 233 33 78 90'
    },
    category: { 
      id: '8', 
      name: 'Hypertension',
      slug: 'hypertension'
    },
    location: { 
      id: 'loc6',
      address: 'Hôpital Régional de Bamenda', 
      city: 'Bamenda', 
      region: 'Nord-Ouest',
      latitude: 5.9631,
      longitude: 10.1595
    }
  },
  {
    id: '7',
    organizationId: 'org6',
    title: 'Atelier sur la Nutrition Infantile',
    slug: 'atelier-nutrition-infantile',
    content: 'Atelier sur les bonnes pratiques nutritionnelles pour les enfants de 6 mois à 5 ans.',
    excerpt: 'Une bonne nutrition est essentielle pour la croissance et le développement de votre enfant.',
    featuredImage: 'child-nutrition',
    thumbnailImage: 'child-nutrition-thumb',
    categoryId: '5',
    startDate: '2025-09-08',
    endDate: '2025-09-10',
    targetAudience: [TargetAudience.CHILDREN, TargetAudience.INFANTS],
    isFree: true,
    cost: null,
    capacity: 100,
    registeredCount: 67,
    requiresRegistration: true,
    viewsCount: 720,
    sharesCount: 48,
    commentsCount: 35,
    reactionsCount: 89,
    notificationsSent: 700,
    isPinned: false,
    publishedAt: new Date('2025-08-08'),
    status: AnnouncementStatus.PUBLISHED,
    suspensionReason: null,
    suspendedBy: null,
    deletedAt: null,
    createdAt: new Date('2025-08-05'),
    updatedAt: new Date('2025-08-08'),
    organization: {
      id: 'org6',
      name: 'Centre de Promotion de la Nutrition',
      logo: 'cpn-logo',
      phone: '+237 233 33 45 67'
    },
    category: { 
      id: '5', 
      name: 'Nutrition Infantile',
      slug: 'nutrition-infantile'
    },
    location: { 
      id: 'loc7',
      address: 'Centre de Santé d\'Edea', 
      city: 'Edea', 
      region: 'Littoral',
      latitude: 3.8036,
      longitude: 10.1446
    }
  },
  {
    id: '8',
    organizationId: 'org7',
    title: 'Journée de Sensibilisation sur le VIH/SIDA',
    slug: 'journee-sensibilisation-vih-sida',
    content: 'Journée de sensibilisation et de dépistage gratuit du VIH/SIDA.',
    excerpt: 'Le dépistage est le premier pas vers une prise en charge efficace. Faites-vous dépister.',
    featuredImage: 'hiv-awareness',
    thumbnailImage: 'hiv-awareness-thumb',
    categoryId: '2',
    startDate: '2025-09-15',
    endDate: '2025-09-15',
    targetAudience: [TargetAudience.ADULTS, TargetAudience.YOUTH],
    isFree: true,
    cost: null,
    capacity: 500,
    registeredCount: 312,
    requiresRegistration: false,
    viewsCount: 1100,
    sharesCount: 78,
    commentsCount: 46,
    reactionsCount: 134,
    notificationsSent: 1050,
    isPinned: false,
    publishedAt: new Date('2025-08-10'),
    status: AnnouncementStatus.PUBLISHED,
    suspensionReason: null,
    suspendedBy: null,
    deletedAt: null,
    createdAt: new Date('2025-08-08'),
    updatedAt: new Date('2025-08-10'),
    organization: {
      id: 'org7',
      name: 'Coalition Camerounaise contre le SIDA',
      logo: 'ccs-logo',
      phone: '+237 233 42 89 01'
    },
    category: { 
      id: '2', 
      name: 'Dépistage VIH/SIDA',
      slug: 'depistage-vih'
    },
    location: { 
      id: 'loc8',
      address: 'Centre de Santé de Kribi', 
      city: 'Kribi', 
      region: 'Sud',
      latitude: 2.9415,
      longitude: 10.0091
    }
  }
];

// Données mocks pour les catégories
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
  },
];

/// Composant pour la carte d'annonce en vue liste (amélioré)
function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();
 

// Ajoutez cette fonction pour gérer le clic sur une annonce
const handleViewDetails = () => {
  router.push(`/annonces/details`);   //////////////////////////////////////////////////////////////////////////////////////
};
  
  // Fonction pour formater la date (corrigée)
  const formatDate = (date: Date | string) => {
    // Si c'est une chaîne, la convertir en Date
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Fonction pour formater l'heure (corrigée)
  const formatTime = (date: Date | string) => {
    // Si c'est une chaîne, la convertir en Date
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
const getCategoryIcon = (category: Category | string) => {
  // Si c'est une chaîne, utiliser la correspondance basée sur le nom
  if (typeof category === 'string') {
    const name = category.toLowerCase();
    if (name.includes('vaccin')) return '💉';
    if (name.includes('dépist')) return '🔬';
    if (name.includes('palud')) return '🦟';
    if (name.includes('matern')) return '🤰';
    if (name.includes('nutrition')) return '👶';
    if (name.includes('cancer')) return '🎗️';
    if (name.includes('diab')) return '🩸';
    if (name.includes('hyper')) return '❤️';
    if (name.includes('planif')) return '👨‍👩‍👧‍👦';
    if (name.includes('hygi')) return '🧼';
    return '🏥'; // Icône par défaut
  }
  
  // Si c'est un objet Category, utiliser sa propriété icon ou son nom
  if (!category) return '🏥';
  
  // Si l'objet a une propriété icon, l'utiliser
  if (category.icon) return category.icon;
  
  // Sinon, utiliser le nom pour déterminer l'icône
  const name = category.name.toLowerCase();
  if (name.includes('vaccin')) return '💉';
  if (name.includes('dépist')) return '🔬';
  if (name.includes('palud')) return '🦟';
  if (name.includes('matern')) return '🤰';
  if (name.includes('nutrition')) return '👶';
  if (name.includes('cancer')) return '🎗️';
  if (name.includes('diab')) return '🩸';
  if (name.includes('hyper')) return '❤️';
  if (name.includes('planif')) return '👨‍👩‍👧‍👦';
  if (name.includes('hygi')) return '🧼';
  return '🏥'; // Icône par défaut
};
// Fonction pour obtenir la couleur de catégorie (affinée)
const getCategoryColor = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('vaccin')) return 'from-emerald-400 to-emerald-600'; // Vert émeraude
  if (name.includes('dépist')) return 'from-blue-400 to-blue-600'; // Bleu
  if (name.includes('palud')) return 'from-yellow-400 to-orange-500'; // Jaune à orange
  if (name.includes('matern')) return 'from-pink-400 to-pink-600'; // Rose
  if (name.includes('nutrition')) return 'from-green-400 to-teal-600'; // Vert à sarcelle
  if (name.includes('cancer')) return 'from-red-400 to-red-600'; // Rouge
  if (name.includes('diab')) return 'from-indigo-400 to-indigo-600'; // Indigo
  if (name.includes('hyper')) return 'from-purple-400 to-purple-600'; // Violet
  if (name.includes('planif')) return 'from-cyan-400 to-cyan-600'; // Cyan
  if (name.includes('hygi')) return 'from-gray-400 to-gray-600'; // Gris
  return 'from-gray-400 to-gray-600'; // Couleur par défaut
};
  
  const fillPercentage = announcement.capacity ? Math.round((announcement.registeredCount / announcement.capacity) * 100) : 0;
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: announcement.title,
        text: announcement.excerpt || '',
        url: window.location.origin + '/announcements/' + announcement.slug,
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
      navigator.clipboard.writeText(window.location.origin + '/announcements/' + announcement.slug);
      toast('Lien copié dans le presse-papiers!', {
        icon: '📋',
        style: {
          background: '#10b981',
          color: '#ffffff',
        },
      });
    }
  };
    const handleRegister = () => {
    router.push(`/annonces/details`);
  };

  // Fonction pour gérer le clic sur "Plus de détails"
  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="relative">
        <img
          src={getCloudinaryImageUrl(announcement.featuredImage, { width: 400, height: 200, crop: 'fill' })}
          alt={announcement.title}
          className="w-full h-48 object-cover"
        />
        
        {/* Badge de catégorie */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-linear-to-r ${getCategoryColor(announcement.category?.name || '')} text-white shadow-md`}>
            {getCategoryIcon(announcement.category?.name || '')} {announcement.category?.name}
          </span>
        </div>
        
        {/* Badge spécial si l'annonce est épinglée */}
        {announcement.isPinned && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-amber-500 text-white shadow-md">
              <Star className="h-3 w-3 mr-1" /> Épinglé
            </span>
          </div>
        )}
        
        {/* Actions rapides */}
        <div className="absolute bottom-3 right-3 flex space-x-2">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
          >
            <Share2 className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">{announcement.title}</h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{announcement.excerpt}</p>
        
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <div className="flex items-center mr-4">
            <MapPin className="h-4 w-4 mr-1 text-teal-600" />
            {announcement.location?.city}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-teal-600" />
            {formatDate(announcement.startDate)}
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Users className="h-4 w-4 mr-1 text-teal-600" />
          {announcement.organization?.name}
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-teal-600">
            {announcement.isFree ? 'Gratuit' : `${announcement.cost} XAF`}
          </span>
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {announcement.viewsCount}
            </div>
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              {announcement.commentsCount}
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              {announcement.reactionsCount}
            </div>
          </div>
        </div>
        
        {announcement.capacity && (
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{announcement.registeredCount} inscrits</span>
              <span className="text-gray-600">{announcement.capacity - announcement.registeredCount} places restantes</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  fillPercentage > 80 ? 'bg-red-500' : fillPercentage > 50 ? 'bg-amber-500' : 'bg-teal-600'
                }`}
                style={{ width: `${fillPercentage}%` }}
              ></div>
            </div>
            <div className="text-right text-xs text-gray-500 mt-1">{fillPercentage}% complet</div>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <button
            onClick={handleToggleDetails}
            className="text-teal-600 text-sm font-medium flex items-center hover:text-teal-700 transition-colors"
          >
            {showDetails ? 'Moins de détails' : 'Plus de détails'}
            <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          </button>
          
          <button className="px-4 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-full hover:bg-teal-700 transition-colors" onClick={handleRegister}>
            
            S&apos;inscrire
          </button>
        </div>
        
        {/* Détails supplémentaires (affichés lors du clic) */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 pt-3 border-t border-gray-100"
            >
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Clock className="h-4 w-4 mr-2 text-teal-600" />
                {formatTime(announcement.startDate)} - {formatTime(announcement.endDate)}
              </div>
              
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-2 text-teal-600" />
                {announcement.location?.address}
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2 text-teal-600" />
                Public ciblé: {announcement.targetAudience?.join(', ')}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Composant pour la carte d'annonce en vue grille (amélioré)
function AnnouncementGridCard({ announcement }: { announcement: Announcement }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const router = useRouter();
  
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const handleViewDetails = () => {
    router.push(`/annonces/details`);
  };
  
const getCategoryIcon = (category: Category | string) => {
  // Si c'est une chaîne, utiliser la correspondance basée sur le nom
  if (typeof category === 'string') {
    const name = category.toLowerCase();
    if (name.includes('vaccin')) return '💉';
    if (name.includes('dépist')) return '🔬';
    if (name.includes('palud')) return '🦟';
    if (name.includes('matern')) return '🤰';
    if (name.includes('nutrition')) return '👶';
    if (name.includes('cancer')) return '🎗️';
    if (name.includes('diab')) return '🩸';
    if (name.includes('hyper')) return '❤️';
    if (name.includes('planif')) return '👨‍👩‍👧‍👦';
    if (name.includes('hygi')) return '🧼';
    return '🏥'; // Icône par défaut
  }
  
  // Si c'est un objet Category, utiliser sa propriété icon ou son nom
  if (!category) return '🏥';
  
  // Si l'objet a une propriété icon, l'utiliser
  if (category.icon) return category.icon;
  
  // Sinon, utiliser le nom pour déterminer l'icône
  const name = category.name.toLowerCase();
  if (name.includes('vaccin')) return '💉';
  if (name.includes('dépist')) return '🔬';
  if (name.includes('palud')) return '🦟';
  if (name.includes('matern')) return '🤰';
  if (name.includes('nutrition')) return '👶';
  if (name.includes('cancer')) return '🎗️';
  if (name.includes('diab')) return '🩸';
  if (name.includes('hyper')) return '❤️';
  if (name.includes('planif')) return '👨‍👩‍👧‍👦';
  if (name.includes('hygi')) return '🧼';
  return '🏥'; // Icône par défaut
};
// Fonction pour obtenir la couleur de catégorie (affinée)
const getCategoryColor = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('vaccin')) return 'from-emerald-400 to-emerald-600'; // Vert émeraude
  if (name.includes('dépist')) return 'from-blue-400 to-blue-600'; // Bleu
  if (name.includes('palud')) return 'from-yellow-400 to-orange-500'; // Jaune à orange
  if (name.includes('matern')) return 'from-pink-400 to-pink-600'; // Rose
  if (name.includes('nutrition')) return 'from-green-400 to-teal-600'; // Vert à sarcelle
  if (name.includes('cancer')) return 'from-red-400 to-red-600'; // Rouge
  if (name.includes('diab')) return 'from-indigo-400 to-indigo-600'; // Indigo
  if (name.includes('hyper')) return 'from-purple-400 to-purple-600'; // Violet
  if (name.includes('planif')) return 'from-cyan-400 to-cyan-600'; // Cyan
  if (name.includes('hygi')) return 'from-gray-400 to-gray-600'; // Gris
  return 'from-gray-400 to-gray-600'; // Couleur par défaut
};
  
  const fillPercentage = announcement.capacity ? Math.round((announcement.registeredCount / announcement.capacity) * 100) : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="relative">
        <img
          src={getCloudinaryImageUrl(announcement.featuredImage, { width: 300, height: 200, crop: 'fill' })}
          alt={announcement.title}
          className="w-full h-48 object-cover"
        />
        
        {/* Badge de catégorie */}
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-linear-to-r ${getCategoryColor(announcement.category?.name || '')} text-white shadow-md`}>
            {getCategoryIcon(announcement.category?.name || '')} {announcement.category?.name}
          </span>
        </div>
        
        {/* Badge spécial si l'annonce est épinglée */}
        {announcement.isPinned && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-amber-500 text-white shadow-md">
              <Star className="h-3 w-3 mr-1" />
            </span>
          </div>
        )}
        
        {/* Actions rapides */}
        <div className="absolute bottom-2 right-2">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
          >
            <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} />
          </button>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{announcement.title}</h3>
        
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-3.5 w-3.5 mr-1 text-teal-600" />
          {announcement.location?.city}
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Calendar className="h-3.5 w-3.5 mr-1 text-teal-600" />
          {formatDate(announcement.startDate)}
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-teal-600">
            {announcement.isFree ? 'Gratuit' : `${announcement.cost} XAF`}
          </span>
          <div className="flex items-center text-sm text-gray-500">
            <Eye className="h-3.5 w-3.5 mr-1" />
            {announcement.viewsCount}
          </div>
        </div>
        
        {announcement.capacity && (
          <div className="mb-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  fillPercentage > 80 ? 'bg-red-500' : fillPercentage > 50 ? 'bg-amber-500' : 'bg-teal-600'
                }`}
                style={{ width: `${fillPercentage}%` }}
              ></div>
            </div>
            <div className="text-right text-xs text-gray-500 mt-1">{fillPercentage}% complet</div>
          </div>
        )}
        
        <button className="w-full px-3 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-full hover:bg-teal-700 transition-colors" onClick={handleViewDetails}>
          
          Voir les détails
        </button>
      </div>
    </motion.div>
  );
}

// Composant pour la barre de filtres (amélioré)
function FiltersBar({ 
  activeFiltersCount, 
  onOpenFilters,
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  searchSuggestions,
  showSuggestions
}: { 
  activeFiltersCount: number; 
  onOpenFilters: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearchSubmit: () => void;
  searchSuggestions: string[];
  showSuggestions: boolean;
}) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  return (
    <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-3 gap-3">
          {/* Barre de recherche avec suggestions */}
          <div className="relative flex-1 max-w-md">
            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${isSearchFocused ? 'text-teal-600' : 'text-gray-400'}`}>
              <Search className="h-5 w-5" />
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onSearchSubmit(); }}>
              <input
                type="text"
                placeholder="Rechercher une campagne..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                  isSearchFocused ? 'border-teal-500' : 'border-gray-300'
                }`}
              />
            </form>
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
            
            {/* Suggestions de recherche */}
            <AnimatePresence>
              {showSuggestions && searchSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                >
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => onSearchChange(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <Search className="h-4 w-4 mr-2 text-gray-400" />
                      {suggestion}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Boutons de filtres rapides */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            <button
              onClick={onOpenFilters}
              className="flex items-center px-3 py-2 bg-linear-to-r from-teal-500 to-teal-600 text-white text-sm font-medium rounded-full whitespace-nowrap hover:from-teal-600 hover:to-teal-700 transition-all shadow-md"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filtres {activeFiltersCount > 0 && (
                <span className="ml-1 bg-white text-teal-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            
            <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full whitespace-nowrap hover:bg-gray-200 transition-colors">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Ville</span>
            </button>
            
            <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full whitespace-nowrap hover:bg-gray-200 transition-colors">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Date</span>
            </button>
            
            <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full whitespace-nowrap hover:bg-gray-200 transition-colors">
              <span className="mr-1">FCFA</span>
              <span className="hidden sm:inline">Prix</span>
            </button>
          </div>
          
          {/* Bouton de vue */}
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Filtres actifs affichés sous la barre */}
        {activeFiltersCount > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center space-x-2 py-2 overflow-x-auto"
          >
            <span className="text-xs text-gray-500">Filtres actifs:</span>
            {/* Les filtres actifs seraient affichés ici */}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Composant pour les options de tri (amélioré)
function SortOptions({ 
  sortOption, 
  onSortChange 
}: { 
  sortOption: string;
  onSortChange: (option: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-2">Trier par:</span>
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center text-sm font-medium text-gray-900 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              {sortOption === 'recent' && 'Plus récent'}
              {sortOption === 'popular' && 'Plus populaire'}
              {sortOption === 'date' && 'Date'}
              {sortOption === 'price' && 'Prix'}
              {sortOption === 'distance' && 'Distance'}
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-full"
                >
                  <button
                    onClick={() => { onSortChange('recent'); setIsOpen(false); }}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                      sortOption === 'recent' ? 'bg-teal-50 text-teal-600' : ''
                    }`}
                  >
                    <span>Plus récent</span>
                    {sortOption === 'recent' && <Check className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => { onSortChange('popular'); setIsOpen(false); }}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                      sortOption === 'popular' ? 'bg-teal-50 text-teal-600' : ''
                    }`}
                  >
                    <span>Plus populaire</span>
                    {sortOption === 'popular' && <Check className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => { onSortChange('date'); setIsOpen(false); }}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                      sortOption === 'date' ? 'bg-teal-50 text-teal-600' : ''
                    }`}
                  >
                    <span>Date</span>
                    {sortOption === 'date' && <Check className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => { onSortChange('price'); setIsOpen(false); }}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                      sortOption === 'price' ? 'bg-teal-50 text-teal-600' : ''
                    }`}
                  >
                    <span>Prix</span>
                    {sortOption === 'price' && <Check className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => { onSortChange('distance'); setIsOpen(false); }}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                      sortOption === 'distance' ? 'bg-teal-50 text-teal-600' : ''
                    }`}
                  >
                    <span>Distance</span>
                    {sortOption === 'distance' && <Check className="h-4 w-4" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-3 py-1.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <Sparkles className="h-4 w-4 mr-1 text-amber-500" />
            Recommandé
          </button>
        </div>
      </div>
    </div>
  );
}

// Composant pour l'en-tête des résultats (amélioré)
function ResultsHeader({ 
  totalCount, 
  viewMode, 
  onViewModeChange,
  showMap,
  onToggleMap
}: { 
  totalCount: number; 
  viewMode: 'list' | 'grid'; 
  onViewModeChange: (mode: 'list' | 'grid') => void;
  showMap: boolean;
  onToggleMap: () => void;
}) {
  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">
          {totalCount} campagnes trouvées
        </h2>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleMap}
            className={`p-2 rounded-full ${showMap ? 'bg-teal-100 text-teal-600' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
            title="Afficher la carte"
          >
            <MapPin className="h-5 w-5" />
          </button>
          
          <div className="flex items-center bg-gray-100 rounded-full p-1">
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-full ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <List className={`h-4 w-4 ${viewMode === 'list' ? 'text-teal-600' : 'text-gray-600'}`} />
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-full ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              <Grid className={`h-4 w-4 ${viewMode === 'grid' ? 'text-teal-600' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour le modal de filtres (amélioré)
function FiltersModal({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange,
  onApplyFilters,
  onResetFilters
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  filters: FiltersFormData; 
  onFiltersChange: (filters: FiltersFormData) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}) {
  const [activeTab, setActiveTab] = useState('category');
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center"
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-t-3xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        >
          <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          {/* Onglets de navigation */}
          <div className="flex border-b border-gray-100 px-4">
            <button
              onClick={() => setActiveTab('category')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'category' 
                  ? 'text-teal-600 border-teal-600' 
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Catégorie
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'location' 
                  ? 'text-teal-600 border-teal-600' 
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Lieu
            </button>
            <button
              onClick={() => setActiveTab('date')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'date' 
                  ? 'text-teal-600 border-teal-600' 
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Date
            </button>
            <button
              onClick={() => setActiveTab('other')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'other' 
                  ? 'text-teal-600 border-teal-600' 
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Autres
            </button>
          </div>
          
          <div className="overflow-y-auto flex-1">
            {activeTab === 'category' && (
              <div className="p-4">
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
                    Catégories populaires
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mockCategories.slice(0, 5).map((category) => (
                      <button
                        key={category.id}
                        onClick={() => onFiltersChange({ ...filters, category: category.id })}
                        className={`px-3 py-1.5 text-sm font-medium rounded-full flex items-center ${
                          filters.category === category.id
                            ? 'bg-teal-100 text-teal-700 border border-teal-300'
                            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        <span className="mr-1">{category.icon}</span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Toutes les catégories</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        className="mr-2"
                        checked={!filters.category}
                        onChange={() => onFiltersChange({ ...filters, category: undefined })}
                      />
                      <span>Toutes les catégories</span>
                    </label>
                    
                    {mockCategories.map((category) => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          className="mr-2"
                          checked={filters.category === category.id}
                          onChange={() => onFiltersChange({ ...filters, category: category.id })}
                        />
                        <span>{category.icon} {category.name} ({category.announcementsCount})</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'location' && (
              <div className="p-4">
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-teal-600" />
                    Ville
                  </h4>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-3"
                    value={filters.city || ''}
                    onChange={(e) => onFiltersChange({ ...filters, city: e.target.value })}
                  >
                    <option value="">Sélectionnez une ville</option>
                    <option value="douala">Douala</option>
                    <option value="yaounde">Yaoundé</option>
                    <option value="bafoussam">Bafoussam</option>
                    <option value="garoua">Garoua</option>
                    <option value="buea">Buea</option>
                    <option value="maroua">Maroua</option>
                    <option value="bamenda">Bamenda</option>
                    <option value="ngaoundere">Ngaoundere</option>
                  </select>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onFiltersChange({ ...filters, city: 'douala' })}
                      className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                        filters.city === 'douala'
                          ? 'bg-teal-100 text-teal-700 border border-teal-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      Douala
                    </button>
                    <button
                      onClick={() => onFiltersChange({ ...filters, city: 'yaounde' })}
                      className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                        filters.city === 'yaounde'
                          ? 'bg-teal-100 text-teal-700 border border-teal-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      Yaoundé
                    </button>
                    <button
                      onClick={() => onFiltersChange({ ...filters, city: 'bafoussam' })}
                      className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                        filters.city === 'bafoussam'
                          ? 'bg-teal-100 text-teal-700 border border-teal-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      Bafoussam
                    </button>
                    <button
                      onClick={() => onFiltersChange({ ...filters, city: undefined })}
                      className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                        !filters.city
                          ? 'bg-teal-100 text-teal-700 border border-teal-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      Toutes
                    </button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-amber-500" />
                    Distance
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="distance"
                        className="mr-2"
                        checked={filters.distance === '5km'}
                        onChange={() => onFiltersChange({ ...filters, distance: '5km' })}
                      />
                      <span>Moins de 5 km</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="distance"
                        className="mr-2"
                        checked={filters.distance === '10km'}
                        onChange={() => onFiltersChange({ ...filters, distance: '10km' })}
                      />
                      <span>Moins de 10 km</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="distance"
                        className="mr-2"
                        checked={filters.distance === '20km'}
                        onChange={() => onFiltersChange({ ...filters, distance: '20km' })}
                      />
                      <span>Moins de 20 km</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="distance"
                        className="mr-2"
                        checked={!filters.distance}
                        onChange={() => onFiltersChange({ ...filters, distance: undefined })}
                      />
                      <span>Toutes distances</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'date' && (
              <div className="p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-teal-600" />
                  Date
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="date"
                      className="mr-2"
                      checked={!filters.date}
                      onChange={() => onFiltersChange({ ...filters, date: undefined })}
                    />
                    <span>Toutes les dates</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="date"
                      className="mr-2"
                      checked={filters.date === 'today'}
                      onChange={() => onFiltersChange({ ...filters, date: 'today' })}
                    />
                    <span>Aujourd&apos;hui</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="date"
                      className="mr-2"
                      checked={filters.date === 'week'}
                      onChange={() => onFiltersChange({ ...filters, date: 'week' })}
                    />
                    <span>Cette semaine</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="date"
                      className="mr-2"
                      checked={filters.date === 'month'}
                      onChange={() => onFiltersChange({ ...filters, date: 'month' })}
                    />
                    <span>Ce mois-ci</span>
                  </label>
                </div>
              </div>
            )}
            
            {activeTab === 'other' && (
              <div className="p-4">
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <span className="mr-2">€</span>
                    Prix
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={filters.price === 'free'}
                        onChange={(e) => onFiltersChange({ ...filters, price: e.target.checked ? 'free' : undefined })}
                      />
                      <span>Gratuit uniquement</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={filters.price === 'paid'}
                        onChange={(e) => onFiltersChange({ ...filters, price: e.target.checked ? 'paid' : undefined })}
                      />
                      <span>Payant</span>
                    </label>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-teal-600" />
                    Places disponibles
                  </h4>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={filters.hasPlaces}
                      onChange={(e) => onFiltersChange({ ...filters, hasPlaces: e.target.checked })}
                    />
                    <span>Places disponibles uniquement</span>
                  </label>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-amber-500" />
                    Type d&apos;organisation
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={filters.organizationType === 'public'}
                        onChange={(e) => onFiltersChange({ ...filters, organizationType: e.target.checked ? 'public' : undefined })}
                      />
                      <span>Hôpital public</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={filters.organizationType === 'private'}
                        onChange={(e) => onFiltersChange({ ...filters, organizationType: e.target.checked ? 'private' : undefined })}
                      />
                      <span>Hôpital privé</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={filters.organizationType === 'clinic'}
                        onChange={(e) => onFiltersChange({ ...filters, organizationType: e.target.checked ? 'clinic' : undefined })}
                      />
                      <span>Clinique</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={filters.organizationType === 'ngo'}
                        onChange={(e) => onFiltersChange({ ...filters, organizationType: e.target.checked ? 'ngo' : undefined })}
                      />
                      <span>ONG médicale</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={filters.organizationType === 'ministry'}
                        onChange={(e) => onFiltersChange({ ...filters, organizationType: e.target.checked ? 'ministry' : undefined })}
                      />
                      <span>Ministère de la Santé</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4 flex items-center justify-between">
            <button
              onClick={onResetFilters}
              className="px-4 py-2 text-gray-700 font-medium flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Réinitialiser
            </button>
            <button
              onClick={() => { onApplyFilters(); onClose(); }}
              className="px-6 py-2 bg-linear-to-r from-teal-500 to-teal-600 text-white font-medium rounded-full shadow-md hover:from-teal-600 hover:to-teal-700 transition-all flex items-center"
            >
              <Check className="h-4 w-4 mr-1" />
              Appliquer les filtres
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Composant pour l'état vide (amélioré)
function EmptyState({ onResetFilters, searchTerm }: { onResetFilters: () => void; searchTerm: string }) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  useEffect(() => {
    // Générer des suggestions basées sur le terme de recherche
    if (searchTerm) {
      const mockSuggestions = [
        'Vaccination COVID-19',
        'Dépistage du cancer',
        'Consultation prénatale',
        'Distribution de moustiquaires',
        'Campagne de sensibilisation VIH',
      ];
      setSuggestions(mockSuggestions.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase())));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        {searchTerm ? (
          <Search className="h-12 w-12 text-gray-400" />
        ) : (
          <Filter className="h-12 w-12 text-gray-400" />
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {searchTerm ? 'Aucune campagne trouvée' : 'Aucune campagne correspondant à vos filtres'}
      </h3>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {searchTerm 
          ? `Essayez de modifier votre recherche "${searchTerm}" ou explorez nos suggestions ci-dessous.`
          : 'Essayez d\'ajuster vos filtres ou explorez nos suggestions ci-dessous.'}
      </p>
      
      {searchTerm && suggestions.length > 0 && (
        <div className="w-full max-w-md mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Suggestions de recherche:</h4>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="px-3 py-1.5 bg-teal-100 text-teal-700 text-sm font-medium rounded-full hover:bg-teal-200 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onResetFilters}
          className="px-6 py-2.5 bg-white text-teal-600 font-medium rounded-full border border-teal-600 hover:bg-teal-50 transition-colors flex items-center"
        >
          <X className="h-4 w-4 mr-2" />
          {searchTerm ? 'Effacer la recherche' : 'Réinitialiser les filtres'}
        </button>
        <button className="px-6 py-2.5 bg-linear-to-r from-teal-500 to-teal-600 text-white font-medium rounded-full shadow-md hover:from-teal-600 hover:to-teal-700 transition-all flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          Voir les campagnes populaires
        </button>
      </div>
      
      <div className="mt-8 p-4 bg-amber-50 rounded-lg max-w-md w-full">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-amber-600 mr-2 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-amber-800 mb-1">Conseil</h4>
            <p className="text-sm text-amber-700">
              Essayez d&apos;utiliser des termes plus généraux ou de vérifier l&apos;orthographe de votre recherche.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Page principale (améliorée)
export default function AnnouncementsPage() {
   const router = useRouter();
  
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [filters, setFilters] = useState<FiltersFormData>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('recent');
  const [showMap, setShowMap] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Calculer le nombre de filtres actifs
  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== false
  ).length;
  
  // Appliquer les filtres et le tri
  const filteredAnnouncements = useMemo(() => {
    let filtered = [...mockAnnouncements];
    
    // Filtrage par recherche
 // ...
  if (searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase(); // Optimisation : on ne le calcule qu'une fois
    filtered = filtered.filter(announcement => 
      announcement.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      (announcement.excerpt || '').toLowerCase().includes(lowerCaseSearchTerm) || // LIGNE CORRIGÉE
      announcement.category?.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      announcement.organization?.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }
  // ...
    
    // Filtrage par catégorie
    if (filters.category) {
      filtered = filtered.filter(announcement => announcement.categoryId === filters.category);
    }
    
    // Filtrage par ville
    if (filters.city) {
      filtered = filtered.filter(announcement => 
        announcement.location?.city.toLowerCase() === filters.city?.toLowerCase()
      );
    }
    
    // Filtrage par date
    if (filters.date === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter(announcement => 
        new Date(announcement.startDate) >= today && 
        new Date(announcement.startDate) < new Date(today.getTime() + 24 * 60 * 60 * 1000)
      );
    } else if (filters.date === 'week') {
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(announcement => 
        new Date(announcement.startDate) >= today && 
        new Date(announcement.startDate) <= weekFromNow
      );
    } else if (filters.date === 'month') {
      const today = new Date();
      const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(announcement => 
        new Date(announcement.startDate) >= today && 
        new Date(announcement.startDate) <= monthFromNow
      );
    }
    
    // Filtrage par prix
    if (filters.price === 'free') {
      filtered = filtered.filter(announcement => announcement.isFree);
    } else if (filters.price === 'paid') {
      filtered = filtered.filter(announcement => !announcement.isFree);
    }
    
    // Filtrage par places disponibles
    if (filters.hasPlaces) {
      filtered = filtered.filter(announcement => 
        announcement.capacity && announcement.registeredCount < announcement.capacity
      );
    }
    
    // Tri des résultats
// Tri des résultats
if (sortOption === 'recent') {
  filtered.sort((a, b) => {
    // Si la date est manquante, on utilise -Infinity pour la placer à la fin
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : -Infinity;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : -Infinity;
    // Tri par ordre décroissant (le plus récent en premier)
    return dateB - dateA;
  });
} else if (sortOption === 'popular') {
  filtered.sort((a, b) => b.viewsCount - a.viewsCount);
} else if (sortOption === 'date') {
  filtered.sort((a, b) => {
    // Si la date est manquante, on utilise Infinity pour la placer à la fin
    const dateA = a.startDate ? new Date(a.startDate).getTime() : Infinity;
    const dateB = b.startDate ? new Date(b.startDate).getTime() : Infinity;
    // Tri par ordre croissant (le plus tôt en premier)
    return dateA - dateB;
  });
}
    
    return filtered;
  }, [filters, searchTerm, sortOption, mockAnnouncements]);
  
  // Suggestions de recherche
 const searchSuggestions = useMemo(() => {
  if (!searchTerm || searchTerm.length < 2) return [];
  
  const allTitles = mockAnnouncements.map(a => a.title);
  const allCategories = mockCategories.map(c => c.name);
  
  // Correction explicite avec un type guard
  const allOrganizations = [...new Set(
    mockAnnouncements
      .map(a => a.organization?.name)
      .filter((name): name is string => Boolean(name)) // LIGNE CORRIGÉE
  )];
  
  const allSuggestions = [...allTitles, ...allCategories, ...allOrganizations];
  
  // TypeScript sait maintenant que 's' est toujours une chaîne de caractères
  return allSuggestions
    .filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 5);
}, [searchTerm, mockAnnouncements, mockCategories]);
  // Afficher les suggestions lorsque le terme de recherche change
  useEffect(() => {
    setShowSuggestions(searchTerm.length >= 2 && searchSuggestions.length > 0);
  }, [searchTerm, searchSuggestions]);
  
  // Fonction pour réinitialiser les filtres
  const handleResetFilters = () => {
    setFilters({});
    setSearchTerm('');
  };
  
  // Fonction pour appliquer les filtres
  const handleApplyFilters = () => {
    setIsLoading(true);
    // Simuler un chargement
    setTimeout(() => {
      setIsLoading(false);
      toast('Filtres appliqués avec succès', {
        icon: '✅',
        style: {
          background: '#10b981',
          color: '#ffffff',
        },
      });
    }, 500);
  };
  
  // Fonction pour soumettre la recherche
  const handleSearchSubmit = () => {
    setIsLoading(true);
    // Simuler un chargement
    setTimeout(() => {
      setIsLoading(false);
      setShowSuggestions(false);
      if (filteredAnnouncements.length === 0) {
        toast(`Aucun résultat pour "${searchTerm}"`, {
          icon: '🔍',
          style: {
            background: '#f59e0b',
            color: '#ffffff',
          },
        });
      } else {
        toast(`${filteredAnnouncements.length} résultats trouvés`, {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });
      }
    }, 500);
  };
  
  // Fonction pour charger plus d'annonces
  const handleLoadMore = () => {
    setIsLoading(true);
    // Simuler un chargement
    setTimeout(() => {
      setIsLoading(false);
      // Dans une vraie application, vous chargeriez plus de données depuis l'API
      toast('Toutes les annonces ont été chargées', {
        icon: 'ℹ️',
        style: {
          background: '#3b82f6',
          color: '#ffffff',
        },
      });
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          
          <h1 className="text-lg font-semibold text-gray-900">Campagnes</h1>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Search className="h-5 w-5 text-gray-700" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Settings className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Barre de filtres */}
      <FiltersBar
        activeFiltersCount={activeFiltersCount}
        onOpenFilters={() => setIsFiltersModalOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
        searchSuggestions={searchSuggestions}
        showSuggestions={showSuggestions}
      />
      
      {/* Options de tri */}
      <SortOptions 
        sortOption={sortOption}
        onSortChange={setSortOption}
      />
      
      {/* En-tête des résultats */}
      <ResultsHeader
        totalCount={filteredAnnouncements.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showMap={showMap}
        onToggleMap={() => setShowMap(!showMap)}
      />
      
      {/* Contenu principal */}
      <main className="pb-20">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
          </div>
        ) : filteredAnnouncements.length > 0 ? (
          <>
            {viewMode === 'list' ? (
              <div className="space-y-4 px-4">
                <AnimatePresence>
                  {filteredAnnouncements.map((announcement) => (
                    <AnnouncementCard
                      key={announcement.id}
                      announcement={announcement}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 px-4">
                <AnimatePresence>
                  {filteredAnnouncements.map((announcement) => (
                    <AnnouncementGridCard
                      key={announcement.id}
                      announcement={announcement}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
            
            {/* Pagination */}
            <div className="flex justify-center py-8">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="px-6 py-3 bg-white text-teal-600 font-medium rounded-full border border-teal-600 hover:bg-teal-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  <>
                    Charger plus (20 suivants)
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <EmptyState 
            onResetFilters={handleResetFilters}
            searchTerm={searchTerm}
          />
        )}
      </main>
      
      {/* Modal de filtres */}
      <FiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}