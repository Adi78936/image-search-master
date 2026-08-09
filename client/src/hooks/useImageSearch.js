import { useCallback, useState } from 'react';
import { withCreds } from '../api';

/**
 * Owns the search request so every entry point - the form, a history entry, a
 * top-search chip, a suggestion - runs through one code path with one set of
 * loading and error states.
 */
export default function useImageSearch(onSuccess) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = useCallback(
    async (rawTerm) => {
      const term = String(rawTerm || '').trim();
      if (!term) {
        setError('Enter a keyword to search - try "minimal interior dusk".');
        return false;
      }

      setLoading(true);
      setError('');

      try {
        const res = await withCreds('/api/search', {
          method: 'POST',
          body: JSON.stringify({ term }),
        });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data = await res.json();
        setResult(data);
        onSuccess?.(data.term ?? term, data.total ?? 0);
        return true;
      } catch (err) {
        console.error(err);
        setError('We could not reach Unsplash. Check your connection and try again.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess],
  );

  const clearError = useCallback(() => setError(''), []);

  return { result, loading, error, search, clearError };
}
