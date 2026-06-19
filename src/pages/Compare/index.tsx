import { useState, useMemo, useEffect } from 'react';
import { GitCompare, Search, Plus, Trash2, HelpCircle, Info } from 'lucide-react';
import { useCompareStore } from '@/store/compareStore';
import { useQueries } from '@tanstack/react-query';
import { getLatestNAV, getNAVHistory } from '@/services/mfapi';
import { searchFunds } from '@/services/mfapi';
import { useDebounce } from '@/hooks/useDebounce';
import { formatNAV, formatReturn, extractAMC } from '@/utils';
import { CompareChart } from '@/components/charts/NAVChart';
import { ChartSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { COMPARE_COLORS, DATE_RANGE_PRESETS } from '@/constants';
import { getStartDateFromPreset } from '@/services/mfapi';
import { SEOHead } from '@/components/seo/SEOHead';

export default function Compare() {
  const { funds, addFund, removeFund, clearAll } = useCompareStore();
  const [searchVal, setSearchVal] = useState('');
  const debouncedSearch = useDebounce(searchVal, 400);

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [preset, setPreset] = useState<string>('1Y');

  // Load search options locally
  useEffect(() => {
    if (debouncedSearch.trim().length >= 2) {
      setSearching(true);
      searchFunds(debouncedSearch.trim())
        .then((res) => setSearchResults(res.slice(0, 5)))
        .catch(() => setSearchResults([]))
        .finally(() => setSearching(false));
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch]);

  // Fetch full details and history for selected funds
  const fundQueries = useQueries({
    queries: funds.map((f) => ({
      queryKey: ['nav-history', f.schemeCode],
      queryFn: () => getNAVHistory(f.schemeCode),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const loading = fundQueries.some((q) => q.isLoading);

  const startDateLimit = useMemo(() => {
    return getStartDateFromPreset(preset);
  }, [preset]);

  // Normalize data to base 100 starting from the range start date
  const comparisonChartData = useMemo(() => {
    // 1. Check if we have valid datasets loaded
    const datasets = fundQueries
      .map((q, idx) => {
        if (!q.data?.data) return null;
        return {
          name: funds[idx].schemeName,
          // parse and sort ascending
          data: [...q.data.data]
            .map((entry) => {
              const [d, m, y] = entry.date.split('-').map(Number);
              return {
                dateStr: `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`,
                nav: parseFloat(entry.nav),
                displayDate: entry.date,
              };
            })
            .sort((a, b) => new Date(a.dateStr).getTime() - new Date(b.dateStr).getTime()),
        };
      })
      .filter(Boolean) as Array<{
      name: string;
      data: Array<{ dateStr: string; nav: number; displayDate: string }>;
    }>;

    if (datasets.length === 0) return [];

    // Filter datasets to starting date
    const limitTime = new Date(startDateLimit).getTime();
    const filteredDatasets = datasets.map((d) => ({
      name: d.name,
      data: d.data.filter((pt) => new Date(pt.dateStr).getTime() >= limitTime),
    }));

    // Find all unique dates across all series in ascending order
    const allDates = Array.from(
      new Set(filteredDatasets.flatMap((d) => d.data.map((pt) => pt.dateStr)))
    ).sort();

    // Map base NAV for each series to calculate relative returns (%)
    const baseNavMap = new Map<string, number>();
    filteredDatasets.forEach((ds) => {
      if (ds.data.length > 0) {
        baseNavMap.set(ds.name, ds.data[0].nav);
      }
    });

    // Create aligned data points for Recharts LineChart
    return allDates.map((dateStr) => {
      const ptObj: any = {
        date: dateStr,
        displayDate: dateStr.split('-').reverse().join('-'), // "DD-MM-YYYY"
      };

      filteredDatasets.forEach((ds) => {
        const found = ds.data.find((pt) => pt.dateStr === dateStr);
        if (found) {
          const base = baseNavMap.get(ds.name) || found.nav;
          // Return percentage gain relative to first point
          ptObj[ds.name] = ((found.nav - base) / base) * 100;
        }
      });

      return ptObj;
    });
  }, [fundQueries, funds, startDateLimit]);

  const handleSelectFund = (item: any) => {
    if (funds.length >= 4) {
      alert('You can compare up to 4 funds.');
      return;
    }
    addFund({
      schemeCode: item.schemeCode,
      schemeName: item.schemeName,
      fundHouse: extractAMC(item.schemeName),
    });
    setSearchVal('');
    setSearchResults([]);
  };

  const schemeKeys = useMemo(() => funds.map((f) => f.schemeName), [funds]);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem 4rem' }} className="page-enter">
      <SEOHead title="Compare Mutual Funds" description="Compare performance charts and NAV return rates side-by-side for up to 4 funds" />

      <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 1.5rem 0' }}>
        Compare Funds
      </h1>

      {/* Fund Selector */}
      <div style={{ position: 'relative', maxWidth: 600, marginBottom: '2.5rem' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder={funds.length >= 4 ? 'Maximum 4 funds reached' : 'Type to find funds to add...'}
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            disabled={funds.length >= 4}
            className="input-base"
            style={{ paddingLeft: '3rem' }}
          />
          <Search size={18} color="var(--text-tertiary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        {/* Suggestion Dropdown */}
        {searchResults.length > 0 && (
          <div
            className="glass-card"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 10,
              marginTop: '0.5rem',
              maxHeight: '250px',
              overflowY: 'auto',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            }}
          >
            {searchResults.map((item) => (
              <div
                key={item.schemeCode}
                onClick={() => handleSelectFund(item)}
                style={{
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  fontSize: '0.85rem',
                }}
                className="btn-ghost"
              >
                <div style={{ fontWeight: 600 }}>{item.schemeName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>Code: {item.schemeCode}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Empty State */}
      {funds.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 1rem' }} className="glass-card">
          <GitCompare size={48} color="var(--text-tertiary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>No Funds Selected</h3>
          <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Search and add up to 4 mutual funds to compare performance and parameters.
          </p>
        </div>
      )}

      {funds.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Active Comparison Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            {funds.map((f, idx) => (
              <div
                key={f.schemeCode}
                className="glass-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  borderLeft: `4px solid ${COMPARE_COLORS[idx % COMPARE_COLORS.length]}`,
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{f.fundHouse}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {f.schemeName}
                  </div>
                </div>
                <button
                  onClick={() => removeFund(f.schemeCode)}
                  className="btn-ghost"
                  style={{ padding: 4, marginLeft: '0.5rem', color: 'var(--loss)' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {funds.length > 1 && (
              <button onClick={clearAll} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: 'var(--loss)', borderColor: 'var(--loss-bg)' }}>
                Clear All
              </button>
            )}
          </div>

          {/* Comparison Chart Container */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Normalized Return Chart (%) <span style={{ display: 'inline-flex', alignItems: 'center' }} title="NAV value normalized to 0% at range start date"><Info size={14} style={{ color: 'var(--text-tertiary)', marginLeft: '0.25rem' }} /></span>
              </h3>

              <div style={{ display: 'flex', gap: '0.375rem' }}>
                {DATE_RANGE_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPreset(p.value)}
                    className={`tab-item ${preset === p.value ? 'active' : ''}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <ChartSkeleton />
            ) : comparisonChartData.length > 0 ? (
              <CompareChart data={comparisonChartData} keys={schemeKeys} colors={COMPARE_COLORS} height={350} />
            ) : (
              <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                Loading comparison curves...
              </div>
            )}
          </div>

          {/* Detailed Parameter Table */}
          <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontWeight: 700, fontSize: '1.1rem' }}>Key Metrics Comparison</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-tertiary)' }}>Parameter</th>
                  {funds.map((f, idx) => (
                    <th key={f.schemeCode} style={{ padding: '0.75rem 0.5rem', borderLeft: `1px solid var(--border)` }}>
                      <span style={{ color: COMPARE_COLORS[idx % COMPARE_COLORS.length], fontWeight: 750 }}>
                        {f.fundHouse}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Scheme Name</td>
                  {funds.map((f) => (
                    <td key={f.schemeCode} style={{ padding: '0.75rem 0.5rem', borderLeft: `1px solid var(--border)`, fontWeight: 500 }}>
                      {f.schemeName}
                    </td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Latest NAV</td>
                  {fundQueries.map((q, idx) => {
                    const latest = q.data?.data?.[0]?.nav;
                    return (
                      <td key={funds[idx].schemeCode} style={{ padding: '0.75rem 0.5rem', borderLeft: `1px solid var(--border)`, fontFamily: 'var(--font-mono)' }}>
                        {latest ? formatNAV(latest) : '--'}
                      </td>
                    );
                  })}
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Category</td>
                  {fundQueries.map((q, idx) => {
                    const cat = q.data?.meta?.scheme_category;
                    return (
                      <td key={funds[idx].schemeCode} style={{ padding: '0.75rem 0.5rem', borderLeft: `1px solid var(--border)` }}>
                        {cat || '--'}
                      </td>
                    );
                  })}
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Scheme Type</td>
                  {fundQueries.map((q, idx) => {
                    const type = q.data?.meta?.scheme_type;
                    return (
                      <td key={funds[idx].schemeCode} style={{ padding: '0.75rem 0.5rem', borderLeft: `1px solid var(--border)` }}>
                        {type || '--'}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Scheme Code</td>
                  {funds.map((f) => (
                    <td key={f.schemeCode} style={{ padding: '0.75rem 0.5rem', borderLeft: `1px solid var(--border)`, fontFamily: 'var(--font-mono)' }}>
                      {f.schemeCode}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
}
