/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Settings,
  HelpCircle,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Loader2,
  Check,
  AlertCircle,
  Clock,
  Target,
  Pin,
  Navigation,
  Bell,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getCloudinaryImageUrl } from '@/lib/cloudinary';

// Schéma de validation pour le formulaire d'annonce
const announcementSchema = z.object({
  title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères').max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  excerpt: z.string().min(10, 'Le résumé doit contenir au moins 10 caractères').max(500, 'Le résumé ne peut pas dépasser 500 caractères').optional(),
  content: z.string().min(50, 'Le contenu doit contenir au moins 50 caractères'),
  featuredImage: z.string().min(1, "L'image principale est requise"),
  thumbnailImage: z.string().optional(),
  categoryId: z.string().min(1, 'La catégorie est requise'),
  startDate: z.string().min(1, 'La date de début est requise'),
  endDate: z.string().min(1, 'La date de fin est requise'),
  targetAudience: z.array(z.string()).min(1, 'Sélectionnez au moins un public cible'),
  isFree: z.boolean(),
  cost: z.number().nonnegative().optional(),
  capacity: z.number().int().positive().optional(),
  requiresRegistration: z.boolean(),
  registrationDeadline: z.string().optional(),
  autoCloseWhenFull: z.boolean(),
  requireConfirmation: z.boolean(),
  locationType: z.enum(['HOSPITAL', 'OTHER']),
  hospitalId: z.string().optional(),
  locationName: z.string().optional(),
  locationAddress: z.string().optional(),
  locationCity: z.string().optional(),
  locationRegion: z.string().optional(),
  locationLatitude: z.number().optional(),
  locationLongitude: z.number().optional(),
  locationDirections: z.string().optional(),
  additionalInfo: z.string().optional(),
  isPinned: z.boolean(),
  enableComments: z.boolean(),
  sendNotifications: z.boolean(),
  scheduledPublish: z.boolean(),
  scheduledPublishDate: z.string().optional(),
  scheduledPublishTime: z.string().optional(),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

// Données mock pour les catégories
const mockCategories = [
  { id: 'cat1', name: 'Vaccination', icon: '💉', color: '#10B981' },
  { id: 'cat2', name: 'Dépistage', icon: '🔬', color: '#3B82F6' },
  { id: 'cat3', name: 'Sensibilisation', icon: '📢', color: '#8B5CF6' },
  { id: 'cat4', name: 'Consultation', icon: '🩺', color: '#6366F1' },
  { id: 'cat5', name: 'Urgence', icon: '🚨', color: '#EF4444' },
  { id: 'cat6', name: 'Prévention', icon: '🛡️', color: '#22C55E' },
  { id: 'cat7', name: 'Formation', icon: '📚', color: '#F59E0B' },
  { id: 'cat8', name: 'Don de sang', icon: '❤️', color: '#EC4899' },
];

// Données mock pour les hôpitaux
const mockHospitals = [
  { id: 'hosp1', name: 'Hôpital Général de Douala', address: 'Avenue de la République, Bonanjo' },
  { id: 'hosp2', name: 'Centre Médical Akwa', address: 'Rue Akwa, Douala' },
  { id: 'hosp3', name: 'Clinique la Quintinie', address: 'Rue de la Santé, Bonapriso' },
];

// Composant pour l'en-tête du dashboard
function DashboardHeader() {
  const router = useRouter();
  
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Créer une annonce</h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <HelpCircle className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
          <div className="h-10 w-10 bg-linear-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            JD
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour le fil d'Ariane
function Breadcrumb() {
  return (
    <div className="px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-200">
      <nav className="flex items-center space-x-2 text-sm overflow-x-auto">
        <button className="text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap">Dashboard</button>
        <span className="text-gray-400">/</span>
        <button className="text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap">Mes Annonces</button>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium whitespace-nowrap">Nouvelle annonce</span>
      </nav>
    </div>
  );
}

// Composant pour les étapes du formulaire
function ProgressStepper({ currentStep }: { currentStep: number }) {
  const steps = [
    { id: 1, name: 'Infos de base', icon: <Target className="h-4 w-4" /> },
    { id: 2, name: 'Contenu', icon: <Save className="h-4 w-4" /> },
    { id: 3, name: 'Date & Lieu', icon: <Calendar className="h-4 w-4" /> },
    { id: 4, name: 'Options', icon: <Settings className="h-4 w-4" /> },
    { id: 5, name: 'Publier', icon: <Eye className="h-4 w-4" /> },
  ];

  return (
    <div className="px-4 sm:px-6 py-4 bg-white border-b border-gray-200">
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-linear-to-r from-teal-500 to-blue-600"
            initial={{ width: "20%" }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        
        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <motion.div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 z-10 ${
                  currentStep > index
                    ? 'bg-linear-to-r from-teal-500 to-blue-600 border-teal-600 text-white'
                    : currentStep === index + 1
                    ? 'bg-white border-teal-600 text-teal-600 shadow-md'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {step.icon}
              </motion.div>
              <div className="mt-2 text-center">
                <p className={`text-xs sm:text-sm font-medium ${
                  currentStep > index ? 'text-teal-600' : currentStep === index + 1 ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Composant pour le champ de saisie avec icône
function FormField({ 
  label, 
  icon, 
  error, 
  children, 
  required = false,
  helperText 
}: { 
  label: string; 
  icon?: React.ReactNode; 
  error?: string; 
  children: React.ReactNode; 
  required?: boolean;
  helperText?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        {children}
      </div>
      {error && (
        <motion.p 
          className="text-sm text-red-600 flex items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </motion.p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

// Composant pour l'éditeur de texte riche
// Composant pour l'éditeur de texte riche
function RichTextEditor({ 
  value, 
  onChange, 
  placeholder,
  icon
}: { 
  value: string; 
  onChange: (value: string) => void; 
  placeholder: string;
  icon?: React.ReactNode;
}) {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleCommand = (command: string) => {
    document.execCommand(command, false);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center space-x-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => {
            setIsBold(!isBold);
            handleCommand('bold');
          }}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${isBold ? 'bg-gray-200' : ''}`}
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setIsItalic(!isItalic);
            handleCommand('italic');
          }}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${isItalic ? 'bg-gray-200' : ''}`}
        >
          <Italic className="h-4 w-4" />
        </button>
        <div className="w-px h-6 bg-gray-300"></div>
        <button
          type="button"
          onClick={() => handleCommand('insertUnorderedList')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => handleCommand('insertOrderedList')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <div className="w-px h-6 bg-gray-300"></div>
        <button
          type="button"
          onClick={() => handleCommand('justifyLeft')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => handleCommand('justifyCenter')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => handleCommand('justifyRight')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
        >
          <AlignRight className="h-4 w-4" />
        </button>
      </div>
      
      {/* Editor area with icon */}
      <div className="relative"> {/* Conteneur relatif pour positionner l'icône */}
        {icon && (
          <div className="absolute left-3 top-3 text-gray-400 pointer-events-none z-10">
            {icon}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          className={`min-h-[300px] p-4 bg-white focus:outline-none ${icon ? 'pl-12' : ''}`} 
          dangerouslySetInnerHTML={{ __html: value }}
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          data-placeholder={placeholder}
          style={{
            backgroundImage: value || icon ? 'none' : `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9 2H11V4H9V2ZM9 6H11V8H9V6ZM9 10H11V12H9V10ZM9 14H11V16H9V14Z' fill='%239CA3AF'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: icon ? '50px 16px' : '16px 16px', // Ajustement de la position du placeholder
          }}
        />
      </div>
      <style jsx>{`
        [data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
        }
      `}</style>
    </div>
  );
}

// Composant pour la zone de glisser-déposer d'images
function ImageUpload({ 
  value, 
  onChange, 
  label 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  label: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      // Simuler l'upload
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange(event.target?.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange(event.target?.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-300 bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt="Preview"
              className="mx-auto h-48 object-cover rounded-lg shadow-md"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Glissez-déposez une image ici ou cliquez pour sélectionner
            </p>
            <p className="text-xs text-gray-500">JPG, PNG • Max 5MB • Ratio 16:9</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}

// Composant pour le sélecteur de dates
function DateTimePicker({ 
  value, 
  onChange, 
  label, 
  icon 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  label: string; 
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        <input
          type="datetime-local"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}

// Composant pour la carte interactive
function LocationPicker({ 
  value, 
  onChange 
}: { 
  value: any; 
  onChange: (value: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Type de lieu</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onChange({ ...value, locationType: 'HOSPITAL' })}
            className={`p-3 border rounded-lg text-sm font-medium transition-all ${
              value.locationType === 'HOSPITAL'
                ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-md'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            <Navigation className="h-4 w-4 mr-2 inline" />
            Mon hôpital
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...value, locationType: 'OTHER' })}
            className={`p-3 border rounded-lg text-sm font-medium transition-all ${
              value.locationType === 'OTHER'
                ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-md'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            <MapPin className="h-4 w-4 mr-2 inline" />
            Autre lieu
          </button>
        </div>
      </div>

      {value.locationType === 'HOSPITAL' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Sélectionner un hôpital</label>
          <select
            value={value.hospitalId}
            onChange={(e) => onChange({ ...value, hospitalId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">Sélectionner un hôpital</option>
            {mockHospitals.map((hospital) => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {value.locationType === 'HOSPITAL' ? "Informations complémentaires" : "Adresse du lieu"}
        </label>
        <input
          type="text"
          value={value.locationName || ''}
          onChange={(e) => onChange({ ...value, locationName: e.target.value })}
          placeholder="Nom du lieu"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        <textarea
          value={value.locationAddress || ''}
          onChange={(e) => onChange({ ...value, locationAddress: e.target.value })}
          placeholder="Adresse complète"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Ville</label>
          <input
            type="text"
            value={value.locationCity || ''}
            onChange={(e) => onChange({ ...value, locationCity: e.target.value })}
            placeholder="Ville"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Région</label>
          <input
            type="text"
            value={value.locationRegion || ''}
            onChange={(e) => onChange({ ...value, locationRegion: e.target.value })}
            placeholder="Région"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Localisation sur la carte</p>
        <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
          <MapPin className="h-8 w-8 text-gray-400" />
          <span className="ml-2 text-gray-500">Carte interactive</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Coordonnées: {value.locationLatitude || '4.0483'}, {value.locationLongitude || '9.7043'}
        </p>
      </div>
    </div>
  );
}

// Composant pour le panneau d'aperçu
function PreviewPanel({ formData }: { formData: AnnouncementFormData }) {
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  return (
    <div className="sticky top-24 bg-gray-50 rounded-xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Aperçu</h3>
        <button
          onClick={() => setIsMobilePreview(!isMobilePreview)}
          className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {isMobilePreview ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
        </button>
      </div>

      <div className={`${isMobilePreview ? 'w-72' : 'w-full'} bg-white rounded-lg overflow-hidden shadow-sm`}>
        {/* Image */}
        {formData.featuredImage && (
          <div className="relative">
            <img
              src={formData.featuredImage}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-white text-xs font-medium">
                {mockCategories.find(c => c.id === formData.categoryId)?.icon}{' '}
                {mockCategories.find(c => c.id === formData.categoryId)?.name}
              </span>
            </div>
          </div>
        )}

        {/* Contenu */}
        <div className="p-4">
          <h4 className="font-semibold text-gray-900 mb-2">{formData.title}</h4>
          {formData.excerpt && (
            <p className="text-sm text-gray-600 mb-3">{formData.excerpt}</p>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{new Date(formData.startDate).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{formData.locationCity || 'Lieu à définir'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-teal-600">
              {formData.isFree ? 'Gratuit' : `${formData.cost} XAF`}
            </span>
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <span>👁️ 0</span>
              <span>💬 0</span>
              <span>❤️ 0</span>
            </div>
          </div>

          {formData.capacity && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Places</span>
                <span className="text-gray-600">0/{formData.capacity}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-linear-to-r from-teal-500 to-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          💡 L&apos;aperçu se met à jour automatiquement lorsque vous modifiez le formulaire
        </p>
      </div>
    </div>
  );
}

// Composant pour les notifications toast
function NotificationToast({ 
  type, 
  message, 
  action 
}: { 
  type: 'success' | 'error' | 'info'; 
  message: string; 
  action?: { label: string; onClick: () => void };
}) {
  const bgColor = type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 
                   type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 
                   'bg-blue-50 border-blue-200 text-blue-800';
  
  const icon = type === 'success' ? <Check className="h-5 w-5" /> : 
                type === 'error' ? <AlertCircle className="h-5 w-5" /> : 
                <Bell className="h-5 w-5" />;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-20 right-4 z-50 flex items-start p-4 rounded-lg shadow-lg border ${bgColor} max-w-sm`}
      >
        <div className="flex items-start">
          <div className="shrink-0">
            {icon}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{message}</p>
            {action && (
              <button
                onClick={action.onClick}
                className="text-sm underline mt-1 hover:no-underline"
              >
                {action.label}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Bouton moderne réutilisable
// Bouton moderne réutilisable
function ModernButton({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  disabled = false, 
  className = '',
  icon,
  form  // Ajout de cette propriété
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  type?: 'button' | 'submit' | 'reset'; 
  variant?: 'primary' | 'secondary' | 'outline'; 
  disabled?: boolean; 
  className?: string;
  icon?: React.ReactNode;
  form?: string;  // Ajout de cette propriété dans le type
}) {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:from-teal-600 hover:to-blue-700 shadow-md hover:shadow-lg",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
  };
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      form={form}  // Ajout de cette propriété dans le bouton
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}

// Page principale
export default function CreateAnnouncementPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [showNotification, setShowNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string; action?: any } | null>(null);
  
  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      thumbnailImage: '',
      categoryId: '',
      startDate: '',
      endDate: '',
      targetAudience: [],
      isFree: true,
      requiresRegistration: true,
      autoCloseWhenFull: false,
      requireConfirmation: true,
      locationType: 'HOSPITAL',
      isPinned: false,
      enableComments: true,
      sendNotifications: true,
      scheduledPublish: false,
    },
  });

  // Utiliser watch() directement sans typage explicite
  const title = form.watch('title');
  const excerpt = form.watch('excerpt');
  const content = form.watch('content');
  const featuredImage = form.watch('featuredImage');
  const thumbnailImage = form.watch('thumbnailImage');
  const categoryId = form.watch('categoryId');
  const startDate = form.watch('startDate');
  const endDate = form.watch('endDate');
  const targetAudience = form.watch('targetAudience');
  const isFree = form.watch('isFree');
  const cost = form.watch('cost');
  const capacity = form.watch('capacity');
  const requiresRegistration = form.watch('requiresRegistration');
  const registrationDeadline = form.watch('registrationDeadline');
  const autoCloseWhenFull = form.watch('autoCloseWhenFull');
  const requireConfirmation = form.watch('requireConfirmation');
  const locationType = form.watch('locationType');
  const hospitalId = form.watch('hospitalId');
  const locationName = form.watch('locationName');
  const locationAddress = form.watch('locationAddress');
  const locationCity = form.watch('locationCity');
  const locationRegion = form.watch('locationRegion');
  const locationLatitude = form.watch('locationLatitude');
  const locationLongitude = form.watch('locationLongitude');
  const locationDirections = form.watch('locationDirections');
  const additionalInfo = form.watch('additionalInfo');
  const isPinned = form.watch('isPinned');
  const enableComments = form.watch('enableComments');
  const sendNotifications = form.watch('sendNotifications');
  const scheduledPublish = form.watch('scheduledPublish');
  const scheduledPublishDate = form.watch('scheduledPublishDate');
  const scheduledPublishTime = form.watch('scheduledPublishTime');

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: AnnouncementFormData) => {
    setIsSaving(true);
    
    try {
      // Simuler la sauvegarde
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowNotification({
        type: 'success',
        message: 'Annonce créée avec succès!',
        action: {
          label: 'Voir l\'annonce',
          onClick: () => router.push('/annonces/1')
        }
      });
      
      // Réinitialiser le formulaire
      form.reset();
      setCurrentStep(1);
    } catch (error) {
      setShowNotification({
        type: 'error',
        message: 'Erreur lors de la création de l\'annonce. Veuillez réessayer.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const saveDraft = async () => {
    try {
      // Simuler la sauvegarde du brouillon
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowNotification({
        type: 'info',
        message: 'Brouillon sauvegardé avec succès!'
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du brouillon:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <DashboardHeader />
      
      {/* Breadcrumb */}
      <Breadcrumb />
      
      {/* Progress Stepper */}
      <ProgressStepper currentStep={currentStep} />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Container */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormField
                      label="Titre de la campagne"
                      icon={<Target className="h-5 w-5" />}
                      error={form.formState.errors.title?.message}
                      required
                    >
                      <input
                        type="text"
                        {...form.register('title')}
                        placeholder="Ex: Campagne de vaccination contre la rougeole"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </FormField>

                    <FormField
                      label="Résumé"
                      icon={<Save className="h-5 w-5 mb-12" />}
                      error={form.formState.errors.excerpt?.message}
                      helperText="Court description qui apparaîtra dans les listes et les aperçus"
                    >
                      <textarea
                        {...form.register('excerpt')}
                        placeholder="Décrivez brièvement votre campagne..."
                        rows={3}
                        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" // <-- AJOUTEZ "pl-10" ICI
                      />
                    </FormField>

                   <FormField
                      label="Catégorie"
                      icon={<Target className="h-5 w-5" />}
                      error={form.formState.errors.categoryId?.message}
                      required
                    >
                      <select
                        {...form.register('categoryId')}
                        className="w-full pr-3 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" // <-- MODIFIEZ ICI
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {mockCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </option>
                        ))}
                      </select>
                    </FormField>

                    <div className="flex justify-end">
                      <ModernButton
                        onClick={nextStep}
                        variant="primary"
                        icon={<ChevronRight className="h-4 w-4" />}
                      >
                        Suivant
                      </ModernButton>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Content */}
                {currentStep === 2 && (
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormField
                      label="Description complète"
                      // Pas d'icône ici, et ce n'est plus une erreur !
                      error={form.formState.errors.content?.message}
                      required
                    >
                      <RichTextEditor
                        value={content || ''}
                        onChange={(value) => form.setValue('content', value)}
                        placeholder="Décrivez en détail votre campagne..."
                        icon={<Save className="h-5 w-5" />}
                      />
                    </FormField>

                    <ImageUpload
                      label="Image principale"
                      value={featuredImage || ''}
                      onChange={(value) => form.setValue('featuredImage', value)}
                    />

                    <ImageUpload
                      label="Image miniature (optionnelle)"
                      value={thumbnailImage || ''}
                      onChange={(value) => form.setValue('thumbnailImage', value)}
                    />

                    <div className="flex justify-between">
                      <ModernButton
                        onClick={prevStep}
                        variant="secondary"
                        icon={<ChevronLeft className="h-4 w-4" />}
                      >
                        Précédent
                      </ModernButton>
                      <ModernButton
                        onClick={nextStep}
                        variant="primary"
                        icon={<ChevronRight className="h-4 w-4" />}
                      >
                        Suivant
                      </ModernButton>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Date & Location */}
                {currentStep === 3 && (
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DateTimePicker
                        label="Date de début"
                        value={startDate || ''}
                        onChange={(value) => form.setValue('startDate', value)}
                        icon={<Calendar className="h-5 w-5" />}
                      />

                      <DateTimePicker
                        label="Date de fin"
                        value={endDate || ''}
                        onChange={(value) => form.setValue('endDate', value)}
                        icon={<Calendar className="h-5 w-5" />}
                      />
                    </div>

                    <LocationPicker
                      value={{
                        locationType,
                        hospitalId,
                        locationName,
                        locationAddress,
                        locationCity,
                        locationRegion,
                        locationLatitude,
                        locationLongitude,
                      }}
                      onChange={(value) => {
                        form.setValue('locationType', value.locationType);
                        form.setValue('hospitalId', value.hospitalId);
                        form.setValue('locationName', value.locationName);
                        form.setValue('locationAddress', value.locationAddress);
                        form.setValue('locationCity', value.locationCity);
                        form.setValue('locationRegion', value.locationRegion);
                        form.setValue('locationLatitude', value.locationLatitude);
                        form.setValue('locationLongitude', value.locationLongitude);
                      }}
                    />

                    <div className="flex justify-between">
                      <ModernButton
                        onClick={prevStep}
                        variant="secondary"
                        icon={<ChevronLeft className="h-4 w-4" />}
                      >
                        Précédent
                      </ModernButton>
                      <ModernButton
                        onClick={nextStep}
                        variant="primary"
                        icon={<ChevronRight className="h-4 w-4" />}
                      >
                        Suivant
                      </ModernButton>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Options */}
                {currentStep === 4 && (
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-medium text-gray-700">Tarification</label>
                        <button
                          type="button"
                          onClick={() => form.setValue('isFree', !isFree)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            isFree
                              ? 'bg-linear-to-r from-teal-500 to-blue-600'
                              : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform ${
                              isFree ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        {isFree ? 'Gratuit' : 'Payant'}
                      </p>
                    </div>

                    {!isFree && (
                      <FormField
                        label="Coût par personne (FCFA)"
                        icon={<DollarSign className="h-5 w-5" />}
                        error={form.formState.errors.cost?.message}
                      >
                        <input
                          type="number"
                          {...form.register('cost', { valueAsNumber: true })}
                          placeholder="2500"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </FormField>
                    )}

                    <FormField
                      label="Public cible"
                      icon={<Users className="h-5 w-5" />}
                      error={form.formState.errors.targetAudience?.message}
                      required
                    >
                      <div className="space-y-2">
                        {['CHILDREN', 'INFANTS', 'ADULTS', 'ELDERLY', 'PREGNANT_WOMEN', 'ALL'].map((audience) => (
                          <label key={audience} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input
                              type="checkbox"
                              {...form.register('targetAudience')}
                              value={audience}
                              className="mr-3 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                            />
                            <span className="text-sm text-gray-700">
                              {audience === 'CHILDREN' && '👶 Enfants (0-2 ans)'}
                              {audience === 'INFANTS' && '👶 Nourrissons (0-2 ans)'}
                              {audience === 'ADULTS' && '👤 Adultes (18-60 ans)'}
                              {audience === 'ELDERLY' && '👴 Personnes âgées (60+ ans)'}
                              {audience === 'PREGNANT_WOMEN' && '🤰 Femmes enceintes'}
                              {audience === 'ALL' && '👥 Tout public'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </FormField>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <FormField
                        label="Nombre de places"
                        icon={<Users className="h-5 w-5" />}
                        error={form.formState.errors.capacity?.message}
                      >
                        <div className="flex items-center">
                          <input
                            type="number"
                            {...form.register('capacity', { valueAsNumber: true })}
                            placeholder="150"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                      </FormField>

                      <div className="mt-4">
                        <label className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                          <input
                            type="checkbox"
                            {...form.register('requiresRegistration')}
                            className="mr-3 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                          />
                          <span className="text-sm text-gray-700">Inscription requise</span>
                        </label>
                      </div>

                      {requiresRegistration && (
                        <div className="mt-4 space-y-3 pl-6">
                          <DateTimePicker
                            label="Date limite d'inscription"
                            value={registrationDeadline || ''}
                            onChange={(value) => form.setValue('registrationDeadline', value)}
                            icon={<Clock className="h-5 w-5" />}
                          />

                          <label className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <input
                              type="checkbox"
                              {...form.register('autoCloseWhenFull')}
                              className="mr-3 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                            />
                            <span className="text-sm text-gray-700">Clôturer automatiquement si complet</span>
                          </label>

                          <label className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <input
                              type="checkbox"
                              {...form.register('requireConfirmation')}
                              className="mr-3 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                            />
                            <span className="text-sm text-gray-700">Confirmation requise (email/SMS)</span>
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <ModernButton
                        onClick={prevStep}
                        variant="secondary"
                        icon={<ChevronLeft className="h-4 w-4" />}
                      >
                        Précédent
                      </ModernButton>
                      <ModernButton
                        onClick={nextStep}
                        variant="primary"
                        icon={<ChevronRight className="h-4 w-4" />}
                      >
                        Suivant
                      </ModernButton>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Publish */}
                {currentStep === 5 && (
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Options de publication</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                          <div>
                            <p className="font-medium text-gray-900">Publier maintenant</p>
                            <p className="text-sm text-gray-600">L&apos;annonce sera visible immédiatement</p>
                          </div>
                          <ModernButton
                            type="submit"
                            disabled={isSaving}
                            variant="primary"
                            icon={isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                          >
                            {isSaving ? 'Publication...' : 'Publier'}
                          </ModernButton>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <label className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <input
                              type="checkbox"
                              {...form.register('scheduledPublish')}
                              className="mr-3 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                            />
                            <span className="text-sm text-gray-700">Programmer la publication</span>
                          </label>
                          
                          {scheduledPublish && (
                            <div className="mt-4 space-y-4 pl-6">
                              <DateTimePicker
                                label="Date de publication"
                                value={scheduledPublishDate || ''}
                                onChange={(value) => form.setValue('scheduledPublishDate', value)}
                                icon={<Calendar className="h-5 w-5" />}
                              />
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                                  <input
                                    type="time"
                                    {...form.register('scheduledPublishTime')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-medium text-gray-900 mb-3">Options supplémentaires</h4>
                        
                        <div className="space-y-3">
                          <label className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <input
                              type="checkbox"
                              {...form.register('isPinned')}
                              className="mr-3 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                            />
                            <span className="text-sm text-gray-700">Épingler en haut</span>
                          </label>

                          <label className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <input
                              type="checkbox"
                              {...form.register('enableComments')}
                              className="mr-3 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                            />
                            <span className="text-sm text-gray-700">Activer les commentaires</span>
                          </label>

                          <label className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <input
                              type="checkbox"
                              {...form.register('sendNotifications')}
                              className="mr-3 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                            />
                            <span className="text-sm text-gray-700">Envoyer des notifications push</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <ModernButton
                          onClick={prevStep}
                          variant="secondary"
                          icon={<ChevronLeft className="h-4 w-4" />}
                        >
                          Précédent
                        </ModernButton>
                        <ModernButton
                          onClick={saveDraft}
                          variant="outline"
                          icon={<Save className="h-4 w-4" />}
                        >
                          Sauvegarder le brouillon
                        </ModernButton>
                      </div>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <PreviewPanel 
              formData={form.getValues()}
            />
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <ModernButton
              onClick={() => router.back()}
              variant="outline"
              icon={<ArrowLeft className="h-4 w-4" />}
            >
              Annuler
            </ModernButton>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <ModernButton
                onClick={saveDraft}
                variant="outline"
                icon={<Save className="h-4 w-4" />}
              >
                <span className="hidden sm:inline">Brouillon</span>
                <span className="sm:hidden">Brouillon</span>
              </ModernButton>
              
              <ModernButton
                type="submit"
                form="announcement-form"
                disabled={isSaving}
                variant="primary"
                icon={isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
              >
                {isSaving ? (
                  <>
                    <span className="hidden sm:inline">Publication...</span>
                    <span className="sm:hidden">Publication...</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Publier l&apos;annonce</span>
                    <span className="sm:hidden">Publier</span>
                  </>
                )}
              </ModernButton>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {showNotification && (
          <NotificationToast
            type={showNotification.type}
            message={showNotification.message}
            action={showNotification.action}
          />
        )}
      </AnimatePresence>
    </div>
  )
}