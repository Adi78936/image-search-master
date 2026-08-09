import { useCallback, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import SelectedCounter from './components/SelectedCounter';
import SelectionBar from './components/SelectionBar';
import ImageGrid, { ImageGridSkeleton } from './components/ImageGrid';
import HistorySidebar from './components/HistorySidebar';
import TopSearchesBanner from './components/TopSearchesBanner';
import Lightbox from './components/Lightbox';
import Login from './components/Login';
import { ImageIcon, SearchIcon } from './components/Icon';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import useSearchHistory from './hooks/useSearchHistory';
import useImageSearch from './hooks/useImageSearch';

const copyToClipboard = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  /* Fallback for non-secure contexts where the Clipboard API is unavailable. */
  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.appendChild(field);
  field.select();
  document.execCommand('copy');
  document.body.removeChild(field);
};

export default function App() {
  const { loading: authLoading, user } = useAuth();
  const { notify } = useToast();
  const { recent, top, record, clear } = useSearchHistory();

  const [term, setTerm] = useState('');
  const [selected, setSelected] = useState({});
  const [previewIndex, setPreviewIndex] = useState(-1);

  const { result, loading: searching, error, search, clearError } = useImageSearch(record);

  const images = result?.results ?? [];
  const hasResults = images.length > 0;

  const selectedCount = useMemo(
    () => Object.values(selected).filter(Boolean).length,
    [selected],
  );

  const toggle = useCallback(
    (id) => setSelected((prev) => ({ ...prev, [id]: !prev[id] })),
    [],
  );

  /* Single entry point for the form, history entries, chips and suggestions. */
  const runSearch = useCallback(
    async (nextTerm) => {
      setTerm(nextTerm);
      setPreviewIndex(-1); /* the old index would not survive a new result set */
      const ok = await search(nextTerm);
      if (ok) setSelected({});
    },
    [search],
  );

  /* History and chips live outside the results region, so bring focus with us. */
  const rerun = useCallback(
    (nextTerm) => {
      runSearch(nextTerm);
      const region = document.getElementById('results');
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      region?.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' });
      region?.focus({ preventScroll: true });
    },
    [runSearch],
  );

  const copyLink = useCallback(
    async (image) => {
      try {
        await copyToClipboard(image.link);
        notify('Link copied to clipboard');
      } catch {
        notify('Could not copy the link', 'error');
      }
    },
    [notify],
  );

  const copySelected = useCallback(async () => {
    const links = images.filter((image) => selected[image.id]).map((image) => image.link);
    if (!links.length) return;
    try {
      await copyToClipboard(links.join('\n'));
      notify(`Copied ${links.length} link${links.length === 1 ? '' : 's'}`);
    } catch {
      notify('Could not copy the links', 'error');
    }
  }, [images, notify, selected]);

  const allSelected = hasResults && selectedCount === images.length;
  const toggleAll = useCallback(() => {
    setSelected(
      allSelected ? {} : Object.fromEntries(images.map((image) => [image.id, true])),
    );
  }, [allSelected, images]);

  if (authLoading) {
    return (
      <div className="container">
        <div className="panel">
          <span className="srOnly">Checking your session</span>
          <div className="skeleton skeletonLine" style={{ width: '40%' }} />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <Navbar />
        <Login />
      </div>
    );
  }

  return (
    <>
      <a className="skipLink" href="#results">
        Skip to results
      </a>

      <div className="container">
        <Navbar />
        <TopSearchesBanner items={top} onSelect={rerun} />

        <div className="mainLayout">
          <div className="contentColumn">
            <SearchBar
              term={term}
              onTermChange={setTerm}
              onSearch={runSearch}
              loading={searching}
              error={error}
              onClearError={clearError}
              suggestions={recent.map((item) => item.term)}
            />

            <section
              className="panel resultsPanel"
              id="results"
              tabIndex={-1}
              aria-labelledby="resultsHeading"
              aria-busy={searching}
            >
              <div className="resultsHeader">
                <div>
                  <h2 className="resultsTitle" id="resultsHeading">
                    {result ? `Results for "${result.term}"` : 'Results'}
                  </h2>
                  <p className="resultsMeta" aria-live="polite">
                    {searching
                      ? 'Searching Unsplash...'
                      : result
                        ? `${Number(result.total || 0).toLocaleString()} photos found - showing ${images.length}`
                        : 'Nothing searched yet'}
                  </p>
                </div>
                {hasResults && !searching && <SelectedCounter count={selectedCount} />}
              </div>

              {searching ? (
                <ImageGridSkeleton />
              ) : hasResults ? (
                <ImageGrid
                  images={images}
                  selected={selected}
                  toggle={toggle}
                  onPreview={(id) =>
                    setPreviewIndex(images.findIndex((image) => image.id === id))
                  }
                  onCopyLink={copyLink}
                />
              ) : (
                <div className="emptyState">
                  <span className="emptyIcon">
                    {result ? <ImageIcon size={26} /> : <SearchIcon size={26} />}
                  </span>
                  <h3 className="emptyTitle">
                    {result ? 'No photos matched that search' : 'Start with a keyword'}
                  </h3>
                  <p className="emptyText">
                    {result
                      ? 'Try a broader term, or drop one of the words - "coastal fog" often beats "coastal fog sunrise".'
                      : 'Search a theme, colour, or mood. Combining concepts works well - try "minimal interior dusk".'}
                  </p>
                </div>
              )}
            </section>

            <SelectionBar
              count={selectedCount}
              total={images.length}
              allSelected={allSelected}
              onSelectAll={toggleAll}
              onClear={() => setSelected({})}
              onCopyAll={copySelected}
            />
          </div>

          <HistorySidebar items={recent} onSelect={rerun} onClear={clear} />
        </div>
      </div>

      {previewIndex >= 0 && (
        <Lightbox
          images={images}
          index={previewIndex}
          onClose={() => setPreviewIndex(-1)}
          onNavigate={setPreviewIndex}
          onToggleSelect={toggle}
          isSelected={(id) => Boolean(selected[id])}
          onCopyLink={copyLink}
        />
      )}
    </>
  );
}
