import { useState } from 'react';
import { CheckIcon, CopyIcon, ExpandIcon } from './Icon';

function Card({ image, checked, onToggle, onPreview, onCopyLink }) {
  const [loaded, setLoaded] = useState(false);
  const label = image.alt || `Photo by ${image.author || 'an unknown photographer'}`;

  return (
    <figure className="card" data-selected={checked}>
      <div className="cardMedia">
        <img
          className="cardImg"
          src={image.thumb}
          alt={label}
          data-loaded={loaded}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* One real button covering the card - not a div with role="button". */}
      <button
        type="button"
        className="cardToggle"
        aria-pressed={checked}
        aria-label={`${checked ? 'Deselect' : 'Select'} ${label}`}
        onClick={() => onToggle(image.id)}
      />

      {checked && (
        <span className="cardBadge">
          <CheckIcon size={14} />
          Selected
        </span>
      )}

      <figcaption className="cardFooter">
        <span className="metaPrimary" title={image.author || 'Unknown'}>
          {image.author || 'Unknown'}
        </span>
        <span className="cardActions">
          <button
            type="button"
            className="cardAction"
            onClick={() => onPreview(image.id)}
            aria-label={`Preview ${label}`}
          >
            <ExpandIcon size={16} />
          </button>
          <button
            type="button"
            className="cardAction"
            onClick={() => onCopyLink(image)}
            aria-label={`Copy link to ${label}`}
          >
            <CopyIcon size={16} />
          </button>
        </span>
      </figcaption>
    </figure>
  );
}

export function ImageGridSkeleton({ count = 12 }) {
  return (
    <div className="grid" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div className="skeleton skeletonCard" key={i} />
      ))}
    </div>
  );
}

export default function ImageGrid({ images, selected, toggle, onPreview, onCopyLink }) {
  if (!images?.length) return null;

  return (
    <div className="grid">
      {images.map((image) => (
        <Card
          key={image.id}
          image={image}
          checked={Boolean(selected[image.id])}
          onToggle={toggle}
          onPreview={onPreview}
          onCopyLink={onCopyLink}
        />
      ))}
    </div>
  );
}
