// app/articles/page.tsx
import { Metadata } from 'next';
import ArticlesPage from '@/components/articles/ArticlesPage'; // Ton composant client ci-dessous

export const metadata: Metadata = {
  title: 'Articles de Santé et Conseils Médicaux',
  description: 'Découvrez nos derniers articles, conseils et actualités pour une meilleure santé.',
  openGraph: {
    title: 'Articles de Santé',
    description: 'Conseils médicaux et actualités santé.',
  },
};

export default function Page() {
  return <ArticlesPage />;
}