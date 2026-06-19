import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter, X, Landmark, Trash2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchFunds } from '@/hooks/useMFApi';
import { useSearchHistoryStore } from '@/store/compareStore';
import { FundCard } from '@/components/fund/FundCard';
import { FundCardSkeleton } from '@/components/ui/Skeleton';
import { SEOHead } from '@/components/seo/SEOHead';
import { POPULAR_AMCS } from '@/constants';

const ITEMS_PER_PAGE = 12;

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [inputVal, setInputVal] = useState(queryParam);
  const debouncedQuery = useDebounce(inputVal, 400);

  const [selectedAmc, setSelectedAmc] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const { queries: history, addQuery, removeQuery, clearAll: clearHistory } = useSearchHistoryStore();

  // Trigger search on debounced query
  const { data: results, isLoading, isError } = useSearchFunds(debouncedQuery);

  useEffect(() => {
    setInputVal(queryParam);
  }, [queryParam]);

  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      addQuery(debouncedQuery.trim());
      setSearchParams({ q: debouncedQuery });
      setCurrentPage(1); // Reset page on query change
    } else if (debouncedQuery.trim() === '') {
      setSearchParams({});
    }
  }, [debouncedQuery, addQuery, setSearchParams]);

  // Derived filter AMCs
  const filteredResults = useMemo(() => {
    if (!results) return [];
    if (!selectedAmc) return results;
    return results.filter((item) =>
      item.schemeName.toLowerCase().includes(selectedAmc.toLowerCase())
    );
  }, [results, selectedAmc]);

  // Paginated Results
  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredResults.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredResults, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleChipClick = (query: string) => {
    setInputVal(query);
    setSearchParams({ q: query });
  };

  const handleClearSearch = () => {
    setInputVal('');
    setSelectedAmc('');
    setSearchParams({});
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem 4rem' }} className="page-enter">
      <SEOHead
        title={debouncedQuery ? `Search: ${debouncedQuery}` : 'Search Mutual Funds'}
        description="Search real-time performance and latest NAV details for all Indian Mutual Funds"
      />

      <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 1.5rem 0' }}>
        Search Mutual Funds
      </h1>

      {/* Main Grid: Filters Left, Results Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'flex-start' }}>

        {/* Sidebar Filters */}
        <div className="glass-card" style={{ padding: '1.25rem', position: 'sticky', top: 84 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} /> Filters
          </h2>

          {/* AMC Filter */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Filter by Fund House (AMC)
            </label>
            <select
              value={selectedAmc}
              onChange={(e) => {
                setSelectedAmc(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                color: 'var(--text-primary)',
                padding: '0.5rem',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            >
              <option value="">All AMCs</option>
              {POPULAR_AMCS.map((amc) => (
                <option key={amc.abbr} value={amc.query}>
                  {amc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search History */}
          {history.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Recent Searches</span>
                <button onClick={clearHistory} className="btn-ghost" style={{ padding: 4, color: 'var(--loss)' }} title="Clear history">
                  <Trash2 size={12} />
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {history.slice(0, 8).map((q) => (
                  <div
                    key={q}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border)',
                      borderRadius: '0.375rem',
                      padding: '2px 8px',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleChipClick(q)}
                  >
                    <span>{q}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeQuery(q);
                      }}
                      style={{ background: 'none', border: 'none', padding: 0, display: 'flex', cursor: 'pointer', color: 'var(--text-tertiary)' }}
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Area */}
        <div style={{ gridColumn: 'span 2' }}>
          {/* Input Box */}
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="Search by AMC name, category, equity, debt..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="input-base"
              style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
            />
            <SearchIcon
              size={18}
              color="var(--text-tertiary)"
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            {inputVal && (
              <button
                onClick={handleClearSearch}
                className="btn-ghost"
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', padding: 4 }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Results Summary */}
          {debouncedQuery.trim().length >= 2 && !isLoading && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Found {filteredResults.length} results for "{debouncedQuery}"
              {selectedAmc && ` in AMC "${selectedAmc}"`}
            </div>
          )}

          {/* Loader Grid */}
          {isLoading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <FundCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty / Splash State */}
          {!isLoading && debouncedQuery.trim().length < 2 && (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }} className="glass-card">
              <SearchIcon size={48} color="var(--text-tertiary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>Type to Search</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Enter at least 2 characters to search over 10,000+ mutual fund schemes in India.
              </p>
            </div>
          )}

          {/* Error State */}
          {!isLoading && isError && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }} className="glass-card">
              <span style={{ color: 'var(--loss)', fontWeight: 600, fontSize: '0.9rem' }}>
                Failed to fetch search results. Please check your network or try again.
              </span>
            </div>
          )}

          {/* Empty Search Results */}
          {!isLoading && !isError && debouncedQuery.trim().length >= 2 && filteredResults.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }} className="glass-card">
              <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>No Funds Found</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Try searching for something else or clearing filters.
              </p>
            </div>
          )}

          {/* Results Grid */}
          {!isLoading && !isError && paginatedResults.length > 0 && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {paginatedResults.map((item) => (
                  <FundCard
                    key={item.schemeCode}
                    schemeCode={item.schemeCode}
                    schemeName={item.schemeName}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn-secondary"
                    style={{ padding: '0.5rem', borderRadius: '0.5rem', opacity: currentPage === 1 ? 0.5 : 1 }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn-secondary"
                    style={{ padding: '0.5rem', borderRadius: '0.5rem', opacity: currentPage === totalPages ? 0.5 : 1 }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
}
