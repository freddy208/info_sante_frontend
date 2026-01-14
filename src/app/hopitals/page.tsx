// app/hopitals/page.tsx
import { Metadata } from 'next';
import HospitalsListPage from '@/components/hopitaux/HospitalsListPage'; // Ou l'endroit où est ton composant client

export const metadata: Metadata = {
  title: "Annuaire des Hôpitaux au Cameroun | MboaSanté",
  description: "Trouvez rapidement un hôpital, une clinique ou un centre de santé près de chez vous au Cameroun. Horaires, avis et itinéraire.",
  openGraph: {
    title: "Annuaire Santé Cameroun",
    description: "Carte interactive et liste complète des structures de santé.",
    type: "website",
    locale: 'fr_FR',
  },
  alternates: {
    canonical: '/hopitals',
  },
};

export default function Page() {
  return <HospitalsListPage />;
}