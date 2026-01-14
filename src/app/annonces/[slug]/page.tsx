/* eslint-disable @typescript-eslint/no-unused-vars */
// app/annonces/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AnnouncementDetailPage from '@/components/announcements/AnnouncementDetailPage';
import { announcementsApi } from '@/lib/api-endponts'; 

// ✅ MODIFICATION 1 : params doit être une Promise
interface PageProps {
  params: Promise<{ slug: string }>;
}

// ✅ MODIFICATION 2 : generateMetadata devient asynchrone avec await params
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params; // On attend la résolution ici
    const slug = resolvedParams.slug;

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

// ✅ MODIFICATION 3 : Le composant devient async avec await params
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Si tu as besoin de vérifier si l'annonce existe avant d'afficher :
  // if (!slug) notFound();

  return <AnnouncementDetailPage />;
}