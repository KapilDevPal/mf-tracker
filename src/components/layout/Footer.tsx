import { Link } from 'react-router-dom';
import { BarChart2, ExternalLink } from 'lucide-react';
import { ROUTES } from '@/constants';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: 'rgba(17, 24, 39, 0.8)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '3rem 1.5rem 1.5rem',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <BarChart2 size={16} color="white" />
              </div>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                MF<span style={{ color: 'var(--accent-primary)' }}>Tracker</span>
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, maxWidth: 220 }}>
              Track, compare and analyze Indian mutual funds with real-time NAV data.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', marginTop: 0 }}>Tools</h4>
            {[
              { to: ROUTES.SEARCH, label: 'Search Funds' },
              { to: ROUTES.COMPARE, label: 'Compare Funds' },
              { to: ROUTES.SIP_CALCULATOR, label: 'SIP Calculator' },
              { to: ROUTES.WATCHLIST, label: 'Watchlist' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} style={{ display: 'block', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '0.5rem', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >{label}</Link>
            ))}
          </div>

          {/* Data Source */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', marginTop: 0 }}>Data Source</h4>
            <a href="https://mfapi.in" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              MFapi.in <ExternalLink size={12} />
            </a>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', margin: 0 }}>
              NAV data sourced from AMFI India via MFapi.in free API.
            </p>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', marginTop: 0 }}>Disclaimer</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', lineHeight: 1.6, margin: 0 }}>
              Mutual fund investments are subject to market risks. This tool is for informational purposes only and does not constitute financial advice.
            </p>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '1.25rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1rem',
        }}>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
            © {year} MFTracker. Data from AMFI India.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ display: 'inline-flex', padding: 8 }}>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
