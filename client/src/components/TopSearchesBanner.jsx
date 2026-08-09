import { TrendingUpIcon } from './Icon';

export default function TopSearchesBanner({ items = [], onSelect }) {
  if (!items.length) return null;

  return (
    <section className="panel banner" aria-labelledby="topSearchesHeading">
      <h2 className="bannerLabel" id="topSearchesHeading">
        <TrendingUpIcon size={18} />
        Top searches
      </h2>
      <ul className="chipRow">
        {items.map(({ term, count }) => (
          <li key={term}>
            <button type="button" className="chip" onClick={() => onSelect(term)}>
              {term}
              <span className="chipCount">
                {count}
                <span className="srOnly"> searches</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
