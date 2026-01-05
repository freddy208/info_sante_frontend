import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Providers } from "./providers";
import 'leaflet/dist/leaflet.css';

// On n'importe plus "next/font". On utilisera la font définie dans globals.css (font-sans)
// Cela évite l'erreur "Module not found" et le timeout de téléchargement.

export const metadata: Metadata = {
  title: "Info Santé 237",
  description: "Votre santé, notre priorité, au Cameroun.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased"
      )}>
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}