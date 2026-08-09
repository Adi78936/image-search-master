import { useEffect, useState } from 'react';
import { withCreds } from '../api';

export default function TopSearchesBanner({ refreshKey = 0 }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await withCreds('/api/top-searches');
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data = await res.json();
        if (!cancelled) {
          setItems(Array.isArray(data) ? data : []);
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          setItems([]);
          setError('Could not load top searches.');
          console.error(err);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (error) {
    return <div className="panel banner error">{error}</div>;
  }

  if (!items.length) return null;

  return (
    <div className="panel banner">
      <span className="chip chipLabel">Top searches</span>
      {items.map(({ term, count }) => (
        <span className="chip" key={`${term}-${count}`}>
          {term} <span className="chipCount">({count})</span>
        </span>
      ))}
    </div>
  );
}
