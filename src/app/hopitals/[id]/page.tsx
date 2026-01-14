import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HospitalDetailsContent from '@/components/hopitaux/HospitalDetailsContent';

type Props = {
  params: Promise<{ id: string }>; // Modifier ici : ajouter Promise
};

// Fetch SEO
async function getHospitalForSEO(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/organizations/${id}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return null;

    const json = await res.json();
    return json.data ?? json;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { id } = await params;

  if (!id) {
    return { title: 'Hôpital introuvable | MboaSanté' };
  }

  const hospital = await getHospitalForSEO(id);

  if (!hospital) {
    return {
      title: 'Hôpital introuvable | MboaSanté',
      description: 'Cet établissement n’existe pas.',
    };
  }

  return {
    title: `${hospital.name} | MboaSanté`,
    description: hospital.description,
    alternates: {
      canonical: `/hopitals/${id}`,
    },
  };
}


export default async function Page({ params }: Props) {
  const { id } = await params;

  if (!id) notFound();

  return <HospitalDetailsContent id={id} />;
}

