import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Copy,
  Share2,
  Download,
  Calendar,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  Check,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useNAVHistory } from '@/hooks/useMFApi';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import { useWatchlistStore } from '@/store/watchlistStore';
import {
  formatNAV,
  formatDate,
  formatReturn,
  exportNavToCSV,
  downloadChartAsPNG,
  extractAMC,
  copyToClipboard,
  shareUrl,
} from '@/utils';
import { DATE_RANGE_PRESETS, ROUTES } from '@/constants';
import { getStartDateFromPreset, toApiDate } from '@/services/mfapi';
import { NAVChart } from '@/components/charts/NAVChart';
import { ChartSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { SEOHead } from '@/components/seo/SEOHead';

export default function FundDetail() {
  const { schemeCode } = useParams<{ schemeCode: string }>();
  const code = parseInt(schemeCode || '0', 10);

  const [preset, setPreset] = useState<string>('1Y');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const recentlyViewed = useRecentlyViewedStore((s) => s.addFund);
  const { isInWatchlist, addFund, removeFund } = useWatchlistStore();

  const isFavorite = isInWatchlist(code);

  // Determine query parameters for API calls
  const startDate = useMemo(() => {
    if (isCustomMode && customRange.start) return customRange.start;
    return getStartDateFromPreset(preset);
  }, [preset, isCustomMode, customRange.start]);

  const endDate = useMemo(() => {
    if (isCustomMode && customRange.end) return customRange.end;
    return toApiDate(new Date());
  }, [isCustomMode, customRange.end]);

  const { data: fundDetail, isLoading, isError, refetch } = useNAVHistory(code);

  // Trigger cache refetch if dates change or update recently viewed list
  useEffect(() => {
    if (fundDetail && fundDetail.meta) {
      recentlyViewed({
        schemeCode: code,
        schemeName: fundDetail.meta.scheme_name,
        fundHouse: fundDetail.meta.fund_house,
        latestNav: parseFloat(fundDetail.data?.[0]?.nav || '0'),
        navDate: fundDetail.data?.[0]?.date,
      });
    }
  }, [fundDetail, code, recentlyViewed]);

  const sortedNavData = useMemo(() => {
    if (!fundDetail?.data) return [];
    // Sort ascending by date
    return [...fundDetail.data]
      .map((entry) => {
        const [d, m, y] = entry.date.split('-').map(Number);
        return {
          date: `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`,
          nav: parseFloat(entry.nav),
          displayDate: entry.date,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [fundDetail]);

  // Dynamic filter for UI visualization without hammering the API
  const filteredNavData = useMemo(() => {
    if (sortedNavData.length === 0) return [];
    const startMs = new Date(startDate).getTime();
    const endMs = new Date(endDate).getTime();
    return sortedNavData.filter((d) => {
      const ms = new Date(d.date).getTime();
      return ms >= startMs && ms <= endMs;
    });
  }, [sortedNavData, startDate, endDate]);

  const returnStats = useMemo(() => {
    if (filteredNavData.length < 2) return { returnPct: 0, initialNav: 0, finalNav: 0 };
    const initialNav = filteredNavData[0].nav;
    const finalNav = filteredNavData[filteredNavData.length - 1].nav;
    const returnPct = ((finalNav - initialNav) / initialNav) * 100;
    return { returnPct, initialNav, finalNav };
  }, [filteredNavData]);

  if (isLoading) {
    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        <Skeleton style={{ width: '300px', height: '24px', marginBottom: '1.5rem' }} />
        <Skeleton style={{ width: '60%', height: '36px', marginBottom: '1rem' }} />
        <ChartSkeleton />
      </div>
    );
  }

  if (isError || !fundDetail || !fundDetail.meta) {
    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--loss)' }}>Failed to load Mutual Fund details</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Please check your internet or try searching again.</p>
        <Link to={ROUTES.HOME} className="btn-primary" style={{ marginTop: '1rem' }}>
          Go to Home
        </Link>
      </div>
    );
  }

  const { meta } = fundDetail;
  const latestEntry = fundDetail.data?.[0];
  const fundHouse = extractAMC(meta.scheme_name);

  const handleWatchlistToggle = () => {
    if (isFavorite) {
      removeFund(code);
    } else {
      addFund({
        schemeCode: code,
        schemeName: meta.scheme_name,
        fundHouse: meta.fund_house,
        category: meta.scheme_category,
        latestNav: latestEntry ? parseFloat(latestEntry.nav) : undefined,
        navDate: latestEntry?.date,
        isFavorite: false,
        addedAt: new Date().toISOString(),
      });
    }
  };

  const handleCopyCode = () => {
    copyToClipboard(code.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = () => {
    const title = meta.scheme_name;
    const desc = `Latest NAV for ${meta.scheme_name} is ${formatNAV(latestEntry?.nav || 0)}`;
    const url = window.location.href;
    shareUrl(title, desc, url);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const handleExportCSV = () => {
    if (fundDetail.data) {
      exportNavToCSV(meta.scheme_name, code, fundDetail.data);
    }
  };

  const handleChartPNG = () => {
    downloadChartAsPNG('nav-detail-chart', `${meta.scheme_name.replace(/\s+/g, '_')}_Chart.png`);
  };

  // Structured Data (FinancialProduct / InvestmentFund)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'InvestmentFund',
    name: meta.scheme_name,
    identifier: code.toString(),
    provider: {
      '@type': 'FinancialService',
      name: meta.fund_house,
    },
    offers: {
      '@type': 'Offer',
      price: latestEntry?.nav,
      priceCurrency: 'INR',
      priceValidUntil: latestEntry ? toApiDate(new Date()) : undefined,
    },
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem 4rem' }} className="page-enter">
      <SEOHead
        title={`${meta.scheme_name} Latest NAV`}
        description={`Check NAV price history, growth return percentages, and parameters for ${meta.scheme_name}`}
        structuredData={schemaData}
      />

      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '1.25rem' }}>
        <Link to={ROUTES.HOME} style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
        <ChevronRight size={12} />
        <Link to={ROUTES.SEARCH} style={{ color: 'inherit', textDecoration: 'none' }}>Search</Link>
        <ChevronRight size={12} />
        <span style={{ color: 'var(--text-secondary)' }}>{fundHouse}</span>
      </div>

      {/* Header Info Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <span style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
              {meta.scheme_category}
            </span>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 800, margin: '0.5rem 0', lineHeight: 1.25 }}>
              {meta.scheme_name}
            </h1>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>AMC: <strong>{meta.fund_house}</strong></span>
              <span>•</span>
              <span>Code: <strong>{code}</strong></span>
              {meta.isin_growth && (
                <>
                  <span>•</span>
                  <span>ISIN: <strong>{meta.isin_growth}</strong></span>
                </>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={handleWatchlistToggle} className="btn-secondary" style={{ color: isFavorite ? '#fbbf24' : 'inherit' }}>
              <Star size={16} fill={isFavorite ? '#fbbf24' : 'none'} />
              {isFavorite ? 'Watchlisted' : 'Watchlist'}
            </button>
            <button onClick={handleCopyCode} className="btn-secondary">
              {copied ? <Check size={16} color="var(--gain)" /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
            <button onClick={handleShare} className="btn-secondary">
              {shared ? <Check size={16} color="var(--gain)" /> : <Share2 size={16} />}
              {shared ? 'Link Copied!' : 'Share'}
            </button>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="stat-card">
            <div className="stat-label">Latest NAV ({latestEntry?.date})</div>
            <div className="stat-value" style={{ color: 'var(--accent-primary)' }}>
              {latestEntry ? formatNAV(latestEntry.nav) : '--'}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Returns ({preset})</div>
            <div className="stat-value" style={{ color: returnStats.returnPct >= 0 ? 'var(--gain)' : 'var(--loss)' }}>
              {formatReturn(returnStats.returnPct)}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Starting NAV ({preset})</div>
            <div className="stat-value" style={{ fontSize: '1.25rem' }}>
              {formatNAV(returnStats.initialNav)}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1.5rem', alignItems: 'flex-start' }} className="grid-detail-wrap">
        
        {/* Main Chart Card */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} /> Price Chart
            </h3>

            {/* Presets & Dates Selection */}
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
              {DATE_RANGE_PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => {
                    setPreset(p.value);
                    setIsCustomMode(false);
                  }}
                  className={`tab-item ${preset === p.value && !isCustomMode ? 'active' : ''}`}
                >
                  {p.label}
                </button>
              ))}
              <button
                onClick={() => setIsCustomMode(true)}
                className={`tab-item ${isCustomMode ? 'active' : ''}`}
              >
                Custom
              </button>
            </div>
          </div>

          {/* Custom Date Inputs */}
          {isCustomMode && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>From:</span>
                <input
                  type="date"
                  value={customRange.start}
                  onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                  style={{ background: 'var(--bg-primary)', color: 'white', border: '1px solid var(--border)', borderRadius: '4px', padding: '2px 6px', fontSize: '0.8rem' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>To:</span>
                <input
                  type="date"
                  value={customRange.end}
                  onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                  style={{ background: 'var(--bg-primary)', color: 'white', border: '1px solid var(--border)', borderRadius: '4px', padding: '2px 6px', fontSize: '0.8rem' }}
                />
              </div>
            </div>
          )}

          {/* Recharts chart placeholder wrapper */}
          {filteredNavData.length > 0 ? (
            <NAVChart data={filteredNavData} chartId="nav-detail-chart" height={320} />
          ) : (
            <div style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              No price data matches the selected date range.
            </div>
          )}

          {/* Export Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1rem' }}>
            <button onClick={handleExportCSV} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
              <FileSpreadsheet size={14} /> Export CSV
            </button>
            <button onClick={handleChartPNG} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
              <Download size={14} /> Save PNG
            </button>
          </div>
        </div>

        {/* Side Parameters */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontWeight: 700, fontSize: '1.1rem' }}>Parameters</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--text-tertiary)' }}>Scheme Type</span>
              <div style={{ fontWeight: 600, marginTop: '2px' }}>{meta.scheme_type}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-tertiary)' }}>Growth ISIN</span>
              <div style={{ fontWeight: 600, marginTop: '2px' }}>{meta.isin_growth || '--'}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-tertiary)' }}>Reinvestment ISIN</span>
              <div style={{ fontWeight: 600, marginTop: '2px' }}>{meta.isin_div_reinvestment || '--'}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-tertiary)' }}>AMFI Scheme Code</span>
              <div style={{ fontWeight: 600, marginTop: '2px' }}>{code}</div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .grid-detail-wrap { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
