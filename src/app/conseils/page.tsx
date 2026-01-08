// app/conseils/page.tsx
import { Metadata } from 'next';
import AdvicesPage from '@/components/conseils/AdvicesPage'; // Ton composant client ci-dessous

export const metadata: Metadata = {
  title: 'Conseils et Recommandations Santé',
  description: 'Consultez nos conseils santé classés par priorité et catégorie.',
  openGraph: {
    title: 'Conseils Santé',
    description: 'Recommandations médicales et astuces de bien-être.',
  },
};

export default function Page() {
  return <AdvicesPage />;
}