import { useEffect } from 'react';
import { usePizzeriaStore } from '../stores/pizzeriaStore';
import { getPizzerias, getPizzaStyles } from '../services/supabase';

/**
 * Hook to load pizzeria data on mount
 * Handles loading state, error state, and data fetching
 */
export function useLoadPizzerias() {
  const {
    isLoading,
    error,
    setPizzerias,
    setPizzaStyles,
    setLoading,
    setError,
  } = usePizzeriaStore();

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        const [pizzeriaData, styleData] = await Promise.all([
          getPizzerias(),
          getPizzaStyles(),
        ]);

        if (!cancelled) {
          setPizzerias(pizzeriaData);
          setPizzaStyles(styleData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load data');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [setPizzerias, setPizzaStyles, setLoading, setError]);

  return { isLoading, error };
}
