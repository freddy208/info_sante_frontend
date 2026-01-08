/* eslint-disable @typescript-eslint/no-unused-vars */
// app/conseils/[id]/page.tsx
import { Metadata } from 'next';
import AdviceDetailPage from '@/components/conseils/AdviceDetailPage'; // Ton composant client ci-dessous

// Fonction helper pour récupérer les données (simulée ici)
interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: "Détail du Conseil - Ma Plateforme Santé",
    description: "Lisez nos conseils médicaux validés par des experts.",
    openGraph: {
      title: "Conseil Santé",
      images: ["/default-og.jpg"],
    },
  };
}

export default function Page({ params }: PageProps) {
  return <AdviceDetailPage />;
}