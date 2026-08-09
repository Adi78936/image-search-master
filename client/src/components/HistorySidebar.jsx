import { useEffect, useState } from 'react';
import { withCreds } from '../api';

export default function HistorySidebar({ refreshKey = 0 }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const res = await withCreds('/api/history');
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data = await res.json();
        if (!cancelled) {
          setItems(Array.isArray(data) ? data : []);
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          setItems([]);
          setError('Could not load search history.');
          console.error(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return (
    <aside className="sidebar panel">
      <h3 className="sidebarTitle">Search History</h3>
      {loading && <div className="small">Loading history...</div>}
      {!loading && !items.length && !error && (
        <div className="small">No searches yet.</div>
      )}
      {error && <div className="small">{error}</div>}
      <ul className="historyList">
        {items.map((item) => {
          const date = new Date(item.timestamp);
          const formatted = Number.isNaN(date.getTime())
            ? 'Unknown time'
            : date.toLocaleString();
          return (
            <li className="historyItem" key={`${item.term}-${item.timestamp}`}>
              <div className="historyTerm">{item.term}</div>
              <div className="small">{formatted}</div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
