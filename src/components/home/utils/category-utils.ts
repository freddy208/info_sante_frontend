// Type d'entrée générique pour accepter soit une chaîne (nom), soit un objet Category
interface CategoryInput {
  name: string;
  icon?: string | null;
}

export const getCategoryIcon = (category: CategoryInput | string | null | undefined) => {
  if (!category) return '🏥'; // Fallback si null/undefined

  // Cas 1 : C'est une simple chaîne de caractères (nom direct)
  if (typeof category === 'string') {
    const name = category.toLowerCase();
    // Priorité aux noms exacts des nouvelles catégories
    if (name.includes('vaccin')) return '💉';
    if (name.includes('palud')) return '🦟'; // Couvre "Paludisme"
    if (name.includes('hygiène') || name.includes('hygiene')) return '🧼';
    if (name.includes('nutri')) return '🍎';
    if (name.includes('matern')) return '🤰';
    if (name.includes('infant') || name.includes('enfant')) return '👶';
    if (name.includes('diab') || name.includes('chronique')) return '💊';
    if (name.includes('urgence')) return '🚨';
    if (name.includes('consult')) return '🩺';
    if (name.includes('sang')) return '🩸';
    
    // Fallback générique
    return '🏥';
  }

  // Cas 2 : C'est un objet (CategoryLite ou Category)
  // On vérifie d'abord si la propriété 'icon' existe et n'est pas vide
  if (category.icon) {
    return category.icon;
  }

  // Cas 3 : Fallback automatique basé sur le nom si pas d'icône customisée
  const name = category.name.toLowerCase();
  if (name.includes('vaccin')) return '💉';
  if (name.includes('palud')) return '🦟';
  if (name.includes('hygiène') || name.includes('hygiene')) return '🧼';
  if (name.includes('nutri')) return '🍎';
  if (name.includes('matern')) return '🤰';
  if (name.includes('infant') || name.includes('enfant')) return '👶';
  if (name.includes('diab') || name.includes('chronique')) return '💊';
  if (name.includes('urgence')) return '🚨';
  if (name.includes('consult')) return '🩺';
  if (name.includes('sang')) return '🩸';

  return '🏥'; // Défaut
};

export const getCategoryColor = (categoryName: string) => {
  const name = categoryName.toLowerCase();

  // Correspondance avec les couleurs du Seed (approximatives en gradients)
  if (name.includes('vaccin')) return 'from-emerald-400 to-emerald-600';
  if (name.includes('palud')) return 'from-amber-400 to-orange-500'; // Moustique/Chaleur
  if (name.includes('hygi')) return 'from-gray-300 to-gray-500'; // Propre/Neutre
  if (name.includes('nutri')) return 'from-lime-400 to-green-500'; // Frais/Santé
  if (name.includes('matern')) return 'from-pink-400 to-pink-600';
  if (name.includes('infant') || name.includes('enfant')) return 'from-blue-400 to-blue-600';
  if (name.includes('chronique') || name.includes('diab')) return 'from-violet-400 to-violet-600';
  if (name.includes('urgence')) return 'from-red-400 to-red-600';
  if (name.includes('consult')) return 'from-sky-400 to-sky-600';
  if (name.includes('sang')) return 'from-red-500 to-red-700';

  return 'from-gray-200 to-gray-400'; // Couleur par défaut
};