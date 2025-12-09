/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Head from 'next/head';
import { 
  MapPin, 
  Phone, 
  Star, 
  Clock, 
  Search, 
  X, 
  ChevronDown, 
  ChevronLeft,
  Heart, 
  Navigation, 
  Shield, 
  CheckCircle, 
  Users, 
  Calendar, 
  Activity, 
  TrendingUp, 
  Award, 
  ChevronUp,
  MessageCircle,
  Share2,
  Settings,
  ExternalLink,
  User,
  ThumbsUp,
  Send,
  Globe,
  Mail,
  Ambulance,
  Pill,
  Microscope,
  Bed,
  Camera,
  Baby,
  HeartPulse,
  Stethoscope,
  Eye,
  Smile,       
  AlertCircle,
  Check,
  XCircle,
  Megaphone,
  FileText,
  MessageSquare,
  BedDouble,
  Plus
} from 'lucide-react';
import { getCloudinaryThumbnailUrl } from '@/lib/cloudinary';

// Types pour les données
enum OrganizationType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  CLINIC = 'CLINIC',
  HEALTH_CENTER = 'HEALTH_CENTER',
  NGO = 'NGO',
  HEALTH_DISTRICT = 'HEALTH_DISTRICT'
}

interface Hospital {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  country: string;
  logo: string;
  type: OrganizationType;
  specialties: string[];
  website: string | null;
  isActive: boolean;
  isVerified: boolean;
  latitude: number;
  longitude: number;
  rating: number;
  totalReviews: number;
  registrationNumber: string;
  emergencyAvailable: boolean;
  insuranceAccepted: string[];
  openingHours: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  date: Date;
  helpful: number;
  hospitalId: string;
  hospitalReply?: {
    date: Date;
    comment: string;
  };
}

interface Announcement {
  id: string;
  title: string;
  description: string;
  category: string;
  date: Date;
  imageUrl?: string;
  views: number;
  isFree?: boolean;
hospitalId: string
}

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  readTime: number;
  date: Date;
  imageUrl?: string;
  views: number;
  likes: number;
   hospitalId: string
}

// Constantes de données mock (vides pour être complétées)

// Données mock (réutilisées depuis la page précédente)
const mockHospitals: Hospital[] = [
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
    totalReviews: 156,
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
    totalReviews: 142,
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
    website: 'https://demo.hgd.cm/',
    isActive: true,
    isVerified: true,
    latitude: 4.0511,
    longitude: 9.7679,
    rating: 3.8,
    totalReviews: 128,
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
    totalReviews: 167,
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
    totalReviews: 189,
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
    totalReviews: 98,
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
    totalReviews: 76,
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
    totalReviews: 84,
    registrationNumber: 'HPN-2021-008',
    emergencyAvailable: true,
    insuranceAccepted: ['CNPS', 'Mutuelle des fonctionnaires'],
    openingHours: '24/7',
    description: 'Hôpital protestant avec services de médecine interne et pédiatrie',
    createdAt: new Date('2021-10-08'),
    updatedAt: new Date('2023-08-01')
  }
];

// Données mock pour les avis
const mockReviews: Review[] = [
  {
    id: '1',
    hospitalId: '3',
    userId: '1',
    userName: 'Marie Kamga',
    rating: 5,
    comment: 'Excellent service! Le personnel est très professionnel et à l\'écoute. L\'établissement est propre et bien équipé. Je recommande vivement.',
    date: new Date('2023-08-15'),
    helpful: 24,
    hospitalReply: {
      date: new Date('2023-08-16'),
      comment: 'Merci beaucoup Marie pour votre retour positif! Nous sommes ravis d\'avoir pu vous aider.'
    }
  },
  {
    id: '2',
    hospitalId: '3',
    userId: '2',
    userName: 'Paul Nguema',
    rating: 4,
    comment: 'Bon hôpital mais temps d\'attente parfois long... Les médecins sont compétents.',
    date: new Date('2023-08-10'),
    helpful: 12
  },
  {
    id: '3',
    hospitalId: '3',
    userId: '3',
    userName: 'Sophie Tchoumi',
    rating: 5,
    comment: 'J\'ai accouché dans cet hôpital et l\'expérience a été formidable. Le personnel de la maternité est exceptionnel.',
    date: new Date('2023-08-05'),
    helpful: 18
  }
];

// Données mock pour les annonces
const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    hospitalId: '3',
    title: 'Campagne vaccination rougeole',
    description: 'Vaccination gratuite pour tous les enfants de 6 mois à 5 ans',
    category: 'Vaccination',
    date: new Date('2023-08-15'),
    imageUrl: 'vaccination-campaign',
    views: 1200,
    isFree: true
  },
  {
    id: '2',
    hospitalId: '3',
    title: 'Journée de dépistage du cancer',
    description: 'Dépistage gratuit du cancer du sein et du col de l\'utérus',
    category: 'Dépistage',
    date: new Date('2023-08-10'),
    imageUrl: 'breast-cancer-screening',
    views: 800,
    isFree: true
  },
  {
    id: '3',
    hospitalId: '3',
    title: 'Nouveau service de cardiologie',
    description: 'Ouverture de notre nouveau service de cardiologie avec des équipements de pointe',
    category: 'Nouveauté',
    date: new Date('2023-08-05'),
    imageUrl: 'prenatal-care',
    views: 650
  }
];

// Données mock pour les articles
const mockArticles: Article[] = [
  {
    id: '1',
    hospitalId: '3',
    title: 'Les 5 signes du paludisme',
    description: 'Comment reconnaître les symptômes du paludisme et agir rapidement',
    category: 'Dépistage',
    author: 'Dr. Kamga',
    readTime: 5,
    date: new Date('2023-08-15'),
    imageUrl: 'malaria-prevention',
    views: 3500,
    likes: 456
  },
  {
    id: '2',
    hospitalId: '3',
    title: 'L\'importance du dépistage précoce',
    description: 'Pourquoi le dépistage régulier est crucial pour votre santé',
    category: 'Prévention',
    author: 'Dr. Tchoumi',
    readTime: 7,
    date: new Date('2023-08-10'),
    imageUrl: 'prenatal-care',
    views: 2100,
    likes: 234
  },
  {
    id: '3',
    hospitalId: '3',
    title: 'Alimentation saine pour un cœur en bonne santé',
    description: 'Les aliments à privilégier pour protéger votre système cardiovasculaire',
    category: 'Nutrition',
    author: 'Dr. Nguema',
    readTime: 8,
    date: new Date('2023-08-05'),
    imageUrl: 'local-foods',
    views: 1800,
    likes: 189
  }
]; 

// Fonctions utilitaires
const getTypeLabel = (type: OrganizationType): string => {
  switch (type) {
    case OrganizationType.PUBLIC:
      return 'Hôpital Public';
    case OrganizationType.PRIVATE:
      return 'Hôpital Privé';
    case OrganizationType.CLINIC:
      return 'Clinique';
    case OrganizationType.HEALTH_CENTER:
      return 'Centre de Santé';
    case OrganizationType.NGO:
      return 'ONG Médicale';
    case OrganizationType.HEALTH_DISTRICT:
      return 'District de Santé';
    default:
      return 'Établissement';
  }
};

const getTypeColor = (type: OrganizationType): string => {
  switch (type) {
    case OrganizationType.PUBLIC:
      return 'bg-blue-100 text-blue-800';
    case OrganizationType.PRIVATE:
      return 'bg-purple-100 text-purple-800';
    case OrganizationType.CLINIC:
      return 'bg-green-100 text-green-800';
    case OrganizationType.HEALTH_CENTER:
      return 'bg-yellow-100 text-yellow-800';
    case OrganizationType.NGO:
      return 'bg-pink-100 text-pink-800';
    case OrganizationType.HEALTH_DISTRICT:
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getSpecialtyIcon = (specialty: string): React.ReactNode => {
  const lowerSpecialty = specialty.toLowerCase();
  if (lowerSpecialty.includes('cardi')) return <HeartPulse className="w-5 h-5" />;
  if (lowerSpecialty.includes('pédiatr')) return <Baby className="w-5 h-5" />;
  if (lowerSpecialty.includes('chirurg')) return <Stethoscope className="w-5 h-5" />;
  if (lowerSpecialty.includes('gynécolog')) return <Baby className="w-5 h-5" />;
  if (lowerSpecialty.includes('ophtalm')) return <Eye className="w-5 h-5" />;
  if (lowerSpecialty.includes('dent')) return <Smile className="w-5 h-5" />;
  if (lowerSpecialty.includes('laborat')) return <Microscope className="w-5 h-5" />;
  if (lowerSpecialty.includes('radiolog')) return <Camera className="w-5 h-5" />;
  return <Shield className="w-5 h-5" />;
};

const formatDate = (date: Date): string => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Aujourd\'hui';
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
  return `Il y a ${Math.floor(diffDays / 365)} ans`;
};

const formatFullDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Composants
const HeaderSection: React.FC<{
  hospital: Hospital;
  isFollowing: boolean;
  setIsFollowing: (value: boolean) => void;
}> = ({ hospital, isFollowing, setIsFollowing }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  return (
    <div className="relative">
      {/* Image de couverture */}
      <div className="h-48 bg-linear-to-r from-blue-500 to-indigo-600 relative">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        {hospital.emergencyAvailable && (
          <div className="absolute bottom-10 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            Urgences 24/7
          </div>
        )}
      </div>
      
      {/* Header transparent */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
        <button 
          onClick={() => window.history.back()}
          className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Informations principales */}
      <div className="bg-linear-to-br from-white to-gray-50 rounded-t-3xl -mt-6 relative px-6 py-8 shadow-xl border border-gray-100">
  <div className="flex items-start">
    <div className="w-24 h-24 rounded-full bg-white p-1.5 shadow-xl -mt-12 relative z-10 border-4 border-white transition-all duration-300 hover:scale-105">
      <img 
        src={getCloudinaryThumbnailUrl(hospital.logo, 80)} 
        alt={hospital.name}
        className="w-full h-full rounded-full object-cover transition-opacity duration-300"
        onError={(e) => {
          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(hospital.name)}&background=6366f1&color=ffffff&size=80`;
        }}
      />
    </div>
    
    <div className="ml-5 flex-1">
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{hospital.name}</h1>
      <div className="flex items-center mt-2 bg-amber-50 px-3 py-1.5 rounded-full w-fit">
        <Star className="w-5 h-5 text-amber-500 fill-current" />
        <span className="ml-1.5 text-sm font-semibold text-amber-700">{hospital.rating}</span>
        <span className="ml-1.5 text-sm text-gray-600">({hospital.totalReviews} avis)</span>
      </div>
    </div>
  </div>
  
  <div className="mt-5">
    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${getTypeColor(hospital.type)} transition-all duration-300 hover:shadow-md`}>
      {getTypeLabel(hospital.type)}
    </span>
  </div>
  
  <div className="mt-8 flex space-x-4">
    {isFollowing ? (
      <button 
        onClick={() => setIsFollowing(false)}
        className="flex-1 py-3 bg-linear-to-r from-green-50 to-emerald-50 text-green-700 rounded-xl font-semibold flex items-center justify-center border border-green-200 transition-all duration-300 hover:shadow-md hover:from-green-100 hover:to-emerald-100"
      >
        <Check className="w-5 h-5 mr-2" />
        Abonné(e)
      </button>
    ) : (
      <button 
        onClick={() => setIsFollowing(true)}
        className="flex-1 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-xl hover:from-blue-700 hover:to-indigo-700"
      >
        <Star className="w-5 h-5 mr-2" />
        Suivre
      </button>
    )}
    
    <button className="flex-1 py-3 bg-linear-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl font-semibold flex items-center justify-center border border-gray-200 transition-all duration-300 hover:shadow-md hover:from-gray-100 hover:to-gray-200">
      <Phone className="w-5 h-5 mr-2" />
      Contacter
    </button>
  </div>
</div>
    </div>
  );
};

// ... (le reste de votre code)

const QuickInfoCards: React.FC<{ hospital: Hospital }> = ({ hospital }) => {
  // Données structurées pour une maintenabilité aisée
  // Dans une vraie application, ces valeurs viendraient de votre API ou de vos props
  const statsData = [
    {
      label: 'Abonnés',
      value: '2.1K',
      icon: Users,
      gradient: 'from-blue-500 to-indigo-600',
      shadowColor: 'shadow-blue-200',
    },
    {
      label: 'Annonces',
      value: '45',
      icon: Megaphone,
      gradient: 'from-purple-500 to-pink-600',
      shadowColor: 'shadow-purple-200',
    },
    {
      label: 'Articles',
      value: '78',
      icon: FileText,
      gradient: 'from-green-500 to-teal-600',
      shadowColor: 'shadow-green-200',
    },
    {
      label: 'Note',
      value: hospital.rating, // Utilisation de la variable existante
      icon: Star,
      gradient: 'from-amber-500 to-orange-600',
      shadowColor: 'shadow-amber-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`relative bg-linear-to-br ${stat.gradient} p-5 rounded-2xl text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer group overflow-hidden`}
          >
            {/* Icône en arrière-plan pour un effet subtil */}
            <Icon className="absolute -top-2 -right-2 w-20 h-20 text-white/10 group-hover:rotate-12 transition-transform duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 bg-white/20 rounded-lg backdrop-blur-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-white/70" />
              </div>
              
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-white/90 mt-1 font-medium">{stat.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ContactInformation: React.FC<{ hospital: Hospital }> = ({ hospital }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  // Fonctions d'action
  const openMap = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${hospital.latitude},${hospital.longitude}`, '_blank');
  };
  
  const callPhone = () => {
    window.open(`tel:${hospital.phone}`, '_blank');
  };
  
  const openWhatsApp = () => {
    window.open(`https://wa.me/2376XXXXXXXXX`, '_blank');
  };
  
  const sendEmail = () => {
    window.open(`mailto:${hospital.email}`, '_blank');
  };
  
  const openWebsite = () => {
    if (hospital.website) {
      window.open(hospital.website, '_blank');
    }
  };
  
  // Données structurées pour une meilleure maintenabilité
  const contactMethods = [
    {
      id: 'address',
      title: 'Adresse',
      icon: MapPin,
      color: 'from-red-500 to-pink-600',
      data: (
        <>
          {hospital.address}<br />
          {hospital.city}, {hospital.region}, {hospital.country}
        </>
      ),
      action: openMap,
      actionText: 'Voir sur la carte',
      actionIcon: Navigation
    },
    {
      id: 'phone',
      title: 'Téléphone',
      icon: Phone,
      color: 'from-green-500 to-teal-600',
      data: hospital.phone,
      action: callPhone,
      actionText: 'Appeler',
      actionIcon: Phone
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      icon: MessageCircle,
      color: 'from-green-400 to-green-600',
      data: '+237 6 XX XX XX XX',
      action: openWhatsApp,
      actionText: 'Discuter',
      actionIcon: MessageSquare
    },
    {
      id: 'email',
      title: 'Email',
      icon: Mail,
      color: 'from-blue-500 to-indigo-600',
      data: hospital.email,
      action: sendEmail,
      actionText: 'Envoyer un email',
      actionIcon: Mail
    }
  ];
  
  // Ajouter le site web seulement s'il existe
  if (hospital.website) {
    contactMethods.push({
      id: 'website',
      title: 'Site web',
      icon: Globe,
      color: 'from-purple-500 to-indigo-600',
      data: hospital.website.replace('https://www.', ''),
      action: openWebsite,
      actionText: 'Visiter',
      actionIcon: ExternalLink
    });
  }
  
  return (
    <div className="mt-6">
      <h4 className="text-xl font-bold text-gray-900 mb-5 flex items-center">
        <Phone className="w-6 h-6 mr-3 text-indigo-600" />
        Informations de contact
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contactMethods.map((method) => {
          const Icon = method.icon;
          const ActionIcon = method.actionIcon;
          
          return (
            <div
              key={method.id}
              className={`relative overflow-hidden rounded-xl shadow-md transition-all duration-300 ${
                hoveredCard === method.id ? 'shadow-xl transform -translate-y-1' : ''
              }`}
              onMouseEnter={() => setHoveredCard(method.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`absolute inset-0 bg-linear-to-br ${method.color} opacity-10`}></div>
              
              <div className="relative bg-white p-5 h-full">
                <div className="flex items-start">
                  <div className={`p-3 rounded-lg bg-linear-to-br ${method.color} text-white mr-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 mb-1">{method.title}</h5>
                    <p className="text-sm text-gray-600">{method.data}</p>
                    
                    <button
                      onClick={method.action}
                      className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium bg-linear-to-r ${method.color} text-white flex items-center hover:shadow-md transition-all duration-300 transform hover:scale-105`}
                    >
                      <ActionIcon className="w-4 h-4 mr-2" />
                      {method.actionText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ... (le reste de votre code, y compris les types et les autres fonctions)

const OpeningHours: React.FC<{ hospital: Hospital }> = ({ hospital }) => {
  const [currentDay] = useState(new Date().getDay());
  const [currentTime] = useState(new Date());

  // --- Vos logiques existantes (inchangées) ---
  const isOpenNow = () => {
    if (hospital.emergencyAvailable) return true;
    if (hospital.openingHours === '24/7') return true;
    const hour = currentTime.getHours();
    return hour >= 8 && hour < 17;
  };
  
  const getClosingTime = () => {
    if (hospital.openingHours === '24/7') return null;
    return '17:00';
  };
  
  const getOpeningTime = () => {
    if (hospital.openingHours === '24/7') return null;
    return '08:00';
  };
  
  const getDaysUntilNextOpen = () => {
    const daysUntilNext = currentDay === 0 ? 1 : 8 - currentDay;
    return daysUntilNext === 1 ? 'demain' : `dans ${daysUntilNext} jours`;
  };

  // --- Données structurées pour une meilleure maintenabilité ---
  const weekDays = [
    { name: 'Lundi', hours: '08:00 - 17:00', dayIndex: 1 },
    { name: 'Mardi', hours: '08:00 - 17:00', dayIndex: 2 },
    { name: 'Mercredi', hours: '08:00 - 17:00', dayIndex: 3 },
    { name: 'Jeudi', hours: '08:00 - 17:00', dayIndex: 4 },
    { name: 'Vendredi', hours: '08:00 - 17:00', dayIndex: 5 },
    { name: 'Samedi', hours: '08:00 - 12:00', dayIndex: 6 },
    { name: 'Dimanche', hours: 'Fermé', dayIndex: 0 },
  ];

  return (
    <div className="mt-6">
      <h4 className="text-xl font-bold text-gray-900 mb-5 flex items-center">
        <Clock className="w-6 h-6 mr-3 text-indigo-600" />
        Horaires d&apos;ouverture
      </h4>
      
      <div className="bg-linear-to-br from-slate-50 to-gray-100 p-5 rounded-xl shadow-lg border border-gray-200">
        <div className="space-y-2">
          {weekDays.map((day) => (
            <div
              key={day.name}
              className={`flex justify-between items-center p-3 rounded-lg transition-all duration-200 ${
                currentDay === day.dayIndex
                  ? 'bg-white shadow-sm border border-indigo-200'
                  : 'hover:bg-white/50'
              }`}
            >
              <span className={`font-medium ${currentDay === day.dayIndex ? 'text-indigo-700' : 'text-gray-800'}`}>
                {day.name}
              </span>
              <div className="flex items-center">
                <span className={`text-sm font-medium ${day.hours === 'Fermé' ? 'text-red-600' : 'text-gray-600'}`}>
                  {day.hours}
                </span>
                {currentDay === day.dayIndex && (
                  isOpenNow() ? (
                    <CheckCircle className="w-5 h-5 ml-3 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 ml-3 text-red-500" />
                  )
                )}
              </div>
            </div>
          ))}
          
          {hospital.emergencyAvailable && (
            <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-300 p-3 rounded-lg bg-emerald-50 shadow-sm">
              <div className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-emerald-600" />
                <span className="font-semibold text-gray-800">Urgences</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-emerald-700 font-bold">24h/24, 7j/7</span>
                <CheckCircle className="w-5 h-5 ml-3 text-emerald-500" />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className={`mt-5 p-4 rounded-xl shadow-md flex items-center text-white ${
        isOpenNow()
          ? 'bg-linear-to-r from-green-500 to-emerald-500'
          : 'bg-linear-to-r from-red-500 to-rose-500'
      }`}>
        {isOpenNow() ? (
          <CheckCircle className="w-6 h-6 mr-3" />
        ) : (
          <XCircle className="w-6 h-6 mr-3" />
        )}
        <div>
          <div className="font-semibold text-lg">
            {isOpenNow() ? 'Ouvert maintenant' : 'Actuellement fermé'}
          </div>
          <div className="text-sm opacity-90">
            {isOpenNow() ? (
              getClosingTime() ? `Ferme à ${getClosingTime()}` : 'Ouvert 24h/24'
            ) : (
              `Ouvre ${getDaysUntilNextOpen()} à ${getOpeningTime()}`
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const Description: React.FC<{ hospital: Hospital }> = ({ hospital }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Données structurées pour les caractéristiques clés
  const keyFeatures = [
    { icon: BedDouble, label: 'Lits d\'hospitalisation', value: '250', color: 'from-blue-500 to-cyan-600' },
    { icon: Stethoscope, label: 'Services spécialisés', value: '12', color: 'from-purple-500 to-pink-600' },
    { icon: Microscope, label: 'Laboratoire', value: 'Moderne', color: 'from-green-500 to-teal-600' },
    { icon: Activity, label: 'Bloc opératoire', value: 'Équipé', color: 'from-orange-500 to-red-600' },
  ];

  // Ajouter le service d'urgence si disponible
  if (hospital.emergencyAvailable) {
    keyFeatures.push({ icon: Ambulance, label: 'Service d\'urgences', value: '24/7', color: 'from-red-500 to-rose-600' });
  }

  return (
    <div className="mt-6 bg-linear-to-br from-slate-50 to-gray-100 p-6 rounded-2xl shadow-lg border border-gray-200">
      <h4 className="text-2xl font-bold text-gray-900 mb-5 flex items-center">
        <div className="p-2 bg-indigo-100 rounded-lg mr-3">
          <FileText className="w-6 h-6 text-indigo-600" />
        </div>
        À propos de {hospital.name}
      </h4>
      
      <p className="text-gray-700 leading-relaxed text-base">
        {hospital.description}
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
        {keyFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className={`inline-flex p-3 rounded-lg bg-linear-to-br ${feature.color} text-white mb-3`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="font-bold text-lg text-gray-900">{feature.value}</div>
              <div className="text-xs text-gray-600 mt-1">{feature.label}</div>
            </div>
          );
        })}
      </div>
      
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-h-80 opacity-100 mt-6' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pt-6 border-t border-gray-300">
          <p className="text-sm text-gray-600 leading-relaxed">
            Notre équipe médicale est composée de professionnels hautement qualifiés et expérimentés, 
            dédiés à fournir les meilleurs soins possibles à nos patients. Nous utilisons des 
            technologies de pointe pour garantir des diagnostics précis et des traitements efficaces.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mt-3">
            En tant qu&apos;établissement de santé de référence, nous nous engageons à respecter les 
            normes les plus élevées en matière de qualité et de sécurité des soins. Notre mission 
            est d&apos;améliorer la santé et le bien-être de la communauté que nous servons.
          </p>
        </div>
      </div>
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-5 w-full py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 flex items-center justify-center transition-all duration-300 hover:bg-gray-50 hover:shadow-md group"
      >
        <span>{isExpanded ? 'Réduire' : 'Lire plus sur notre établissement'}</span>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 ml-2 transition-transform group-hover:-translate-y-0.5" />
        ) : (
          <ChevronDown className="w-5 h-5 ml-2 transition-transform group-hover:translate-y-0.5" />
        )}
      </button>
    </div>
  );
};


// Supposons que getSpecialtyIcon est une fonction qui retourne une icône Lucide
// const getSpecialtyIcon = (specialty: string) => { ... };

const ServicesAndSpecialties: React.FC<{ hospital: Hospital }> = ({ hospital }) => {
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);
  
  // Logique pour afficher les spécialités
  const displaySpecialties = showAllSpecialties ? hospital.specialties : hospital.specialties.slice(0, 6);
  
  // Données structurées pour les services additionnels
  const additionalServices = [
    { name: 'Ambulance', icon: Ambulance, color: 'from-red-400 to-red-600' },
    { name: 'Pharmacie', icon: Pill, color: 'from-green-400 to-green-600' },
    { name: 'Laboratoire', icon: Microscope, color: 'from-blue-400 to-blue-600' },
    { name: 'Hospitalisation', icon: Bed, color: 'from-purple-400 to-purple-600' }
  ];

  return (
    <div className="mt-6 bg-linear-to-br from-slate-50 to-gray-100 p-6 rounded-2xl shadow-lg border border-gray-200">
      <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="p-2 bg-indigo-100 rounded-lg mr-3">
          <Stethoscope className="w-6 h-6 text-indigo-600" />
        </div>
        Services et Spécialités
      </h4>
      
      {/* Section Spécialités Médicales */}
      <div className="mb-8">
        <h5 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-indigo-500" />
          Nos Spécialités Médicales
        </h5>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displaySpecialties.map((specialty, index) => (
            <div
              key={index}
              className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3 transition-all duration-300 hover:shadow-md hover:border-indigo-200 cursor-pointer"
            >
              <div className="p-2 bg-linear-to-br from-indigo-50 to-blue-100 rounded-lg text-indigo-600 group-hover:scale-110 transition-transform">
                {getSpecialtyIcon(specialty)}
              </div>
              <span className="font-medium text-gray-700 group-hover:text-gray-900">{specialty}</span>
            </div>
          ))}
        </div>
        
        {hospital.specialties.length > 6 && (
          <button
            onClick={() => setShowAllSpecialties(!showAllSpecialties)}
            className="mt-5 w-full py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 flex items-center justify-center transition-all duration-300 hover:bg-gray-50 hover:shadow-md group"
          >
            <span>
              {showAllSpecialties ? 'Afficher moins de spécialités' : `Afficher toutes les spécialités (${hospital.specialties.length})`}
            </span>
            {showAllSpecialties ? (
              <ChevronUp className="w-5 h-5 ml-2 transition-transform group-hover:-translate-y-0.5" />
            ) : (
              <ChevronDown className="w-5 h-5 ml-2 transition-transform group-hover:translate-y-0.5" />
            )}
          </button>
        )}
      </div>
      
      {/* Section Services Additionnels */}
      <div>
        <h5 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-indigo-500" />
          Services & Équipements
        </h5>
        
        <div className="flex flex-wrap gap-3">
          {additionalServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className={`group relative inline-flex items-center px-4 py-2.5 rounded-full text-white font-medium shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer bg-linear-to-r ${service.color}`}
              >
                <Icon className="w-5 h-5 mr-2" />
                <span>{service.name}</span>
                {/* Effet de brillance au survol */}
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const InsuranceSection: React.FC<{ hospital: Hospital }> = ({ hospital }) => {
  const [showAllInsurances, setShowAllInsurances] = useState(false);
  const displayInsurances = showAllInsurances ? hospital.insuranceAccepted : hospital.insuranceAccepted.slice(0, 5);
  
  return (
    <div className="mt-6">
      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <Shield className="w-5 h-5 mr-2" />
        Assurances acceptées
      </h4>
      
      <div className="flex flex-wrap gap-2">
        {displayInsurances.map((insurance, index) => (
          <div key={index} className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {insurance}
          </div>
        ))}
        
        {hospital.insuranceAccepted.length > 5 && (
          <button 
            onClick={() => setShowAllInsurances(!showAllInsurances)}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
          >
            {showAllInsurances ? '-' : `+${hospital.insuranceAccepted.length - 5} autres`}
          </button>
        )}
      </div>
    </div>
  );
};

const LocationMap: React.FC<{ hospital: Hospital }> = ({ hospital }) => {
  const getDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`, '_blank');
  };
  
  return (
    <div className="mt-6">
      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <MapPin className="w-5 h-5 mr-2" />
        Localisation
      </h4>
      
      <div className="rounded-xl overflow-hidden relative">
        <iframe
          width="100%"
          height="240"
          frameBorder="0"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${hospital.longitude - 0.01},${hospital.latitude - 0.01},${hospital.longitude + 0.01},${hospital.latitude + 0.01}&layer=mapnik&marker=${hospital.latitude},${hospital.longitude}`}
          style={{ border: 0 }}
          allowFullScreen
          title="Carte de l'hôpital"
        />
        
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button 
            onClick={() => window.open(`https://www.openstreetmap.org/?mlat=${hospital.latitude}&mlon=${hospital.longitude}&zoom=15`, '_blank')}
            className="px-3 py-1.5 bg-white rounded-lg text-sm font-medium shadow-md flex items-center hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Ouvrir dans Maps
          </button>
          <button 
            onClick={getDirections}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-md flex items-center hover:bg-blue-700 transition-colors"
          >
            <Navigation className="w-4 h-4 mr-1" />
            Itinéraire
          </button>
        </div>
      </div>
      
      <div className="mt-3 text-sm text-gray-600">
        {hospital.address}<br />
        {hospital.city}, {hospital.region}
      </div>
      
      <div className="mt-2 flex items-center text-xs text-teal-700">
        <MapPin className="w-3 h-3 mr-1" />
        <span>2.5 km de votre position</span>
        <span className="mx-2">•</span>
        <Clock className="w-3 h-3 mr-1" />
        <span>~8 min en voiture</span>
      </div>
    </div>
  );
};

const TabsNavigation: React.FC<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
  counts: { announcements: number; articles: number; reviews: number };
}> = ({ activeTab, setActiveTab, counts }) => {
  return (
    <div className="sticky top-0 z-20 bg-white shadow-md mt-6">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            activeTab === 'announcements'
              ? 'text-teal-700 border-b-3 border-teal-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Annonces ({counts.announcements})
        </button>
        <button
          onClick={() => setActiveTab('articles')}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            activeTab === 'articles'
              ? 'text-teal-700 border-b-3 border-teal-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Articles ({counts.articles})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            activeTab === 'reviews'
              ? 'text-teal-700 border-b-3 border-teal-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Avis ({counts.reviews})
        </button>
      </div>
    </div>
  );
};

const AnnouncementsTab: React.FC<{ announcements: Announcement[] }> = ({ announcements }) => {
  const [sortBy, setSortBy] = useState('recent');
  const [displayCount, setDisplayCount] = useState(3);
  
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (sortBy === 'recent') {
      return b.date.getTime() - a.date.getTime();
    }
    return b.views - a.views;
  });
  
  const displayAnnouncements = sortedAnnouncements.slice(0, displayCount);
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium text-gray-700">Trier par:</div>
        <button className="text-sm text-blue-600 font-medium flex items-center">
          {sortBy === 'recent' ? 'Plus récentes' : 'Plus vues'}
          <ChevronDown className="w-4 h-4 ml-1" />
        </button>
      </div>
      
      <div className="space-y-3">
        {displayAnnouncements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex p-3">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {announcement.imageUrl ? (
                  <img 
                    src={getCloudinaryThumbnailUrl(announcement.imageUrl, 96)} 
                    alt={announcement.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="ml-3 flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-gray-900 line-clamp-1">{announcement.title}</h3>
                  <Star className="w-4 h-4 text-yellow-500 fill-current ml-1 shrink-0" />
                </div>
                
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-medium">
                    {announcement.category}
                  </span>
                  {announcement.isFree && (
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-medium">
                      Gratuit
                    </span>
                  )}
                </div>
                
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{formatFullDate(announcement.date)}</span>
                  <span className="mx-2">•</span>
                  <span>{announcement.views} vues</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {displayCount < announcements.length && (
        <button 
          onClick={() => setDisplayCount(prev => prev + 3)}
          className="w-full mt-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          Voir toutes les annonces ({announcements.length})
        </button>
      )}
    </div>
  );
};

const ArticlesTab: React.FC<{ articles: Article[] }> = ({ articles }) => {
  const [sortBy, setSortBy] = useState('recent');
  const [displayCount, setDisplayCount] = useState(3);
  
  const sortedArticles = [...articles].sort((a, b) => {
    if (sortBy === 'recent') {
      return b.date.getTime() - a.date.getTime();
    }
    return b.views - a.views;
  });
  
  const displayArticles = sortedArticles.slice(0, displayCount);
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium text-gray-700">Trier par:</div>
        <button className="text-sm text-blue-600 font-medium flex items-center">
          {sortBy === 'recent' ? 'Plus récents' : 'Plus vus'}
          <ChevronDown className="w-4 h-4 ml-1" />
        </button>
      </div>
      
      <div className="space-y-3">
        {displayArticles.map((article) => (
          <div key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex p-3">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {article.imageUrl ? (
                  <img 
                    src={getCloudinaryThumbnailUrl(article.imageUrl, 96)} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="ml-3 flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-gray-900 line-clamp-1">{article.title}</h3>
                  <Star className="w-4 h-4 text-yellow-500 fill-current ml-1 shrink-0" />
                </div>
                
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-medium">
                    {article.category}
                  </span>
                </div>
                
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <User className="w-3 h-3 mr-1" />
                  <span>{article.author}</span>
                  <span className="mx-2">•</span>
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{article.readTime} min</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(article.date)}</span>
                </div>
                
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <span>{article.views} vues</span>
                  <span className="mx-2">•</span>
                  <Heart className="w-3 h-3 mr-1" />
                  <span>{article.likes}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {displayCount < articles.length && (
        <button 
          onClick={() => setDisplayCount(prev => prev + 3)}
          className="w-full mt-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          Voir tous les articles ({articles.length})
        </button>
      )}
    </div>
  );
};

const ReviewsTab: React.FC<{ 
  reviews: Review[]; 
  hospitalRating: number; 
  totalReviews: number;
  hospitalName: string;
}> = ({ reviews, hospitalRating, totalReviews, hospitalName }) => {
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');
  const [displayCount, setDisplayCount] = useState(3);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'recent') {
      return b.date.getTime() - a.date.getTime();
    }
    return b.rating - a.rating;
  });
  
  const filteredReviews = filterBy === 'all' 
    ? sortedReviews 
    : sortedReviews.filter(review => review.rating === parseInt(filterBy));
  
  const displayReviews = filteredReviews.slice(0, displayCount);
  
  // Calculer la distribution des notes
  const ratingDistribution = useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  }, [reviews]);
  
  const getPercentage = (count: number) => {
    return Math.round((count / totalReviews) * 100);
  };
  
  return (
    <div className="p-4">
      {/* Résumé des notes */}
      <div className="bg-linear-to-br from-orange-50 to-white rounded-xl p-6 mb-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-orange-600">{hospitalRating}</div>
          <div className="flex justify-center mt-1">
            {[1, 2, 3, 4, 5].map(star => (
              <Star 
                key={star} 
                className={`w-8 h-8 ${star <= Math.floor(hospitalRating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <div className="mt-2 text-gray-700">Basé sur {totalReviews} avis</div>
        </div>
        
        <div className="mt-6 space-y-2">
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="flex items-center">
              <div className="flex items-center w-20">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    className={`w-4 h-4 ${star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${getPercentage(ratingDistribution[rating as keyof typeof ratingDistribution])}%` }}
                ></div>
              </div>
              <div className="w-12 text-right text-sm text-gray-600">
                {ratingDistribution[rating as keyof typeof ratingDistribution]}
              </div>
              <div className="w-12 text-right text-sm text-gray-500">
                {getPercentage(ratingDistribution[rating as keyof typeof ratingDistribution])}%
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => setShowReviewModal(true)}
          className="w-full mt-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Laisser un avis
        </button>
      </div>
      
      {/* Filtres */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium text-gray-700">Trier par:</div>
        <button className="text-sm text-blue-600 font-medium flex items-center">
          {sortBy === 'recent' ? 'Plus récents' : 'Mieux notés'}
          <ChevronDown className="w-4 h-4 ml-1" />
        </button>
      </div>
      
      <div className="flex space-x-2 mb-4">
        <button 
          onClick={() => setFilterBy('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium ${
            filterBy === 'all' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Toutes ⭐
        </button>
        <button 
          onClick={() => setFilterBy('5')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium ${
            filterBy === '5' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          5⭐
        </button>
        <button 
          onClick={() => setFilterBy('4')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium ${
            filterBy === '4' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          4⭐
        </button>
        <button 
          onClick={() => setFilterBy('3')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium ${
            filterBy === '3' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          3⭐
        </button>
      </div>
      
      {/* Liste des avis */}
      <div className="space-y-4">
        {displayReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                {review.userAvatar ? (
                  <img 
                    src={getCloudinaryThumbnailUrl(review.userAvatar, 48)} 
                    alt={review.userName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-400" />
                )}
              </div>
              
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{review.userName}</div>
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="ml-2 text-xs text-gray-500">{formatDate(review.date)}</span>
                    </div>
                  </div>
                  <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                
                <div className="mt-3 text-gray-700">
                  {review.comment}
                </div>
                
                <div className="flex items-center mt-3 text-sm text-gray-500">
                  <button className="flex items-center hover:text-blue-600 transition-colors">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    <span>Utile ({review.helpful})</span>
                  </button>
                  <button className="ml-4 flex items-center hover:text-blue-600 transition-colors">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span>Répondre</span>
                  </button>
                </div>
                
                {review.hospitalReply && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-200">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-white p-1 shrink-0">
                        <img 
                          src="https://ui-avatars.com/api/?name=Hôpital&background=e0e7ff&color=4f46e5&size=40" 
                          alt="Hôpital"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div className="ml-2">
                        <div className="text-sm font-medium text-gray-900">{hospitalName}</div>
                        <div className="text-xs text-gray-500">Réponse officielle</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700">
                      {review.hospitalReply.comment}
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <button className="flex items-center hover:text-blue-600 transition-colors">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        <span>Utile (8)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {displayCount < filteredReviews.length && (
        <button 
          onClick={() => setDisplayCount(prev => prev + 3)}
          className="w-full mt-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          Charger plus d&apos;avis ({Math.min(3, filteredReviews.length - displayCount)})
        </button>
      )}
      
      {/* Modal pour laisser un avis */}
      {showReviewModal && (
        <ReviewModal 
          hospitalName={hospitalName}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => {
            setShowReviewModal(false);
            setShowSuccessModal(true);
          }}
        />
      )}
      
      {/* Modal de confirmation */}
      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} />
      )}
    </div>
  );
};

const ReviewModal: React.FC<{
  hospitalName: string;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ hospitalName, onClose, onSuccess }) => {
  const [overallRating, setOverallRating] = useState(0);
  const [detailedRatings, setDetailedRatings] = useState({
    quality: 0,
    cleanliness: 0,
    welcome: 0,
    waitingTime: 0,
    valueForMoney: 0
  });
  const [comment, setComment] = useState('');
  const [recommend, setRecommend] = useState<'yes' | 'no' | 'maybe'>('maybe');
  const [userName, setUserName] = useState('Jean Dupont');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const getRatingLabel = (rating: number) => {
    if (rating === 1) return 'Très mauvais';
    if (rating === 2) return 'Mauvais';
    if (rating === 3) return 'Moyen';
    if (rating === 4) return 'Bon';
    if (rating === 5) return 'Excellent';
    return '';
  };
  
  const handleSubmit = () => {
    // Logique pour soumettre l'avis
    onSuccess();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Laisser un avis</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">{hospitalName}</h3>
          </div>
          
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">Note globale *</div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setOverallRating(star)}
                    className="p-1"
                  >
                    <Star 
                      className={`w-12 h-12 ${star <= overallRating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                    />
                  </button>
                ))}
              </div>
              {overallRating > 0 && (
                <div className="text-center text-sm text-gray-600">
                  {getRatingLabel(overallRating)}
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">Notes détaillées (optionnel)</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Qualité des soins</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setDetailedRatings(prev => ({ ...prev, quality: star }))}
                      className="p-1"
                    >
                      <Star 
                        className={`w-6 h-6 ${star <= detailedRatings.quality ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Propreté</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setDetailedRatings(prev => ({ ...prev, cleanliness: star }))}
                      className="p-1"
                    >
                      <Star 
                        className={`w-6 h-6 ${star <= detailedRatings.cleanliness ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Accueil</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setDetailedRatings(prev => ({ ...prev, welcome: star }))}
                      className="p-1"
                    >
                      <Star 
                        className={`w-6 h-6 ${star <= detailedRatings.welcome ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Temps d&apos;attente</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setDetailedRatings(prev => ({ ...prev, waitingTime: star }))}
                      className="p-1"
                    >
                      <Star 
                        className={`w-6 h-6 ${star <= detailedRatings.waitingTime ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rapport qualité/prix</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setDetailedRatings(prev => ({ ...prev, valueForMoney: star }))}
                      className="p-1"
                    >
                      <Star 
                        className={`w-6 h-6 ${star <= detailedRatings.valueForMoney ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">Votre avis *</div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience..."
              className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {comment.length} / 500 caractères
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Conseils:<br />
              • Soyez honnête et constructif<br />
              • Partagez des détails spécifiques<br />
              • Restez respectueux
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">Recommanderiez-vous cet hôpital? *</div>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={recommend === 'yes'}
                  onChange={() => setRecommend('yes')}
                  className="mr-2"
                />
                <span>Oui</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={recommend === 'no'}
                  onChange={() => setRecommend('no')}
                  className="mr-2"
                />
                <span>Non</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={recommend === 'maybe'}
                  onChange={() => setRecommend('maybe')}
                  className="mr-2"
                />
                <span>Peut-être</span>
              </label>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">Votre nom apparaîtra avec cet avis</div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                <User className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="flex-1 p-2 border border-gray-200 rounded-lg"
              />
            </div>
            <label className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Publier de manière anonyme</span>
            </label>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={overallRating === 0 || comment.trim() === ''}
            className={`w-full py-3 rounded-xl font-medium transition-colors ${
              overallRating > 0 && comment.trim() !== ''
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Publier mon avis
          </button>
        </div>
      </div>
    </div>
  );
};

const SuccessModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
        
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-12 h-12 text-green-600" />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Merci pour votre avis! 🙏
        </h2>
        
        <p className="text-gray-600 mb-6">
          Votre avis a été publié avec succès. Il aidera d&apos;autres personnes à choisir leur établissement de santé.
        </p>
        
        <div className="space-y-3">
          <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
            Voir mon avis
          </button>
          
          <button 
            onClick={onClose}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Retour au profil
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant principal
const HospitalDetailsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('announcements');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    // Récupérer l'hôpital depuis les données mock en utilisant l'ID
     const storedHospital = sessionStorage.getItem('selectedHospital');
    
    if (storedHospital) {
      setHospital(JSON.parse(storedHospital));
    } else {
      // Hôpital par défaut si vous accédez directement à la page
      setHospital(mockHospitals[1]);
    }
  }, []);
  
  if (!mounted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }
  
  if (!hospital) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Hôpital non trouvé</h1>
          <p className="text-gray-600 mb-4">L&apos;hôpital que vous recherchez n&apos;existe pas ou a été supprimé.</p>
          <button 
            onClick={() => router.push('/hospitals')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Retour à la liste des hôpitaux
          </button>
        </div>
      </div>
    );
  }
  
  // Récupérer les données mock pour les onglets
  const reviews = mockReviews.filter(review => review.hospitalId === hospital.id);
  const announcements = mockAnnouncements.filter(announcement => announcement.hospitalId === hospital.id);
  const articles = mockArticles.filter(article => article.hospitalId === hospital.id);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{hospital.name} - Santé Cameroun</title>
        <meta name="description" content={hospital.description} />
      </Head>
      
      {/* Header avec image de couverture et informations principales */}
      <HeaderSection 
        hospital={hospital} 
        isFollowing={isFollowing} 
        setIsFollowing={setIsFollowing} 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Cartes d'informations rapides */}
        <QuickInfoCards hospital={hospital} />
        
        {/* Informations de contact */}
        <ContactInformation hospital={hospital} />
        
        {/* Heures d'ouverture */}
        <OpeningHours hospital={hospital} />
        
        {/* Description */}
        <Description hospital={hospital} />
        
        {/* Services et spécialités */}
        <ServicesAndSpecialties hospital={hospital} />
        
        {/* Assurances acceptées */}
        <InsuranceSection hospital={hospital} />
        
        {/* Carte de localisation */}
        <LocationMap hospital={hospital} />
        
        {/* Navigation par onglets */}
        <TabsNavigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          counts={{
            announcements: announcements.length,
            articles: articles.length,
            reviews: reviews.length
          }} 
        />
        
        {/* Contenu des onglets */}
        {activeTab === 'announcements' && (
          <AnnouncementsTab announcements={announcements} />
        )}
        
        {activeTab === 'articles' && (
          <ArticlesTab articles={articles} />
        )}
        
        {activeTab === 'reviews' && (
          <ReviewsTab 
            reviews={reviews} 
            hospitalRating={hospital.rating} 
            totalReviews={hospital.totalReviews}
            hospitalName={hospital.name}
          />
        )}
      </main>
    </div>
  );
};

export default HospitalDetailsPage;