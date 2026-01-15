import { Metadata } from 'next';
import { Suspense } from 'react'; // ✅ CORRECTION : Importer Suspense depuis 'react'
import ArticlesPage from '@/components/articles/ArticlesPage';

// ✅ CORRECTION DU WARNING METADATA
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: 'Articles de Santé et Conseils Médicaux',
  description: 'Découvrez nos derniers articles, conseils et actualités pour une meilleure santé.',
  openGraph: {
    title: 'Articles de Santé',
    description: 'Conseils médicaux et actualités santé.',
    url: APP_URL,
    siteName: 'Info Santé',
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function Page() {
  return (
    // ✅ WRAP DANS SUSPENSE
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    }>
      <ArticlesPage />
    </Suspense>
  );
}