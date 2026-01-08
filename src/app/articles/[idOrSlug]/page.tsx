/* eslint-disable @typescript-eslint/no-unused-vars */
// app/articles/[idOrSlug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleDetailPage from '@/components/articles/ArticleDetailPage'; // Ton composant client ci-dessous

// Fonction helper pour récupérer les données (simulée ici, à adapter à ta logique fetch côté serveur)
// Dans une vraie app, tu ferais ici un `fetch(articlesApi.getArticleById(id))` pour avoir les métadonnées avant le rendu.

interface PageProps {
  params: { idOrSlug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Idéalement : fetch article data ici
  // const article = await fetchArticle(params.idOrSlug);
  return {
    title: "Détail de l'article - Ma Plateforme Santé",
    description: "Lisez cet article complet...",
    openGraph: {
      title: "Titre de l'article",
      type: "article",
      images: ["/default-og.jpg"],
    },
  };
}

export default function Page({ params }: PageProps) {
  return <ArticleDetailPage />;
}