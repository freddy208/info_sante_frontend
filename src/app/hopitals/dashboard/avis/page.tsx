/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star,
  MessageSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Mail,
  Calendar,
  TrendingUp,
  User,
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
  Flag,
  Reply,
  Edit,
  ThumbsUp,
  ThumbsDown,
  Shield,
  Building,
  Phone,
  MessageCircle,
  Filter as FilterIcon,
  MoreVertical,
  Bell
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Types pour les données
interface Review {
  id: string;
  patientName: string;
  patientAvatar: string;
  rating: number;
  date: Date;
  comment: string;
  isVerified: boolean;
  isResponded: boolean;
  response?: {
    content: string;
    author: string;
    authorTitle: string;
    date: Date;
  };
  helpfulCount: number;
  detailedRatings: {
    quality: number;
    cleanliness: number;
    welcome: number;
    waitingTime: number;
    valueForMoney: number;
  };
  status: 'published' | 'flagged' | 'pending';
}

// Données mocks pour les avis
const mockReviews: Review[] = [
  {
    id: '1',
    patientName: 'Marie Kamga',
    patientAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    rating: 5,
    date: new Date('2025-03-21T10:30:00'),
    comment: 'Excellent service! Le personnel est très professionnel et à l\'écoute. L\'établissement est propre et bien équipé. Je recommande vivement cet hôpital.',
    isVerified: true,
    isResponded: false,
    helpfulCount: 24,
    detailedRatings: {
      quality: 5,
      cleanliness: 5,
      welcome: 5,
      waitingTime: 4,
      valueForMoney: 5
    },
    status: 'published'
  },
  {
    id: '2',
    patientName: 'Paul Nguema',
    patientAvatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    rating: 4,
    date: new Date('2025-03-20T14:15:00'),
    comment: 'Bon hôpital mais le temps d\'attente est parfois un peu long. Sinon, les soins sont de qualité et le personnel est compétent.',
    isVerified: true,
    isResponded: true,
    response: {
      content: 'Merci pour votre retour Paul. Nous travaillons activement à réduire les temps d\'attente. N\'hésitez pas à prendre rendez-vous en ligne pour éviter l\'attente.',
      author: 'Hôpital Général',
      authorTitle: 'Réponse officielle',
      date: new Date('2025-03-21T09:30:00')
    },
    helpfulCount: 12,
    detailedRatings: {
      quality: 4,
      cleanliness: 4,
      welcome: 4,
      waitingTime: 3,
      valueForMoney: 4
    },
    status: 'published'
  },
  {
    id: '3',
    patientName: 'Sophie Mballa',
    patientAvatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    rating: 5,
    date: new Date('2025-03-19T16:45:00'),
    comment: 'Service exceptionnel! J\'ai été traitée avec beaucoup d\'attention et de professionnalisme. Les installations sont modernes et très propres.',
    isVerified: true,
    isResponded: false,
    helpfulCount: 18,
    detailedRatings: {
      quality: 5,
      cleanliness: 5,
      welcome: 5,
      waitingTime: 5,
      valueForMoney: 5
    },
    status: 'published'
  },
  {
    id: '4',
    patientName: 'Jean Tchamda',
    patientAvatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    rating: 3,
    date: new Date('2025-03-18T11:20:00'),
    comment: 'L\'accueil pourrait être amélioré, mais les soins sont corrects. Les prix sont un peu élevés par rapport à la qualité.',
    isVerified: false,
    isResponded: false,
    helpfulCount: 6,
    detailedRatings: {
      quality: 3,
      cleanliness: 4,
      welcome: 2,
      waitingTime: 3,
      valueForMoney: 3
    },
    status: 'published'
  },
  {
    id: '5',
    patientName: 'Catherine Etame',
    patientAvatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    rating: 2,
    date: new Date('2025-03-17T09:30:00'),
    comment: 'Très déçu par l\'accueil et le temps d\'attente. Le personnel semble surchargé et ne prend pas le temps d\'expliquer les procédures.',
    isVerified: false,
    isResponded: true,
    response: {
      content: 'Nous sommes sincèrement désolés pour votre expérience. Vos commentaires nous aideront à améliorer nos services. Nous vous invitons à nous contacter directement pour discuter de votre expérience.',
      author: 'Hôpital Général',
      authorTitle: 'Réponse officielle',
      date: new Date('2025-03-18T14:00:00')
    },
    helpfulCount: 3,
    detailedRatings: {
      quality: 2,
      cleanliness: 3,
      welcome: 1,
      waitingTime: 2,
      valueForMoney: 2
    },
    status: 'flagged'
  },
  {
    id: '6',
    patientName: 'Michel Onguene',
    patientAvatar: 'https://randomuser.me/api/portraits/men/6.jpg',
    rating: 5,
    date: new Date('2025-03-16T15:30:00'),
    comment: 'Excellente expérience médicale! Le personnel est compétent et attentionné. Je me suis senti en sécurité et bien pris en charge.',
    isVerified: true,
    isResponded: false,
    helpfulCount: 15,
    detailedRatings: {
      quality: 5,
      cleanliness: 5,
      welcome: 5,
      waitingTime: 4,
      valueForMoney: 5
    },
    status: 'published'
  },
  {
    id: '7',
    patientName: 'Isabelle Foe',
    patientAvatar: 'https://randomuser.me/api/portraits/women/7.jpg',
    rating: 4,
    date: new Date('2025-03-15T12:45:00'),
    comment: 'Bons soins dans l\'ensemble. Quelques petites améliorations possibles au niveau de l\'organisation mais je recommande cet hôpital.',
    isVerified: true,
    isResponded: false,
    helpfulCount: 9,
    detailedRatings: {
      quality: 4,
      cleanliness: 4,
      welcome: 4,
      waitingTime: 3,
      valueForMoney: 4
    },
    status: 'published'
  },
  {
    id: '8',
    patientName: 'Robert Nkolo',
    patientAvatar: 'https://randomuser.me/api/portraits/men/8.jpg',
    rating: 1,
    date: new Date('2025-03-14T10:15:00'),
    comment: 'Très mauvaise expérience. Personnel désagréable, temps d\'attente interminable et installation vétuste. À éviter absolument.',
    isVerified: false,
    isResponded: true,
    response: {
      content: 'Nous sommes profondément attristés par votre expérience. Nous prenons très au sérieux ces allégations et aimerions en discuter personnellement avec vous.',
      author: 'Hôpital Général',
      authorTitle: 'Réponse officielle',
      date: new Date('2025-03-15T16:30:00')
    },
    helpfulCount: 2,
    detailedRatings: {
      quality: 1,
      cleanliness: 1,
      welcome: 1,
      waitingTime: 1,
      valueForMoney: 1
    },
    status: 'flagged'
  }
];

// Fonction pour formater la date relative
const getRelativeTime = (date: Date) => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInHours < 24) {
    return `Il y a ${diffInHours}h`;
  } else if (diffInDays === 1) {
    return 'Il y a 1 jour';
  } else {
    return `Il y a ${diffInDays} jours`;
  }
};

// Fonction pour obtenir la couleur de la note
const getRatingColor = (rating: number) => {
  switch (rating) {
    case 5:
      return 'border-l-green-500';
    case 4:
      return 'border-l-green-400';
    case 3:
      return 'border-l-yellow-500';
    case 2:
      return 'border-l-orange-500';
    case 1:
      return 'border-l-red-500';
    default:
      return 'border-l-gray-300';
  }
};

// Composant pour les étoiles
function StarRating({ rating, size = 'small' }: { rating: number; size?: 'small' | 'medium' | 'large' }) {
  const sizeClass = size === 'small' ? 'w-4 h-4' : size === 'medium' ? 'w-5 h-5' : 'w-6 h-6';
  
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

function Avatar({ 
  name, 
  size = 'md', 
  className = '' 
}: { 
  name: string; 
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  // Extraire les initiales du nom
  const getInitials = (name: string) => {
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return names.map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Générer une couleur de fond cohérente basée sur le nom
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500'
    ];
    
    // Générer un index basé sur le nom pour toujours obtenir la même couleur
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
  };

  // Définir les tailles
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-20 h-20 text-2xl'
  };

  const initials = getInitials(name);
  const avatarColor = getAvatarColor(name);
  const sizeClass = sizeClasses[size];

  return (
    <div 
      className={`${sizeClass} ${avatarColor} rounded-full flex items-center justify-center text-white font-semibold shadow-md ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
}

// Composant pour les likes aléatoires (non exporté)
function ReviewRandomLikes() {
  const [likes, setLikes] = useState<number | null>(null);

  useEffect(() => {
    setLikes(Math.floor(Math.random() * 20) + 5);
  }, []);

  return <span>{likes ?? "…"}</span>;
}

// Composant pour la carte d'avis
function ReviewCard({ 
  review, 
  onReply, 
  onFlag, 
  onDelete,
  onEditResponse,
  onDeleteResponse,
  isSelected, 
  onSelect 
}: { 
  review: Review; 
  onReply: () => void; 
  onFlag: () => void; 
  onDelete: () => void;
  onEditResponse: () => void;
  onDeleteResponse: () => void;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [showActions, setShowActions] = useState(false);
  
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 ${isSelected ? 'ring-2 ring-teal-500' : ''} border-l-4 ${getRatingColor(review.rating)} relative`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded-lg mr-4"
            />
            
            <Avatar 
              name={review.patientName} 
              size="md" 
              className="mr-4" 
            />
            
            <div>
              <div className="flex items-center mb-1">
                <h3 className="text-base font-semibold text-gray-900 mr-2">{review.patientName}</h3>
                {review.isVerified && (
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                )}
              </div>
              <p className="text-sm text-gray-500">{getRelativeTime(review.date)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <StarRating rating={review.rating} />
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <p className="text-gray-800 mb-4 leading-relaxed">{review.comment}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Qualité:</span>
            <StarRating rating={review.detailedRatings.quality} size="small" />
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Propreté:</span>
            <StarRating rating={review.detailedRatings.cleanliness} size="small" />
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Accueil:</span>
            <StarRating rating={review.detailedRatings.welcome} size="small" />
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Attente:</span>
            <StarRating rating={review.detailedRatings.waitingTime} size="small" />
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Rapport Q/P:</span>
            <StarRating rating={review.detailedRatings.valueForMoney} size="small" />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span>{review.helpfulCount} personnes ont trouvé cet avis utile</span>
          </div>
          
          <button
            onClick={onReply}
            className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors flex items-center"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Répondre à cet avis
          </button>
        </div>
        
        {!review.isResponded && (
          <div className="mt-4 p-3 bg-amber-50 rounded-xl flex items-center">
            <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
            <span className="text-sm text-amber-800">⚠️ En attente de réponse</span>
          </div>
        )}
        
        {review.response && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border-l-4 border-teal-600">
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold mr-3">
                HG
              </div>
              <div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">{review.response.author}</span>
                  <span className="ml-2 px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                    {review.response.authorTitle}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{getRelativeTime(review.response.date)}</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-3">{review.response.content}</p>
            
            <div className="flex items-center text-sm text-gray-500">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <ReviewRandomLikes />
            </div>
            
            <div className="flex items-center space-x-2 mt-3">
              <button
                onClick={onEditResponse}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Modifier
              </button>
              <button
                onClick={onDeleteResponse}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Menu d'actions */}
      {showActions && (
        <div className="absolute right-6 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
          <button
            onClick={() => { onReply(); setShowActions(false); }}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
          >
            <Reply className="h-4 w-4" />
            Répondre
          </button>
          <button
            onClick={() => { onFlag(); setShowActions(false); }}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
          >
            <Flag className="h-4 w-4" />
            Signaler
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

// Composant pour le modal de réponse
function ReplyModal({ 
  isOpen, 
  onClose, 
  review, 
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  review: Review | null; 
  onSubmit: (response: string, notifyPatient: boolean) => void; 
}) {
  const [response, setResponse] = useState('');
  const [notifyPatient, setNotifyPatient] = useState(true);
  const [authorName, setAuthorName] = useState('Hôpital Général de Douala');
  const [authorTitle, setAuthorTitle] = useState('Dr. Jean Kamga');
  
  useEffect(() => {
    if (isOpen && review) {
      setResponse('');
      setNotifyPatient(true);
    }
  }, [isOpen, review]);
  
  if (!isOpen || !review) return null;
  
  const handleSubmit = () => {
    if (!response.trim()) {
      toast.error('Veuillez saisir une réponse');
      return;
    }
    onSubmit(response, notifyPatient);
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Répondre à l&apos;avis de {review.patientName}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Avis original */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Avis original:</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <StarRating rating={review.rating} />
                  <span className="ml-2 text-sm text-gray-500">{getRelativeTime(review.date)}</span>
                </div>
                <p className="text-gray-800">{review.comment}</p>
              </div>
            </div>
            
            {/* Votre réponse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre réponse <span className="text-red-500">*</span>
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Merci beaucoup pour votre retour. Nous apprécions vos commentaires..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">0 / 500 caractères</p>
            </div>
            
            {/* Conseils */}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Conseils pour une bonne réponse:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Remerciez le patient</li>
                    <li>• Soyez professionnel et courtois</li>
                    <li>• Apportez une solution si problème</li>
                    <li>• Restez bref et pertinent</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Signature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Signature</label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Nom de l&apos;hôpital</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Nom et titre du répondant</label>
                  <input
                    type="text"
                    value={authorTitle}
                    onChange={(e) => setAuthorTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Notification */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifyPatient}
                  onChange={(e) => setNotifyPatient(e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded-lg mr-2"
                />
                <span className="text-sm text-gray-700">Notifier {review.patientName} par email</span>
              </label>
            </div>
            
            {/* Aperçu */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Aperçu de votre réponse:</h3>
              <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-teal-600">
                <div className="flex items-center mb-2">
                  <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold mr-3">
                    HG
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{authorName}</span>
                      <span className="ml-2 px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                        Réponse officielle
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{authorTitle}</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  {response || 'Votre réponse apparaîtra ici...'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors flex items-center"
            >
              <Send className="h-4 w-4 mr-2" />
              Publier la réponse
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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
    { id: 'settings', label: 'Paramètres', icon: Settings, path: '/hopitals/dashboard/parametres' },
    { id: 'help', label: 'Aide & Support', icon: HelpCircle, path: '/hopitals/dashboard/aide' }
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
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
        >
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
            <h1 className="text-2xl font-bold text-gray-900">Avis des patients</h1>
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
export default function ReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'flagged' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'rating'>('recent');
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('reviews');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  
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
    { id: 1, title: 'Nouvel avis reçu', time: 'Il y a 5 minutes', action: 'Voir' },
    { id: 2, title: 'Avis signalé', time: 'Il y a 1 heure', action: 'Voir' },
    { id: 3, title: 'Nouvelle statistique disponible', time: 'Il y a 3 heures', action: 'Voir' }
  ];
  
  // Nombre d'éléments par page
  const itemsPerPage = 10;
  
  // Calculer les statistiques
  const stats = useMemo(() => {
    const total = reviews.length;
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const flagged = reviews.filter(r => r.status === 'flagged').length;
    const pending = reviews.filter(r => r.status === 'pending').length;
    const responded = reviews.filter(r => r.isResponded).length;
    
    return { total, averageRating, flagged, pending, responded };
  }, [reviews]);
  
  // Données pour le graphique de distribution
  const ratingDistribution = useMemo(() => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      distribution[review.rating - 1]++;
    });
    
    return [
      { rating: '5⭐', count: distribution[4], percentage: (distribution[4] / reviews.length) * 100 },
      { rating: '4⭐', count: distribution[3], percentage: (distribution[3] / reviews.length) * 100 },
      { rating: '3⭐', count: distribution[2], percentage: (distribution[2] / reviews.length) * 100 },
      { rating: '2⭐', count: distribution[1], percentage: (distribution[1] / reviews.length) * 100 },
      { rating: '1⭐', count: distribution[0], percentage: (distribution[0] / reviews.length) * 100 }
    ];
  }, [reviews]);
  
  // Données pour les notes détaillées
  const detailedRatings = useMemo(() => {
    const totals = {
      quality: 0,
      cleanliness: 0,
      welcome: 0,
      waitingTime: 0,
      valueForMoney: 0
    };
    
    reviews.forEach(review => {
      totals.quality += review.detailedRatings.quality;
      totals.cleanliness += review.detailedRatings.cleanliness;
      totals.welcome += review.detailedRatings.welcome;
      totals.waitingTime += review.detailedRatings.waitingTime;
      totals.valueForMoney += review.detailedRatings.valueForMoney;
    });
    
    return [
      { category: 'Qualité des soins', rating: (totals.quality / reviews.length).toFixed(1) },
      { category: 'Propreté', rating: (totals.cleanliness / reviews.length).toFixed(1) },
      { category: 'Accueil du personnel', rating: (totals.welcome / reviews.length).toFixed(1) },
      { category: 'Temps d\'attente', rating: (totals.waitingTime / reviews.length).toFixed(1) },
      { category: 'Rapport qualité/prix', rating: (totals.valueForMoney / reviews.length).toFixed(1) }
    ];
  }, [reviews]);
  
  // Filtrer et trier les avis
  const filteredReviews = useMemo(() => {
    let filtered = [...reviews];
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(review => 
        review.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrer par note
    if (filterRating !== 'all') {
      filtered = filtered.filter(review => review.rating === filterRating);
    }
    
    // Filtrer par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(review => review.status === filterStatus);
    }
    
    // Trier
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }
    
    return filtered;
  }, [reviews, searchTerm, filterRating, filterStatus, sortBy]);
  
  // Paginer les résultats
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredReviews.slice(startIndex, endIndex);
  }, [filteredReviews, currentPage]);
  
  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  
  // Gérer la sélection d'avis
  const handleSelectReview = (reviewId: string) => {
    setSelectedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };
  
  // Gérer la sélection de tous les avis
  const handleSelectAll = () => {
    if (selectedReviews.length === paginatedReviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(paginatedReviews.map(r => r.id));
    }
  };
  
  // Gérer la réponse à un avis
  const handleReply = (reviewId: string) => {
    const review = reviews.find(r => r.id === reviewId);
    if (review) {
      setSelectedReview(review);
      setShowReplyModal(true);
    }
  };
  
  // Gérer la soumission de réponse
  const handleSubmitReply = (response: string, notifyPatient: boolean) => {
    setIsLoading(true);
    
    // Simuler l'envoi de la réponse
    setTimeout(() => {
      setReviews(prev => 
        prev.map(r => 
          r.id === selectedReview?.id 
            ? { 
                ...r, 
                isResponded: true, 
                response: {
                  content: response,
                  author: 'Hôpital Général',
                  authorTitle: 'Réponse officielle',
                  date: new Date()
                }
              }
            : r
        )
      );
      
      setIsLoading(false);
      setShowReplyModal(false);
      setSelectedReview(null);
      
      if (notifyPatient) {
        toast.success('Réponse publiée et notification envoyée au patient');
      } else {
        toast.success('Réponse publiée avec succès');
      }
    }, 1500);
  };
  
  // Gérer le signalement d'un avis
  const handleFlag = (reviewId: string) => {
    setReviews(prev => 
      prev.map(r => 
        r.id === reviewId 
          ? { ...r, status: 'flagged' as const }
          : r
      )
    );
    toast.success('Avis signalé pour modération');
  };
  
  // Gérer la suppression d'un avis
  const handleDelete = (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    toast.success('Avis supprimé avec succès');
  };
  
  // Afficher ou masquer les actions groupées
  useEffect(() => {
    setShowBulkActions(selectedReviews.length > 0);
  }, [selectedReviews]);
  
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
          {/* Header avec statistiques */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Avis des patients</h1>
            <p className="text-base text-gray-600">
              {stats.total} avis • Note moyenne: {stats.averageRating.toFixed(1)} ⭐
            </p>
          </div>
          
          {/* Rating overview */}
          <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Rating Overview</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Overall rating */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-orange-100 rounded-2xl mb-4">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-orange-600">{stats.averageRating.toFixed(1)}</div>
                    <div className="text-lg text-orange-600">/ 5</div>
                  </div>
                </div>
                <StarRating rating={Math.round(stats.averageRating)} size="large" />
                <p className="text-gray-600 mt-2">Basé sur {stats.total} avis</p>
              </div>
              
              {/* Rating distribution */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Rating Distribution</h4>
                <div className="space-y-2">
                  {ratingDistribution.map((item) => (
                    <div key={item.rating} className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 w-12">{item.rating}</span>
                      <div className="flex-1 mx-3">
                        <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{item.count}</span>
                      <span className="text-sm text-gray-500 w-12 text-right">{item.percentage.toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Detailed ratings */}
            <div className="mt-8">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Detailed Ratings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {detailedRatings.map((item) => (
                  <div key={item.category} className="flex items-center justify-between bg-white rounded-xl p-4">
                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                    <div className="flex items-center">
                      <StarRating rating={Math.round(parseFloat(item.rating))} size="small" />
                      <span className="ml-2 text-sm text-gray-600">{item.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Filters and search */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher dans les avis..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">Toutes notes</option>
                  <option value="5">5⭐</option>
                  <option value="4">4⭐</option>
                  <option value="3">3⭐</option>
                  <option value="2">2⭐</option>
                  <option value="1">1⭐</option>
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">Tous statuts</option>
                  <option value="published">Publiés</option>
                  <option value="flagged">Signalés</option>
                  <option value="pending">En attente</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="recent">Plus récents</option>
                  <option value="oldest">Plus anciens</option>
                  <option value="rating">Mieux notés</option>
                </select>
              </div>
            </div>
            
            {/* Filter pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterRating('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterRating === 'all' 
                    ? 'bg-teal-100 text-teal-700 border border-teal-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                Tous
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilterRating(rating)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filterRating === rating 
                      ? 'bg-teal-100 text-teal-700 border border-teal-300' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {rating}⭐
                </button>
              ))}
              <button
                onClick={() => setFilterStatus('flagged')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterStatus === 'flagged' 
                    ? 'bg-red-100 text-red-700 border border-red-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                Signalés ({stats.flagged})
              </button>
            </div>
            
            {/* Bulk actions */}
            {showBulkActions && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mt-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700">
                    {selectedReviews.length} sélectionné{selectedReviews.length > 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      // Action groupée
                      toast('Action groupée à implémenter');
                    }}
                    className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 inline mr-1" />
                    Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Reviews list */}
          <div className="space-y-4 mb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedReviews.length === paginatedReviews.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded-lg mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    {selectedReviews.length} de {paginatedReviews.length} sélectionné{selectedReviews.length > 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="text-sm text-gray-500">
                  Affichage de 1-{Math.min(itemsPerPage, filteredReviews.length)} sur {filteredReviews.length} avis
                </div>
              </div>
            </div>
            
            <AnimatePresence>
              {paginatedReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onReply={() => handleReply(review.id)}
                  onFlag={() => handleFlag(review.id)}
                  onDelete={() => handleDelete(review.id)}
                  onEditResponse={() => toast('Édition de réponse à implémenter')}
                  onDeleteResponse={() => toast('Suppression de réponse à implémenter')}
                  isSelected={selectedReviews.includes(review.id)}
                  onSelect={() => handleSelectReview(review.id)}
                />
              ))}
            </AnimatePresence>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de {(currentPage - 1) * itemsPerPage + 1} à{' '}
              {Math.min(currentPage * itemsPerPage, filteredReviews.length)} sur{' '}
              {filteredReviews.length} avis
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
        </main>
      </div>
      
      {/* Reply modal */}
      <ReplyModal
        isOpen={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        review={selectedReview}
        onSubmit={handleSubmitReply}
      />
      
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