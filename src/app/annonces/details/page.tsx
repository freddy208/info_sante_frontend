/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  Settings, 
  Bookmark, 
  Share2,
  MapPin,
  Calendar,
  Clock,
  Users,
  Eye,
  MessageCircle,
  Heart,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  MoreVertical,
  X,
  Phone,
  Globe,
  AlertTriangle,
  User,
  Send,
  Loader2,
  ChevronRight,
  BarChart3,
  Target,
  Info,
  CheckCircle,
  AlertCircle,
  FileText,
  Building,
  Navigation,
  Bell
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getCloudinaryImageUrl } from '@/lib/cloudinary';
import { AnnouncementStatus, TargetAudience } from '@/types/announcement';
import { Category } from '@/types/category';

// Données mock pour l'annonce
const mockAnnouncement = {
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
  ,
};

// Données mock pour les commentaires
const mockComments = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Marie Kamga',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    content: 'Excellente initiative! J\'ai pu vacciner mes deux enfants. Merci à l\'équipe médicale pour leur professionnalisme.',
    createdAt: new Date('2025-03-13T14:30:00'),
    reactionsCount: 12,
    replies: [
      {
        id: '1-1',
        userId: 'user2',
        userName: 'Dr. Kamga',
        userAvatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        content: 'Merci beaucoup pour votre retour! Nous sommes ravis d\'avoir pu vous aider.',
        createdAt: new Date('2025-03-13T16:45:00'),
        reactionsCount: 3,
      }
    ]
  },
  {
    id: '2',
    userId: 'user3',
    userName: 'Paul Nkolo',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    content: 'Très bien organisé. Personnel attentionné et lieu propre. Je recommande vivement.',
    createdAt: new Date('2025-03-14T09:15:00'),
    reactionsCount: 8,
    replies: []
  },
  {
    id: '3',
    userId: 'user4',
    userName: 'Sophie Fon',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    content: 'Le seul inconvénient est le temps d\'attente, mais sinon tout était parfait.',
    createdAt: new Date('2025-03-14T11:20:00'),
    reactionsCount: 5,
    replies: []
  }
];

// Données mock pour les campagnes similaires
const mockSimilarCampaigns = [
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
];

// Composant pour la section d'image hero
function HeroImageSection({ 
  announcement, 
  isBookmarked, 
  onBookmarkToggle, 
  onShare, 
  onOptions 
}: { 
  announcement: any; 
  isBookmarked: boolean; 
  onBookmarkToggle: () => void; 
  onShare: () => void; 
  onOptions: () => void;
}) {
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

  const getStatusBadge = () => {
    const fillPercentage = Math.round((announcement.registeredCount / announcement.capacity) * 100);
    
    if (fillPercentage >= 100) {
      return { text: 'Complet', bgColor: 'bg-red-500', icon: '🔴' };
    } else if (new Date(announcement.startDate) > new Date()) {
      return { text: 'Bientôt', bgColor: 'bg-blue-500', icon: '⏰' };
    } else {
      return { text: 'Places disponibles', bgColor: 'bg-green-500', icon: '🟢' };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="relative h-80 sm:h-96">
      <img
        src={getCloudinaryImageUrl(announcement.featuredImage, { width: 800, height: 400, crop: 'fill' })}
        alt={announcement.title}
        className="w-full h-full object-cover"
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
      
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <button
          onClick={() => window.history.back()}
          className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onBookmarkToggle}
            className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={onShare}
            className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <Share2 className="h-5 w-5" />
          </button>
          <button
            onClick={onOptions}
            className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Category badge */}
      <div className="absolute bottom-10 left-4">
        <div className="flex items-center px-4 py-2 bg-white/95 backdrop-blur-md rounded-full shadow-xl">
          <div className="w-6 h-6 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-2">
            <span className="text-white text-xs">{getCategoryIcon(announcement.category?.name || '')}</span>
          </div>
          <span className="text-gray-800 font-medium text-sm">{announcement.category?.name}</span>
        </div>
      </div>

      {/* Status badge */}
      <div className="absolute bottom-10 right-4" >
        <div className={`flex items-center px-4 py-2 ${statusBadge.bgColor} rounded-full shadow-xl`}>
          <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-2">
            <span className="text-white text-xs">{statusBadge.icon}</span>
          </div>
          <span className="text-white font-medium text-sm">{statusBadge.text}</span>
        </div>
      </div>
    </div>
  );
}

// Composant pour la section de contenu
function ContentSection({ 
  announcement, 
  isExpanded, 
  onToggleExpanded 
}: { 
  announcement: any; 
  isExpanded: boolean; 
  onToggleExpanded: () => void;
}) {
  const fillPercentage = Math.round((announcement.registeredCount / announcement.capacity) * 100);
  const daysUntilEvent = Math.ceil((new Date(announcement.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const hoursUntilEvent = Math.ceil((new Date(announcement.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60));
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  
  const registrationDeadline = new Date(new Date(announcement.startDate).getTime() - 24 * 60 * 60 * 1000);

  const daysUntilDeadline = Math.floor((registrationDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const getTargetAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'CHILDREN': return '👶';
      case 'INFANTS': return '👶';
      case 'ADULTS': return '👤';
      case 'ELDERLY': return '👴';
      case 'PREGNANT_WOMEN': return '🤰';
      default: return '👥';
    }
  };

  const getTargetAudienceLabel = (audience: string) => {
    switch (audience) {
      case 'CHILDREN': return 'Enfants';
      case 'INFANTS': return 'Nourrissons';
      case 'ADULTS': return 'Adultes';
      case 'ELDERLY': return 'Personnes âgées';
      case 'PREGNANT_WOMEN': return 'Femmes enceintes';
      default: return 'Tous';
    }
  };

  return (
    <div className="bg-white rounded-t-3xl -mt-8 relative z-10 p-6 sm:p-8 shadow-lg">
      {/* Title & Basic Info */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
          {announcement.title}
        </h1>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center px-4 py-2 bg-green-50 text-green-800 rounded-full">
            <span className="mr-2">✓</span>
            <span className="font-medium">Gratuit</span>
          </div>
          <div className="flex items-center px-4 py-2 bg-green-50 text-green-800 rounded-full">
            <span className="mr-2">👥</span>
            <span className="font-medium">{announcement.capacity} places</span>
          </div>
        </div>
      </div>

     {/* Hospital Info */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="bg-linear-to-r from-blue-500 to-teal-600 p-4">
        <h3 className="font-semibold text-white flex items-center text-lg">
          <Building className="h-5 w-5 mr-2" />
          Informations sur l&apos;établissement
        </h3>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
          <div className="w-16 h-16 bg-gray-100 rounded-full mr-4 shrink-0 overflow-hidden"> 
              <img
                src={getCloudinaryImageUrl(announcement.organization.logo, { width: 64, height: 64, crop: 'fill' })} // Ajustez la taille si nécessaire
                alt={announcement.organization.name}
                className="w-full h-full object-cover" // <-- MODIFIEZ ICI
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{announcement.organization.name}</h3>
              <div className="flex items-center mt-1">
                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg mr-3">
                  <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                  <span className="text-sm font-medium text-gray-700">{announcement.organization.rating}</span>
                </div>
                <span className="text-sm text-gray-600">({announcement.organization.totalReviews} avis)</span>
              </div>
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <Building className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Type d&apos;établissement</p>
              <p className="text-sm text-gray-600">Hôpital Public</p>
            </div>
          </div>
          
          {announcement.organization.emergencyAvailable && (
            <div className="flex items-center p-3 bg-red-50 rounded-lg">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Services d&apos;urgence</p>
                <p className="text-sm text-gray-600">Disponible 24/7</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex items-center p-3 bg-gray-50 rounded-lg">
          <Phone className="h-5 w-5 text-gray-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900">Contact</p>
            <p className="text-sm text-gray-600">{announcement.organization.phone}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Date & Time */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="bg-linear-to-r from-purple-500 to-indigo-600 p-4">
        <h3 className="font-semibold text-white flex items-center text-lg">
          <Calendar className="h-5 w-5 mr-2" />
          Date & Heure
        </h3>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div className="mb-4 sm:mb-0">
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Date de l&apos;événement</p>
                <p className="font-semibold text-gray-900 text-lg">
                  {formatDate(announcement.startDate)}
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Heure</p>
                <p className="font-semibold text-gray-900 text-lg">
                  {formatTime(announcement.startDate)} - {formatTime(announcement.endDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {daysUntilEvent > 0 && (
          <div className="bg-linear-to-r from-purple-50 to-indigo-50 rounded-lg p-4 mb-6 border border-purple-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-900">L&apos;événement commence dans</p>
                <div className="flex items-center mt-1">
                  <span className="text-2xl font-bold text-purple-900">{daysUntilEvent}</span>
                  <span className="text-lg font-medium text-purple-700 ml-2">
                    jour{daysUntilEvent > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center">
            <Calendar className="h-4 w-4 mr-2" />
            Ajouter au calendrier
          </button>
          <button className="flex-1 px-4 py-3 bg-white text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium flex items-center justify-center">
            <Bell className="h-4 w-4 mr-2" />
            Me rappeler
          </button>
        </div>
      </div>
    </div>

      
      {/* Location */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="bg-linear-to-r from-blue-500 to-teal-600 p-4">
          <h3 className="font-semibold text-white flex items-center text-lg">
            <MapPin className="h-5 w-5 mr-2" />
            Localisation
          </h3>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-start mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 shrink-0">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-lg">{announcement.organization.name}</h4>
                <p className="text-gray-600 mt-1">{announcement.location.address}</p>
                <p className="text-gray-600">{announcement.location.city}, {announcement.location.region}</p>
              </div>
            </div>
            
            <div className="flex items-center mt-3">
              <Phone className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">{announcement.organization.phone}</span>
            </div>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-md mb-4">
            <div className="relative h-64 bg-gray-100">
              {/* Carte statique avec OpenStreetMap (gratuit et sans clé API) */}
              <img 
                src={`https://staticmap.openstreetmap.de/staticmap.php?center=${announcement.location.latitude},${announcement.location.longitude}&zoom=15&size=600x400&maptype=mapnik&markers=${announcement.location.latitude},${announcement.location.longitude},red`}
                alt="Carte de localisation"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback si l'image de la carte ne charge pas
                  // Utilisation d'une image de carte générique et valide
                  e.currentTarget.src = "https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
                }}
              />
              
              <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 bg-white rounded-lg p-2 shadow-md">
                <p className="text-sm font-medium text-gray-900 flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-blue-600" />
                  {announcement.location.city}, {announcement.location.region}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center">
              <MapPin className="h-4 w-4 mr-2" />
              Ouvrir dans Maps
            </button>
            <button className="flex-1 px-4 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center justify-center">
              <Navigation className="h-4 w-4 mr-2" />
              Obtenir l&apos;itinéraire
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <h3 className="font-semibold text-gray-900 text-lg">Description complète</h3>
      </div>
      
      <div className="relative bg-slate-50 rounded-lg p-5 overflow-hidden">
        <div className={`text-gray-700 leading-relaxed transition-all duration-300 ${isExpanded ? '' : 'line-clamp-4'}`}>
          {announcement.content.split('\n').map((paragraph: string, index: number) => (
            <p key={index} className={index > 0 ? 'mt-3' : ''}>
              {paragraph}
            </p>
          ))}
        </div>
        
        {/* Effet de fondu pour indiquer qu'il y a plus de contenu */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-slate-50 to-transparent pointer-events-none"></div>
        )}
      </div>
      
      <button
        onClick={onToggleExpanded}
        className="mt-4 px-4 py-2 bg-teal-50 text-teal-700 font-medium rounded-lg border border-teal-200 hover:bg-teal-100 transition-all duration-200 flex items-center mx-auto"
      >
        {isExpanded ? (
          <>
            Réduire <ChevronUp className="h-4 w-4 ml-1" />
          </>
        ) : (
          <>
            Afficher plus <ChevronDown className="h-4 w-4 ml-1" />
          </>
        )}
      </button>
    </div>

      {/* Target Audience */}
      {/* Target Audience */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
            <Target className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">Public cible</h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {announcement.targetAudience.map((audience: string) => (
            <div
              key={audience}
              className="group flex flex-col items-center justify-center p-4 bg-linear-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                <span className="text-2xl">{getTargetAudienceIcon(audience)}</span>
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">{getTargetAudienceLabel(audience)}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-700 flex items-start">
            <Info className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
            Cette campagne est spécifiquement conçue pour les groupes mentionnés ci-dessus.
          </p>
        </div>
      </div>

      {/* Registration Info */}
      {/* Registration Info */}
      {announcement.requiresRegistration && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="bg-linear-to-r from-teal-500 to-blue-600 p-4">
            <h3 className="font-semibold text-white flex items-center text-lg">
              <Users className="h-5 w-5 mr-2" />
              Informations d&apos;inscription
            </h3>
          </div>
          
          <div className="p-6">
            {/* Availability Status */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Places disponibles</span>
                <span className={`text-sm font-bold ${fillPercentage > 80 ? 'text-orange-600' : 'text-green-600'}`}>
                  {announcement.capacity - announcement.registeredCount} / {announcement.capacity}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    fillPercentage > 80 ? 'bg-linear-to-r from-orange-400 to-orange-600' : 'bg-linear-to-r from-green-400 to-green-600'
                  }`}
                  style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                {announcement.registeredCount} personne{announcement.registeredCount > 1 ? 's' : ''} déjà inscrite{announcement.registeredCount > 1 ? 's' : ''}
              </p>
            </div>

            {/* Registration Deadline */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                  <Calendar className="h-5 w-5 text-teal-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">Date limite d&apos;inscription</h4>
                  <p className="text-sm text-gray-600">{formatDate(registrationDeadline)} à 18h00</p>
                  {daysUntilDeadline > 0 ? (
                    <div className="mt-2 flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-orange-500" />
                      <span className="text-sm font-medium text-orange-600">
                        Il reste {daysUntilDeadline} jour{daysUntilDeadline > 1 ? 's' : ''}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                      <span className="text-sm font-medium text-red-600">Date limite dépassée</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Registration Button */}
            {daysUntilDeadline > 0 && announcement.capacity > announcement.registeredCount && (
              <button className="w-full py-3 bg-linear-to-r from-teal-600 to-blue-600 text-white rounded-lg font-medium hover:from-teal-700 hover:to-blue-700 transition-all shadow-md">
                S&apos;inscrire maintenant
              </button>
            )}
            
            {daysUntilDeadline <= 0 && (
              <div className="w-full py-3 bg-gray-200 text-gray-500 rounded-lg font-medium text-center cursor-not-allowed">
                Les inscriptions sont closes
              </div>
            )}
            
            {announcement.capacity <= announcement.registeredCount && daysUntilDeadline > 0 && (
              <div className="w-full py-3 bg-orange-100 text-orange-700 rounded-lg font-medium text-center">
                Complet
              </div>
            )}
          </div>
        </div>
      )}

      {/* Statistics */}
      {/* Statistics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">Statistiques de la campagne</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-xl p-4 text-center hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{announcement.viewsCount}</p>
            <p className="text-sm text-gray-600">Vues</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 text-center hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{announcement.commentsCount}</p>
            <p className="text-sm text-gray-600">Commentaires</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 text-center hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{announcement.reactionsCount}</p>
            <p className="text-sm text-gray-600">Intéressés</p>
          </div>
        </div>
        
        {/* Additional statistics visualization */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Taux d&apos;engagement</span>
            <span className="text-sm font-semibold text-gray-900">
              {Math.round(((announcement.commentsCount + announcement.reactionsCount) / announcement.viewsCount) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-linear-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(((announcement.commentsCount + announcement.reactionsCount) / announcement.viewsCount) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Share Section */}
      <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
            <Share2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">Partager cette campagne</h3>
            <p className="text-sm text-gray-600">Aidez-nous à informer plus de personnes!</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
          <button className="group flex flex-col items-center justify-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-all duration-200 transform hover:-translate-y-1">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.162 5.656a8.384 8.384 0 01-2.402.658A4.196 4.196 0 0021.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 00-7.126 3.814 11.874 11.874 0 01-8.62-4.37 4.168 4.168 0 00-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 01-1.894-.523v.052a4.185 4.185 0 003.355 4.101 4.21 4.21 0 01-1.89.072A4.185 4.185 0 007.97 16.65a8.394 8.394 0 01-6.191 1.732 11.83 11.83 0 006.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 002.087-2.165z"/>
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-700">WhatsApp</span>
          </button>
          
          <button className="group flex flex-col items-center justify-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-200 transform hover:-translate-y-1">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-700">Facebook</span>
          </button>
          
          <button className="group flex flex-col items-center justify-center p-3 bg-sky-50 rounded-xl hover:bg-sky-100 transition-all duration-200 transform hover:-translate-y-1">
            <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-700">Twitter</span>
          </button>
          
          <button className="group flex flex-col items-center justify-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-200 transform hover:-translate-y-1">
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-700">LinkedIn</span>
          </button>
          
          <button className="group flex flex-col items-center justify-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:-translate-y-1">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-700">E-mail</span>
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4 flex items-center">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Lien de la campagne</p>
            <div className="flex items-center">
              <input
                type="text"
                value={`https://healthinfo.cm/annonces/${announcement.slug}`}
                readOnly
                className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                className="ml-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm font-medium"
                onClick={() => {
                  navigator.clipboard.writeText(`https://healthinfo.cm/annonces/${announcement.slug}`);
                  // You could add a toast notification here
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copier
              </button>
            </div>
          </div>
        </div>
      </div>
        {/* Similar Campaigns */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="mr-2 text-2xl">🔍</span>
              Campagnes similaires
            </h3>
            <button className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">
              Voir tout
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSimilarCampaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                {/* Image with category badge */}
                <div className="relative">
                  <img
                    src={getCloudinaryImageUrl(campaign.featuredImage, { width: 400, height: 200, crop: 'fill' })}
                    alt={campaign.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center text-xs font-medium text-gray-700">
                    <span className="mr-1">
                      {campaign.category.name === 'Diabète' ? '🩺' : 
                      campaign.category.name === 'Hypertension' ? '❤️' : 
                      campaign.category.name === 'Nutrition Infantile' ? '🥗' : 
                      campaign.category.name === 'Vaccination' ? '💉' : '🔬'}
                    </span>
                    {campaign.category.name}
                  </div>
                  {campaign.isFree && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full px-3 py-1 text-xs font-medium">
                      Gratuit
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  {/* Organization info */}
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full mr-2 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {campaign.organization.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">{campaign.organization.name}</span>
                  </div>
                  
                  {/* Title */}
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{campaign.title}</h4>
                  
                  {/* Excerpt */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{campaign.excerpt}</p>
                  
                  {/* Date and location */}
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{new Date(campaign.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    {campaign.endDate !== campaign.startDate && (
                      <> - {new Date(campaign.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{campaign.location.address}, {campaign.location.city}</span>
                  </div>
                  
                  {/* Target audience */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {campaign.targetAudience.map((audience, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {audience === TargetAudience.ADULTS ? 'Adultes' :
                        audience === TargetAudience.CHILDREN ? 'Enfants' :
                        audience === TargetAudience.ELDERLY ? 'Personnes âgées' :
                        audience === TargetAudience.INFANTS ? 'Nourrissons' :
                        audience === TargetAudience.TEENAGERS ? 'Adolescents' :
                        audience === TargetAudience.FAMILIES ? 'Familles' :
                        audience === TargetAudience.PREGNANT_WOMEN ? 'Femmes enceintes' :
                        audience === TargetAudience.HEALTHCARE_WORKERS ? 'Professionnels de santé' :
                        audience === TargetAudience.TEACHERS ? 'Enseignants' :
                        audience === TargetAudience.STUDENTS ? 'Étudiants' : audience}
                      </span>
                    ))}
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{campaign.registeredCount}/{campaign.capacity}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Heart className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{campaign.reactionsCount}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MessageCircle className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{campaign.commentsCount}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action button */}
                  <button className="w-full mt-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors">
                    {campaign.requiresRegistration ? "S'inscrire" : "Voir les détails"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}

// Composant pour la section des commentaires
function CommentsSection({ 
  comments, 
  onAddComment, 
  onReplyComment 
}: { 
  comments: any[]; 
  onAddComment: (content: string) => void; 
  onReplyComment: (commentId: string, content: string) => void;
}) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  
  // Fonction pour nettoyer et formater les noms d'utilisateurs
  const formatUserName = (name: string) => {
    // Supprimer les doublons potentiels (ex: "Marie Kamga Kamga" → "Marie Kamga")
    const nameParts = name.split(' ');
    const uniqueParts = [...new Set(nameParts)];
    return uniqueParts.join(' ');
  };
  
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return interval + " ans";
    
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + " mois";
    
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return interval + " jours";
    
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return interval + " heures";
    
    interval = Math.floor(seconds / 60);
    if (interval > 1) return interval + " minutes";
    
    return "à l'instant";
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const handleReplyComment = () => {
    if (replyingTo && replyContent.trim()) {
      onReplyComment(replyingTo, replyContent);
      setReplyingTo(null);
      setReplyContent('');
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900 flex items-center text-lg">
          <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
          Commentaires ({comments.length})
        </h3>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-2">Trier par:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm font-medium text-gray-900 bg-transparent border-0 focus:outline-none focus:ring-0 cursor-pointer"
          >
            <option value="recent">Plus récents</option>
            <option value="popular">Plus populaires</option>
          </select>
        </div>
      </div>
      
      {/* Add Comment Box */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex items-start">
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-teal-600 rounded-full mr-3 flex items-center justify-center text-white font-semibold">
            {'U'}
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              rows={3}
            ></textarea>
            <div className="flex justify-between mt-2">
              <div className="text-sm text-gray-500">
                Appuyez sur Entrée pour envoyer
              </div>
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-linear-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all flex items-center shadow-sm"
              >
                <Send className="h-4 w-4 mr-2" />
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0">
            <div className="flex items-start">
              <img
                src={comment.userAvatar}
                alt={comment.userName}
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900">{formatUserName(comment.userName)}</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{formatTimeAgo(comment.createdAt)}</span>
                    <button className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{comment.content}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                  <button className="flex items-center hover:text-teal-600 transition-colors group">
                    <Heart className="h-4 w-4 mr-1 group-hover:fill-current" />
                    <span>{comment.reactionsCount}</span>
                  </button>
                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    className="flex items-center hover:text-teal-600 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span>Répondre</span>
                  </button>
                  <button className="flex items-center hover:text-teal-600 transition-colors">
                    <Share2 className="h-4 w-4 mr-1" />
                    <span>Partager</span>
                  </button>
                </div>
                
                {/* Reply Box */}
                {replyingTo === comment.id && (
                  <div className="bg-gray-50 rounded-lg p-3 mt-3">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-teal-600 rounded-full mr-3 flex items-center justify-center text-white text-sm font-semibold">
                        {'U'}
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Répondre à ce commentaire..."
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm transition-all"
                          rows={2}
                        ></textarea>
                        <div className="flex justify-end mt-2 space-x-2">
                          <button
                            onClick={() => setReplyingTo(null)}
                            className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={handleReplyComment}
                            className="px-3 py-1 bg-linear-to-r from-teal-600 to-blue-600 text-white rounded hover:from-teal-700 hover:to-blue-700 transition-all text-sm"
                          >
                            Répondre
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {comment.replies.map((reply: any) => (
                      <div key={reply.id} className="flex items-start bg-gray-50 rounded-lg p-3">
                        <img
                          src={reply.userAvatar}
                          alt={reply.userName}
                          className="w-8 h-8 rounded-full mr-3 object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-medium text-gray-900 text-sm">{formatUserName(reply.userName)}</h5>
                            <div className="flex items-center text-sm text-gray-500">
                              <span>{formatTimeAgo(reply.createdAt)}</span>
                              <button className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors">
                                <MoreVertical className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 text-sm">{reply.content}</p>
                          
                          <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
                            <button className="flex items-center hover:text-teal-600 transition-colors group">
                              <Heart className="h-3 w-3 mr-1 group-hover:fill-current" />
                              <span>{reply.reactionsCount}</span>
                            </button>
                            <button className="flex items-center hover:text-teal-600 transition-colors">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              <span>Répondre</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Load More Comments */}
      <div className="text-center mt-8">
        <button className="px-6 py-3 bg-white text-teal-600 font-medium rounded-full border border-teal-600 hover:bg-teal-50 transition-all shadow-sm">
          Charger plus de commentaires (40)
        </button>
      </div>
    </div>
  );
}

// Composant pour la barre CTA sticky
function StickyCTA({ 
  announcement, 
  isInterested, 
  onInterestToggle, 
  onNotifyWhenAvailable 
}: { 
  announcement: any; 
  isInterested: boolean; 
  onInterestToggle: () => void; 
  onNotifyWhenAvailable: () => void;
}) {
  const fillPercentage = Math.round((announcement.registeredCount / announcement.capacity) * 100);
  const isPast = new Date(announcement.endDate) < new Date();
  const isFull = fillPercentage >= 100;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-3xl mx-auto px-4 py-4 safe-area-inset-bottom">
        <div className="flex items-center justify-between">
          <button
            onClick={onInterestToggle}
            className={`p-3 rounded-full ${
              isInterested 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-600'
            } transition-colors`}
          >
            {isInterested ? (
              <Check className="h-5 w-5" />
            ) : (
              <Star className="h-5 w-5" />
            )}
          </button>
          
          <div className="flex-1 mx-4">
            {isPast ? (
              <button
                disabled
                className="w-full px-4 py-3 bg-gray-200 text-gray-500 rounded-full font-medium"
              >
                📅 Campagne terminée
              </button>
            ) : isFull ? (
              <button
                onClick={onNotifyWhenAvailable}
                className="w-full px-4 py-3 bg-white text-teal-600 rounded-full font-medium border border-teal-600 hover:bg-teal-50 transition-colors"
              >
                🔔 M&apos;alerter si une place se libère
              </button>
            ) : (
              <button
                onClick={onInterestToggle}
                className="w-full px-4 py-3 bg-linear-to-r from-teal-500 via-emerald-500 to-cyan-600 text-white rounded-full font-medium hover:from-teal-600 hover:via-emerald-600 hover:to-cyan-700 transition-all"
              >
                {isInterested ? '✓ Inscrit' : `Je suis intéressé(e) (${announcement.registeredCount} déjà inscrits)`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour le modal d'inscription
function RegistrationModal({ 
  isOpen, 
  onClose, 
  announcement, 
  onConfirm 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  announcement: any; 
  onConfirm: (data: any) => void;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    peopleCount: '1',
    notes: '',
    receiveSms: true,
    allowContact: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!isOpen) return null;
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simuler une soumission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onConfirm(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
          className="relative bg-white rounded-t-3xl w-full max-h-[90vh] overflow-hidden"
        >
          <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Je suis intéressé(e)</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          <div className="overflow-y-auto p-4">
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Confirmez votre intérêt pour cette campagne</h4>
              
              {isLoggedIn ? (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    <span>Jean Dupont</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    <span>jean.dupont@email.com</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    <span>+237 6 XX XX XX XX</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-3">
                    Ces informations seront partagées avec l&apos;hôpital organisateur.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 mb-4">Pour vous inscrire:</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-10 pr-3 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Jean Dupont"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone *</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-10 pr-3 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="+237 6 XX XX XX XX"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Pour confirmation par SMS</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email (optionnel)</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-10 pr-3 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de personnes *</label>
                      <select
                        value={formData.peopleCount}
                        onChange={(e) => setFormData({ ...formData, peopleCount: e.target.value })}
                        className="w-full px-3 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5+">5+</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h5 className="font-medium text-gray-900 mb-2">Résumé de la campagne</h5>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="mr-2">💉</span>
                    <span>Vaccination Rougeole</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                    <span>{new Date(announcement.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} • {new Date(announcement.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-600" />
                    <span>{announcement.organization.name}</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-3 bg-white border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={4}
                  placeholder="Informations complémentaires (Allergies, nombre d'enfants, etc.)"
                ></textarea>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.receiveSms}
                    onChange={(e) => setFormData({ ...formData, receiveSms: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Je souhaite recevoir des rappels par SMS</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.allowContact}
                    onChange={(e) => setFormData({ ...formData, allowContact: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">J&apos;autorise l&apos;hôpital à me contacter</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4 flex items-center justify-between">
            {!isLoggedIn && (
              <button
                onClick={() => setIsLoggedIn(true)}
                className="px-4 py-2 text-gray-700 font-medium"
              >
                Créer un compte pour plus d&apos;options
              </button>
            )}
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-linear-to-r from-teal-500 via-emerald-500 to-cyan-600 text-white font-medium rounded-full hover:from-teal-600 hover:via-emerald-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : (
                'Confirmer mon inscription'
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Composant pour le modal de confirmation
function ConfirmationModal({ 
  isOpen, 
  onClose, 
  announcement 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  announcement: any;
}) {
  const [codeCopied, setCodeCopied] = useState(false);
  const confirmationCode = 'HC-2025-001234';
  
  if (!isOpen) return null;
  
  const copyCode = () => {
    navigator.clipboard.writeText(confirmationCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-green-600 mb-2">Inscription confirmée! 🎉</h2>
            <p className="text-gray-700">
              Vous êtes maintenant inscrit(e) à cette campagne.
            </p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-5 w-5 mr-2 text-blue-600" />
              <span>Confirmation envoyée par email</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-5 w-5 mr-2 text-blue-600" />
              <span>SMS de rappel le 14 Mars</span>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Votre code de confirmation:</p>
              <div className="flex items-center bg-green-50 rounded-lg p-3">
                <span className="font-bold text-green-800 text-lg mr-2">{confirmationCode}</span>
                <button
                  onClick={copyCode}
                  className="p-1 rounded hover:bg-green-100 transition-colors"
                >
                  {codeCopied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Présentez ce code à l&apos;hôpital le jour J</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Prochaines étapes:</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>Recevez un rappel 24h avant</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>Apportez votre pièce d&apos;identité</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>Soyez à l&apos;heure (09h00)</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-white text-teal-600 font-medium rounded-full border border-teal-600 hover:bg-teal-50 transition-colors flex items-center justify-center">
              <Calendar className="h-4 w-4 mr-2" />
              Ajouter à mon calendrier
            </button>
            
            <button className="w-full px-4 py-3 bg-white text-teal-600 font-medium rounded-full border border-teal-600 hover:bg-teal-50 transition-colors flex items-center justify-center">
              <MapPin className="h-4 w-4 mr-2" />
              Voir l&apos;itinéraire
            </button>
            
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-linear-to-r from-teal-500 via-emerald-500 to-cyan-600 text-white font-medium rounded-full hover:from-teal-600 hover:via-emerald-600 hover:to-cyan-700 transition-all"
            >
              Retour à l&apos;accueil
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Composant pour le menu contextuel
function ContextMenu({ 
  isOpen, 
  onClose, 
  onShare, 
  onBookmark, 
  onCopyLink, 
  onAddToCalendar, 
  onEnableAlerts, 
  onReport 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onShare: () => void; 
  onBookmark: () => void; 
  onCopyLink: () => void; 
  onAddToCalendar: () => void; 
  onEnableAlerts: () => void; 
  onReport: () => void;
}) {
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="absolute right-4 top-16 bg-white rounded-lg shadow-lg border border-gray-200 z-50 w-48"
      >
        <button
          onClick={() => {
            onShare();
            onClose();
          }}
          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center"
        >
          <Share2 className="h-4 w-4 mr-3 text-gray-600" />
          <span>Partager</span>
        </button>
        
        <button
          onClick={() => {
            onCopyLink();
            onClose();
          }}
          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center"
        >
          <Copy className="h-4 w-4 mr-3 text-gray-600" />
          <span>Copier le lien</span>
        </button>
        
        <button
          onClick={() => {
            onBookmark();
            onClose();
          }}
          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center"
        >
          <Bookmark className="h-4 w-4 mr-3 text-gray-600" />
          <span>Ajouter aux favoris</span>
        </button>
        
        <button
          onClick={() => {
            onAddToCalendar();
            onClose();
          }}
          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center"
        >
          <Calendar className="h-4 w-4 mr-3 text-gray-600" />
          <span>Ajouter au calendrier</span>
        </button>
        
        <button
          onClick={() => {
            onEnableAlerts();
            onClose();
          }}
          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center"
        >
          <AlertTriangle className="h-4 w-4 mr-3 text-gray-600" />
          <span>Activer les alertes</span>
        </button>
        
        <div className="border-t border-gray-200 my-1"></div>
        
        <button
          onClick={() => {
            onReport();
            onClose();
          }}
          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center text-red-600"
        >
          <AlertTriangle className="h-4 w-4 mr-3" />
          <span>Signaler cette campagne</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

// Composant pour le modal de signalement
function ReportModal({ 
  isOpen, 
  onClose, 
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (reason: string, details: string) => void;
}) {
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!isOpen) return null;
  
  const handleSubmit = async () => {
    if (!selectedReason) return;
    
    setIsSubmitting(true);
    
    try {
      // Simuler une soumission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit(selectedReason, details);
      onClose();
    } catch (error) {
      console.error('Erreur lors du signalement:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
          className="relative bg-white rounded-t-3xl w-full max-w-md max-h-[80vh] overflow-hidden"
        >
          <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Signaler cette campagne</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          <div className="overflow-y-auto p-4">
            <p className="text-gray-600 mb-6">Pourquoi signalez-vous cette campagne?</p>
            
            <div className="space-y-2 mb-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="reason"
                  className="mr-3"
                  checked={selectedReason === 'incorrect-info'}
                  onChange={() => setSelectedReason('incorrect-info')}
                />
                <span>Informations incorrectes</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="reason"
                  className="mr-3"
                  checked={selectedReason === 'inappropriate-content'}
                  onChange={() => setSelectedReason('inappropriate-content')}
                />
                <span>Contenu inapproprié</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="reason"
                  className="mr-3"
                  checked={selectedReason === 'spam'}
                  onChange={() => setSelectedReason('spam')}
                />
                <span>Spam ou publicité</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="reason"
                  className="mr-3"
                  checked={selectedReason === 'cancelled'}
                  onChange={() => setSelectedReason('cancelled')}
                />
                <span>Campagne annulée/terminée</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="reason"
                  className="mr-3"
                  checked={selectedReason === 'fraud'}
                  onChange={() => setSelectedReason('fraud')}
                />
                <span>Fraude ou arnaque</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="reason"
                  className="mr-3"
                  checked={selectedReason === 'other'}
                  onChange={() => setSelectedReason('other')}
                />
                <span>Autre raison</span>
              </label>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Détails (optionnel)</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-3 py-3 bg-white border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={5}
                placeholder="Décrivez le problème..."
              ></textarea>
            </div>
            
            <p className="text-xs text-gray-500 mb-6">
              Votre signalement sera examiné par notre équipe de modération.
            </p>
          </div>
          
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-medium"
            >
              Annuler
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedReason}
              className="px-6 py-2 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Envoi...
                </>
              ) : (
                'Envoyer le signalement'
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Page principale
export default function AnnouncementDetailPage() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isInterested, setIsInterested] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: mockAnnouncement.title,
        text: mockAnnouncement.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papiers');
    }
  };
  
  const handleOptions = () => {
    setIsContextMenuOpen(!isContextMenuOpen);
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Lien copié dans le presse-papiers');
  };
  
  const handleAddToCalendar = () => {
    // Implémenter l'ajout au calendrier
    toast.success('Ajouté au calendrier');
  };
  
  const handleEnableAlerts = () => {
    // Implémenter l'activation des alertes
    toast.success('Alertes activées');
  };
  
  const handleReport = () => {
    setIsReportModalOpen(true);
  };
  
  const handleInterestToggle = () => {
    if (!isInterested) {
      setIsRegistrationModalOpen(true);
    } else {
      setIsInterested(false);
      toast.success('Inscription annulée');
    }
  };
  
  const handleNotifyWhenAvailable = () => {
    toast.success('Vous serez notifié lorsqu\'une place se libérera');
  };
  
  const handleRegistrationConfirm = (data: any) => {
    setIsInterested(true);
    setIsConfirmationModalOpen(true);
  };
  
  const handleReportSubmit = (reason: string, details: string) => {
    toast.success('Signalement envoyé');
  };
  
  const handleAddComment = (content: string) => {
    toast.success('Commentaire ajouté');
  };
  
  const handleReplyComment = (commentId: string, content: string) => {
    toast.success('Réponse ajoutée');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Image Section */}
      <HeroImageSection
        announcement={mockAnnouncement}
        isBookmarked={isBookmarked}
        onBookmarkToggle={handleBookmarkToggle}
        onShare={handleShare}
        onOptions={handleOptions}
      />
      
      {/* Content Section */}
      <ContentSection
        announcement={mockAnnouncement}
        isExpanded={isExpanded}
        onToggleExpanded={() => setIsExpanded(!isExpanded)}
      />
      
      {/* Comments Section */}
      <CommentsSection
        comments={mockComments}
        onAddComment={handleAddComment}
        onReplyComment={handleReplyComment}
      />
      
      {/* Sticky CTA */}
      <StickyCTA
        announcement={mockAnnouncement}
        isInterested={isInterested}
        onInterestToggle={handleInterestToggle}
        onNotifyWhenAvailable={handleNotifyWhenAvailable}
      />
      
      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        announcement={mockAnnouncement}
        onConfirm={handleRegistrationConfirm}
      />
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        announcement={mockAnnouncement}
      />
      
      {/* Context Menu */}
      <ContextMenu
        isOpen={isContextMenuOpen}
        onClose={() => setIsContextMenuOpen(false)}
        onShare={handleShare}
        onBookmark={handleBookmarkToggle}
        onCopyLink={handleCopyLink}
        onAddToCalendar={handleAddToCalendar}
        onEnableAlerts={handleEnableAlerts}
        onReport={handleReport}
      />
      
      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}