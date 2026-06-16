import { useEffect, useState } from 'react';
import type { AutocompleteSuggestion } from '../components/checkout/CheckoutAutocompleteField';
import { searchWarehouses } from '../services/novaPoshta';
import { useDebouncedValue } from './useDebouncedValue';

export function useNovaPoshtaWarehouses(
  cityRef: string,
  query: string,
  enabled: boolean,
) {
  const debouncedQuery = useDebouncedValue(query.trim(), 350);
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !cityRef) {
      setSuggestions([]);
      setError(null);
      return;
    }

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const warehouses = await searchWarehouses(cityRef, debouncedQuery);

        if (cancelled) {
          return;
        }

        setSuggestions(
          warehouses.map(warehouse => ({
            id: warehouse.Ref,
            title: warehouse.Description,
            subtitle: warehouse.ShortAddress,
          })),
        );
      } catch (loadError) {
        if (!cancelled) {
          setSuggestions([]);
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Не вдалося знайти відділення',
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [cityRef, debouncedQuery, enabled]);

  return { suggestions, isLoading, error };
}
