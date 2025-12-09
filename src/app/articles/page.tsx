/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
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
  Star,
  ChevronDown,
  X,
  Clock,
  Eye,
  MessageCircle,
  Heart,
  Grid,
  List,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Bookmark,
  Share2,
  Check,
  Sparkles,
  TrendingUp,
  Calendar,
  User,
  FileText,
  Info
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Category } from '@/types/category';
import { Organization } from '@/types/organization';
import { ArticleStatus } from '@/types/article';
import { getCloudinaryImageUrl } from '@/lib/cloudinary';
import { toast } from 'react-hot-toast';

// Types pour les articles
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
  status: ArticleStatus;
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

// Schéma de validation pour les filtres
const filtersSchema = z.object({
  category: z.string().optional(),
  organization: z.string().optional(),
  readingTime: z.string().optional(),
  date: z.string().optional(),
  featured: z.boolean().optional(),
});

type FiltersFormData = z.infer<typeof filtersSchema>;

// Mock data pour les articles
const mockArticles: Article[] = [
  {
    id: '1',
    organizationId: 'org1',
    title: 'Comment prévenir le paludisme pendant la saison des pluies au Cameroun',
    slug: 'prevenir-paludisme-saison-pluies-cameroun',
    content: 'Le paludisme reste l\'une des principales causes de morbidité et de mortalité au Cameroun...',
    excerpt: 'Le paludisme reste l\'une des principales causes de morbidité et de mortalité au Cameroun. Voici des conseils pratiques pour vous protéger.',
    featuredImage: 'malaria-prevention',
    thumbnailImage: 'malaria-prevention-thumb',
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
    content: 'La vaccination est l\'un des moyens les plus efficaces de protéger les enfants...',
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
];

// Mock categories (réutilisation de celui fourni)
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

// Composant Carousel pour articles en vedette (version améliorée)
function FeaturedCarousel({ articles }: { articles: Article[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [preloadedImages, setPreloadedImages] = useState<{[key: string]: boolean}>({});
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const featuredArticles = articles.filter(article => article.isFeatured);
  
  // Gestion du swipe pour mobile
  const minSwipeDistance = 50;
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };
  
  // Précharger toutes les images du carrousel
  useEffect(() => {
    const images: {[key: string]: boolean} = {};
    
    featuredArticles.forEach((article) => {
      const img = new Image();
      img.src = getCloudinaryImageUrl(article.featuredImage, { 
        width: 800, 
        height: 400, 
        crop: 'fill',
      });
      img.onload = () => {
        images[article.id] = true;
        setPreloadedImages(prev => ({...prev, [article.id]: true}));
      };
    });
  }, [featuredArticles]);
  
  useEffect(() => {
    if (!isAutoPlaying || featuredArticles.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredArticles.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredArticles.length]);
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredArticles.length);
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);
  };
  
  if (featuredArticles.length === 0) return null;
  
  const currentArticle = featuredArticles[currentIndex];
  
  return (
    <section 
      className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-gray-900"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Conteneur avec positionnement absolu pour éviter les espaces blancs */}
      <div className="relative w-full h-full">
        {/* Arrière-plan avec l'image précédente pendant la transition */}
        {currentIndex > 0 && (
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${getCloudinaryImageUrl(featuredArticles[currentIndex - 1].featuredImage, { 
                width: 800, 
                height: 400, 
                crop: 'fill',
              })})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 1
            }}
          />
        )}
        
        {/* Arrière-plan avec l'image suivante pendant la transition */}
        {currentIndex < featuredArticles.length - 1 && (
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${getCloudinaryImageUrl(featuredArticles[currentIndex + 1].featuredImage, { 
                width: 800, 
                height: 400, 
                crop: 'fill',
              })})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 1
            }}
          />
        )}
        
        <AnimatePresence mode="sync">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full z-10"
          >
            <img
              src={getCloudinaryImageUrl(currentArticle.featuredImage, { 
                width: 800, 
                height: 400, 
                crop: 'fill',
              })}
              alt={currentArticle.title}
              className="w-full h-full object-cover"
              style={{ display: preloadedImages[currentArticle.id] ? 'block' : 'none' }}
            />
            
            {/* Fallback pendant le chargement */}
            {!preloadedImages[currentArticle.id] && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
              {/* Badge featured */}
              <div className="inline-flex items-center px-3 py-1 bg-amber-500 rounded-full mb-3">
                <Star className="h-3 w-3 mr-1" />
                <span className="text-xs font-bold">EN VEDETTE</span>
              </div>
              
              {/* Category */}
              <div className="flex items-center mb-2">
                <span className="text-xs font-medium opacity-90">
                  {currentArticle.category?.name?.toUpperCase()}
                </span>
              </div>
              
              {/* Title */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 line-clamp-2">
                {currentArticle.title}
              </h2>
              
              {/* Author info */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium mr-3">{currentArticle.author}</span>
                <span className="text-sm opacity-75">• {currentArticle.readingTime} min</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation arrows */}
      {featuredArticles.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 z-20"
            aria-label="Article précédent"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 z-20"
            aria-label="Article suivant"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </>
      )}
      
      {/* Pagination dots */}
      {featuredArticles.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {featuredArticles.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-6' : 'bg-white/50'
              }`}
              aria-label={`Aller à l'article ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// Composant carte d'article (vue liste)
function ArticleCard({ article }: { article: Article }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const router = useRouter();
  
  const handleViewArticle = () => {
    router.push(`/articles/details`);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  const formatViews = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleViewArticle}
    >
      <div className="flex p-3 sm:p-4">
        {/* Image */}
        <div className="w-24 h-24 sm:w-30 sm:h-30 rounded-xl overflow-hidden shrink-0 mr-3 sm:mr-4">
          <img
            src={getCloudinaryImageUrl(article.featuredImage, { 
              width: 120, 
              height: 120, 
              crop: 'fill' 
            })}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              {/* Category */}
              <div className="text-xs font-medium text-teal-600 mb-1 uppercase tracking-wide">
                {article.category?.name}
              </div>
              
              {/* Title */}
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg line-clamp-2 mb-2">
                {article.title}
              </h3>
            </div>
            
            {/* Bookmark */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsBookmarked(!isBookmarked);
              }}
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors ml-2"
              aria-label={isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
            </button>
          </div>
          
          {/* Excerpt */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {article.excerpt}
          </p>
          
          {/* Author and date */}
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
              <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                {article.author}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(article.publishedAt)} • {article.readingTime} min de lecture
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center space-x-3 sm:space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {formatViews(article.viewsCount)}
            </div>
            <div className="flex items-center">
              <MessageCircle className="h-3 w-3 mr-1" />
              {article.commentsCount}
            </div>
            <div className="flex items-center">
              <Heart className="h-3 w-3 mr-1" />
              {article.reactionsCount}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// Composant carte d'article (vue grille)
function ArticleGridCard({ article }: { article: Article }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const router = useRouter();
  
  const handleViewArticle = () => {
    router.push(`/articles/details`);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    });
  };
  
  const formatViews = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };
  
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleViewArticle}
    >
      {/* Image */}
      <div className="relative">
        <div className="w-full h-36 sm:h-40 overflow-hidden">
          <img
            src={getCloudinaryImageUrl(article.featuredImage, { 
              width: 300, 
              height: 200, 
              crop: 'fill' 
            })}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Bookmark */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsBookmarked(!isBookmarked);
          }}
          className="absolute top-2 right-2 p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300"
          aria-label={isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Bookmark className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-3 sm:p-4">
        {/* Category */}
        <div className="text-xs font-medium text-teal-600 mb-1 uppercase tracking-wide">
          {article.category?.name}
        </div>
        
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 mb-2">
          {article.title}
        </h3>
        
        {/* Author and date */}
        <div className="flex items-center mb-2">
          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-2">
            <User className="h-3 w-3 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">
              {article.author}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(article.publishedAt)} • {article.readingTime} min
            </p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-0.5" />
              {formatViews(article.viewsCount)}
            </div>
            <div className="flex items-center">
              <Heart className="h-3 w-3 mr-0.5" />
              {article.reactionsCount}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// Composant filtres et tri
function FiltersSortSection({ 
  activeFiltersCount, 
  onOpenFilters,
  sortOption,
  onSortChange
}: { 
  activeFiltersCount: number; 
  onOpenFilters: () => void;
  sortOption: string;
  onSortChange: (option: string) => void;
}) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const sortOptions = [
    { value: 'recent', label: 'Plus récents' },
    { value: 'popular', label: 'Plus lus' },
    { value: 'rated', label: 'Mieux notés' },
  ];
  
  return (
    <div className="bg-gray-50 px-4 py-3 sticky top-0 z-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        {/* Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={onOpenFilters}
            className="flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 whitespace-nowrap"
          >
            <Filter className="h-3.5 w-3.5 mr-1" />
            Filtres
            {activeFiltersCount > 0 && (
              <span className="ml-1 bg-teal-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
          
          <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 whitespace-nowrap">
            Catégorie ▼
          </button>
          
          <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 whitespace-nowrap">
            Hôpital ▼
          </button>
        </div>
        
        {/* Sort */}
        <div className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 whitespace-nowrap"
          >
            Trier par: {sortOptions.find(o => o.value === sortOption)?.label}
            <ChevronDown className={`h-3.5 w-3.5 ml-1 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isSortOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 w-40 sm:w-48"
              >
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-all duration-200 flex items-center justify-between ${
                      sortOption === option.value ? 'bg-teal-50 text-teal-600' : ''
                    }`}
                  >
                    {option.label}
                    {sortOption === option.value && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Composant catégories rapides
function QuickCategories({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}: { 
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}) {
  return (
    <section className="bg-white px-4 py-3 border-b border-gray-100">
      <h2 className="text-sm font-medium text-gray-700 mb-2">Parcourir par catégorie:</h2>
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => onCategorySelect(null)}
          className={`px-3 sm:px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
            !selectedCategory 
              ? 'bg-teal-600 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tous
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center ${
              selectedCategory === category.id
                ? 'bg-teal-600 text-white shadow-md'
                : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="mr-1">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
    </section>
  );
}

// Composant modal de filtres
function FiltersModal({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange,
  onApplyFilters,
  onResetFilters,
  categories
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  filters: FiltersFormData; 
  onFiltersChange: (filters: FiltersFormData) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  categories: Category[];
}) {
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
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          aria-label="Fermer le modal"
        />
        
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-t-3xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <header className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between z-10">
            <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
              aria-label="Fermer"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </header>
          
          {/* Content */}
          <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-4 space-y-6">
            {/* Category */}
            <section>
              <h3 className="font-medium text-gray-900 mb-3">Catégorie</h3>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    className="mr-3 text-teal-600 focus:ring-teal-500"
                    checked={!filters.category}
                    onChange={() => onFiltersChange({ ...filters, category: undefined })}
                  />
                  <span className="text-sm">Toutes ({categories.reduce((sum, cat) => sum + cat.articlesCount, 0)})</span>
                </label>
                
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      className="mr-3 text-teal-600 focus:ring-teal-500"
                      checked={filters.category === category.id}
                      onChange={() => onFiltersChange({ ...filters, category: category.id })}
                    />
                    <span className="text-sm">{category.icon} {category.name} ({category.articlesCount})</span>
                  </label>
                ))}
              </div>
            </section>
            
            {/* Reading time */}
            <section>
              <h3 className="font-medium text-gray-900 mb-3">Temps de lecture</h3>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="readingTime"
                    className="mr-3 text-teal-600 focus:ring-teal-500"
                    checked={filters.readingTime === 'short'}
                    onChange={() => onFiltersChange({ ...filters, readingTime: 'short' })}
                  />
                  <span className="text-sm">Lecture rapide (&lt; 5 min)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="readingTime"
                    className="mr-3 text-teal-600 focus:ring-teal-500"
                    checked={filters.readingTime === 'medium'}
                    onChange={() => onFiltersChange({ ...filters, readingTime: 'medium' })}
                  />
                  <span className="text-sm">Lecture moyenne (5-10 min)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="readingTime"
                    className="mr-3 text-teal-600 focus:ring-teal-500"
                    checked={filters.readingTime === 'long'}
                    onChange={() => onFiltersChange({ ...filters, readingTime: 'long' })}
                  />
                  <span className="text-sm">Lecture longue (&gt; 10 min)</span>
                </label>
              </div>
            </section>
            
            {/* Date */}
            <section>
              <h3 className="font-medium text-gray-900 mb-3">Date de publication</h3>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="date"
                    className="mr-3 text-teal-600 focus:ring-teal-500"
                    checked={!filters.date}
                    onChange={() => onFiltersChange({ ...filters, date: undefined })}
                  />
                  <span className="text-sm">Toutes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="date"
                    className="mr-3 text-teal-600 focus:ring-teal-500"
                    checked={filters.date === 'week'}
                    onChange={() => onFiltersChange({ ...filters, date: 'week' })}
                  />
                  <span className="text-sm">Cette semaine</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="date"
                    className="mr-3 text-teal-600 focus:ring-teal-500"
                    checked={filters.date === 'month'}
                    onChange={() => onFiltersChange({ ...filters, date: 'month' })}
                  />
                  <span className="text-sm">Ce mois-ci</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="date"
                    className="mr-3 text-teal-600 focus:ring-teal-500"
                    checked={filters.date === 'year'}
                    onChange={() => onFiltersChange({ ...filters, date: 'year' })}
                  />
                  <span className="text-sm">Cette année</span>
                </label>
              </div>
            </section>
          </div>
          
          {/* Footer */}
          <footer className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4 flex items-center justify-between">
            <button
              onClick={onResetFilters}
              className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900 transition-colors"
            >
              Réinitialiser
            </button>
            <button
              onClick={() => { onApplyFilters(); onClose(); }}
              className="px-6 py-2 bg-teal-600 text-white font-medium rounded-full hover:bg-teal-700 transition-all duration-300 shadow-md"
            >
              Appliquer les filtres
            </button>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Composant état vide
function EmptyState({ onResetFilters }: { onResetFilters: () => void }) {
  return (
    <section className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-60 h-45 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
        <FileText className="h-20 w-20 text-gray-400" />
      </div>
      
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
        Aucun article trouvé
      </h2>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        Essayez d&apos;ajuster vos filtres ou explorez d&apos;autres catégories.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onResetFilters}
          className="px-6 py-2.5 bg-white text-teal-600 font-medium rounded-full border border-teal-600 hover:bg-teal-50 transition-all duration-300"
        >
          Réinitialiser les filtres
        </button>
        <button className="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-full hover:bg-teal-700 transition-all duration-300 shadow-md">
          Voir tous les articles
        </button>
      </div>
    </section>
  );
}
// Page principale
// Page principale
export default function ArticlesPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [filters, setFilters] = useState<FiltersFormData>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState('recent');
  
  // Calculer le nombre de filtres actifs
  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== false
  ).length;
  
  // Appliquer les filtres et le tri
  const filteredArticles = useMemo(() => {
    let filtered = [...mockArticles];
    
    // Filtrage par catégorie
    if (selectedCategory) {
      filtered = filtered.filter(article => article.categoryId === selectedCategory);
    }
    
    // Filtrage par temps de lecture
    if (filters.readingTime === 'short') {
      filtered = filtered.filter(article => article.readingTime < 5);
    } else if (filters.readingTime === 'medium') {
      filtered = filtered.filter(article => article.readingTime >= 5 && article.readingTime <= 10);
    } else if (filters.readingTime === 'long') {
      filtered = filtered.filter(article => article.readingTime > 10);
    }
    
    // Filtrage par date
    if (filters.date === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(article => new Date(article.publishedAt) >= weekAgo);
    } else if (filters.date === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(article => new Date(article.publishedAt) >= monthAgo);
    } else if (filters.date === 'year') {
      const yearAgo = new Date();
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      filtered = filtered.filter(article => new Date(article.publishedAt) >= yearAgo);
    }
    
    // Tri des résultats
    if (sortOption === 'recent') {
      filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sortOption === 'popular') {
      filtered.sort((a, b) => b.viewsCount - a.viewsCount);
    } else if (sortOption === 'rated') {
      filtered.sort((a, b) => b.reactionsCount - a.reactionsCount);
    }
    
    return filtered;
  }, [filters, selectedCategory, sortOption, mockArticles]);
  
  // Fonction pour réinitialiser les filtres
  const handleResetFilters = () => {
    setFilters({});
    setSelectedCategory(null);
  };
  
  // Fonction pour appliquer les filtres
  const handleApplyFilters = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast('Filtres appliqués avec succès', {
        icon: '✅',
      });
    }, 500);
  };
  
  // Fonction pour charger plus d'articles
  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast('Tous les articles ont été chargés', {
        icon: 'ℹ️',
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
            className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
            aria-label="Retour"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          
          <h1 className="text-lg font-semibold text-gray-900">Articles de santé</h1>
          
          <div className="flex items-center space-x-2">
            <button 
              className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
              aria-label="Rechercher"
            >
              <Search className="h-5 w-5 text-gray-700" />
            </button>
            <button 
              className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
              aria-label="Paramètres"
            >
              <Settings className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Featured carousel */}
      <FeaturedCarousel articles={articles} />
      
      {/* Filters and sort */}
      <FiltersSortSection
        activeFiltersCount={activeFiltersCount}
        onOpenFilters={() => setIsFiltersModalOpen(true)}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />
      
      {/* Quick categories */}
      <QuickCategories
        categories={mockCategories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      
      {/* Results header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-sm text-gray-600">
            {filteredArticles.length} articles trouvés
          </h2>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-full transition-all duration-300 ${
                viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'
              }`}
              aria-label="Vue liste"
            >
              <List className={`h-4 w-4 ${viewMode === 'list' ? 'text-teal-600' : 'text-gray-600'}`} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-all duration-300 ${
                viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'
              }`}
              aria-label="Vue grille"
            >
              <Grid className={`h-4 w-4 ${viewMode === 'grid' ? 'text-teal-600' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <main className="pb-20">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
          </div>
        ) : filteredArticles.length > 0 ? (
          <>
            {viewMode === 'list' ? (
              <div className="space-y-4 px-4 py-4">
                <AnimatePresence>
                  {filteredArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 px-4 py-4">
                <AnimatePresence>
                  {filteredArticles.map((article) => (
                    <ArticleGridCard
                      key={article.id}
                      article={article}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
            
            {/* Load more */}
            <div className="flex justify-center py-8">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="px-6 py-3 bg-white text-teal-600 font-medium rounded-full border border-teal-600 hover:bg-teal-50 transition-all duration-300 disabled:opacity-50 shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
                    Chargement...
                  </>
                ) : (
                  'Charger plus d\'articles (20)'
                )}
              </button>
            </div>
          </>
        ) : (
          <EmptyState onResetFilters={handleResetFilters} />
        )}
      </main>
      
      {/* Filters modal */}
      <FiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        categories={mockCategories}
      />
    </div>
  );
}