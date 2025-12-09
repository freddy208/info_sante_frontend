import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"; // Utilitaire de shadcn/ui pour les classes

// Définissons les catégories possibles basées sur votre schéma et vos couleurs
// Cela garantit la cohérence et l'autocomplétion
type CategoryName = 
  | "vaccination"
  | "depistage"
  | "sensibilisation"
  | "consultation"
  | "urgence"
  | "prevention"
  | "formation";

interface BadgeCategorieProps {
  category: CategoryName;
  className?: string; // Permet de passer des classes Tailwind supplémentaires
}

// L'objet qui fait le lien entre le nom de la catégorie et la classe de couleur
const categoryColorVariants: Record<CategoryName, string> = {
  vaccination: "bg-[#7E57C2] hover:bg-[#7E57C2]/80 text-white",
  depistage: "bg-[#EC407A] hover:bg-[#EC407A]/80 text-white",
  sensibilisation: "bg-[#26A69A] hover:bg-[#26A69A]/80 text-white",
  consultation: "bg-[#5C6BC0] hover:bg-[#5C6BC0]/80 text-white",
  urgence: "bg-[#EF5350] hover:bg-[#EF5350]/80 text-white",
  prevention: "bg-[#66BB6A] hover:bg-[#66BB6A]/80 text-white",
  formation: "bg-[#FFA726] hover:bg-[#FFA726]/80 text-white",
};

export function BadgeCategorie({ category, className }: BadgeCategorieProps) {
  // On récupère la classe de couleur correspondante
  const colorClass = categoryColorVariants[category];

  return (
    <Badge className={cn("capitalize", colorClass, className)}>
      {category}
    </Badge>
  );
}