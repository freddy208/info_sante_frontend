import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-8 bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          <p className="font-medium">Conçu avec passion pour le Cameroun 🇨🇲</p>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} Info Santé 237. Tous droits réservés.</p>
      </div>
    </footer>
  );
}