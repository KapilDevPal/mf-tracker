import { useState, useMemo } from 'react';
import { BookmarkCheck, Search, ArrowUpDown, Trash2 } from 'lucide-react';
import { useWatchlistStore } from '@/store/watchlistStore';
import { FundCard } from '@/components/fund/FundCard';
import { SEOHead } from '@/components/seo/SEOHead';

type SortOption = 'name-asc' | 'name-desc' | 'nav-asc' | 'nav-desc' | 'added-recent' | 'added-old';

export default function Watchlist() {
  const { funds, clearWatchlist } = useWatchlistStore();
  const [searchVal, setSearchVal] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('added-recent');

  const filteredAndSorted = useMemo(() => {
    // 1. Search filter
    let res = [...funds];
    if (searchVal.trim()) {
      const q = searchVal.toLowerCase();
      res = res.filter(
        (f) =>
          f.schemeName.toLowerCase().includes(q) ||
          f.fundHouse.toLowerCase().includes(q) ||
          f.schemeCode.toString().includes(q)
      );
    }

    // 2. Sort execution
    res.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.schemeName.localeCompare(b.schemeName);
        case 'name-desc':
          return b.schemeName.localeCompare(a.schemeName);
        case 'nav-asc':
          return (a.latestNav || 0) - (b.latestNav || 0);
        case 'nav-desc':
          return (b.latestNav || 0) - (a.latestNav || 0);
        case 'added-recent':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case 'added-old':
          return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
        default:
          return 0;
      }
    });

    return res;
  }, [funds, searchVal, sortBy]);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem 4rem' }} className="page-enter">
      <SEOHead title="My Watchlist" description="Monitor and track live performance for your curated watchlist of Indian Mutual Funds" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
          My Watchlist
        </h1>
        {funds.length > 0 && (
          <button
            onClick={clearWatchlist}
            className="btn-secondary"
            style={{ color: 'var(--loss)', borderColor: 'var(--loss-bg)', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
          >
            Clear Watchlist
          </button>
        )}
      </div>

      {/* Empty State */}
      {funds.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 1rem' }} className="glass-card">
          <BookmarkCheck size={48} color="var(--text-tertiary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>Your Watchlist is Empty</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Search for mutual funds and click the star icon to add them here.
          </p>
        </div>
      )}

      {funds.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Controls: Search & Sort */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {/* Local Search Input */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search watchlist..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="input-base"
                style={{ paddingLeft: '2.5rem', paddingRight: '1rem', fontSize: '0.85rem' }}
              />
              <Search
                size={16}
                color="var(--text-tertiary)"
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowUpDown size={16} color="var(--text-secondary)" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  color: 'var(--text-primary)',
                  padding: '0.625rem',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              >
                <option value="added-recent">Date Added: Newest</option>
                <option value="added-old">Date Added: Oldest</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="nav-asc">NAV: Low to High</option>
                <option value="nav-desc">NAV: High to Low</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          {searchVal && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Showing {filteredAndSorted.length} of {funds.length} watchlisted funds
            </div>
          )}

          {/* Grid List */}
          {filteredAndSorted.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {filteredAndSorted.map((f) => (
                <FundCard
                  key={f.schemeCode}
                  schemeCode={f.schemeCode}
                  schemeName={f.schemeName}
                  latestNav={f.latestNav}
                  navDate={f.navDate}
                  category={f.category}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }} className="glass-card">
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                No watchlisted funds matched your search term.
              </span>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
