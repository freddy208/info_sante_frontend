/* eslint-disable @typescript-eslint/no-unused-vars */
// app/annonces/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AnnouncementDetailPage from '@/components/announcements/AnnouncementDetailPage'; // Ton composant client ci-dessous
import { announcementsApi } from '@/lib/api-endponts'; // Assure-toi que cette fonction marche côté serveur ou utilise un fetch direct

interface PageProps {
  params: { slug: string };
}

// Génération des Métadonnées pour le SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    // Idéalement, appeler une API légère pour récupérer juste le titre/desc
    // const announcement = await announcementsApi.getAnnouncementById(params.slug); 
    // Pour l'exemple, je simule ou utilise un fetch direct si l'API client ne tourne pas sur serveur
    return {
      title: 'Détail de la campagne',
      description: 'Participez à cette campagne de santé.',
      openGraph: {
        title: 'Titre OG',
        images: ['/og-image.jpg'],
      },
    };
  } catch (e) {
    return { title: 'Annonce' };
  }
}

export default function Page({ params }: PageProps) {
  // Tu peux passer des données pré-fetchées ici si tu veux optimiser le "Server Render"
  return <AnnouncementDetailPage />;
}