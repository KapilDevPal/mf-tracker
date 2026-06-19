import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, BarChart2, BookmarkCheck, Calculator, GitCompare, Settings, TrendingUp, Menu, X, Bell } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWatchlistStore } from '@/store/watchlistStore';
import { ROUTES } from '@/constants';

const navItems = [
  { to: ROUTES.HOME, label: 'Home', icon: TrendingUp },
  { to: ROUTES.SEARCH, label: 'Search', icon: Search },
  { to: ROUTES.COMPARE, label: 'Compare', icon: GitCompare },
  { to: ROUTES.SIP_CALCULATOR, label: 'SIP Calc', icon: Calculator },
  { to: ROUTES.WATCHLIST, label: 'Watchlist', icon: BookmarkCheck },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const watchlistCount = useWatchlistStore((s) => s.funds.length);

  const isActive = (to: string) => location.pathname === to;

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(10, 15, 30, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <Link to={ROUTES.HOME} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
            }}>
              <BarChart2 size={20} color="white" />
            </div>
            <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              MF<span style={{ color: 'var(--accent-primary)' }}>Tracker</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', gap: '0.25rem' }} className="desktop-nav">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.4rem 0.875rem', borderRadius: '0.5rem',
                textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
                color: isActive(to) ? 'white' : 'var(--text-secondary)',
                background: isActive(to) ? 'rgba(99,102,241,0.15)' : 'transparent',
                border: isActive(to) ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}>
                <Icon size={15} />
                {label}
                {to === ROUTES.WATCHLIST && watchlistCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -4, right: -4,
                    background: '#6366f1', color: 'white',
                    fontSize: '0.6rem', fontWeight: 700,
                    width: 16, height: 16, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{watchlistCount}</span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => navigate(ROUTES.SEARCH)}
              className="btn-ghost"
              title="Search funds"
            >
              <Search size={18} />
            </button>
            <Link to={ROUTES.SETTINGS} className="btn-ghost" style={{ textDecoration: 'none' }}>
              <Settings size={18} />
            </Link>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="btn-ghost mobile-menu-btn"
              style={{ display: 'none' }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              overflow: 'hidden',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(10,15,30,0.95)',
            }}
          >
            <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {navItems.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.75rem 1rem', borderRadius: '0.75rem',
                    textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500,
                    color: isActive(to) ? 'white' : 'var(--text-secondary)',
                    background: isActive(to) ? 'rgba(99,102,241,0.15)' : 'transparent',
                  }}>
                  <Icon size={18} />
                  {label}
                  {to === ROUTES.WATCHLIST && watchlistCount > 0 && (
                    <span style={{
                      marginLeft: 'auto', background: '#6366f1', color: 'white',
                      fontSize: '0.7rem', fontWeight: 700, padding: '1px 6px', borderRadius: 9999,
                    }}>{watchlistCount}</span>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
