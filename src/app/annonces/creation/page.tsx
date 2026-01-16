/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Megaphone, ImagePlus, X, Calendar, DollarSign, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { useAnnouncement, useCreateAnnouncement, useUpdateAnnouncement } from '@/hooks/useAnnouncements';
import { useUploadImage } from '@/hooks/useUploads';
import { useAnnouncementsList } from '@/hooks/useAnnouncements'; // Pour les catégories si besoin
import { TargetAudience, UpdateAnnouncementDto } from '@/types/announcement';
import { ContentType } from '@/types/upload';
import { useCategoriesList } from '@/hooks/useCategories';

// 1. Schéma Zod aligné avec ton Backend
const announcementSchema = z.object({
  title: z.string().min(5).max(200),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(10),
  // ✅ Correction syntaxique ici
 featuredImage: z
    .string()          // doit être une string
    .min(1, "L'image de couverture est obligatoire") // obligatoire
    .url("L'image n'est pas valide"),    
  
  thumbnailImage: z.string().optional().nullable(),
  categoryId: z.string().min(1, "Veuillez choisir une catégorie"),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  targetAudience: z.array(z.nativeEnum(TargetAudience)).min(1),
  isFree: z.boolean(),
  // ✅ On force la conversion en nombre et on gère le cas "0" proprement
  cost: z.coerce.number()
    .min(0, "Le coût ne peut pas être négatif")
    .default(0),

  // ✅ Le backend semble exiger au moins 1 place si le champ est rempli
  capacity: z.coerce.number()
    .int("La capacité doit être un nombre entier")
    .min(1, "La capacité doit être d'au moins 1 personne"),
  requiresRegistration: z.boolean(),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

export default function AnnouncementFormPage() {
  const router = useRouter();
  const params = useParams();
  const announcementId = params?.id as string;
  const isEditMode = !!announcementId;
  const [currentStep, setCurrentStep] = useState(1);

  const { data: existingData, isLoading: isLoadingExisting } = useAnnouncement(announcementId);
  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();
  const uploadMutation = useUploadImage();
  // 2. Récupérer les catégories
  const { data: categoriesData, isLoading: isLoadingCats } = useCategoriesList({ isActive: true });
  // Extraire le tableau de catégories (dépend de la structure de ton PaginatedCategoriesResponse)
  const categories = categoriesData?.data || [];

  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema) as any,
    mode: 'all',
    defaultValues: {
  title: '',
  content: '',
  featuredImage: '', // ✅
  thumbnailImage: undefined,
  targetAudience: [],
  isFree: true,
  cost: 0,
  capacity: 100,
  requiresRegistration: false,
},

  });

  // Hydratation en mode édition
  useEffect(() => {
    if (isEditMode && existingData) {
      form.reset({
        ...existingData,
        startDate: existingData.startDate ? new Date(existingData.startDate).toISOString().split('T')[0] : '',
        endDate: existingData.endDate ? new Date(existingData.endDate).toISOString().split('T')[0] : '',
         targetAudience: (existingData.targetAudience || []).filter((v: any) => Object.values(TargetAudience).includes(v)),
      } as any);
    }
  }, [existingData, isEditMode, form]);

  // Handler d'upload d'image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadMutation.mutateAsync({
        file,
        data: { contentType: ContentType.ANNOUNCEMENT }
      });
      form.setValue('featuredImage', result.url, { shouldValidate: true });
      if (result.thumbnailUrl) form.setValue('thumbnailImage', result.thumbnailUrl);
      toast.success("Image traitée avec succès");
    } catch (error) {
      toast.error("Échec de l'upload");
    }
  };

  const onSubmit: SubmitHandler<AnnouncementFormData> = async (values) => {
    try {
      const payload: any = {
        ...values,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        excerpt: values.excerpt || undefined,
        // ✅ Sécurité : Si c'est gratuit, on force le coût à 0
       cost: values.isFree ? 0 : values.cost,
        thumbnailImage: values.thumbnailImage || undefined,
      };

      if (isEditMode) {
        await updateMutation.mutateAsync({ id: announcementId, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      router.push('/annonces');
    } catch (error) {
      console.error(error);
    }
  };

  // Affichage d'un toast si erreur cachée
  const onError = (errors: any) => {
    console.log("Erreurs validation:", errors);
    toast.error("Veuillez vérifier les champs obligatoires (Image, Catégorie, Dates...)");
  };

  if (isEditMode && isLoadingExisting) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-teal-600 h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">{isEditMode ? "Modifier" : "Créer"} une annonce</h1>
        </div>
        <div className="flex items-center gap-2">
           <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentStep === 1 ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'}`}>1. Infos</span>
           <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentStep === 2 ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'}`}>2. Détails</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form id="announcement-form" onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
            
            <AnimatePresence mode="wait">
              {currentStep === 1 ? (
                <motion.div 
                  key="step1" 
                  initial={{ x: -20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  exit={{ x: 20, opacity: 0 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border space-y-6"
                >
                  <FormField label="Titre de l'annonce" error={form.formState.errors.title?.message}>
                    <input {...form.register('title')} placeholder="Ex: Campagne de dépistage..." className="form-input-custom" />
                  </FormField>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Date de début" error={form.formState.errors.startDate?.message}>
                      <input type="date" {...form.register('startDate')} className="form-input-custom" />
                    </FormField>
                    <FormField label="Date de fin" error={form.formState.errors.endDate?.message}>
                      <input type="date" {...form.register('endDate')} className="form-input-custom" />
                    </FormField>
                  </div>

                  <FormField label="Public Cible" error={form.formState.errors.targetAudience?.message}>
                    <div className="flex flex-wrap gap-2">
                      {Object.values(TargetAudience).map((audience) => (
                        <label key={audience} className={`flex items-center gap-2 px-4 py-2 border rounded-xl cursor-pointer transition ${form.watch('targetAudience')?.includes(audience) ? 'bg-teal-50 border-teal-500 text-teal-700' : 'hover:bg-gray-50'}`}>
                          <input 
                            type="checkbox" className="hidden"
                            checked={form.watch('targetAudience')?.includes(audience)}
                            onChange={(e) => {
                              const prev = form.getValues('targetAudience') || [];
                              const next = e.target.checked ? [...prev, audience] : prev.filter(a => a !== audience);
                              form.setValue('targetAudience', next, { shouldValidate: true });
                            }}
                          />
                          <span className="text-sm font-medium">{audience}</span>
                        </label>
                      ))}
                    </div>
                  </FormField>

                 <FormField label="Catégorie" error={form.formState.errors.categoryId?.message}>
    <div className="relative">
      <select 
        {...form.register('categoryId')} 
        className="form-input-custom appearance-none"
        disabled={isLoadingCats}
      >
        <option value="">-- Sélectionner une catégorie --</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      {isLoadingCats && (
        <Loader2 className="absolute right-4 top-3.5 animate-spin text-teal-600 h-5 w-5" />
      )}
    </div>
  </FormField>

                  <button type="button" onClick={() => setCurrentStep(2)} className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-100">
                    Suivant : Description & Image
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="step2" 
                  initial={{ x: 20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  exit={{ x: -20, opacity: 0 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border space-y-6"
                >
                  <FormField label="Image de couverture" error={form.formState.errors.featuredImage?.message}>
                    <div className="relative group">
                      {form.watch('featuredImage') ? (
                        <div className="relative h-56 rounded-xl overflow-hidden border">
                          <img src={form.watch('featuredImage')} alt="Cover" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => form.setValue('featuredImage','', { shouldValidate: true })} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-56 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                          {uploadMutation.isPending ? (
                            <Loader2 className="animate-spin text-teal-600" />
                          ) : (
                            <>
                              <ImagePlus className="text-gray-400 mb-2" size={32} />
                              <span className="text-sm text-gray-500 font-medium">Uploader l&apos;image Cloudinary</span>
                            </>
                          )}
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadMutation.isPending} />
                        </label>
                      )}
                    </div>
                  </FormField>

                  <FormField label="Contenu détaillé" error={form.formState.errors.content?.message}>
                    <textarea {...form.register('content')} placeholder="Détaillez votre annonce ici..." className="form-input-custom min-h-[250px] resize-none" />
                  </FormField>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                     <FormField label="Gratuit ?">
                       <input type="checkbox" {...form.register('isFree')} className="h-5 w-5 accent-teal-600" />
                     </FormField>
                     {!form.watch('isFree') && (
                        <FormField label="Coût" error={form.formState.errors.cost?.message}>
                          <input type="number" {...form.register('cost')} className="form-input-custom" />
                        </FormField>
                     )}
                  </div>

                  <button type="button" onClick={() => setCurrentStep(1)} className="w-full text-gray-500 font-medium py-2 hover:underline transition">
                    Retour aux informations générales
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Panneau de droite : Preview */}
        <aside className="hidden lg:block">
           <div className="sticky top-24 space-y-4">
              <h2 className="font-bold text-gray-700 flex items-center gap-2"><Megaphone size={18} className="text-teal-600" /> Aperçu en direct</h2>
              <PreviewPanel formData={form.watch()} />
           </div>
        </aside>
      </main>

      {/* Barre d'action fixe */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center px-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
        <div className="text-sm text-gray-400 font-medium">
          {form.formState.isDirty ? "Modifications non enregistrées" : "Toutes les données sont à jour"}
        </div>
        <button 
          type="submit" 
          form="announcement-form"
          className="bg-teal-600 text-white px-12 py-3.5 rounded-xl font-bold flex items-center gap-3 hover:bg-teal-700 transition active:scale-95 disabled:opacity-50 shadow-lg shadow-teal-200"
          disabled={createMutation.isPending || updateMutation.isPending || uploadMutation.isPending}
        >
          {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="animate-spin" size={20} />}
          {isEditMode ? "Enregistrer les modifications" : "Publier l'annonce"}
        </button>
      </div>

      <style jsx global>{`
        .form-input-custom {
          @apply w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition font-medium text-gray-700;
        }
      `}</style>
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

function FormField({ label, children, error }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold text-gray-600 ml-1">{label}</label>
      {children}
      {error && <span className="text-xs text-red-500 font-medium ml-1">{error}</span>}
    </div>
  );
}

function PreviewPanel({ formData }: { formData: any }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="h-48 bg-gray-100 flex items-center justify-center relative">
        {formData.featuredImage ? (
          <img src={formData.featuredImage} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <Megaphone className="text-gray-300 h-12 w-12" />
        )}
        {formData.isFree && (
          <span className="absolute top-3 left-3 bg-teal-500 text-white text-[10px] font-black px-2 py-1 rounded">GRATUIT</span>
        )}
      </div>
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
           {formData.targetAudience?.slice(0, 2).map((a: string) => (
             <span key={a} className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded font-bold uppercase">{a}</span>
           ))}
        </div>
        <h3 className="font-bold text-gray-800 leading-tight line-clamp-2">{formData.title || "Titre de l'annonce..."}</h3>
        <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">{formData.content || "Description courte..."}</p>
        <div className="pt-3 border-t flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
           <div className="flex items-center gap-1"><Calendar size={12}/> {formData.startDate || 'Date'}</div>
           <div className="flex items-center gap-1"><Users size={12}/> {formData.capacity || 0} Places</div>
        </div>
      </div>
    </div>
  );
}