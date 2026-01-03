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
    if (name.includes('vaccin')) return '💉';
    if (name.includes('dépist')) return '🔬';
    if (name.includes('palud')) return '🦟';
    if (name.includes('matern')) return '🤰';
    if (name.includes('nutrition')) return '🍎';
    if (name.includes('cancer')) return '🎗️';
    if (name.includes('diab')) return '🩸';
    if (name.includes('hyper')) return '❤️';
    if (name.includes('planif')) return '👨‍👩‍👧‍👦';
    if (name.includes('hygi')) return '🧼';
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
  if (name.includes('dépist')) return '🔬';
  if (name.includes('palud')) return '🦟';
  if (name.includes('matern')) return '🤰';
  if (name.includes('nutrition')) return '🍎';
  if (name.includes('cancer')) return '🎗️';
  if (name.includes('diab')) return '🩸';
  if (name.includes('hyper')) return '❤️';
  if (name.includes('planif')) return '👨‍👩‍👧‍👦';
  if (name.includes('hygi')) return '🧼';

  return '🏥'; // Défaut
};

export const getCategoryColor = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('vaccin')) return 'from-emerald-400 to-emerald-600';
  if (name.includes('dépist')) return 'from-blue-400 to-blue-600';
  if (name.includes('palud')) return 'from-yellow-400 to-orange-500';
  if (name.includes('matern')) return 'from-pink-400 to-pink-600';
  if (name.includes('nutrition')) return 'from-green-400 to-teal-600';
  if (name.includes('cancer')) return 'from-red-400 to-red-600';
  if (name.includes('diab')) return 'from-indigo-400 to-indigo-600';
  if (name.includes('hyper')) return 'from-purple-400 to-purple-600';
  if (name.includes('planif')) return 'from-teal-400 to-teal-600';
  if (name.includes('hygi')) return 'from-gray-400 to-gray-600';
  return 'from-gray-400 to-gray-600'; // Couleur par défaut
};