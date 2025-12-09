/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Star,
  Settings,
  Share2,
  Heart,
  MessageCircle,
  Bookmark,
  Clock,
  Eye,
  User,
  Calendar,
  ChevronDown,
  ChevronRight,
  X,
  Check,
  Send,
  MoreVertical,
  Info,
  Lightbulb,
  AlertTriangle,
  ExternalLink,
  TrendingUp,
  Filter,
  Search,
  Smile,
  Hash,
  Users,
  FileText,
  Shield,
  ThumbsUp,
  Reply,
  Link2,
  Twitter,
  Facebook
} from 'lucide-react';
import { getCloudinaryImageUrl } from '@/lib/cloudinary';
import { toast } from 'react-hot-toast';
import { ArticleStatus } from '@/types/article';
import { Category } from '@/types/category';

// Types
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
  status: string;
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
    color: string;
  };
}

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  createdAt: string;
  likes: number;
  isAuthor?: boolean;
  replies?: Comment[];
}

// Mock data
const mockArticle: Article = {
  id: '1',
  organizationId: 'org1',
  title: 'Les 5 signes du paludisme à ne pas ignorer',
  slug: 'les-5-signes-du-paludisme-a-ne-pas-ignorer',
  content: `
    <p>Le paludisme reste l'une des principales causes de mortalité en Afrique subsaharienne, particulièrement chez les enfants de moins de 5 ans et les femmes enceintes.</p>
    
    <h2>Introduction</h2>
    <p>Chaque année, des millions de cas sont recensés au Cameroun. La détection précoce des symptômes peut sauver des vies.</p>
    
    <h3>1. La fièvre persistante</h3>
    <p>La fièvre est le symptôme le plus courant du paludisme. Elle apparaît généralement entre 10 et 15 jours après la piqûre du moustique infecté.</p>
    
    <div class="info-box">
      <p><strong>Caractéristiques de la fièvre paludéenne:</strong></p>
      <ul>
        <li>Température supérieure à 38°C</li>
        <li>Pics de fièvre tous les 2-3 jours</li>
        <li>Frissons intenses</li>
        <li>Sueurs abondantes après les frissons</li>
      </ul>
    </div>
    
    <div class="warning-box">
      <p><strong>⚠️ IMPORTANT:</strong> Si la fièvre persiste plus de 48 heures, consultez immédiatement un médecin.</p>
    </div>
    
    <h3>2. Les maux de tête sévères</h3>
    <p>Les céphalées intenses sont fréquentes chez les personnes atteintes de paludisme. Elles diffèrent des maux de tête ordinaires par leur intensité et leur persistance.</p>
    
    <h3>3. Les douleurs musculaires</h3>
    <p>Les courbatures et douleurs musculaires généralisées sont un signe caractéristique de l'infection palustre.</p>
    
    <h3>4. Les nausées et vomissements</h3>
    <p>Les troubles gastro-intestinaux accompagnent souvent la fièvre et les maux de tête.</p>
    
    <h3>5. La fatigue extrême</h3>
    <p>Une fatigue intense et persistante, même après le repos, est un symptôme à ne pas négliger.</p>
    
    <div class="tip-box">
      <p><strong>💡 CONSEIL PRATIQUE:</strong> Dormez toujours sous une moustiquaire imprégnée d'insecticide. C'est le moyen le plus efficace de prévention.</p>
    </div>
    
    <h2>Conclusion</h2>
    <p>La connaissance de ces 5 signes peut vous permettre de détecter rapidement le paludisme et de consulter un médecin à temps. N'attendez pas que les symptômes s'aggravent.</p>
    
    <p>En cas de doute, consultez toujours un professionnel de santé.</p>
  `,
  excerpt: 'Le paludisme reste l\'une des principales causes de mortalité en Afrique subsaharienne. Voici les 5 signes à ne pas ignorer.',
  featuredImage: 'malaria-prevention',
  thumbnailImage: 'malaria-symptoms-thumb',
  categoryId: '3',
  author: 'Dr. Jean Kamga',
  readingTime: 5,
  tags: ['paludisme', 'santé', 'prévention', 'afrique', 'dépistage'],
  viewsCount: 3542,
  sharesCount: 156,
  commentsCount: 89,
  reactionsCount: 456,
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
    name: 'Hôpital Général de Douala',
    logo: 'hgd-logo',
    phone: '+237 233 42 11 31'
  },
  category: { 
    id: '3', 
    name: 'Paludisme',
    slug: 'paludisme',
    color: '#f59e0b'
  }
};

const mockRelatedArticles = [
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
];

const mockComments: Comment[] = [
  {
    id: '1',
    author: 'Marie Kamga',
    content: 'Article très informatif! J\'ai reconnu ces symptômes chez mon enfant et je l\'ai emmené consulter à temps. Merci Docteur! 🙏',
    createdAt: '3h',
    likes: 24,
    replies: [
      {
        id: '1-1',
        author: 'Dr. Jean Kamga',
        content: 'Merci pour votre retour Marie! Ravi que cet article ait pu vous aider. N\'hésitez pas si vous avez des questions.',
        createdAt: '2h',
        likes: 8,
        isAuthor: true
      },
      {
        id: '1-2',
        author: 'Paul Nguema',
        content: 'Très utile, merci!',
        createdAt: '1h',
        likes: 5
      }
    ]
  },
  {
    id: '2',
    author: 'Thomas Mbarga',
    content: 'Excellente synthèse des symptômes. Je partage autour de moi pour sensibiliser.',
    createdAt: '5h',
    likes: 15
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


// Composant principal
export default function ArticleDetailPage() {  
  const router = useRouter();
  const [article] = useState<Article>(mockArticle);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  // Assurez-vous que toutes ces variables d'état sont bien définies
  const [isSharePopoverOpen, setIsSharePopoverOpen] = useState(false); // État pour contrôler l'affichage du popover
  const [likeCount, setLikeCount] = useState(article.reactionsCount);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    toast(isLiked ? 'Like retiré' : 'Article liké!', {
      icon: isLiked ? '💔' : '❤️',
    });
  };
  
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast(isBookmarked ? 'Retiré des favoris' : 'Ajouté aux favoris!', {
      icon: isBookmarked ? '🔖' : '⭐',
    });
  };
  
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast(isFollowing ? 'Vous ne suivez plus cet auteur' : 'Vous suivez maintenant cet auteur!', {
      icon: isFollowing ? '👋' : '✅',
    });
  };

  const handleShare = (platform?: string) => {
    if (platform === 'copy') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      toast('Lien copié!', { icon: '📋' });
    } else {
      toast(`Partage sur ${platform} bientôt disponible!`, { icon: '🚀' });
    }
    setShowShareOptions(false);
  };
  
  const handleComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        author: 'Vous',
        content: commentText,
        createdAt: 'maintenant',
        likes: 0
      };
      setComments([newComment, ...comments]);
      setCommentText('');
      setShowCommentModal(false);
      toast('Commentaire publié!', { icon: '✅' });
    }
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
  
  const renderContent = (content: string) => {
    return content
      .replace(/<h2>/g, '<h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4">')
      .replace(/<h3>/g, '<h3 class="text-lg sm:text-xl font-semibold text-gray-900 mt-4 sm:mt-6 mb-2 sm:mb-3 border-b border-gray-200 pb-2">')
      .replace(/<p>/g, '<p class="text-base sm:text-lg text-gray-700 leading-6 sm:leading-7 mb-3 sm:mb-4">')
      .replace(/<ul>/g, '<ul class="space-y-1 sm:space-y-2 mb-3 sm:mb-4">')
      .replace(/<li>/g, '<li class="flex items-start"><span class="text-teal-600 mr-2">•</span><span>')
      .replace(/<\/li>/g, '</span></li>')
      .replace(/<div class="info-box">/g, '<div class="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">')
      .replace(/<div class="warning-box">/g, '<div class="bg-amber-50 border-l-4 border-amber-500 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">')
      .replace(/<div class="tip-box">/g, '<div class="bg-green-50 border-l-4 border-green-500 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">')
      .replace(/<strong>/g, '<strong class="font-semibold">');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header transparent */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrollY > 100 ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className={`p-2 rounded-full transition-all duration-300 ${
              scrollY > 100 ? 'hover:bg-gray-100' : 'hover:bg-white/20'
            }`}
            aria-label="Retour"
          >
            <ArrowLeft className={`h-5 w-5 ${scrollY > 100 ? 'text-gray-700' : 'text-white'}`} />
          </button>
          
          <h1 className="text-base sm:text-lg font-semibold text-gray-900">Article</h1>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full transition-all duration-300 ${
                scrollY > 100 ? 'hover:bg-gray-100' : 'hover:bg-white/20'
              }`}
              aria-label={isLiked ? "Retirer le like" : "Ajouter un like"}
            >
              <Star className={`h-5 w-5 ${scrollY > 100 ? 'text-gray-700' : 'text-white'} ${isLiked ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </button>
            <button 
              className={`p-2 rounded-full transition-all duration-300 ${
                scrollY > 100 ? 'hover:bg-gray-100' : 'hover:bg-white/20'
              }`}
              aria-label="Paramètres"
            >
              <Settings className={`h-5 w-5 ${scrollY > 100 ? 'text-gray-700' : 'text-white'}`} />
            </button>
            <button
              onClick={() => setShowShareOptions(true)}
              className={`p-2 rounded-full transition-all duration-300 ${
                scrollY > 100 ? 'hover:bg-gray-100' : 'hover:bg-white/20'
              }`}
              aria-label="Partager"
            >
              <Share2 className={`h-5 w-5 ${scrollY > 100 ? 'text-gray-700' : 'text-white'}`} />
            </button>
          </div>
        </div>
      </motion.header>
      
      {/* Hero Image */}
      <section className="relative h-56 sm:h-64 md:h-80 overflow-hidden">
        <img
          src={getCloudinaryImageUrl(article.featuredImage, { 
            width: 800, 
            height: 400, 
            crop: 'fill'
          })}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Category badge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-8 sm:bottom-10 left-4"
        >
          <div 
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-md shadow-lg border border-white/20 bg-gradient-to-r ${getCategoryColor(article.category.name)}`}
          >
            <span className="text-xs sm:text-sm font-bold text-white flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
              {article.category.name.toUpperCase()}
            </span>
          </div>
        </motion.div>
        
        {/* Reading time badge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="absolute bottom-8 sm:bottom-10 right-4"
        >
          <div className="px-3 py-1.5 sm:px-3 sm:py-2 rounded-full backdrop-blur-md bg-black/40 shadow-lg border border-white/20">
            <div className="flex items-center text-white">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
              <span className="text-xs sm:text-sm font-medium">{article.readingTime} min</span>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* Content Section */}
      <div className="bg-white rounded-t-3xl -mt-6 relative shadow-lg">
        <div className="p-4 sm:p-6">
          {/* Article Header */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6"
          >
            {article.title}
          </motion.h1>
          
          {/* Author & Meta Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 shadow-md">
                  <User className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base sm:text-lg">{article.author}</p>
                  <p className="text-sm text-gray-600 font-medium">Médecin Généraliste</p>
                  <p className="text-xs sm:text-sm text-gray-500">{article.organization.name}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFollow}
                className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all shadow-sm ${
                  isFollowing 
                    ? 'bg-gray-100 text-gray-700 border border-gray-200' 
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
              >
                {isFollowing ? '✓ Abonné' : 'Suivre'}
              </motion.button>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-100 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-teal-600" />
                Publié le {formatDate(article.publishedAt)}
              </div>
              <div className="flex items-center bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-teal-600" />
                {article.readingTime} minutes de lecture
              </div>
              <div className="flex items-center bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-teal-600" />
                {article.viewsCount.toLocaleString()} lectures
              </div>
            </div>
          </motion.div>
          
          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="sticky bottom-0 bg-white border-t border-gray-100 py-3 sm:py-4 z-30"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              {/* Bouton Like */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all shadow-sm ${
                  isLiked 
                    ? 'bg-red-100 text-red-600 border border-red-200' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likeCount}</span> 
              </motion.button>

              {/* Bouton Commentaire */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCommentModal(true)}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-white text-gray-700 border border-gray-200 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
              >
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{article.commentsCount}</span>
              </motion.button>

              {/* Bouton Signet */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBookmark}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all shadow-sm ${
                  isBookmarked 
                    ? 'bg-amber-100 text-amber-600 border border-amber-200' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Bookmark className={`h-4 w-4 sm:h-5 sm:w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                <span>Save</span>
              </motion.button>

              {/* Bouton Partager avec Popover */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSharePopoverOpen(!isSharePopoverOpen)} 
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-white text-gray-700 border border-gray-200 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
                >
                  <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Share</span>
                </motion.button>

                {/* Panneau de partage (Popover) */}
                <AnimatePresence>
                  {isSharePopoverOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-full right-0 mb-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 w-44 sm:w-48"
                    >
                      <button
                        onClick={() => handleShare('Facebook')}
                        className="w-full flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <Facebook className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        <span className="text-sm font-medium">Facebook</span>
                      </button>
                      <button
                        onClick={() => handleShare('Twitter')}
                        className="w-full flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <Twitter className="h-4 w-4 sm:h-5 sm:w-5 text-sky-500" />
                        <span className="text-sm font-medium">Twitter</span>
                      </button>
                      <button
                        onClick={() => handleShare('Copier le lien')}
                        className="w-full flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <Link2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                        <span className="text-sm font-medium">Copier le lien</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="py-4 sm:py-6 border-t border-gray-100"
          >
            <div className="flex items-center mb-3 sm:mb-4">
              <Hash className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-teal-600" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Sujets abordés</h3>
            </div>
            
            <motion.div 
              className="flex flex-wrap gap-2 sm:gap-3"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
              initial="hidden"
              animate="visible"
            >
              {article.tags.map((tag, index) => (
                <motion.button
                  key={index}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)" 
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 border border-teal-200 rounded-full text-xs sm:text-sm font-medium hover:from-teal-100 hover:to-cyan-100 transition-all duration-200 flex items-center shadow-sm"
                >
                  <Hash className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5 text-teal-500 group-hover:text-teal-600" />
                  {tag}
                </motion.button>
              ))}
            </motion.div>
            
            <div className="mt-3 sm:mt-4 text-center">
              <button className="text-xs sm:text-sm text-gray-500 hover:text-teal-600 transition-colors">
                Explorer tous les sujets →
              </button>
            </div>
          </motion.div>
          
          {/* Article Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="prose prose-sm sm:prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: renderContent(article.content) }}
          />
          
          {/* Sources & References */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-100"
          >
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Sources & Références</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Informations vérifiées et issues de sources fiables</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover={{ y: -2, boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}
                className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4 shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Organisation Mondiale de la Santé (OMS)</h4>
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Officiel</span>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">&quot;Rapport mondial sur le paludisme 2024&quot;</p>
                    <a 
                      href="#" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Consulter le rapport
                    </a>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover={{ y: -2, boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}
                className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4 shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Ministère de la Santé Publique - Cameroun</h4>
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Officiel</span>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">&quot;Guide national de prise en charge du paludisme&quot;</p>
                    <a 
                      href="#" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Consulter le guide
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-start">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-medium text-amber-800 text-sm sm:text-base">Notre engagement</h4>
                  <p className="text-xs sm:text-sm text-amber-700 mt-1">
                    Nous nous engageons à citer uniquement des sources vérifiées et fiables pour garantir la qualité et l&apos;exactitude de nos informations.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Disclaimer */}
          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2 sm:mr-3 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 text-sm sm:text-base mb-1">ℹ️ Avertissement médical</h4>
                <p className="text-xs sm:text-sm text-blue-800">
                  Cet article est fourni à titre informatif uniquement et ne remplace pas une consultation médicale professionnelle. 
                  Consultez toujours un médecin pour un diagnostic précis.
                </p>
              </div>
            </div>
          </div>
          
          {/* Share Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-100"
          >
            <div className="mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 flex items-center">
                <Share2 className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-teal-600" />
                Partager cet article
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">Aidez-nous à sensibiliser plus de personnes en partageant cette information!</p>
            </div>
            
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare('whatsapp')}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-green-500 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare('facebook')}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-blue-600 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-blue-600 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare('twitter')}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-sky-500 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-sky-500 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare('linkedin')}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-blue-700 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-blue-700 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare('email')}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gray-600 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gray-600 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </motion.button>
              </div>
              
              <div className="relative">
                <AnimatePresence>
                  {copiedLink && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute -top-8 sm:-top-10 left-0 right-0 bg-green-100 text-green-700 px-3 sm:px-4 py-2 rounded-lg text-center text-xs sm:text-sm font-medium"
                    >
                      Lien copié avec succès!
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleShare('copy')}
                  className={`w-full py-3 sm:py-4 rounded-2xl font-medium transition-all flex items-center justify-center shadow-sm ${
                    copiedLink 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Lien copié avec succès!
                    </>
                  ) : (
                    <>
                      <Link2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Copier le lien de l&apos;article
                    </>
                  )}
                </motion.button>
              </div>
              
              <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500">
                <p>En partageant cet article, vous contribuez à notre mission de sensibilisation</p>
              </div>
            </div>
          </motion.div>
          
          {/* Author Bio */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">À propos de l&apos;auteur</h3>
            
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-teal-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                    <User className="h-7 w-7 sm:h-8 sm:w-8 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900">{article.author}</h4>
                    <p className="text-sm text-gray-600">Médecin Généraliste</p>
                    <p className="text-xs sm:text-sm text-gray-500">{article.organization.name}</p>
                  </div>
                </div>
                <button
                  onClick={handleFollow}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                    isFollowing 
                      ? 'bg-gray-200 text-gray-700' 
                      : 'bg-teal-600 text-white hover:bg-teal-700'
                  }`}
                >
                  {isFollowing ? '✓ Abonné' : 'Suivre'}
                </button>
              </div>
              
              <p className="text-sm sm:text-base text-gray-700 mb-4">
                Spécialisé en médecine tropicale et maladies infectieuses. 15 ans d&apos;expérience dans la lutte contre le paludisme au Cameroun.
              </p>
              
              <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-4">
                <span className="mr-3 sm:mr-4">📝 23 articles</span>
                <span>👥 1.2K abonnés</span>
              </div>
              
              <button className="text-teal-600 hover:text-teal-700 font-medium text-sm sm:text-base flex items-center">
                Voir tous ses articles
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          
          {/* Related Articles */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-100"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Articles similaires</h3>
              <button className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors flex items-center">
                Voir tout
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {mockRelatedArticles.map((relatedArticle, index) => (
                <motion.div
                  key={relatedArticle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                    {/* Image avec badge de catégorie */}
                    <div className="relative h-40 sm:h-48 overflow-hidden">
                      <img
                        src={getCloudinaryImageUrl(relatedArticle.featuredImage, { 
                          width: 300, 
                          height: 200, 
                          crop: 'fill' 
                        })}
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Badge de catégorie */}
                      <div 
                        className={`absolute top-3 left-3 px-2 py-1 bg-gradient-to-r ${getCategoryColor(relatedArticle.category?.name)} text-white text-xs font-medium rounded-full shadow-md`}
                      >
                        {relatedArticle.category?.name?.toUpperCase()}
                      </div>
                      {/* Badge featured si applicable */}
                      {relatedArticle.isFeatured && (
                        <div className="absolute top-3 right-3 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-md flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          Vedette
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 sm:p-5 flex-1 flex flex-col">
                      {/* Titre */}
                      <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2 text-base sm:text-lg group-hover:text-teal-600 transition-colors">
                        {relatedArticle.title}
                      </h4>
                      
                      {/* Extrait */}
                      <p className="text-gray-600 text-sm mb-3 sm:mb-4 line-clamp-2 flex-1">
                        {relatedArticle.excerpt}
                      </p>
                      
                      {/* Métadonnées */}
                      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-200 rounded-full flex items-center justify-center mr-1 sm:mr-2">
                            <User className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-600" />
                          </div>
                          <span className="truncate">{relatedArticle.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                          <span>{relatedArticle.readingTime} min</span>
                        </div>
                      </div>
                      
                      {/* Statistiques et bouton */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-500">
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-0.5 sm:mr-1" />
                            {relatedArticle.viewsCount.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-0.5 sm:mr-1" />
                            {relatedArticle.viewsCount || 0}
                          </div>
                        </div>
                        
                        <button className="text-teal-600 hover:text-teal-700 font-medium text-xs sm:text-sm flex items-center transition-colors">
                          Lire
                          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Bouton "Charger plus" */}
            <div className="flex justify-center mt-6 sm:mt-8">
              <button className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors flex items-center text-sm sm:text-base">
                Charger plus d&apos;articles
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
            </div>
          </motion.div>
          
          {/* Comments Section */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 pb-20 sm:pb-32">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">💬 Commentaires ({comments.length})</h3>
            
            {/* Add Comment */}
            <button
              onClick={() => setShowCommentModal(true)}
              className="w-full p-3 sm:p-4 bg-gray-100 rounded-2xl text-gray-700 hover:bg-gray-200 transition-colors flex items-center text-sm sm:text-base"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </div>
              <span>Ajouter un commentaire...</span>
            </button>
            
            {/* Comments List */}
            <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-100 pb-4 sm:pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-3 ${
                        comment.isAuthor ? 'bg-teal-100' : 'bg-gray-300'
                      }`}>
                        <User className={`h-5 w-5 sm:h-6 sm:w-6 ${comment.isAuthor ? 'text-teal-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className={`font-medium text-sm sm:text-base ${comment.isAuthor ? 'text-teal-600' : 'text-gray-900'}`}>
                            {comment.author}
                          </span>
                          {comment.isAuthor && (
                            <span className="ml-2 px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full">
                              Auteur
                            </span>
                          )}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500">Il y a {comment.createdAt}</span>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                  
                  <p className="text-gray-700 mb-3 leading-relaxed text-sm sm:text-base">{comment.content}</p>
                  
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <button className="flex items-center text-gray-600 hover:text-red-600 transition-colors text-sm sm:text-base">
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="flex items-center text-gray-600 hover:text-teal-600 transition-colors text-sm sm:text-base">
                      <Reply className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                      <span>Répondre</span>
                    </button>
                    <button className="flex items-center text-gray-600 hover:text-teal-600 transition-colors text-sm sm:text-base">
                      <Share2 className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                      <span>Partager</span>
                    </button>
                  </div>
                  
                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 sm:mt-4 ml-8 sm:ml-12 space-y-3 sm:space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="bg-gray-50 rounded-lg p-3 sm:p-4">
                          <div className="flex items-center mb-2">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-2 ${
                              reply.isAuthor ? 'bg-teal-100' : 'bg-gray-300'
                            }`}>
                              <User className={`h-4 w-4 sm:h-5 sm:w-5 ${reply.isAuthor ? 'text-teal-600' : 'text-gray-600'}`} />
                            </div>
                            <div>
                              <span className={`text-sm font-medium ${reply.isAuthor ? 'text-teal-600' : 'text-gray-900'}`}>
                                {reply.author}
                              </span>
                              {reply.isAuthor && (
                                <span className="ml-1 px-1.5 py-0.5 bg-teal-100 text-teal-700 text-xs rounded">
                                  Auteur
                                </span>
                              )}
                              <span className="text-xs text-gray-500 ml-2">Il y a {reply.createdAt}</span>
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm">{reply.content}</p>
                          <div className="flex items-center mt-2 space-x-3">
                            <button className="flex items-center text-gray-600 hover:text-red-600 transition-colors text-sm">
                              <Heart className="h-3 w-3 mr-1" />
                              <span>{reply.likes}</span>
                            </button>
                            <button className="text-xs sm:text-sm text-gray-600 hover:text-teal-600 transition-colors">
                              Répondre
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Load More Comments */}
            <button className="w-full mt-4 sm:mt-6 py-2.5 sm:py-3 text-teal-600 font-medium hover:text-teal-700 transition-colors text-sm sm:text-base">
              Charger plus de commentaires ({comments.length - 3})
            </button>
          </div>
        </div>
      </div>
      
      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
        <div className="flex items-center justify-between p-3">
          <div className="flex space-x-2">
            <button
              onClick={handleLike}
              className={`p-2.5 sm:p-3 rounded-xl transition-colors ${
                isLiked 
                  ? 'bg-red-50 text-red-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-label={isLiked ? "Retirer le like" : "Ajouter un like"}
            >
              <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={() => setShowCommentModal(true)}
              className="p-2.5 sm:p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              aria-label="Commenter"
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={handleBookmark}
              className={`p-2.5 sm:p-3 rounded-xl transition-colors ${
                isBookmarked 
                  ? 'bg-amber-50 text-amber-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-label={isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Bookmark className={`h-4 w-4 sm:h-5 sm:w-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
          
          <button
            onClick={handleFollow}
            className={`flex-1 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
              isFollowing 
                ? 'bg-gray-200 text-gray-700' 
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            {isFollowing ? '✓ Abonné' : 'Suivre l\'auteur'}
          </button>
        </div>
      </div>
      
      {/* Comment Modal */}
      <AnimatePresence>
        {showCommentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowCommentModal(false)}
              aria-label="Fermer le modal"
            />
            
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-t-3xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Ajouter un commentaire</h3>
                <button
                  onClick={() => setShowCommentModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Fermer"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">Votre nom</span>
                </div>
                
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Partagez votre avis..."
                  className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[100px] text-sm sm:text-base"
                  rows={5}
                />
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs sm:text-sm text-gray-500">
                    {commentText.length} / 1000 caractères
                  </span>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                      <Smile className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <button className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base">
                    😀
                  </button>
                  <button className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base">
                    🙏
                  </button>
                  <button className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base">
                    ❤️
                  </button>
                  <button className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base">
                    👍
                  </button>
                </div>
              </div>
              
              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className={`w-full py-3 rounded-xl font-medium transition-colors text-sm sm:text-base ${
                    commentText.trim()
                      ? 'bg-teal-600 text-white hover:bg-teal-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Publier le commentaire
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Share Options Modal */}
      <AnimatePresence>
        {showShareOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowShareOptions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl p-4 sm:p-6 m-4 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Partager l&apos;article</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="p-3 sm:p-4 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors flex flex-col items-center"
                >
                  <span className="text-xl sm:text-2xl mb-1">W</span>
                  <span className="text-xs sm:text-sm font-medium">WhatsApp</span>
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-3 sm:p-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors flex flex-col items-center"
                >
                  <span className="text-xl sm:text-2xl mb-1">F</span>
                  <span className="text-xs sm:text-sm font-medium">Facebook</span>
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-3 sm:p-4 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-100 transition-colors flex flex-col items-center"
                >
                  <span className="text-xl sm:text-2xl mb-1">T</span>
                  <span className="text-xs sm:text-sm font-medium">Twitter</span>
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-3 sm:p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors flex flex-col items-center"
                >
                  <span className="text-xl sm:text-2xl mb-1">L</span>
                  <span className="text-xs sm:text-sm font-medium">LinkedIn</span>
                </button>
              </div>
              <button
                onClick={() => handleShare('copy')}
                className={`w-full mt-3 sm:mt-4 py-2.5 sm:py-3 rounded-xl font-medium transition-colors flex items-center justify-center text-sm sm:text-base ${
                  copiedLink 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Lien copié!
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Copier le lien
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}