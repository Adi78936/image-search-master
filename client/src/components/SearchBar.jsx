import { useEffect, useId, useRef, useState } from 'react';
import { AlertCircleIcon, ClockIcon, CloseIcon, SearchIcon } from './Icon';

export default function SearchBar({
  term,
  onTermChange,
  onSearch,
  loading = false,
  error = '',
  onClearError,
  suggestions = [],
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const inputId = useId();
  const errorId = useId();
  const listId = useId();

  /* "/" focuses search from anywhere, the way search-first tools behave. */
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const query = term.trim().toLowerCase();
  const options = (
    query ? suggestions.filter((item) => item.toLowerCase().includes(query)) : suggestions
  ).slice(0, 5);
  const isOpen = open && options.length > 0;
  const activeId = isOpen && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined;

  const close = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const choose = (value) => {
    close();
    onTermChange(value);
    onSearch(value);
  };

  const submit = (event) => {
    event.preventDefault();
    if (isOpen && activeIndex >= 0) {
      choose(options[activeIndex]);
      return;
    }
    close();
    if (!term.trim()) inputRef.current?.focus();
    onSearch(term);
  };

  /* Standard combobox keyboard model: arrows move, Enter picks, Escape closes. */
  const onInputKeyDown = (event) => {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      close();
      return;
    }
    if (!isOpen || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) return;
    event.preventDefault();
    setActiveIndex((prev) => {
      const next = event.key === 'ArrowDown' ? prev + 1 : prev - 1;
      if (next < 0) return options.length - 1;
      if (next >= options.length) return 0;
      return next;
    });
  };

  return (
    <form className="panel searchPanel" onSubmit={submit} role="search">
      <div className="searchLabelRow">
        <label className="searchLabel" htmlFor={inputId}>
          Search Unsplash
        </label>
        <span className="searchHint">
          Press <kbd className="kbd">/</kbd> to focus
        </span>
      </div>

      <div className="searchRow">
        <div className="searchFieldWrap">
          <div className="searchField">
            <SearchIcon className="searchIcon icon" size={18} />
            <input
              id={inputId}
              ref={inputRef}
              className="input"
              type="search"
              value={term}
              onChange={(event) => {
                onTermChange(event.target.value);
                setOpen(true);
                setActiveIndex(-1);
                if (error) onClearError?.();
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => window.setTimeout(close, 120)}
              onKeyDown={onInputKeyDown}
              placeholder="Keyword, colour, or mood"
              autoComplete="off"
              enterKeyHint="search"
              disabled={loading}
              role="combobox"
              aria-expanded={isOpen}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={activeId}
              aria-describedby={error ? errorId : undefined}
              aria-invalid={error ? 'true' : undefined}
            />
            {term && !loading && (
              <button
                type="button"
                className="clearBtn"
                onClick={() => {
                  onTermChange('');
                  onClearError?.();
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
              >
                <CloseIcon size={16} />
              </button>
            )}
          </div>

          <ul
            className="suggestions"
            id={listId}
            role="listbox"
            aria-label="Recent searches"
            hidden={!isOpen}
          >
            {options.map((item, index) => (
              <li
                key={item}
                id={`${listId}-${index}`}
                className="suggestionOption"
                role="option"
                aria-selected={index === activeIndex}
                /* mousedown fires before the input's blur closes the list */
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(item)}
              >
                <ClockIcon size={16} />
                <span className="suggestionTerm">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <button className="btn btn--primary searchSubmit" type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="btnSpinner" aria-hidden="true" />
              Searching
            </>
          ) : (
            <>
              <SearchIcon size={18} />
              Search
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="formError" id={errorId} role="alert">
          <AlertCircleIcon size={16} />
          {error}
        </p>
      )}
    </form>
  );
}
