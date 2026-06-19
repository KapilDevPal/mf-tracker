import { Settings as SettingsIcon, Sun, Moon, Eye, BarChart, Trash2, Check } from 'lucide-react';
import { useState } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import { useSearchHistoryStore } from '@/store/compareStore';
import { SEOHead } from '@/components/seo/SEOHead';
import type { Theme, Currency, ChartType } from '@/types';

export default function Settings() {
  const settings = useSettingsStore();
  const { clearAll: clearRecent } = useRecentlyViewedStore();
  const { clearAll: clearHistory } = useSearchHistoryStore();

  const [clearedRecent, setClearedRecent] = useState(false);
  const [clearedHistory, setClearedHistory] = useState(false);

  const handleClearRecent = () => {
    clearRecent();
    setClearedRecent(true);
    setTimeout(() => setClearedRecent(false), 2000);
  };

  const handleClearHistory = () => {
    clearHistory();
    setClearedHistory(true);
    setTimeout(() => setClearedHistory(false), 2000);
  };

  return (
    <div style={{ maxWidth: 750, margin: '0 auto', padding: '2rem 1.5rem 4rem' }} className="page-enter">
      <SEOHead title="Preferences & Settings" description="Configure visual preferences, charts parameters, currencies, and cached data logs" />

      <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 1.5rem 0' }}>
        Settings
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Visual Settings */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={18} /> Visual Theme
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Theme Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Theme Mode</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Select light or dark style appearance</div>
              </div>
              <div className="tab-list">
                {(['dark', 'light'] as Theme[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => settings.setTheme(t)}
                    className={`tab-item ${settings.theme === t ? 'active' : ''}`}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Currency Choice */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Currency Unit</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Current app currency (INR default)</div>
              </div>
              <div className="tab-list">
                {(['INR', 'USD'] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => settings.setCurrency(c)}
                    className={`tab-item ${settings.currency === c ? 'active' : ''}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chart Options */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart size={18} /> Chart Preferences
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Chart Type */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Chart Style</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Select line curves visualization</div>
              </div>
              <div className="tab-list">
                {(['area', 'line'] as ChartType[]).map((ct) => (
                  <button
                    key={ct}
                    onClick={() => settings.setChartType(ct)}
                    className={`tab-item ${settings.chartType === ct ? 'active' : ''}`}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {ct}
                  </button>
                ))}
              </div>
            </div>

            {/* Show Gridlines */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Show Gridlines</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Toggle horizontal/vertical axes guides</div>
              </div>
              <button
                onClick={() => settings.setShowGridLines(!settings.showGridLines)}
                className={`tab-item ${settings.showGridLines ? 'active' : ''}`}
                style={{ padding: '0.4rem 1rem', borderRadius: '0.5rem' }}
              >
                {settings.showGridLines ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Chart Animation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Animate Rendering</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Toggle interactive graph loading transitions</div>
              </div>
              <button
                onClick={() => settings.setAnimateCharts(!settings.animateCharts)}
                className={`tab-item ${settings.animateCharts ? 'active' : ''}`}
                style={{ padding: '0.4rem 1rem', borderRadius: '0.5rem' }}
              >
                {settings.animateCharts ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>

        {/* Storage / Cached Data Cleanup */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--loss)' }}>
            <Trash2 size={18} /> Danger Zone
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Clear search queries */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Clear Search History</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Flush all local input log queries</div>
              </div>
              <button
                onClick={handleClearHistory}
                className="btn-secondary"
                style={{ color: 'var(--loss)', borderColor: 'var(--loss-bg)', fontSize: '0.8rem', minWidth: '120px' }}
              >
                {clearedHistory ? <Check size={14} color="var(--gain)" /> : <Trash2 size={14} />}
                {clearedHistory ? 'History Cleared' : 'Clear History'}
              </button>
            </div>

            {/* Clear recently viewed */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Clear Recently Viewed</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Flush all local recently opened fund logs</div>
              </div>
              <button
                onClick={handleClearRecent}
                className="btn-secondary"
                style={{ color: 'var(--loss)', borderColor: 'var(--loss-bg)', fontSize: '0.8rem', minWidth: '120px' }}
              >
                {clearedRecent ? <Check size={14} color="var(--gain)" /> : <Trash2 size={14} />}
                {clearedRecent ? 'Cache Cleared' : 'Clear Cache'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
