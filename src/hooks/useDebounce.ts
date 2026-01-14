import { useState, useEffect } from 'react';

// Hook générique pour le debounce
function useDebounce<T>(value: T, delay?: number): T {
  // État pour stocker la valeur débouncée
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Définir le timer pour mettre à jour la valeur après le délai
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay || 500); // 500ms par défaut

    // Nettoyage du timer si la valeur change avant la fin du délai
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;