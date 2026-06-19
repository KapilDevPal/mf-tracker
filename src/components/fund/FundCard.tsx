import { Link } from 'react-router-dom';
import { Star, GitCompare, ArrowUpRight, ArrowDownRight, Copy, Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWatchlistStore } from '@/store/watchlistStore';
import { useCompareStore } from '@/store/compareStore';
import { formatNAV, formatReturn, extractAMC, copyToClipboard } from '@/utils';
import { ROUTES } from '@/constants';

interface FundCardProps {
  schemeCode: number;
  schemeName: string;
  latestNav?: number | string;
  navDate?: string;
  category?: string;
  showActions?: boolean;
}

export function FundCard({
  schemeCode,
  schemeName,
  latestNav,
  navDate,
  category = 'Mutual Fund',
  showActions = true,
}: FundCardProps) {
  const [copied, setCopied] = useState(false);
  const { isInWatchlist, addFund, removeFund } = useWatchlistStore();
  const { isInCompare, addFund: addToCompare, removeFund: removeFromCompare, funds: compareFunds } = useCompareStore();

  const isFavorite = isInWatchlist(schemeCode);
  const inCompare = isInCompare(schemeCode);
  const fundHouse = extractAMC(schemeName);

  const parsedNav = latestNav ? (typeof latestNav === 'string' ? parseFloat(latestNav) : latestNav) : null;

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFund(schemeCode);
    } else {
      addFund({
        schemeCode,
        schemeName,
        fundHouse,
        category,
        latestNav: parsedNav || undefined,
        navDate,
        isFavorite: false,
        addedAt: new Date().toISOString(),
      });
    }
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(schemeCode);
    } else {
      if (compareFunds.length >= 4) {
        alert('You can compare up to 4 funds at a time.');
        return;
      }
      addToCompare({
        schemeCode,
        schemeName,
        fundHouse,
      });
    }
  };

  const handleCopyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    copyToClipboard(schemeCode.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-card"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: '180px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div>
        {/* Header: AMC & Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {fundHouse}
            </span>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{category}</div>
          </div>

          {showActions && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', zIndex: 5 }}>
              <button
                onClick={handleCopyCode}
                className="btn-ghost"
                style={{ padding: '0.35rem', borderRadius: '0.375rem' }}
                title="Copy Scheme Code"
              >
                {copied ? <Check size={14} color="var(--gain)" /> : <Copy size={14} />}
              </button>
              <button
                onClick={handleCompareToggle}
                className="btn-ghost"
                style={{
                  padding: '0.35rem',
                  borderRadius: '0.375rem',
                  color: inCompare ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  background: inCompare ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                }}
                title={inCompare ? 'Remove from comparison' : 'Add to comparison'}
              >
                <GitCompare size={14} />
              </button>
              <button
                onClick={handleWatchlistToggle}
                className="btn-ghost"
                style={{
                  padding: '0.35rem',
                  borderRadius: '0.375rem',
                  color: isFavorite ? '#fbbf24' : 'var(--text-secondary)',
                }}
                title={isFavorite ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                <Star size={14} fill={isFavorite ? '#fbbf24' : 'none'} />
              </button>
            </div>
          )}
        </div>

        {/* Title / Name */}
        <Link
          to={ROUTES.FUND_DETAIL.replace(':schemeCode', schemeCode.toString())}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <h3
            style={{
              fontSize: '0.95rem',
              fontWeight: 600,
              lineHeight: 1.4,
              margin: '0 0 1rem 0',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              height: '2.8rem',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
          >
            {schemeName}
          </h3>
        </Link>
      </div>

      {/* NAV Details */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Latest NAV</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '0.125rem' }}>
            {parsedNav ? formatNAV(parsedNav) : '--'}
          </div>
        </div>
        {navDate && (
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>As of {navDate}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
