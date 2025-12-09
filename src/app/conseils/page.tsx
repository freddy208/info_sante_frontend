/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Settings, 
  Heart,
  ChevronDown,
  X,
  TrendingUp,
  Eye,
  MessageCircle,
  Share2,
  Users,
  Target,
  Calendar,
  Clock,
  Check,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Shield,
  Star,
  Loader2,
  Plus,
  ChevronRight,
  Sparkles,
  Activity,
  Droplets,
  Apple,
  HeartHandshake,
  Brain,
  Pill,
  Stethoscope,
  Baby,
  User,
  Home,
  Flame
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Types
import { 
  Advice, 
  AdviceStatus, 
  Priority, 
  TargetAudience,
  PaginatedAdvicesResponse 
} from '@/types/advice';

// Mock data
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
  }
];

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

// Composant principal
export default function AdvicesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [advices, setAdvices] = useState<Advice[]>(mockAdvices);
  const [filteredAdvices, setFilteredAdvices] = useState<Advice[]>(mockAdvices);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(mockAdvices.length);
  
  // S'assurer que le code s'exécute côté client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Featured advice (high priority)
  const featuredAdvice = useMemo(() => {
    return advices.find(advice => advice.priority === Priority.HIGH || advice.priority === Priority.URGENT) || advices[0];
  }, [advices]);
  
  // Filter advices
  useEffect(() => {
    let filtered = [...advices];
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(advice => advice.categoryId === selectedCategory);
    }
    
    // Filter by priority
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(advice => advice.priority === selectedPriority);
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(advice => 
        advice.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        advice.content.toLowerCase().includes(lowerCaseSearchTerm) ||
        advice.category?.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    
    setFilteredAdvices(filtered);
    setTotal(filtered.length);
    setTotalPages(Math.ceil(filtered.length / 6)); // 6 items per page
  }, [advices, selectedCategory, selectedPriority, searchTerm]);
  
  // Get priority color and icon
  const getPriorityInfo = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT:
        return { color: '#E53935', bgColor: '#FFEBEE', label: 'Urgente', icon: AlertTriangle };
      case Priority.HIGH:
        return { color: '#FF6F00', bgColor: '#FFF3E0', label: 'Haute', icon: Flame };
      case Priority.MEDIUM:
        return { color: '#FFA000', bgColor: '#FFF8E1', label: 'Moyenne', icon: TrendingUp };
      case Priority.LOW:
        return { color: '#43A047', bgColor: '#E8F5E9', label: 'Basse', icon: CheckCircle };
      default:
        return { color: '#757575', bgColor: '#F5F5F5', label: 'Normale', icon: Info };
    }
  };
  
  // Get category icon
  const getCategoryIcon = (categoryName: string) => {
    const category = mockCategories.find(c => c.name === categoryName);
    return category ? category.icon : '💡';
  };
  
  // Format audience
  const formatAudience = (audience: TargetAudience[]) => {
    if (audience.includes(TargetAudience.ALL)) return 'Tout public';
    
    const audienceMap = {
      [TargetAudience.ALL]: 'Tout public',
      [TargetAudience.CHILDREN]: 'Enfants',
      [TargetAudience.INFANTS]: 'Nourrissons',
      [TargetAudience.ADULTS]: 'Adultes',
      [TargetAudience.ELDERLY]: 'Personnes âgées',
      [TargetAudience.PREGNANT_WOMEN]: 'Femmes enceintes',
    };
    
    return audience.map(a => audienceMap[a]).join(', ');
  };
  
  // Format stats
  const formatStats = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };
  
  // Handle like
  const handleLike = (id: string) => {
    setAdvices(advices.map(advice => 
      advice.id === id 
        ? { ...advice, reactionsCount: advice.reactionsCount + 1 }
        : advice
    ));
    toast('Conseil aimé!', { icon: '❤️' });
  };
  
  // Handle share
  const handleShare = (id: string) => {
    navigator.clipboard.writeText(window.location.origin + '/advices/' + id);
    toast('Lien copié!', { icon: '📋' });
  };
  
  // Handle view details
  const handleViewDetails = (id: string, slug: string) => {
    router.push(`/conseils/details`);
  };
  
  // Load more
  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(page + 1);
    } else {
      toast('Tous les conseils ont été chargés', { icon: 'ℹ️' });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          
          <h1 className="text-lg font-semibold text-gray-900">Conseils santé</h1>
          
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Rechercher">
            <Search className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </header>
      
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-400 px-4 sm:px-6 py-6 sm:py-8 rounded-b-3xl">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Conseils santé du jour</h2>
          <p className="text-white/80 text-sm sm:text-base max-w-md">Découvrez des astuces quotidiennes pour rester en bonne santé</p>
        </div>
      </section>
      
      {/* Filters Bar */}
      <section className="bg-white px-4 py-4 border-b border-gray-100">
        {/* Categories */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Catégories:</p>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                !selectedCategory
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
            
            {mockCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex items-center ${
                  selectedCategory === category.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Priority Filter */}
        <div className="relative">
          <p className="text-sm text-gray-600 mb-2">Priorité:</p>
          <button
            onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-left flex items-center justify-between hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
          >
            <span className="text-sm sm:text-base">
              {selectedPriority === 'all' 
                ? 'Toutes' 
                : getPriorityInfo(selectedPriority as Priority).label
              }
            </span>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showPriorityDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showPriorityDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10"
              >
                <button
                  onClick={() => {
                    setSelectedPriority('all');
                    setShowPriorityDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                    selectedPriority === 'all' ? 'bg-teal-50 text-teal-600' : ''
                  }`}
                >
                  <span className="text-sm sm:text-base">Toutes</span>
                  {selectedPriority === 'all' && <Check className="h-4 w-4" />}
                </button>
                
                {Object.values(Priority).map((priority) => (
                  <button
                    key={priority}
                    onClick={() => {
                      setSelectedPriority(priority);
                      setShowPriorityDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                      selectedPriority === priority ? 'bg-teal-50 text-teal-600' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: getPriorityInfo(priority).color }}
                      />
                      <span className="text-sm sm:text-base">{getPriorityInfo(priority).label}</span>
                    </div>
                    {selectedPriority === priority && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
            
      {/* Featured Advice */}
      {featuredAdvice && (
        <section className="px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-500 rounded-2xl p-4 sm:p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
            onClick={() => handleViewDetails(featuredAdvice.id, featuredAdvice.title.toLowerCase().replace(/\s+/g, '-'))}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-4 text-2xl sm:text-3xl">
                {featuredAdvice.icon}
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{featuredAdvice.title}</h3>
              
              <p className="text-gray-700 text-sm sm:text-base mb-6 text-center line-clamp-3">{featuredAdvice.content}</p>
              
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {featuredAdvice.organization?.name}
                </div>
                
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {formatAudience(featuredAdvice.targetAudience || [])}
                </div>
                
                {(() => {
                  const priorityInfo = getPriorityInfo(featuredAdvice.priority);
                  return (
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      {priorityInfo.icon && <priorityInfo.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />}
                      <span style={{ color: priorityInfo.color }}>
                        Priorité {priorityInfo.label}
                      </span>
                    </div>
                  );
                })()}
              </div>
              
              <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-sm text-gray-600">
                <button
                  onClick={() => handleLike(featuredAdvice.id)}
                  className="flex items-center hover:text-red-500 transition-colors"
                >
                  <Heart className="h-4 w-4 mr-1" />
                  {formatStats(featuredAdvice.reactionsCount)}
                </button>
                
                <button className="flex items-center hover:text-blue-500 transition-colors">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  45
                </button>
                
                <button
                  onClick={() => handleShare(featuredAdvice.id)}
                  className="flex items-center hover:text-green-500 transition-colors"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  {formatStats(featuredAdvice.sharesCount)}
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      )}
      
      {/* All Advices Header */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Tous les conseils</h3>
        </div>
        
        <p className="text-sm text-gray-500">{total} conseils disponibles</p>
      </section>
      
      {/* Advice Cards */}
      <main className="px-4 pb-24">
        <div className="space-y-4">
          {filteredAdvices.slice(0, page * 6).map((advice) => {
            const priorityInfo = getPriorityInfo(advice.priority);
            
            return (
              <motion.article
                key={advice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{
                  borderLeft: `4px solid ${priorityInfo.color}`,
                  backgroundColor: priorityInfo.bgColor + '20'
                }}
                onClick={() => handleViewDetails(advice.id, advice.title.toLowerCase().replace(/\s+/g, '-'))}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4 shadow-sm flex-shrink-0">
                      <span className="text-xl sm:text-2xl">{advice.icon}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{advice.title}</h4>
                      
                      <p className="text-gray-700 text-sm sm:text-base mb-4 line-clamp-2">{advice.content}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center">
                          <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {advice.organization?.name}
                        </div>
                        
                        <div className="flex items-center">
                          <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {formatAudience(advice.targetAudience || [])}
                        </div>
                        
                        <div className="flex items-center">
                          <div 
                            className="w-2 h-2 rounded-full mr-1"
                            style={{ backgroundColor: priorityInfo.color }}
                          />
                          <span style={{ color: priorityInfo.color }}>
                            Priorité {priorityInfo.label}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 sm:space-x-4 text-sm text-gray-600">
                          <button
                            onClick={() => handleLike(advice.id)}
                            className="flex items-center hover:text-red-500 transition-colors"
                          >
                            <Heart className="h-4 w-4 mr-1" />
                            {formatStats(advice.reactionsCount)}
                          </button>
                          
                          <button className="flex items-center hover:text-blue-500 transition-colors">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {isClient ? Math.floor(Math.random() * 100) : 0}
                          </button>
                          
                          <button
                            onClick={() => handleShare(advice.id)}
                            className="flex items-center hover:text-green-500 transition-colors"
                          >
                            <Share2 className="h-4 w-4 mr-1" />
                            {formatStats(advice.sharesCount)}
                          </button>
                        </div>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(advice.id, advice.title.toLowerCase().replace(/\s+/g, '-'));
                          }}
                          className="text-teal-600 hover:text-teal-700 transition-colors flex items-center text-sm sm:text-base font-medium"
                        >
                          Voir plus
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
        
        {/* Load More */}
        {page < totalPages && (
          <div className="flex justify-center mt-6 sm:mt-8">
            <button
              onClick={handleLoadMore}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white border border-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Chargement...
                </>
              ) : (
                <>
                  Charger plus de conseils ({Math.min(6, total - page * 6)})
                </>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}