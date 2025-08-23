import { useMemo, useCallback } from 'react';

export function useAffectations(data, filters) {
  const filteredAffectations = useMemo(() => {
    let result = data.affectations;

    if (filters.search) {
      result = result.filter(a => 
        (a.familleNom || '').toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.classe) {
      result = result.filter(a => a.classeId === filters.classe);
    }

    // Ajoutez d'autres filtres ici

    return result;
  }, [data.affectations, filters]);

  const moveAffectation = useCallback((dragIndex, dropIndex) => {
    // Logique pour déplacer une affectation
    // À implémenter plus tard avec react-dnd
  }, []);

  return { filteredAffectations, moveAffectation };
} 