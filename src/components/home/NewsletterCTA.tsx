/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Mail, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

const newsletterSchema = z.object({
  email: z.string().email('Veuillez entrer une adresse email valide'),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export default function NewsletterCTA() {
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  const newsletterForm = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '' },
  });

  const handleNewsletterSubmit = async (data: NewsletterFormData) => {
    setIsSubscribing(true);
    try {
      // Simuler l'inscription à la newsletter
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Inscription à la newsletter réussie !');
      newsletterForm.reset();
    } catch (error) {
      toast.error('Erreur lors de l\'inscription à la newsletter');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-br from-teal-600 to-teal-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Mail className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Restez informé des dernières campagnes</h2>
          <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Inscrivez-vous à notre newsletter pour recevoir les alertes de santé directement dans votre boîte mail
          </p>

          <form onSubmit={newsletterForm.handleSubmit(handleNewsletterSubmit)} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
            <input
              type="email"
              {...newsletterForm.register('email')}
              placeholder="Votre adresse email..."
              className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
            />
            <button
              type="submit"
              disabled={isSubscribing}
              className="px-4 sm:px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 text-sm sm:text-base"
            >
              {isSubscribing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'S\'inscrire'}
            </button>
          </form>

          <div className="flex justify-center mt-6 space-x-4 sm:space-x-6 text-sm text-white/80">
            <div className="flex items-center">
              <span className="mr-2">✓</span> Gratuit
            </div>
            <div className="flex items-center">
              <span className="mr-2">✓</span> Sans spam
            </div>
            <div className="flex items-center">
              <span className="mr-2">✓</span> Désabonnement facile
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}