import { ClockIcon, TrashIcon } from './Icon';

const formatWhen = (timestamp) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'Unknown time';

  const diffMinutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffMinutes < 1440) return `${Math.round(diffMinutes / 60)}h ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export default function HistorySidebar({ items = [], onSelect, onClear }) {
  return (
    <aside className="sidebar panel" aria-labelledby="historyHeading">
      <div className="sidebarHeader">
        <h2 className="sidebarTitle" id="historyHeading">
          <ClockIcon size={18} />
          Search history
        </h2>
        {items.length > 0 && (
          <button
            type="button"
            className="btn btn--subtle btn--icon"
            onClick={onClear}
            aria-label="Clear search history"
            title="Clear search history"
          >
            <TrashIcon size={18} />
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="small">
          Your searches appear here so you can jump back to any of them in one tap.
        </p>
      ) : (
        <ul className="historyList">
          {items.map((item) => (
            <li key={`${item.term}-${item.timestamp}`}>
              <button
                type="button"
                className="historyBtn"
                onClick={() => onSelect(item.term)}
              >
                <span className="historyTerm">{item.term}</span>
                <span className="historyMeta">
                  {formatWhen(item.timestamp)}
                  {item.total ? ` - ${item.total.toLocaleString()} results` : ''}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
