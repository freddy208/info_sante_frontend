/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  Heart, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Star,
  Bell,
  User,
  ArrowRight,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Filter,
  Plus,
  ChevronDown,
  Bookmark,
  Share2,
  Eye,
  MessageCircle,
  TrendingUp,
  Activity,
  Shield,
  Zap,
  Loader2,
  BookOpen,
  Apple
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { 
  announcementsApi, 
  articlesApi, 
  categoriesApi, 
  organizationsApi 
} from '@/lib/api-endponts';
import { getCloudinaryImageUrl } from '@/lib/cloudinary';
import { toast } from 'react-hot-toast';
import { AnnouncementStatus, TargetAudience } from '@/types/announcement';
import { ArticleStatus } from '@/types/article';
import { Category } from '@/types/category';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { OrganizationType } from '@/types';

// Import dynamique de Leaflet pour éviter les erreurs de SSR
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-teal-600" /></div>
});

// Données mock pour les catégories (typiques du Cameroun)
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

// Données mock pour les annonces (campagnes de santé au Cameroun)
const mockAnnouncements = [
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

// Données mock pour les articles de santé
const mockArticles = [
  {
    id: '1',
    organizationId: 'org1',
    title: 'Comment prévenir le paludisme pendant la saison des pluies au Cameroun',
    slug: 'prevenir-paludisme-saison-pluies-cameroun',
    content: 'Le paludisme reste l\'une des principales causes de morbidité et de mortalité au Cameroun. Voici des conseils pratiques pour vous protéger pendant la saison des pluies. Utilisez des moustiquaires imprégnées, éliminez les eaux stagnantes autour de votre maison et prenez des traitements préventifs recommandés par les professionnels de santé.',
    excerpt: 'Le paludisme reste l\'une des principales causes de morbidité et de mortalité au Cameroun. Voici des conseils pratiques pour vous protéger.',
    featuredImage: 'malaria-prevention',
    thumbnailImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    categoryId: '3',
    author: 'Dr. Jean-Marc Tchamda',
    readingTime: 5,
    tags: ['paludisme', 'prévention', 'saison des pluies', 'moustiquaires'],
    viewsCount: 2450,
    sharesCount: 156,
    commentsCount: 18,
    reactionsCount: 142,
    isFeatured: true,
    publishedAt: '2025-08-01',
    status: ArticleStatus.PUBLISHED,
    suspensionReason: null,
    suspendedBy: null,
    deletedAt: null,
    createdAt: '2025-07-25',
    updatedAt: new Date('2025-08-01'),
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
    organizationId: 'org8',
    title: 'L\'importance de la vaccination chez les enfants camerounais',
    slug: 'importance-vaccination-enfants-camerounais',
    content: 'La vaccination est l\'un des moyens les plus efficaces de protéger les enfants contre les maladies infectieuses graves. Au Cameroun, le Programme Élargi de Vaccination (PEV) vise à réduire la mortalité infantile en assurant une couverture vaccinale élevée. Découvrez le calendrier vaccinal recommandé pour vos enfants.',
    excerpt: 'La vaccination est l\'un des moyens les plus efficaces de protéger les enfants contre les maladies infectieuses graves.',
    featuredImage: 'child-vaccination',
    thumbnailImage: 'child-vaccination-thumb',
    categoryId: '1',
    author: 'Dr. Marie Mbarga',
    readingTime: 7,
    tags: ['vaccination', 'enfants', 'PEV', 'calendrier vaccinal'],
    viewsCount: 1820,
    sharesCount: 124,
    commentsCount: 12,
    reactionsCount: 98,
    isFeatured: false,
    publishedAt: '2025-07-28',
    status: ArticleStatus.PUBLISHED,
    suspensionReason: null,
    suspendedBy: null,
    deletedAt: null,
    createdAt: '2025-07-20',
    updatedAt: new Date('2025-07-28'),
    organization: {
      id: 'org8',
      name: 'Centre de Vaccination de Yaoundé',
      logo: 'cvy-logo',
      phone: '+237 222 23 45 67'
    },
    category: { 
      id: '1', 
      name: 'Vaccination',
      slug: 'vaccination'
    }
  },
  {
    id: '3',
    organizationId: 'org9',
    title: 'Alimentation équilibrée : les produits locaux camerounais à privilégier',
    slug: 'alimentation-equilibree-produits-locaux-cameroun',
    content: 'Une alimentation saine et équilibrée est essentielle pour maintenir une bonne santé. Le Cameroun dispose d\'une grande variété de produits locaux riches en nutriments. Découvrez comment composer vos repas avec des produits comme le manioc, le plantain, le gombo, le poisson fumé et bien d\'autres.',
    excerpt: 'Une alimentation saine et équilibrée est essentielle pour maintenir une bonne santé. Découvrez les produits locaux riches en nutriments.',
    featuredImage: 'local-foods',
    thumbnailImage: 'local-foods-thumb',
    categoryId: '5',
    author: 'Dr. Sophie Ngo',
    readingTime: 6,
    tags: ['alimentation', 'produits locaux', 'nutrition', 'manioc', 'plantain'],
    viewsCount: 1650,
    sharesCount: 98,
    commentsCount: 15,
    reactionsCount: 87,
    isFeatured: false,
    publishedAt: '2025-07-25',
    status: ArticleStatus.PUBLISHED,
    suspensionReason: null,
    suspendedBy: null,
    deletedAt: null,
    createdAt: '2025-07-18',
    updatedAt: new Date('2025-07-25'),
    organization: {
      id: 'org9',
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
    organizationId: 'org1',
    title: 'Comment reconnaître les symptômes du COVID-19 et que faire',
    slug: 'reconnaitre-symptomes-covid-19-cameroun',
    content: 'Le COVID-19 continue de circuler au Cameroun. Il est important de connaître les symptômes et les gestes à adopter en cas de suspicion. Fièvre, toux sèche, fatigue, perte de goût ou d\'odorat sont les symptômes les plus courants. En cas de symptômes, isolez-vous et contactez les services de santé.',
    excerpt: 'Le COVID-19 continue de circuler au Cameroun. Il est important de connaître les symptômes et les gestes à adopter.',
    featuredImage: 'covid-symptoms',
    thumbnailImage: 'covid-symptoms-thumb',
    categoryId: '1',
    author: 'Dr. Pierre Kamga',
    readingTime: 4,
    tags: ['COVID-19', 'symptômes', 'prévention', 'gestes barrière'],
    viewsCount: 2100,
    sharesCount: 167,
    commentsCount: 25,
    reactionsCount: 156,
    isFeatured: true,
    publishedAt: '2025-07-22',
    status: ArticleStatus.PUBLISHED,
    suspensionReason: null,
    suspendedBy: null,
    deletedAt: null,
    createdAt: '2025-07-15',
    updatedAt: new Date('2025-07-22'),
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
    }
  },
  {
    id: '5',
    organizationId: 'org10',
    title: 'Santé maternelle : les consultations prénatales au Cameroun',
    slug: 'sante-maternelle-consultations-prenatales-cameroun',
    content: 'Les soins prénatals sont essentiels pour assurer une grossesse saine et réduire les risques de complications. Au Cameroun, il est recommandé de faire au moins 4 consultations prénatales pendant la grossesse. Découvrez ce qui est vérifié lors de ces consultations et pourquoi elles sont importantes.',
    excerpt: 'Les soins prénatals sont essentiels pour assurer une grossesse saine et réduire les risques de complications.',
    featuredImage: 'prenatal-care',
    thumbnailImage: 'prenatal-care-thumb',
    categoryId: '4',
    author: 'Dr. Rachel Essomba',
    readingTime: 8,
    tags: ['santé maternelle', 'consultations prénatales', 'grossesse', 'soins périnataux'],
    viewsCount: 1780,
    sharesCount: 134,
    commentsCount: 20,
    reactionsCount: 112,
    isFeatured: false,
    publishedAt: '2025-07-18',
    status: ArticleStatus.PUBLISHED,
    suspensionReason: null,
    suspendedBy: null,
    deletedAt: null,
    createdAt: '2025-07-10',
    updatedAt: new Date('2025-07-18'),
    organization: {
      id: 'org10',
      name: 'Hôpital Central de Yaoundé',
      logo: 'hcy-logo',
      phone: '+237 222 23 14 52'
    },
    category: { 
      id: '4', 
      name: 'Santé Maternelle',
      slug: 'sante-maternelle'
    }
  },
  {
    id: '6',
    organizationId: 'org11',
    title: 'Les plantes médicinales camerounaises reconnues par la science',
    slug: 'plantes-medicinales-camerounaises-reconnues-science',
    content: 'Le Cameroun possède une riche biodiversité avec de nombreuses plantes aux propriétés médicinales reconnues. Des études scientifiques ont validé l\'efficacité de certaines plantes comme le moringa, l\'artemisia, le neem ou encore le kinkeliba dans le traitement de divers maux.',
    excerpt: 'Le Cameroun possède une riche biodiversité avec de nombreuses plantes aux propriétés médicinales reconnues.',
    featuredImage: 'medicinal-plants',
    thumbnailImage: 'medicinal-plants-thumb',
    categoryId: '9',
    author: 'Dr. Joseph Etame',
    readingTime: 6,
    tags: ['plantes médicinales', 'médecine traditionnelle', 'moringa', 'artemisia'],
    viewsCount: 1920,
    sharesCount: 145,
    commentsCount: 22,
    reactionsCount: 134,
    isFeatured: false,
    publishedAt: '2025-07-15',
    status: ArticleStatus.PUBLISHED,
    suspensionReason: null,
    suspendedBy: null,
    deletedAt: null,
    createdAt: '2025-07-08',
    updatedAt: new Date('2025-07-15'),
    organization: {
      id: 'org11',
      name: 'Institut de Recherche Médicale et d\'Études des Plantes Médicinales',
      logo: 'irempm-logo',
      phone: '+237 222 23 67 89'
    },
    category: { 
      id: '9', 
      name: 'Hygiène',
      slug: 'hygiene'
    }
  }
];

 // Données mock pour les hôpitaux au Cameroun
// MODIFIÉ : La structure est maintenant plate pour correspondre au type 'Organization'
// Données mock pour les hôpitaux au Cameroun
// MODIFIÉ : La structure est maintenant plate pour correspondre au type 'Organization'
const mockHospitals = [
  {
    id: '1',
    name: 'Hôpital Central de Yaoundé',
    email: 'info@hcy.cm',
    phone: '+237 222 23 14 52',
    address: 'Avenue Charles Atangana',
    city: 'Yaoundé',
    region: 'Centre',
    country: 'Cameroun',
    logo: 'hcy-logo.png',
    type: OrganizationType.PUBLIC,
    specialties: ['Cardiologie', 'Pédiatrie', 'Gynécologie', 'Urgences 24/7'],
    website: 'https://www.hcy.cm',
    isActive: true,
    isVerified: true,
    latitude: 3.8480,
    longitude: 11.5021,
    rating: 4.2,
    totalReviews: 156, // Corrigé de reviewsCount à totalReviews
    registrationNumber: 'HCY-2020-001',
    emergencyAvailable: true,
    insuranceAccepted: ['CNPS', 'Allianz', 'AXA'],
    openingHours: '24/7',
    description: 'Hôpital de référence pour les maladies cardiaques et pédiatriques',
    createdAt: new Date('2020-01-15'),
    updatedAt: new Date('2023-08-10')
  },
  {
    id: '2',
    name: 'Hôpital Laquintinie de Douala',
    email: 'contact@laquintinie.cm',
    phone: '+237 233 42 11 31',
    address: 'Boulevard de la Liberté',
    city: 'Douala',
    region: 'Littoral',
    country: 'Cameroun',
    logo: 'laquintinie-logo.png',
    type: OrganizationType.PUBLIC,
    specialties: ['Chirurgie', 'Ophtalmologie', 'Urgences 24/7'],
    website: null,
    isActive: true,
    isVerified: true,
    latitude: 4.0483,
    longitude: 9.7043,
    rating: 4.0,
    totalReviews: 142, // Corrigé de reviewsCount à totalReviews
    registrationNumber: 'HLQ-2019-002',
    emergencyAvailable: true,
    insuranceAccepted: ['CNPS', 'Allianz'],
    openingHours: '24/7',
    description: 'Spécialisé en chirurgie et ophtalmologie',
    createdAt: new Date('2019-05-20'),
    updatedAt: new Date('2023-07-22')
  },
  {
    id: '3',
    name: 'Hôpital Général de Douala',
    email: 'info@hgd.cm',
    phone: '+237 233 42 20 11',
    address: 'Rue Joss',
    city: 'Douala',
    region: 'Littoral',
    country: 'Cameroun',
    logo: 'hgd-logo.png',
    type: OrganizationType.PUBLIC,
    specialties: ['Médecine Interne', 'Pédiatrie', 'Urgences 24/7'],
    website: 'https://www.hgd.cm',
    isActive: true,
    isVerified: true,
    latitude: 4.0511,
    longitude: 9.7679,
    rating: 3.8,
    totalReviews: 128, // Corrigé de reviewsCount à totalReviews
    registrationNumber: 'HGD-2018-003',
    emergencyAvailable: true,
    insuranceAccepted: ['CNPS'],
    openingHours: '24/7',
    description: 'Hôpital général avec services de médecine interne et pédiatrie',
    createdAt: new Date('2018-11-10'),
    updatedAt: new Date('2023-08-05')
  },
  {
    id: '4',
    name: 'Hôpital Jamot de Yaoundé',
    email: 'contact@hopital-jamot.cm',
    phone: '+237 222 23 16 01',
    address: 'Rue Mballa II',
    city: 'Yaoundé',
    region: 'Centre',
    country: 'Cameroun',
    logo: 'hopital-jamot-logo.png',
    type: OrganizationType.PUBLIC,
    specialties: ['Pneumologie', 'Cardiologie', 'Urgences 24/7'],
    website: null,
    isActive: true,
    isVerified: true,
    latitude: 3.8660,
    longitude: 11.5185,
    rating: 4.1,
    totalReviews: 167, // Corrigé de reviewsCount à totalReviews
    registrationNumber: 'HJY-2021-004',
    emergencyAvailable: true,
    insuranceAccepted: ['CNPS', 'Allianz', 'AXA'],
    openingHours: '24/7',
    description: 'Spécialisé en pneumologie et cardiologie',
    createdAt: new Date('2021-02-18'),
    updatedAt: new Date('2023-08-15')
  },
  {
    id: '5',
    name: 'Centre Hospitalier et Universitaire (CHU) de Yaoundé',
    email: 'info@chu-yaounde.cm',
    phone: '+237 222 23 40 14',
    address: 'Campus de l\'Université de Yaoundé I',
    city: 'Yaoundé',
    region: 'Centre',
    country: 'Cameroun',
    logo: 'chu-yaounde-logo.png',
    type: OrganizationType.PUBLIC,
    specialties: ['Toutes spécialités', 'Urgences 24/7', 'Formation médicale'],
    website: 'https://www.chu-yaounde.cm',
    isActive: true,
    isVerified: true,
    latitude: 3.8265,
    longitude: 11.4998,
    rating: 4.3,
    totalReviews: 189, // Corrigé de reviewsCount à totalReviews
    registrationNumber: 'CHUY-2017-005',
    emergencyAvailable: true,
    insuranceAccepted: ['CNPS', 'Allianz', 'AXA', 'Mutuelle des fonctionnaires'],
    openingHours: '24/7',
    description: 'Centre hospitalier universitaire avec toutes les spécialités',
    createdAt: new Date('2017-09-05'),
    updatedAt: new Date('2023-08-20')
  },
  {
    id: '6',
    name: 'Hôpital Régional de Bafoussam',
    email: 'info@hr-bafoussam.cm',
    phone: '+237 233 33 12 45',
    address: 'Avenue des Chutes',
    city: 'Bafoussam',
    region: 'Ouest',
    country: 'Cameroun',
    logo: 'hr-bafoussam-logo.png',
    type: OrganizationType.PUBLIC,
    specialties: ['Médecine Générale', 'Pédiatrie', 'Urgences 24/7'],
    website: null,
    isActive: true,
    isVerified: true,
    latitude: 5.4769,
    longitude: 10.4182,
    rating: 3.7,
    totalReviews: 98, // Corrigé de reviewsCount à totalReviews
    registrationNumber: 'HRB-2019-006',
    emergencyAvailable: true,
    insuranceAccepted: ['CNPS'],
    openingHours: '24/7',
    description: 'Hôpital régional desservant la région de l\'Ouest',
    createdAt: new Date('2019-07-30'),
    updatedAt: new Date('2023-07-10')
  },
  {
    id: '7',
    name: 'Hôpital Ad Lucem de Mbouda',
    email: 'contact@adlucem-mbouda.cm',
    phone: '+237 233 33 56 78',
    address: 'Quartier Chefferie',
    city: 'Mbouda',
    region: 'Ouest',
    country: 'Cameroun',
    logo: 'adlucem-logo.png',
    type: OrganizationType.PRIVATE,
    specialties: ['Chirurgie', 'Gynécologie', 'Urgences'],
    website: 'https://www.adlucem-mbouda.cm',
    isActive: true,
    isVerified: false,
    latitude: 5.6363,
    longitude: 10.2548,
    rating: 3.9,
    totalReviews: 76, // Corrigé de reviewsCount à totalReviews
    registrationNumber: 'HALM-2020-007',
    emergencyAvailable: false,
    insuranceAccepted: ['Allianz', 'AXA'],
    openingHours: '08:00 - 18:00',
    description: 'Hôpital privé spécialisé en chirurgie et gynécologie',
    createdAt: new Date('2020-03-12'),
    updatedAt: new Date('2023-06-25')
  },
  {
    id: '8',
    name: 'Hôpital Protestant de Ngaoundéré',
    email: 'info@hpn-gaoundere.cm',
    phone: '+237 222 62 12 34',
    address: 'Quartier Djalingo',
    city: 'Ngaoundéré',
    region: 'Adamaoua',
    country: 'Cameroun',
    logo: 'hpn-logo.png',
    type: OrganizationType.PRIVATE,
    specialties: ['Médecine Interne', 'Pédiatrie', 'Urgences 24/7'],
    website: null,
    isActive: true,
    isVerified: true,
    latitude: 7.3158,
    longitude: 13.5785,
    rating: 3.6,
    totalReviews: 84, // Corrigé de reviewsCount à totalReviews
    registrationNumber: 'HPN-2021-008',
    emergencyAvailable: true,
    insuranceAccepted: ['CNPS', 'Mutuelle des fonctionnaires'],
    openingHours: '24/7',
    description: 'Hôpital protestant avec services de médecine interne et pédiatrie',
    createdAt: new Date('2021-10-08'),
    updatedAt: new Date('2023-08-01')
  }
];

// Schéma de validation pour la recherche
const searchSchema = z.object({
  query: z.string().min(1, 'Veuillez entrer un terme de recherche'),
});

type SearchFormData = z.infer<typeof searchSchema>;

// Schéma de validation pour la newsletter
const newsletterSchema = z.object({
  email: z.string().email('Veuillez entrer une adresse email valide'),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

// Composant Image avec fallback basé sur le contenu
interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  category?: Category | string;
  title?: string;
  [key: string]: any;
}

const SafeImage = ({ 
  src, 
  alt, 
  className, 
  category,
  title,
  ...props 
}: SafeImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  
  // Fonction pour obtenir une image placeholder basée sur la catégorie
  const getPlaceholderImage = (categoryName: string, itemTitle: string) => {
    // Images basées sur la catégorie
    const categoryImages: Record<string, string> = {
      'vaccination': 'https://images.unsplash.com/photo-1596495579954-90b1fe5a072a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'cancer': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'paludisme': 'https://images.unsplash.com/photo-1584999734482-03a1d9b6a5bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'santé maternelle': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'nutrition': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'diabète': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'hypertension': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'dépistage vih': 'https://images.unsplash.com/photo-1584999734482-03a1d9b6a5bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'planification familiale': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'hygiène': 'https://images.unsplash.com/photo-1584999734482-03a1d9b6a5bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    };;
    
    // Image par défaut
    const defaultImage = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    
    // Chercher une image basée sur la catégorie
    if (categoryName) {
      const lowerCategory = categoryName.toLowerCase();
      for (const [key, value] of Object.entries(categoryImages)) {
        if (lowerCategory.includes(key)) {
          return value;
        }
      }
    }
    
    return defaultImage;
  };
  
  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Utiliser une image placeholder basée sur la catégorie ou le titre
      const categoryName = typeof category === 'string' ? category : (category?.name || '');
      const fallbackImage = category 
        ? getPlaceholderImage(categoryName, title || '')
        : getPlaceholderImage('', title || '');
      setImgSrc(fallbackImage);
    }
  };
  
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default function HomePage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  // Références pour les sections
  const heroRef = useRef<HTMLDivElement>(null);
  const announcementsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const articlesRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const newsletterRef = useRef<HTMLDivElement>(null);

  // Formulaire de recherche
  const searchForm = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: '' },
  });

  // Formulaire de newsletter
  const newsletterForm = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '' },
  });

// Récupérer les dernières annonces avec fallback sur les données mock
const { data: announcementsData, isLoading: announcementsLoading } = useQuery({
  queryKey: ['announcements', 'featured', { limit: 8, status: 'PUBLISHED' }],
  queryFn: () => announcementsApi.getAnnouncements({ limit: 8, status: AnnouncementStatus.PUBLISHED }),
  staleTime: 1000 * 60 * 5, // 5 minutes
  // CORRECTION : La structure de initialData doit correspondre à la réponse de l'API
  initialData: {
    data: mockAnnouncements,
    meta: {
      total: mockAnnouncements.length,
      page: 1,
      limit: 8,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  },
});

// Récupérer les catégories avec fallback sur les données mock
const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
  queryKey: ['categories', 'active'],
  queryFn: () => categoriesApi.getCategories({ isActive: true }),
  staleTime: 1000 * 60 * 10, // 10 minutes
  // CORRECTION : La structure de initialData doit correspondre à la réponse de l'API
  initialData: {
    data: mockCategories,
    meta: {
      total: mockCategories.length,
      page: 1,
      limit: mockCategories.length, // ou une valeur par défaut
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  },
});

// Récupérer les articles récents avec fallback sur les données mock
const { data: articlesData, isLoading: articlesLoading } = useQuery({
  queryKey: ['articles', 'featured', { limit: 6, status: 'PUBLISHED' }],
  queryFn: () => articlesApi.getArticles({ limit: 6, status: ArticleStatus.PUBLISHED }),
  staleTime: 1000 * 60 * 5, // 5 minutes
  // CORRECTION : La structure de initialData doit correspondre à la réponse de l'API
  initialData: {
    data: mockArticles,
    meta: {
      total: mockArticles.length,
      page: 1,
      limit: 6,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  },
});

// Récupérer les hôpitaux pour la carte avec fallback sur les données mock
const { data: hospitalsData, isLoading: hospitalsLoading } = useQuery({
  queryKey: ['organizations', 'hospitals', { limit: 50 }],
  queryFn: () => organizationsApi.getOrganizations({ limit: 50 }),
  staleTime: 1000 * 60 * 10, // 10 minutes
  // Utilisation d'une assertion de type pour contourner le problème de type
  initialData: {
    data: mockHospitals as any, // Assertion de type pour contourner le problème
    meta: {
      total: mockHospitals.length,
      page: 1,
      limit: 50,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  },
});

  // Soumettre le formulaire de recherche
  const handleSearch = (data: SearchFormData) => {
    router.push(`/recherche?q=${encodeURIComponent(data.query)}`);
  };

  // Soumettre le formulaire de newsletter
  const handleNewsletterSubmit = async (data: NewsletterFormData) => {
    setIsSubscribing(true);
    try {
      // Simuler l'inscription à la newsletter
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Inscription à la newsletter réussie !');
      newsletterForm.reset();
    } catch (error) {
      toast.error('Erreur lors de l\'inscription à la newsletter');
    } finally {
      setIsSubscribing(false);
    }
  };

  // Fonction pour obtenir l'icône de catégorie
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

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  
  // Fonction pour générer une couleur basée sur le nom
const getAvatarColor = (name: string) => {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-red-500', 'bg-purple-500', 'bg-pink-500', 
    'bg-indigo-500', 'bg-teal-500'
  ];
  
  // Générer un index basé sur le nom pour une couleur cohérente
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// Fonction pour obtenir les initiales
const getInitials = (name: string) => {
  return name.split(' ').map(part => part.charAt(0)).join('').substring(0, 2).toUpperCase();
};
  // Fonction pour formater l'heure
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Fonction pour calculer le temps de lecture
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header / Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-linear-to-r from-teal-500 via-emerald-500 to-cyan-500 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-white p-1.5 sm:p-2 rounded-full shadow-2xl">
                    <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" strokeWidth={2.5} />
                  </div>
                </div>
                <span className="ml-2 sm:ml-3 text-lg sm:text-xl font-semibold text-gray-900">Info santé Cameroun</span>
              </Link>
            </div>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex space-x-6 lg:space-x-8">
              <Link href="/accueil" className="text-gray-900 hover:text-teal-600 font-medium transition-colors">Accueil</Link>
              <Link href="/annonces" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Campagnes</Link>
              <Link href="/articles" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Articles</Link>
              <Link href="/conseils" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Conseils</Link>
              <Link href="/hopitals" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Hopitaux</Link>
            </nav>

            {/* Boutons Connexion/Inscription Desktop */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              <Link href="/auth/connexion" className="px-3 lg:px-4 py-2 text-teal-600 font-medium hover:text-teal-700 transition-colors text-sm lg:text-base">Connexion</Link>
              <Link href="/auth/inscription" className="px-3 lg:px-4 py-2 bg-linear-to-r from-teal-500 via-emerald-500 to-cyan-600 text-white font-medium rounded-full hover:from-teal-600 hover:via-emerald-600 hover:to-cyan-700 transition-all text-sm lg:text-base">Inscription</Link>
            </div>

            {/* Menu Mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-teal-600 hover:bg-gray-100 focus:outline-none"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu Mobile Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-teal-600 hover:bg-gray-50">Accueil</Link>
              <Link href="/annonces" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50">Annonces</Link>
              <Link href="/articles" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50">Articles</Link>
              <Link href="/conseils" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50">Conseils</Link>
              <Link href="/hopitals" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50">Hopitaux</Link>
              <div className="pt-4 pb-2 border-t border-gray-200">
                <Link href="/auth/connexion" className="block px-3 py-2 rounded-md text-base font-medium text-teal-600 hover:text-teal-700 hover:bg-gray-50">Connexion</Link>
                <Link href="/auth/inscription" className="block px-3 py-2 mt-1 rounded-md text-base font-medium text-white bg-linear-to-r from-teal-500 via-emerald-500 to-cyan-600 hover:from-teal-600 hover:via-emerald-600 hover:to-cyan-700">Inscription</Link>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative mt-16 md:mt-20 bg-linear-to-br from-teal-600 via-blue-600 to-cyan-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column */}
            <div className="text-white">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                Toute l&apos;information sanitaire du Cameroun en un seul endroit
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-white/90">
                Recevez les alertes des campagnes de vaccination, dépistages et consultations gratuites près de chez vous.
              </p>
              
              {/* Search Bar */}
              <form onSubmit={searchForm.handleSubmit(handleSearch)} className="relative mb-6 sm:mb-8">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...searchForm.register('query')}
                    className="block w-full pl-12 pr-12 py-3 sm:py-4 text-gray-900 bg-white border border-gray-300 rounded-full shadow-lg focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 focus:outline-none text-sm sm:text-base"
                    placeholder="Rechercher..."
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <button
                      type="submit"
                      className="p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                      aria-label="Rechercher"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </form>

              {/* Suggestions populaires */}
              <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                <button
                  onClick={() => searchForm.setValue('query', 'Vaccination')}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors text-sm sm:text-base"
                >
                  💉 Vaccination
                </button>
                <button
                  onClick={() => searchForm.setValue('query', 'Dépistage VIH')}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors text-sm sm:text-base"
                >
                  🔬 Dépistage VIH
                </button>
                <button
                  onClick={() => searchForm.setValue('query', 'Consultation gratuite')}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors text-sm sm:text-base"
                >
                  🏥 Consultation gratuite
                </button>
              </div>

              {/* Stats Cards - CORRIGÉ POUR LE RESPONSIVE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="p-2 sm:p-3 bg-teal-100 rounded-lg sm:rounded-xl">
                      <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600" />
                    </div>
                    <div className="text-teal-600 text-xs sm:text-sm font-medium">+12%</div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">500+</p>
                  <p className="text-xs sm:text-sm text-gray-600">Annonces</p>
                </div>
                
                <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="p-2 sm:p-3 bg-blue-100 rounded-lg sm:rounded-xl">
                      <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <div className="text-blue-600 text-xs sm:text-sm font-medium">+8%</div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">200+</p>
                  <p className="text-xs sm:text-sm text-gray-600">Hôpitaux</p>
                </div>
                
                <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="p-2 sm:p-3 bg-purple-100 rounded-lg sm:rounded-xl">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                    </div>
                    <div className="text-purple-600 text-xs sm:text-sm font-medium">+25%</div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">50K+</p>
                  <p className="text-xs sm:text-sm text-gray-600">Utilisateurs</p>
                </div>
              </div>
            </div>

            {/* Right Column - Illustration */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-teal-400/20 to-blue-400/20 rounded-3xl blur-3xl"></div>
                <div className="relative transform -translate-y-4 transition-transform duration-500 hover:-translate-y-6">
                  <img
                    src="https://res.cloudinary.com/duqsblvzm/image/upload/v1765157251/logoHeader_f6pnu3.webp"
                    alt="Healthcare workers"
                    className="rounded-3xl shadow-2xl w-full h-[400px] lg:h-[500px] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dernières Annonces Section - CORRIGÉ POUR LE RESPONSIVE */}
      <section ref={announcementsRef} className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Dernières annonces</h2>
            <Link href="/annonces" className="text-teal-600 hover:text-teal-700 font-medium flex items-center text-sm sm:text-base whitespace-nowrap">
              Voir tout <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {/* Filtres rapides */}
          <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium transition-colors text-sm sm:text-base ${
                selectedCategory === null
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Toutes
            </button>
            {Array.isArray(categoriesData?.data) && categoriesData?.data.slice(0, 4).map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium transition-colors text-sm sm:text-base ${
                  selectedCategory === category.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {getCategoryIcon(category.name)} {category.name}
              </button>
            ))}
          </div>

          {/* Cartes d'annonces */}
          {announcementsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
          ) : !Array.isArray(announcementsData?.data) || announcementsData?.data.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-8 sm:p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune campagne pour le moment</h3>
              <p className="text-gray-600 mb-6">Revenez plus tard pour découvrir les nouvelles campagnes de santé.</p>
              <Link href="/categories" className="inline-flex items-center px-4 py-2 bg-teal-600 text-white font-medium rounded-full hover:bg-teal-700 transition-colors">
                Explorer les catégories
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {announcementsData?.data.map((announcement) => (
                <motion.div
                  key={announcement.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="relative">
                    <img
                      src={getCloudinaryImageUrl(announcement.featuredImage, { width: 400, height: 225, crop: 'fill' })}
                      alt={announcement.title}
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2">
                      <Bookmark className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                    </div>
                    <div className="absolute top-2 left-2 bg-teal-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                      {getCategoryIcon(announcement.category?.name || '')} {announcement.category?.name}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base">{announcement.title}</h3>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {announcement.location?.city}, {announcement.location?.region}
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {formatDate(announcement.startDate)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-medium text-teal-600">
                        {announcement.isFree ? 'Gratuit' : `${announcement.cost} XAF`}
                      </span>
                      <div className="flex items-center text-xs sm:text-sm text-gray-500">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {announcement.viewsCount}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-6 sm:mt-8">
            <Link href="/annonces" className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-teal-500 via-emerald-500 to-cyan-600 text-white font-medium rounded-full hover:from-teal-600 hover:via-emerald-600 hover:to-cyan-700 transition-all text-sm sm:text-base">
              Voir toutes les annonces
            </Link>
          </div>
        </div>
      </section>

{/* section categories - CORRIGÉ POUR LE RESPONSIVE */}
<section ref={categoriesRef} className="py-12 sm:py-16 lg:py-20 bg-linear-to-br from-gray-50 to-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-8 sm:mb-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Explorez par catégorie</h2>
      <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
        Découvrez nos campagnes de santé organisées par catégorie pour trouver facilement ce qui vous intéresse
      </p>
    </div>

    {categoriesLoading ? (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {Array.isArray(categoriesData?.data) && categoriesData?.data.slice(0, 10).map((category) => (
          <motion.div
            key={category.id}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            {/* Arrière-plan dégradé au survol */}
            <div className={`absolute inset-0 bg-linear-to-br ${getCategoryColor(category.name)} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Conteneur de l'icône */}
              <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br ${getCategoryColor(category.name)} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 text-white shadow-lg group-hover:shadow-2xl transition-shadow`}>
                <span className="text-3xl sm:text-4xl">{getCategoryIcon(category)}</span>
              </div>
              
              {/* Nom de la catégorie */}
              <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base lg:text-lg">{category.name}</h3>
              
              {/* Nombre de campagnes */}
              <div className="flex items-center text-xs sm:text-sm text-gray-500">
                <span className="font-medium text-teal-600">{category.announcementsCount}</span>
                <span className="mx-1">•</span>
                <span>campagnes</span>
              </div>
              
              {/* Description de la catégorie */}
              <p className="text-xs text-gray-500 mt-1 line-clamp-2 hidden sm:block">{category.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    )}
    
    <div className="text-center mt-8 sm:mt-12">
      <Link href="/categories" className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-teal-500 via-emerald-500 to-cyan-600 text-white font-medium rounded-full hover:from-teal-600 hover:via-emerald-600 hover:to-cyan-700 transition-all text-sm sm:text-base">
        Voir toutes les catégories
      </Link>
    </div>
  </div>
</section>


      {/* Articles de Santé Section - CORRIGÉ POUR LE RESPONSIVE */}
      <section ref={articlesRef} className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Articles de santé récents</h2>
            <Link href="/articles" className="text-teal-600 hover:text-teal-700 font-medium flex items-center text-sm sm:text-base whitespace-nowrap">
              Voir tous <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {articlesLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
          ) : !Array.isArray(articlesData?.data) || articlesData?.data.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-8 sm:p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun article pour le moment</h3>
              <p className="text-gray-600 mb-6">Revenez plus tard pour découvrir les nouveaux articles de santé.</p>
              <Link href="/categories" className="inline-flex items-center px-4 py-2 bg-teal-600 text-white font-medium rounded-full hover:bg-teal-700 transition-colors">
                Explorer les catégories
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {articlesData?.data.map((article) => (
                <motion.div
                  key={article.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="relative">
                    <img
                      src={getCloudinaryImageUrl(article.featuredImage, { width: 400, height: 225, crop: 'fill' })}
                      alt={article.title}
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                      {article.category?.name}
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base">{article.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base">{article.excerpt}</p>
                    <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-500 mb-4 gap-x-2 gap-y-1">
                      <div className="w-6 h-6 bg-gray-200 rounded-full mr-1"></div>
                      <span>{article.author}</span>
                      <span className="mx-1">•</span>
                      <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                      <span className="mx-1">•</span>
                      <span>{article.readingTime || calculateReadingTime(article.content)} min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {article.viewsCount}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {article.commentsCount}
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {article.reactionsCount}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Carte Interactive Section - CORRIGÉ POUR LE RESPONSIVE */}
      <section ref={mapRef} className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">Trouvez un hôpital près de chez vous</h2>

          <div className="relative bg-gray-100 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg" style={{ height: '400px', minHeight: '300px' }}>
            <LeafletMap hospitals={mockHospitals} />
                  
            {/* Filtres */}
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2 z-10">
              <div className="flex flex-col space-y-2">
                <button className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors">
                  Public
                </button>
                <button className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors">
                  Privé
                </button>
                <button className="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-800 rounded hover:bg-orange-200 transition-colors">
                  Urgences 24/7
                </button>
              </div>
            </div>

            {/* Barre de recherche */}
            <div className="absolute top-4 left-4 right-20 sm:right-auto sm:left-4 z-10">
              <div className="bg-white rounded-lg shadow-md p-2 flex">
                <input
                  type="text"
                  placeholder="Rechercher une ville..."
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base flex-1"
                />
                <button className="px-3 sm:px-4 py-2 bg-teal-600 text-white rounded-r-lg hover:bg-teal-700 transition-colors">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>

            {/* Bouton de localisation */}
            <div className="absolute bottom-4 right-4 z-10">
              <button className="p-2 sm:p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow" aria-label="Ma position">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600" />
              </button>
            </div>
          </div>

          <div className="text-center mt-6 sm:mt-8">
            <Link href="/hopitals" className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-teal-600 font-medium rounded-full border border-teal-600 hover:bg-teal-50 transition-colors text-sm sm:text-base">
              Voir tous les hôpitaux
            </Link>
          </div>
        </div>
      </section>

      {/* Témoignages Section - CORRIGÉ POUR LE RESPONSIVE */}
      <section ref={testimonialsRef} className="py-12 sm:py-16 lg:py-20 bg-linear-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">Ce qu&apos;ils disent de nous</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { 
                name: "Marie K.", 
                city: "Douala", 
                text: "Grâce à cette app, j'ai pu vacciner mes enfants à temps. Les alertes sont très utiles !" 
              },
              { 
                name: "Paul N.", 
                city: "Yaoundé", 
                text: "J'ai été informé de la campagne de dépistage du VIH. Très pratique!" 
              },
              { 
                name: "Sophie D.", 
                city: "Bafoussam", 
                text: "Application très utile pour trouver un hôpital près de chez moi!" 
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic text-sm sm:text-base">
                  {testimonial.text}
                </p>
                <div className="flex items-center">
                  {/* Avatar avec initiales */}
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${getAvatarColor(testimonial.name)} rounded-full flex items-center justify-center text-white font-semibold mr-3 sm:mr-4 text-sm sm:text-base`}>
                    {getInitials(testimonial.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{testimonial.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section (CTA) - CORRIGÉ POUR LE RESPONSIVE */}
      <section ref={newsletterRef} className="py-12 sm:py-16 lg:py-20 bg-linear-to-br from-teal-600 to-teal-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Mail className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Restez informé des dernières campagnes</h2>
            <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Inscrivez-vous à notre newsletter pour recevoir les alertes de santé directement dans votre boîte mail
            </p>

            <form onSubmit={newsletterForm.handleSubmit(handleNewsletterSubmit)} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
              <input
                type="email"
                {...newsletterForm.register('email')}
                placeholder="Votre adresse email..."
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="px-4 sm:px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                {isSubscribing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'S\'inscrire'}
              </button>
            </form>

            <div className="flex justify-center mt-6 space-x-4 sm:space-x-6 text-sm text-white/80">
              <div className="flex items-center">
                <span className="mr-2">✓</span> Gratuit
              </div>
              <div className="flex items-center">
                <span className="mr-2">✓</span> Sans spam
              </div>
              <div className="flex items-center">
                <span className="mr-2">✓</span> Désabonnement facile
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - CORRIGÉ POUR LE RESPONSIVE */}
      <footer className="bg-gray-900 text-white py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Column 1 - Logo */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-linear-to-r from-teal-500 via-emerald-500 to-cyan-500 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-white p-2 rounded-full shadow-2xl">
                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" strokeWidth={2.5} />
                  </div>
                </div>
                <span className="ml-2 text-lg sm:text-xl font-semibold">Info santé Cameroun</span>
              </div>
              <p className="text-gray-400 mb-4 text-sm sm:text-base">Votre santé, notre priorité 🇨🇲</p>
            </div>

            {/* Column 2 - Navigation */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Accueil</Link></li>
                <li><Link href="/campagnes" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Campagnes</Link></li>
                <li><Link href="/articles" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Articles</Link></li>
                <li><Link href="/carte" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Carte</Link></li>
                <li><Link href="/hopitaux" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Hôpitaux</Link></li>
              </ul>
            </div>

            {/* Column 3 - Ressources */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Ressources</h3>
              <ul className="space-y-2">
                <li><Link href="/a-propos" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">À propos</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">FAQ</Link></li>
                <li><Link href="/cgu" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">CGU</Link></li>
                <li><Link href="/confidentialite" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Confidentialité</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Contact</Link></li>
              </ul>
            </div>

            {/* Column 4 - Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-400">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  <span className="text-sm sm:text-base">contact@healthinfo.cm</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  <span className="text-sm sm:text-base">+237 656 446 611/ +237 682 470 529</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  <span className="text-sm sm:text-base">Douala, Cameroun</span>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Suivez-nous</h4>
                <div className="flex space-x-3 sm:space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 Health Info Cameroun. Tous droits réservés.</p>
            <p>Fait avec ❤️ au Cameroun</p>
          </div>
        </div>
      </footer>
    </div>
  );
}