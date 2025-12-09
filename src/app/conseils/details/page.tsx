/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X,
  Star,
  Share2,
  Heart,
  MessageCircle,
  Bookmark,
  Home,
  Target,
  Calendar,
  Eye,
  TrendingUp,
  AlertTriangle,
  Flame,
  CheckCircle,
  Info,
  ChevronRight,
  Sparkles,
  Droplets,
  Activity,
  Zap,
  Shield,
  Users,
  Clock,
  ArrowLeft,
  Filter,
  Search,
  Settings,
  Plus,
  Send,
  ThumbsUp,
  Reply,
  MoreVertical,
  Check,
  Bell,
  User
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Types
import { 
  Advice, 
  AdviceStatus, 
  Priority, 
  TargetAudience 
} from '@/types/advice';

// Mock data pour le conseil détaillé
const mockAdvice: Advice = {
  id: '1',
  organizationId: 'org1',
  categoryId: '1',
  title: 'Buvez au moins 2 litres d\'eau par jour',
  content: `
    <p>L'hydratation est essentielle pour maintenir votre santé. L'eau joue un rôle crucial dans:</p>
    
    <ul>
      <li>La régulation de la température corporelle</li>
      <li>Le transport des nutriments</li>
      <li>L'élimination des déchets</li>
      <li>La lubrification des articulations</li>
      <li>Le maintien de la peau hydratée</li>
    </ul>
    
    <p>En période de chaleur ou lors d'activités physiques, augmentez votre consommation d'eau.</p>
    
    <h3>Signes de déshydratation:</h3>
    <ul>
      <li>Soif intense</li>
      <li>Urine foncée</li>
      <li>Fatigue</li>
      <li>Maux de tête</li>
    </ul>
  `,
  icon: '💧',
  reactionsCount: 1245,
  priority: Priority.HIGH,
  targetAudience: [TargetAudience.ALL],
  viewsCount: 5200,
  sharesCount: 234,
  isActive: true,
  publishedAt: new Date('2025-03-15'),
  status: AdviceStatus.PUBLISHED,
  createdAt: new Date('2025-03-10'),
  updatedAt: new Date('2025-03-15'),
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
};

// Mock conseils similaires
const mockSimilarAdvices = [
  {
    id: '2',
    title: 'Mangez 5 fruits et légumes par jour',
    icon: '🍎',
    priority: Priority.MEDIUM,
    organization: 'MINSANTÉ',
    viewsCount: 2100,
    reactionsCount: 823
  },
  {
    id: '3',
    title: 'Dormez 7-8 heures par nuit',
    icon: '😴',
    priority: Priority.MEDIUM,
    organization: 'Clinique du Sommeil',
    viewsCount: 2340,
    reactionsCount: 945
  },
  {
    id: '4',
    title: 'Faites 30 minutes d\'exercice par jour',
    icon: '🏃',
    priority: Priority.HIGH,
    organization: 'Centre Sportif National',
    viewsCount: 1890,
    reactionsCount: 678
  }
];

// Composant principal
export default function AdviceDetailPage() {
  const router = useRouter();
  const [advice] = useState<Advice>(mockAdvice);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    {
      id: '1',
      author: 'Marie Kamga',
      content: 'Excellent conseil! Je bois maintenant 2.5L par jour et je me sens beaucoup mieux.',
      likes: 24,
      time: 'Il y a 2h'
    },
    {
      id: '2',
      author: 'Paul Nguema',
      content: 'Merci pour ces rappels importants. J\'ai partagé avec ma famille.',
      likes: 15,
      time: 'Il y a 5h'
    }
  ]);
  
  // Get priority info
  const getPriorityInfo = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT:
        return { color: '#E53935', label: 'Urgente', icon: AlertTriangle };
      case Priority.HIGH:
        return { color: '#FF6F00', label: 'Haute', icon: Flame };
      case Priority.MEDIUM:
        return { color: '#FFA000', label: 'Moyenne', icon: TrendingUp };
      case Priority.LOW:
        return { color: '#43A047', label: 'Basse', icon: CheckCircle };
      default:
        return { color: '#757575', label: 'Normale', icon: Info };
    }
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
  
  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  // Handle like
  const handleLike = () => {
    setIsLiked(!isLiked);
    toast(isLiked ? 'Like retiré' : 'Conseil aimé!', {
      icon: isLiked ? '💔' : '❤️',
    });
  };
  
  // Handle bookmark
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast(isBookmarked ? 'Retiré des favoris' : 'Ajouté aux favoris!', {
      icon: isBookmarked ? '🔖' : '⭐',
    });
  };
  
  // Handle share
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
  
  // Handle comment
  const handleComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: Date.now().toString(),
        author: 'Vous',
        content: commentText,
        likes: 0,
        time: 'Maintenant'
      };
      setComments([newComment, ...comments]);
      setCommentText('');
      setShowCommentInput(false);
      toast('Commentaire publié!', { icon: '✅' });
    }
  };
  
  // Render content with proper formatting
  const renderContent = (content: string) => {
    return content
      .replace(/<h3>/g, '<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3 border-b border-gray-200 pb-2">')
      .replace(/<p>/g, '<p class="text-lg text-gray-700 leading-7 mb-4">')
      .replace(/<ul>/g, '<ul class="space-y-2 mb-4">')
      .replace(/<li>/g, '<li class="flex items-start"><span class="text-teal-600 mr-2">•</span><span>')
      .replace(/<\/li>/g, '</span></li>');
  };
  
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </motion.button>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLiked(!isLiked)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Star className={`h-5 w-5 text-gray-700 ${isLiked ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowShareOptions(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Share2 className="h-5 w-5 text-gray-700" />
            </motion.button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="px-6 py-6 max-w-4xl mx-auto">
        {/* Icon and Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl shadow-lg">
            {advice.icon}
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-linear-to-r from-blue-600 to-teal-600 bg-clip-text">
            {advice.title}
          </h1>
          
          <div className="w-24 h-1 bg-linear-to-r from-blue-400 to-teal-400 mx-auto rounded-full"></div>
        </motion.div>
        
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100"
        >
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: renderContent(advice.content) }}
          />
          
          {/* Tip Box */}
          <div className="mt-8 p-5 bg-linear-to-r from-blue-50 to-teal-50 border-l-4 border-blue-500 rounded-xl shadow-sm">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mr-3 shadow-md">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
                  CONSEIL PRATIQUE
                </h4>
                <p className="text-blue-800">
                  Gardez une bouteille d&apos;eau près de vous et buvez régulièrement, même sans soif.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 border border-gray-200 shadow-sm"
        >
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-white rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-linear-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-3">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Publié par</p>
                <p className="font-medium text-gray-900">{advice.organization?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-white rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-linear-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mr-3">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Public cible</p>
                <p className="font-medium text-gray-900">{formatAudience(advice.targetAudience || [])}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-white rounded-xl shadow-sm">
              {(() => {
                const priorityInfo = getPriorityInfo(advice.priority);
                const IconComponent = priorityInfo.icon;
                
                return (
                  <>
                    <div className="w-10 h-10 bg-linear-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mr-3">
                      <IconComponent className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Priorité</p>
                      <p 
                        className="font-medium"
                        style={{ color: priorityInfo.color }}
                      >
                        {priorityInfo.label}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
            
            <div className="flex items-center p-3 bg-white rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-linear-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mr-3">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Publié le</p>
                <p className="font-medium text-gray-900">{formatDate(advice.publishedAt!)}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-white rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-linear-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mr-3">
                <Eye className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Statistiques</p>
                <p className="font-medium text-gray-900">
                  👁️ {formatStats(advice.viewsCount)} • ❤️ {formatStats(advice.reactionsCount)} • 💬 {comments.length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex space-x-3 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center shadow-sm ${
              isLiked 
                ? 'bg-linear-to-r from-red-50 to-pink-50 text-red-600 border border-red-200' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Heart className={`h-5 w-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
            {formatStats(advice.reactionsCount)}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCommentInput(!showCommentInput)}
            className="flex-1 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center justify-center shadow-sm"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            {comments.length}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBookmark}
            className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center shadow-sm ${
              isBookmarked 
                ? 'bg-linear-to-r from-amber-50 to-yellow-50 text-amber-600 border border-amber-200' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Bookmark className={`h-5 w-5 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
            Save
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowShareOptions(true)}
            className="flex-1 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center justify-center shadow-sm"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </motion.button>
        </motion.div>
        
        {/* Comment Input */}
        <AnimatePresence>
          {showCommentInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl shadow-lg p-4 mb-6 border border-gray-100"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Partagez votre avis..."
                    className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    rows={3}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">
                      {commentText.length}/500 caractères
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleComment}
                      disabled={!commentText.trim()}
                      className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center ${
                        commentText.trim()
                          ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Publier
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Comments */}
        {comments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
              Commentaires ({comments.length})
            </h3>
            
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border-b border-gray-100 pb-4 last:border-b-0"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-linear-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{comment.author}</p>
                        <p className="text-sm text-gray-500">{comment.time}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </motion.button>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{comment.content}</p>
                  
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span className="text-sm">{comment.likes}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      <span className="text-sm">Répondre</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Similar Advices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
            Conseils similaires
          </h3>
          
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {mockSimilarAdvices.map((similarAdvice, index) => (
              <motion.div
                key={similarAdvice.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="shrink-0 w-72 bg-white rounded-2xl shadow-md border border-gray-100 p-4 hover:shadow-xl transition-all"
              >
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-linear-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mr-3 text-2xl">
                    {similarAdvice.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{similarAdvice.title}</h4>
                    <p className="text-sm text-gray-600">{similarAdvice.organization}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {formatStats(similarAdvice.viewsCount)}
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      {formatStats(similarAdvice.reactionsCount)}
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    Voir
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Share Modal */}
      <AnimatePresence>
        {showShareOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowShareOptions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Partager le conseil</h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare('whatsapp')}
                  className="p-4 bg-linear-to-br from-green-50 to-green-100 text-green-600 rounded-xl hover:from-green-100 hover:to-green-200 transition-all flex flex-col items-center shadow-sm"
                >
                  <span className="text-2xl mb-1">W</span>
                  <span className="text-sm">WhatsApp</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare('facebook')}
                  className="p-4 bg-linear-to-br from-blue-50 to-blue-100 text-blue-600 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all flex flex-col items-center shadow-sm"
                >
                  <span className="text-2xl mb-1">F</span>
                  <span className="text-sm">Facebook</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare('twitter')}
                  className="p-4 bg-linear-to-br from-sky-50 to-sky-100 text-sky-600 rounded-xl hover:from-sky-100 hover:to-sky-200 transition-all flex flex-col items-center shadow-sm"
                >
                  <span className="text-2xl mb-1">T</span>
                  <span className="text-sm">Twitter</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare('linkedin')}
                  className="p-4 bg-linear-to-br from-blue-50 to-indigo-100 text-blue-700 rounded-xl hover:from-blue-100 hover:to-indigo-200 transition-all flex flex-col items-center shadow-sm"
                >
                  <span className="text-2xl mb-1">L</span>
                  <span className="text-sm">LinkedIn</span>
                </motion.button>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleShare('copy')}
                className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center ${
                  copiedLink 
                    ? 'bg-linear-to-r from-green-500 to-green-600 text-white' 
                    : 'bg-linear-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Lien copié!
                  </>
                ) : (
                  <>
                    <Share2 className="h-5 w-5 mr-2" />
                    Copier le lien
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}