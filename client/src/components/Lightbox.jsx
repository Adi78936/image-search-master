import { useCallback, useEffect, useRef } from 'react';
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  CopyIcon,
  ExternalLinkIcon,
} from './Icon';

const FOCUSABLE = 'button, a[href]';

export default function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
  onToggleSelect,
  isSelected,
  onCopyLink,
}) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const restoreFocusRef = useRef(null);
  const image = images[index];

  const goPrev = useCallback(
    () => onNavigate((index - 1 + images.length) % images.length),
    [index, images.length, onNavigate],
  );
  const goNext = useCallback(
    () => onNavigate((index + 1) % images.length),
    [index, images.length, onNavigate],
  );

  /* Remember where focus came from, move it into the dialog, and restore on close. */
  useEffect(() => {
    restoreFocusRef.current = document.activeElement;
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = overflow;
      const target = restoreFocusRef.current;
      if (target instanceof HTMLElement) target.focus();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev();
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
        return;
      }
      if (event.key !== 'Tab') return;

      /* Focus trap: Tab cycles within the dialog. */
      const nodes = dialogRef.current?.querySelectorAll(FOCUSABLE);
      if (!nodes?.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev, onClose]);

  if (!image) return null;

  const label = image.alt || `Photo by ${image.author || 'an unknown photographer'}`;
  const selected = isSelected(image.id);
  const multiple = images.length > 1;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="lightboxDialog" ref={dialogRef}>
        <div className="lightboxStage">
          {multiple && (
            <button
              type="button"
              className="lightboxNav lightboxNav--prev"
              onClick={goPrev}
              aria-label="Previous photo"
            >
              <ChevronLeftIcon size={22} />
            </button>
          )}

          <img
            className="lightboxImage"
            src={image.full || image.thumb}
            alt={label}
            decoding="async"
          />

          {multiple && (
            <button
              type="button"
              className="lightboxNav lightboxNav--next"
              onClick={goNext}
              aria-label="Next photo"
            >
              <ChevronRightIcon size={22} />
            </button>
          )}
        </div>

        <div className="lightboxBar">
          <div className="lightboxMeta">
            <span className="lightboxTitle">{image.author || 'Unknown photographer'}</span>
            <span className="small tabular">
              {index + 1} of {images.length}
              {multiple ? ' - use arrow keys to browse' : ''}
            </span>
          </div>

          <div className="lightboxActions">
            <button
              type="button"
              className={`btn ${selected ? 'btn--primary' : 'btn--subtle'}`}
              onClick={() => onToggleSelect(image.id)}
              aria-pressed={selected}
            >
              <CheckIcon size={18} />
              {selected ? 'Selected' : 'Select'}
            </button>
            <button
              type="button"
              className="btn btn--subtle"
              onClick={() => onCopyLink(image)}
            >
              <CopyIcon size={18} />
              Copy link
            </button>
            <a
              className="btn btn--subtle"
              href={image.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLinkIcon size={18} />
              Unsplash
            </a>
            <button
              type="button"
              className="btn btn--subtle btn--icon"
              onClick={onClose}
              ref={closeRef}
              aria-label="Close preview"
            >
              <CloseIcon size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
