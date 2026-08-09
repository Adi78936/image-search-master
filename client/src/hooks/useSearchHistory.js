import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Search history + top searches, persisted locally.
 *
 * The server's /api/history and /api/top-searches endpoints return a hardcoded
 * empty array (the datastore was removed), which left both panels permanently
 * blank. Keeping the record on the client restores the feature without a
 * backend change; swap the reads/writes here for API calls if the store returns.
 */
const STORAGE_KEY = 'image-search:history';
const MAX_ENTRIES = 50;
const MAX_TOP = 6;

const read = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => item && item.term) : [];
  } catch {
    return [];
  }
};

export default function useSearchHistory() {
  const [entries, setEntries] = useState(() =>
    typeof window === 'undefined' ? [] : read(),
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      /* non-fatal: history just won't survive a reload */
    }
  }, [entries]);

  const record = useCallback((term, total = 0) => {
    const clean = String(term || '').trim();
    if (!clean) return;
    setEntries((prev) =>
      [{ term: clean, total, timestamp: new Date().toISOString() }, ...prev].slice(
        0,
        MAX_ENTRIES,
      ),
    );
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  /** Most recent search per term - the sidebar shows terms, not repeats. */
  const recent = useMemo(() => {
    const seen = new Set();
    return entries.filter((item) => {
      const key = item.term.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [entries]);

  /** Most-searched terms, ranked by frequency then recency. */
  const top = useMemo(() => {
    const counts = new Map();
    entries.forEach(({ term }) => {
      const key = term.toLowerCase();
      const existing = counts.get(key);
      if (existing) existing.count += 1;
      else counts.set(key, { term, count: 1 });
    });
    return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, MAX_TOP);
  }, [entries]);

  return { entries, recent, top, record, clear };
}
