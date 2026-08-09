import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import SelectedCounter from './components/SelectedCounter';
import ImageGrid from './components/ImageGrid';
import HistorySidebar from './components/HistorySidebar';
import TopSearchesBanner from './components/TopSearchesBanner';
import Login from './components/Login';
import { useAuth } from './context/AuthContext';
import { useMemo, useState } from 'react';

export default function App() {
  const { loading, user } = useAuth();
  const [result, setResult] = useState(null);
  const [selected, setSelected] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const hasResults = Boolean(result?.results?.length);

  const toggle = (id) =>
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  const selectedCount = useMemo(
    () => Object.values(selected).filter(Boolean).length,
    [selected],
  );

  return (
    <div className="container">
      <Navbar />

      {loading ? (
        <div className="panel noticeCard">Loading...</div>
      ) : !user ? (
        <Login />
      ) : (
        <>
          <TopSearchesBanner refreshKey={refreshKey} />
          <div className="mainLayout">
            <div className="contentColumn">
              <SearchBar
                onResults={(data) => {
                  setResult(data);
                  setSelected({});
                  setRefreshKey((prev) => prev + 1);
                }}
              />
              {result && (
                <div className="panel noticeCard">
                  You searched for <b>{result.term}</b> - {result.total} results.
                </div>
              )}
              <div className="panel surface">
                <SelectedCounter count={selectedCount} />
                {hasResults ? (
                  <ImageGrid
                    images={result?.results}
                    selected={selected}
                    toggle={toggle}
                  />
                ) : (
                  <div className="emptyState">
                    <p>Start by searching for a theme or keyword.</p>
                    <p className="small">
                      Tip: try combining concepts like "minimal interior dusk".
                    </p>
                  </div>
                )}
              </div>
            </div>
            <HistorySidebar refreshKey={refreshKey} />
          </div>
        </>
      )}
    </div>
  );
}
