import { CheckIcon, CloseIcon, CopyIcon } from './Icon';

/**
 * Sticky bulk-action bar. Only appears once something is selected, so the
 * default view stays uncluttered (progressive disclosure).
 */
export default function SelectionBar({
  count,
  total,
  allSelected,
  onSelectAll,
  onClear,
  onCopyAll,
}) {
  if (!count) return null;

  return (
    <div className="selectionBar" role="region" aria-label="Selection actions">
      <span className="selectionBarCount">
        <CheckIcon size={18} />
        <span className="tabular">{count}</span> of{' '}
        <span className="tabular">{total}</span> selected
      </span>

      <div className="selectionActions">
        <button type="button" className="btn btn--subtle" onClick={onSelectAll}>
          <CheckIcon size={18} />
          {allSelected ? 'Deselect all' : 'Select all'}
        </button>
        <button type="button" className="btn btn--subtle" onClick={onCopyAll}>
          <CopyIcon size={18} />
          Copy links
        </button>
        <button type="button" className="btn btn--danger" onClick={onClear}>
          <CloseIcon size={18} />
          Clear
        </button>
      </div>
    </div>
  );
}
