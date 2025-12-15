"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { NetworkProvider } from "./contexts/NetworkContext";
import OfflineBanner from "@/components/OfflineBanner";

// Créez une instance de QueryClient. Comme ce fichier est un Client Component,
// cette instance est créée côté client, ce qui est parfait.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <NetworkProvider>
        <OfflineBanner />
          {children}
      </NetworkProvider>
    </QueryClientProvider>
  );
}