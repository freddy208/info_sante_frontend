/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/immutability */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  HelpCircle,
  User,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Type,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  BarChart3,
  Lightbulb,
  Code,
  Undo,
  Redo,
  Save,
  Eye,
  FileText,
  Upload,
  X,
  Plus,
  Edit2,
  Trash2,
  Check,
  Calendar,
  Clock,
  Hash,
  MessageSquare,
  Heart,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Users,
  Filter,
  Search,
  Settings,
  Bell,
  Shield,
  Star
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Types
interface ArticleForm {
  title: string;
  categoryId: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  author: string;
  tags: string[];
  isFeatured: boolean;
  enableComments: boolean;
  sendNotifications: boolean;
  scheduledAt: string | null;
  sources: Source[];
}

interface Source {
  id: string;
  title: string;
  organization: string;
  url: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
}

// Mock data
const mockCategories: Category[] = [
  { id: '1', name: 'Dépistage', slug: 'depistage', icon: '🔬', color: '#3b82f6' },
  { id: '2', name: 'Prévention', slug: 'prevention', icon: '🛡️', color: '#10b981' },
  { id: '3', name: 'Nutrition', slug: 'nutrition', icon: '🍎', color: '#f59e0b' },
  { id: '4', name: 'Santé', slug: 'sante', icon: '❤️', color: '#ef4444' },
  { id: '5', name: 'Mental', slug: 'mental', icon: '🧠', color: '#8b5cf6' },
  { id: '6', name: 'Maternité', slug: 'maternite', icon: '👶', color: '#ec4899' },
];

// Composant principal
export default function CreateArticlePage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCalloutModal, setShowCalloutModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [editorContent, setEditorContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  
  const [formData, setFormData] = useState<ArticleForm>({
    title: '',
    categoryId: '',
    excerpt: '',
    content: '',
    featuredImage: null,
    author: 'Dr. Jean Kamga',
    tags: [],
    isFeatured: false,
    enableComments: true,
    sendNotifications: true,
    scheduledAt: null,
    sources: []
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Auto-save
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.title || formData.content) {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds
    
    return () => clearInterval(interval);
  }, [formData]);
  
  // Calculate stats
  useEffect(() => {
    const words = editorContent.split(/\s+/).filter(word => word.length > 0).length;
    const chars = editorContent.length;
    const minutes = Math.ceil(words / 200); // Average reading speed: 200 words/min
    
    setWordCount(words);
    setCharCount(chars);
    setReadingTime(minutes);
  }, [editorContent]);
  
  const handleAutoSave = () => {
    // Simulate auto-save
    setLastSaved(new Date());
    toast('Brouillon enregistré automatiquement', {
      icon: '💾',
      duration: 2000,
    });
  };
  
  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
      toast('Brouillon enregistré avec succès!', {
        icon: '✅',
      });
    }, 1000);
  };
  
  const handlePublish = () => {
    if (!formData.title || !formData.categoryId || !formData.excerpt || !editorContent) {
      toast('Veuillez remplir tous les champs obligatoires', {
        icon: '⚠️',
      });
      return;
    }
    
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      toast('Article publié avec succès!', {
        icon: '🎉',
      });
      router.push('/hospital/articles');
    }, 2000);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate image upload
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        setFormData({ ...formData, featuredImage: result });
        setShowImageModal(false);
        toast('Image téléchargée avec succès!', {
          icon: '📸',
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddSource = () => {
    const newSource: Source = {
      id: Date.now().toString(),
      title: '',
      organization: '',
      url: ''
    };
    setSources([...sources, newSource]);
  };
  
  const handleUpdateSource = (id: string, field: keyof Source, value: string) => {
    setSources(sources.map(source => 
      source.id === id ? { ...source, [field]: value } : source
    ));
  };
  
  const handleRemoveSource = (id: string) => {
    setSources(sources.filter(source => source.id !== id));
  };
  
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value && !formData.tags.includes(value)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, value]
        });
        e.currentTarget.value = '';
      }
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  const insertEditorElement = (type: string) => {
    // Simulate editor insertion
    const element = type === 'image' ? '[Image]' : '[Callout]';
    setEditorContent(editorContent + '\n' + element + '\n');
  };
  
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </motion.button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Créer un article</h1>
              <p className="text-sm text-gray-500">Nouvel article</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <HelpCircle className="h-5 w-5 text-gray-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <User className="h-5 w-5 text-gray-600" />
            </motion.button>
          </div>
        </div>
      </header>
      
      {/* Breadcrumb */}
      <div className="bg-white px-6 py-3 border-b border-gray-100">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="hover:text-gray-900 transition-colors"
          >
            Dashboard
          </motion.button>
          <span>/</span>
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="hover:text-gray-900 transition-colors"
          >
            Mes Articles
          </motion.button>
          <span>/</span>
          <span className="text-gray-900 font-medium">Nouvel article</span>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Editor Column (70%) */}
        <div className="flex-1 lg:max-w-[70%] p-6 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Title Input */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-6 bg-linear-to-r from-teal-600 to-blue-600 bg-clip-text">
                Créer un article
              </h1>
              
              <input
                type="text"
                placeholder="Titre de l'article *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-0 py-3 text-3xl font-bold text-gray-900 border-0 border-b-2 border-gray-200 focus:border-teal-500 focus:outline-none transition-colors placeholder-gray-400"
                maxLength={200}
              />
              <div className="text-sm text-gray-500 mt-1 flex items-center">
                <span className="font-medium">{formData.title.length}</span>
                <span className="mx-1">/</span>
                <span>200 caractères</span>
              </div>
            </div>
            
            {/* Category Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-left flex items-center justify-between hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm"
                >
                  <div className="flex items-center">
                    {selectedCategory ? (
                      <>
                        <span className="mr-2 text-xl">
                          {mockCategories.find(c => c.id === selectedCategory)?.icon}
                        </span>
                        <span className="font-medium">{mockCategories.find(c => c.id === selectedCategory)?.name}</span>
                      </>
                    ) : (
                      <span className="text-gray-400">Sélectionnez une catégorie</span>
                    )}
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                </motion.button>
                
                <AnimatePresence>
                  {showCategoryDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden"
                    >
                      {mockCategories.map((category) => (
                        <motion.button
                          key={category.id}
                          whileHover={{ scale: 1.02, backgroundColor: '#f9fafb' }}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setFormData({ ...formData, categoryId: category.id });
                            setShowCategoryDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center first:rounded-t-xl last:rounded-b-xl"
                        >
                          <span className="mr-3 text-xl">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Excerpt */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extrait (résumé) *
              </label>
              <textarea
                placeholder="Le paludisme reste l'une des principales causes de mortalité..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm placeholder-gray-400"
                rows={3}
                maxLength={300}
              />
              <div className="text-sm text-gray-500 mt-1 flex items-center">
                <span className="font-medium">{formData.excerpt.length}</span>
                <span className="mx-1">/</span>
                <span>300 caractères</span>
              </div>
            </div>
            
            {/* Rich Text Editor */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Contenu de l&apos;article
              </label>
              
              {/* Editor Toolbar */}
              <div className="bg-white border border-gray-200 rounded-t-xl p-3 flex items-center space-x-1 overflow-x-auto shadow-sm">
                <div className="flex items-center space-x-1 pr-3 border-r border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg transition-all"
                  >
                    <Bold className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg transition-all"
                  >
                    <Italic className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg transition-all"
                  >
                    <Underline className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg transition-all"
                  >
                    <Strikethrough className="h-4 w-4" />
                  </motion.button>
                </div>
                
                <div className="flex items-center space-x-1 pr-3 border-r border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg transition-all"
                  >
                    <Heading1 className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg transition-all"
                  >
                    <Heading2 className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg transition-all"
                  >
                    <Heading3 className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg transition-all"
                  >
                    <Type className="h-4 w-4" />
                  </motion.button>
                </div>
                
                <div className="flex items-center space-x-1 pr-3 border-r border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg transition-all"
                  >
                    <List className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg transition-all"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg transition-all"
                  >
                    <AlignLeft className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg transition-all"
                  >
                    <AlignCenter className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg transition-all"
                  >
                    <AlignRight className="h-4 w-4" />
                  </motion.button>
                </div>
                
                <div className="flex items-center space-x-1 pr-3 border-r border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg transition-all"
                  >
                    <Link className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowImageModal(true)}
                    className="p-2 rounded-lg transition-all"
                  >
                    <Image className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg transition-all"
                  >
                    <BarChart3 className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCalloutModal(true)}
                    className="p-2 rounded-lg transition-all"
                  >
                    <Lightbulb className="h-4 w-4" />
                  </motion.button>
                </div>
                
                <div className="flex items-center space-x-1">
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg transition-all"
                  >
                    <Code className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg transition-all"
                  >
                    <Undo className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg transition-all"
                  >
                    <Redo className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
              
              {/* Editor Area */}
              <div
                ref={editorRef}
                contentEditable
                onInput={(e) => setEditorContent(e.currentTarget.innerHTML)}
                className="w-full min-h-[600px] p-6 bg-white border border-t-0 border-gray-200 rounded-b-xl focus:outline-none prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: editorContent || '<p class="text-gray-400">Commencez à écrire votre article...</p>' 
                }}
              />
              
              {/* Keyboard Shortcuts */}
              <div className="mt-4 p-4 bg-linear-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-600 font-medium mb-2 flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-amber-500" />
                  Raccourcis clavier
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <kbd className="px-2 py-1 bg-white rounded border border-gray-300 text-xs font-mono mr-2">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 bg-white rounded border border-gray-300 text-xs font-mono mx-2">B</kbd>
                    <span>= Gras</span>
                  </div>
                  <div className="flex items-center">
                    <kbd className="px-2 py-1 bg-white rounded border border-gray-300 text-xs font-mono mr-2">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 bg-white rounded border border-gray-300 text-xs font-mono mx-2">I</kbd>
                    <span>= Italique</span>
                  </div>
                  <div className="flex items-center">
                    <kbd className="px-2 py-1 bg-white rounded border border-gray-300 text-xs font-mono mr-2">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 bg-white rounded border border-gray-300 text-xs font-mono mx-2">K</kbd>
                    <span>= Lien</span>
                  </div>
                  <div className="flex items-center">
                    <kbd className="px-2 py-1 bg-white rounded border border-gray-300 text-xs font-mono mr-2">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 bg-white rounded border border-gray-300 text-xs font-mono mx-2">S</kbd>
                    <span>= Enregistrer</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Featured Image Upload */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Image principale *
              </label>
              
              {!uploadedImage ? (
                <motion.div
                  whileHover={{ scale: 1.02, borderColor: '#14b8a6' }}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all"
                >
                  <div className="w-16 h-16 bg-linear-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mb-3">
                    <Upload className="h-8 w-8 text-teal-600" />
                  </div>
                  <p className="text-gray-700 font-medium">Glissez-déposez votre image</p>
                  <p className="text-sm text-gray-500">ou cliquez pour parcourir</p>
                  <p className="text-xs text-gray-400 mt-2">JPG, PNG • Max 5MB • Ratio: 16:9</p>
                </motion.div>
              ) : (
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Article featured"
                    className="w-full h-48 object-cover rounded-xl shadow-md"
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-colors"
                    >
                      <Edit2 className="h-4 w-4 text-gray-700" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setUploadedImage(null);
                        setFormData({ ...formData, featuredImage: null });
                      }}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-colors"
                    >
                      <X className="h-4 w-4 text-gray-700" />
                    </motion.button>
                  </div>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            
            {/* Sources */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Sources & Références (optionnel)
                </label>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddSource}
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter source
                </motion.button>
              </div>
              
              {sources.length === 0 ? (
                <motion.button
                  whileHover={{ scale: 1.02, borderColor: '#14b8a6' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddSource}
                  className="w-full py-3 border border-gray-200 rounded-xl text-gray-600 hover:border-teal-500 hover:text-teal-600 transition-all"
                >
                  + Ajouter source
                </motion.button>
              ) : (
                <div className="space-y-3">
                  {sources.map((source, index) => (
                    <motion.div
                      key={source.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <input
                          type="text"
                          placeholder="Titre source"
                          value={source.title}
                          onChange={(e) => handleUpdateSource(source.id, 'title', e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <input
                          type="text"
                          placeholder="Organisation"
                          value={source.organization}
                          onChange={(e) => handleUpdateSource(source.id, 'organization', e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <input
                          type="url"
                          placeholder="https://..."
                          value={source.url}
                          onChange={(e) => handleUpdateSource(source.id, 'url', e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div className="flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRemoveSource(source.id)}
                          className="text-red-600 hover:text-red-700 text-sm flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Publication Options */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Options de publication</h3>
              
              <div className="space-y-4">
                <label className="flex items-center p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                  <input
                    type="checkbox"
                    checked={formData.enableComments}
                    onChange={(e) => setFormData({ ...formData, enableComments: e.target.checked })}
                    className="mr-3 h-5 w-5 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <span className="text-gray-700">Activer les commentaires</span>
                </label>
                
                <label className="flex items-center p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                  <input
                    type="checkbox"
                    checked={formData.sendNotifications}
                    onChange={(e) => setFormData({ ...formData, sendNotifications: e.target.checked })}
                    className="mr-3 h-5 w-5 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <div>
                    <span className="text-gray-700">Envoyer notifications aux abonnés</span>
                    <p className="text-sm text-gray-500">(~1,200 utilisateurs)</p>
                  </div>
                </label>
                
                <label className="flex items-center p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                  <input
                    type="checkbox"
                    checked={!!formData.scheduledAt}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      scheduledAt: e.target.checked ? new Date().toISOString() : null 
                    })}
                    className="mr-3 h-5 w-5 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <span className="text-gray-700">Programmer publication</span>
                </label>
                
                {formData.scheduledAt && (
                  <div className="ml-8 flex space-x-3">
                    <input
                      type="date"
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="time"
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Preview & Settings Column (30%) */}
        <div className="w-full lg:w-[30%] bg-linear-to-b from-gray-50 to-gray-100 p-6 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Mobile Preview */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📱</span>
                Aperçu
              </h3>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Preview"
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <Image className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                
                <div className="p-4">
                  <div className="text-xs font-medium text-teal-600 mb-2 uppercase">
                    {selectedCategory ? mockCategories.find(c => c.id === selectedCategory)?.name : 'Catégorie'}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {formData.title || 'Titre de l\'article'}
                  </h4>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <User className="h-4 w-4 mr-1" />
                    <span>{formData.author}</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{readingTime} min</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>0</span>
                    <MessageSquare className="h-4 w-4 ml-3 mr-1" />
                    <span>0</span>
                    <Heart className="h-4 w-4 ml-3 mr-1" />
                    <span>0</span>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-2 text-center">
                Aperçu en temps réel
              </p>
            </div>
            
            {/* Settings */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres</h3>
              
              <div className="space-y-4">
                {/* Author */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auteur *
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (SEO) *
                  </label>
                  <input
                    type="text"
                    placeholder="paludisme, santé..."
                    onKeyDown={handleTagInput}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Séparés par des virgules</p>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: index * 0.1 }}
                          className="inline-flex items-center px-3 py-1 bg-linear-to-r from-teal-100 to-teal-50 text-teal-700 rounded-full text-sm"
                        >
                          #{tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-teal-500 hover:text-teal-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </motion.span>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Featured */}
                <label className="flex items-center p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="mr-3 h-5 w-5 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <div>
                    <span className="text-gray-700">Article en vedette</span>
                    <p className="text-sm text-gray-500">Apparaît en premier sur la page articles</p>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Statistics */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
              
              <div className="bg-white rounded-xl p-4 space-y-3 shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600">Mots</span>
                  </div>
                  <span className="font-medium text-gray-900">{wordCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Hash className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600">Caractères</span>
                  </div>
                  <span className="font-medium text-gray-900">{charCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600">Temps lecture</span>
                  </div>
                  <span className="font-medium text-gray-900">{readingTime} min</span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
              
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="w-full py-3 bg-linear-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-medium hover:from-gray-200 hover:to-gray-300 transition-all disabled:opacity-50 flex items-center justify-center shadow-sm"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {isSaving ? 'Enregistrement...' : '💾 Enregistrer brouillon'}
                </motion.button>
                
                {lastSaved && (
                  <p className="text-xs text-gray-500 text-center">
                    Auto-sauvegardé: {lastSaved.toLocaleTimeString()}
                  </p>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/articles/preview')}
                  className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center justify-center shadow-sm"
                >
                  <Eye className="h-5 w-5 mr-2" />
                  👁️ Prévisualiser
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center justify-center shadow-sm"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  📄 Importer document
                </motion.button>
                
                <p className="text-xs text-gray-500 text-center">
                  Support: .docx, .txt
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
        <div className="flex items-center justify-between px-6 lg:px-10 py-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.back()}
            className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-colors flex items-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Annuler
          </motion.button>
          
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="px-6 py-3 bg-linear-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-medium hover:from-gray-200 hover:to-gray-300 transition-all disabled:opacity-50 flex items-center shadow-sm"
            >
              <Save className="h-5 w-5 mr-2" />
              {isSaving ? 'Enregistrement...' : 'Brouillon'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-8 py-3 bg-linear-to-r from-teal-600 to-teal-700 text-white rounded-xl font-medium hover:from-teal-700 hover:to-teal-800 transition-all disabled:opacity-50 flex items-center shadow-md"
            >
              {isPublishing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Publication...
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5 mr-2" />
                  📰 Publier l&apos;article
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowImageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl p-6 m-4 max-w-lg w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Insérer une image</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowImageModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </motion.button>
              </div>
              
              {/* Tabs */}
              <div className="flex space-x-1 mb-6 bg-gray-100 rounded-xl p-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2 bg-white text-gray-900 rounded-lg font-medium shadow-sm"
                >
                  Upload
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2 text-gray-600 hover:text-gray-900 rounded-lg font-medium"
                >
                  URL
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2 text-gray-600 hover:text-gray-900 rounded-lg font-medium"
                >
                  Galerie
                </motion.button>
              </div>
              
              {/* Upload Area */}
              <motion.div
                whileHover={{ scale: 1.01, borderColor: '#14b8a6' }}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all"
              >
                <div className="w-16 h-16 bg-linear-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-teal-600" />
                </div>
                <p className="text-gray-700 font-medium mb-2">
                  Glissez-déposez une image
                </p>
                <p className="text-gray-500 text-sm mb-2">
                  ou cliquez pour parcourir
                </p>
                <p className="text-gray-400 text-xs">
                  JPG, PNG, GIF • Max 5MB
                </p>
              </motion.div>
              
              {/* Image Options */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texte alternatif (SEO)
                  </label>
                  <input
                    type="text"
                    placeholder="Description de l'image..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Légende (optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="Texte de la légende..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alignement
                  </label>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      Gauche
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 py-2 bg-teal-50 border border-teal-500 text-teal-700 rounded-lg"
                    >
                      Centre
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      Droite
                    </motion.button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taille
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      Petite
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="py-2 bg-teal-50 border border-teal-500 text-teal-700 rounded-lg"
                    >
                      Moyenne
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      Grande
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      Pleine largeur
                    </motion.button>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowImageModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                >
                  Annuler
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    insertEditorElement('image');
                    setShowImageModal(false);
                  }}
                  className="flex-1 py-3 bg-linear-to-r from-teal-600 to-teal-700 text-white rounded-xl font-medium hover:from-teal-700 hover:to-teal-800 transition-all"
                >
                  Insérer l&apos;image
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Callout Modal */}
      <AnimatePresence>
        {showCalloutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCalloutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl p-6 m-4 max-w-lg w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Insérer un encadré</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCalloutModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </motion.button>
              </div>
              
              {/* Callout Types */}
              <div className="space-y-3 mb-6">
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center p-3 border-2 border-teal-500 bg-teal-50 rounded-xl cursor-pointer"
                >
                  <input type="radio" name="callout" defaultChecked className="mr-3" />
                  <Lightbulb className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium">💡 Conseil pratique (Bleu)</span>
                </motion.label>
                
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50"
                >
                  <input type="radio" name="callout" className="mr-3" />
                  <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                  <span className="font-medium">⚠️ Avertissement (Orange)</span>
                </motion.label>
                
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50"
                >
                  <input type="radio" name="callout" className="mr-3" />
                  <Info className="h-5 w-5 text-blue-400 mr-2" />
                  <span className="font-medium">ℹ️ Information (Bleu clair)</span>
                </motion.label>
                
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50"
                >
                  <input type="radio" name="callout" className="mr-3" />
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium">✅ Succès (Vert)</span>
                </motion.label>
                
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50"
                >
                  <input type="radio" name="callout" className="mr-3" />
                  <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="font-medium">❌ Danger (Rouge)</span>
                </motion.label>
              </div>
              
              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="CONSEIL PRATIQUE"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              {/* Content */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu
                </label>
                <textarea
                  placeholder="Dormez toujours sous une moustiquaire imprégnée..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={4}
                />
              </div>
              
              {/* Preview */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aperçu
                </label>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                  <div className="font-semibold text-blue-900 mb-2">💡 CONSEIL PRATIQUE</div>
                  <p className="text-blue-800">
                    Dormez toujours sous une moustiquaire imprégnée...
                  </p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCalloutModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                >
                  Annuler
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    insertEditorElement('callout');
                    setShowCalloutModal(false);
                  }}
                  className="flex-1 py-3 bg-linear-to-r from-teal-600 to-teal-700 text-white rounded-xl font-medium hover:from-teal-700 hover:to-teal-800 transition-all"
                >
                  Insérer l&apos;encadré
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}