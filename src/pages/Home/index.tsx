import { useNavigate, Link } from 'react-router-dom';
import { Search, ArrowRight, TrendingUp, History, Landmark, Percent, Calculator, Activity } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import { useQueries, useQuery } from '@tanstack/react-query';
import { getLatestNAV } from '@/services/mfapi';
import { POPULAR_AMCS, TRENDING_FUND_CODES, ROUTES } from '@/constants';
import { formatCurrency, formatNAV, extractAMC } from '@/utils';
import { FundCard } from '@/components/fund/FundCard';
import { SEOHead } from '@/components/seo/SEOHead';

export default function Home() {
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  const recentFunds = useRecentlyViewedStore((s) => s.funds);

  // Fetch trending funds details in parallel using useQueries
  const trendingQueries = useQueries({
    queries: TRENDING_FUND_CODES.map((code) => ({
      queryKey: ['latest-nav', code],
      queryFn: () => getLatestNAV(code),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const handleAmcClick = (query: string) => {
    navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(query)}`);
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MF Tracker',
    url: 'https://kapil-dev-pal.github.io/mf-tracker',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://kapil-dev-pal.github.io/mf-tracker/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: '4rem' }} className="page-enter">
      <SEOHead title="Mutual Fund Tracker" structuredData={structuredData} />
      <div className="mesh-bg" />

      {/* Hero Section */}
      <section style={{
        maxWidth: 1280, margin: '0 auto', padding: '5rem 1.5rem 3.5rem',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        position: 'relative', zIndex: 1
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span style={{
            background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)',
            padding: '4px 12px', borderRadius: 9999, fontSize: '0.8rem', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid rgba(99,102,241,0.2)'
          }}>
            Real-time Mutual Fund Tracking
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 850, letterSpacing: '-0.02em',
            margin: '1.25rem 0', lineHeight: 1.15
          }}
        >
          Track Mutual Funds <br />
          <span className="gradient-text">Like a Pro</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'var(--text-secondary)',
            maxWidth: 600, margin: '0 0 2rem 0', lineHeight: 1.6
          }}
        >
          Instant search, detailed NAV curves, comparison tooling, and watchlists. No account required. Real-time data direct from AMFI.
        </motion.p>

        {/* Big Search Bar */}
        <motion.form
          onSubmit={handleSearchSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            width: '100%', maxWidth: 550, position: 'relative',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)', borderRadius: '1rem',
            overflow: 'hidden'
          }}
        >
          <input
            type="text"
            placeholder="Search mutual funds (e.g. HDFC, Small Cap, Direct...)"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="input-base"
            style={{
              padding: '1rem 3.5rem 1rem 1.25rem', fontSize: '1rem',
              borderRadius: '1rem', background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)',
            }}
          />
          <button
            type="submit"
            style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              background: 'var(--accent-primary)', border: 'none', borderRadius: '0.75rem',
              width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-secondary)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent-primary)')}
          >
            <ArrowRight size={20} color="white" />
          </button>
        </motion.form>
      </section>

      {/* Main Grid Content */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '3.5rem', position: 'relative', zIndex: 1 }}>

        {/* Popular AMCs */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Landmark size={20} className="gradient-text" />
            <h2 className="section-title" style={{ margin: 0 }}>Popular Fund Houses</h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '0.75rem'
          }}>
            {POPULAR_AMCS.map((amc) => (
              <motion.button
                key={amc.abbr}
                onClick={() => handleAmcClick(amc.query)}
                whileHover={{ scale: 1.03, y: -2 }}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.375rem',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: amc.color, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.75rem'
                }}>
                  {amc.abbr[0]}
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{amc.abbr}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Trending Funds */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <TrendingUp size={20} className="gradient-text" />
            <h2 className="section-title" style={{ margin: 0 }}>Trending Funds</h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem'
          }}>
            {trendingQueries.map((q, idx) => {
              const code = TRENDING_FUND_CODES[idx];
              if (q.isLoading) {
                return (
                  <div key={code} className="glass-card" style={{ height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Loading...</span>
                  </div>
                );
              }
              if (q.isError || !q.data) {
                return null;
              }
              const meta = q.data.meta;
              const latest = q.data.data?.[0];
              return (
                <FundCard
                  key={code}
                  schemeCode={code}
                  schemeName={meta.scheme_name}
                  latestNav={latest?.nav}
                  navDate={latest?.date}
                  category={meta.scheme_category}
                />
              );
            })}
          </div>
        </section>

        {/* Recently Viewed */}
        {recentFunds.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <History size={20} className="gradient-text" />
              <h2 className="section-title" style={{ margin: 0 }}>Recently Viewed</h2>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem'
            }}>
              {recentFunds.slice(0, 3).map((fund) => (
                <FundCard
                  key={fund.schemeCode}
                  schemeCode={fund.schemeCode}
                  schemeName={fund.schemeName}
                  latestNav={fund.latestNav}
                  navDate={fund.navDate}
                />
              ))}
            </div>
          </section>
        )}

        {/* Quick Tools Callout */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.25rem'
        }}>
          {/* SIP Tool */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{
              padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)'
            }}>
              <Calculator size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 0.375rem 0', fontSize: '1.1rem', fontWeight: 700 }}>SIP Calculator</h3>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Calculate expected future returns on monthly Mutual Fund SIP investments.
              </p>
              <Link to={ROUTES.SIP_CALCULATOR} className="btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', textDecoration: 'none' }}>
                Open Calculator
              </Link>
            </div>
          </div>

          {/* Compare Tool */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{
              padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(16,185,129,0.1)', color: 'var(--gain)'
            }}>
              <Activity size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 0.375rem 0', fontSize: '1.1rem', fontWeight: 700 }}>Compare Funds</h3>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Compare historical NAV returns, metrics, and parameters for up to four mutual funds.
              </p>
              <Link to={ROUTES.COMPARE} className="btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', textDecoration: 'none' }}>
                Compare Now
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
