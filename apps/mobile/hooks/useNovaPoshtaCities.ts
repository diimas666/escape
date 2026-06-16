import { useEffect, useState } from 'react';
import type { AutocompleteSuggestion } from '../components/checkout/CheckoutAutocompleteField';
import { searchCities } from '../services/novaPoshta';
import { useDebouncedValue } from './useDebouncedValue';

export function useNovaPoshtaCities(query: string, enabled: boolean) {
  const debouncedQuery = useDebouncedValue(query.trim(), 350);
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || debouncedQuery.length < 2) {
      setSuggestions([]);
      setError(null);
      return;
    }

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const cities = await searchCities(debouncedQuery);

        if (cancelled) {
          return;
        }

        setSuggestions(
          cities.map(city => ({
            id: city.DeliveryCity || city.Ref,
            title: city.Present || city.MainDescription,
            subtitle: city.Area ? `${city.MainDescription} (${city.Area})` : city.MainDescription,
          })),
        );
      } catch (loadError) {
        if (!cancelled) {
          setSuggestions([]);
          setError(
            loadError instanceof Error ? loadError.message : 'Не вдалося знайти місто',
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
  }, [debouncedQuery, enabled]);

  return { suggestions, isLoading, error };
}
