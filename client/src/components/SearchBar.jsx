import { useState } from 'react';
import { withCreds } from '../api';

export default function SearchBar({ onResults }) {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async (event) => {
    event?.preventDefault?.();
    const term = q.trim();
    if (!term) {
      setError('Type something to search.');
      return;
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
      onResults(data);
    } catch (err) {
      console.error(err);
      setError('Unable to fetch images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="searchBar panel" onSubmit={run}>
      <div className="searchField">
        <span className="searchIcon" aria-hidden="true">
          //
        </span>
        <input
          className="input"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search Unsplash by keyword, color, or mood..."
          aria-label="Search Unsplash"
          disabled={loading}
        />
      </div>
      <button className="btn primary" type="submit" disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
      {error && <p className="formFeedback">{error}</p>}
    </form>
  );
}
