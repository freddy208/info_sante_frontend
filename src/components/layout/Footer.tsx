// components/footer.tsx
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-10 text-gray-300 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Heart className="h-5 w-5 text-red-500 fill-red-500 animate-pulse" />
          <span className="font-medium">Conçu pour protéger et informer le Cameroun 🇨🇲</span>
        </div>
        <p className="text-sm opacity-80">© {new Date().getFullYear()} Info Santé 237 — Tous droits réservés.</p>
      </div>
    </footer>
  );
}