export default function SelectedCounter({ count }) {
  return (
    <div className="counter">
      <span className="counterDot" aria-hidden="true">
        *
      </span>
      {count} image{count === 1 ? '' : 's'} selected
    </div>
  );
}
