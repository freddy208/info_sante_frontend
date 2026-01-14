/* eslint-disable react-hooks/set-state-in-effect */
// src/hooks/useAuthState.ts
import { useState, useEffect } from 'react';

export const useAuthState = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false); // Pour éviter le flash

  useEffect(() => {
    // Vérification au montage uniquement (côté client)
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
    setIsReady(true);
  }, []);

  return { isAuthenticated, isReady };
};