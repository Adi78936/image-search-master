import { CheckIcon, ImageIcon } from './Icon';

/** Live count pill in the results header. Announced politely as it changes. */
export default function SelectedCounter({ count }) {
  const active = count > 0;

  return (
    <span className="selectionPill" data-active={active} aria-live="polite">
      {active ? <CheckIcon size={16} /> : <ImageIcon size={16} />}
      <span className="tabular">{count}</span>
      <span>selected</span>
    </span>
  );
}
