export default function ImageGrid({ images, selected, toggle }) {
  if (!images?.length) {
    return null;
  }

  const handleKey =
    (id) =>
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle(id);
      }
    };

  return (
    <div className="grid">
      {images.map((img) => {
        const checked = Boolean(selected[img.id]);

        return (
          <div
            key={img.id}
            className={`card ${checked ? 'is-selected' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => toggle(img.id)}
            onKeyDown={handleKey(img.id)}
          >
            <img
              src={img.thumb}
              alt={img.alt}
              loading="lazy"
              decoding="async"
            />
            <div className="cardShade" aria-hidden="true" />
            {checked && (
              <span className="cardBadge" aria-label="Selected image">
                Selected
              </span>
            )}
            <div className="cardFooter">
              <span className="metaPrimary" title={img.alt}>
                {img.author || 'Unknown'}
              </span>
              <a
                className="metaLink"
                href={img.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
              >
                View -&gt;
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
