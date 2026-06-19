import { useState, useMemo } from 'react';
import { Calculator, ArrowUpRight, TrendingUp, DollarSign, Award, HelpCircle } from 'lucide-react';
import { calculateSIP, formatCurrency, formatNumber } from '@/utils';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { SEOHead } from '@/components/seo/SEOHead';

export default function SIPCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [durationYears, setDurationYears] = useState(10);

  const sipResults = useMemo(() => {
    return calculateSIP({ monthlyAmount, annualReturn, durationYears });
  }, [monthlyAmount, annualReturn, durationYears]);

  const pieData = [
    { name: 'Invested Amount', value: sipResults.totalInvested, color: '#6366f1' },
    { name: 'Wealth Gained', value: sipResults.wealthGained, color: '#10b981' },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem 4rem' }} className="page-enter">
      <SEOHead title="SIP Calculator" description="Estimate future wealth returns and corpus sizes for systematic investment plans" />

      <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 1.5rem 0' }}>
        SIP Calculator
      </h1>

      {/* Main Grid: Inputs Left, Outputs Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'flex-start' }} className="grid-sip-wrap">

        {/* Inputs Control Panel */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calculator size={18} /> Investment Inputs
          </h2>

          {/* Amount Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Monthly Investment</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                {formatCurrency(monthlyAmount)}
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={100000}
              step={500}
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              <span>₹500</span>
              <span>₹1,00,000</span>
            </div>
          </div>

          {/* Return Rate Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Expected Return (p.a.)</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                {annualReturn}%
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={0.5}
              value={annualReturn}
              onChange={(e) => setAnnualReturn(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              <span>1%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Duration Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Duration (Years)</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                {durationYears} Yr{durationYears > 1 ? 's' : ''}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={40}
              step={1}
              value={durationYears}
              onChange={(e) => setDurationYears(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              <span>1 Yr</span>
              <span>40 Yrs</span>
            </div>
          </div>
        </div>

        {/* Results Presentation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Main Stat Summary Cards */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Estimated Corpus
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 850, color: 'var(--gain)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                {formatCurrency(sipResults.estimatedCorpus)}
              </div>
            </div>
            
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Total Invested</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginTop: '2px' }}>
                {formatCurrency(sipResults.totalInvested)}
              </div>
            </div>
            
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem', borderLeft: '1px solid rgba(255,255,255,0.06)', paddingLeft: '1.25rem' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Wealth Gained</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', marginTop: '2px' }}>
                {formatCurrency(sipResults.wealthGained)}
              </div>
            </div>
          </div>

          {/* Pie Chart Representation */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [formatCurrency(value), '']}
                  contentStyle={{ background: '#111827', border: '1px solid var(--border)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', marginTop: '-1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#6366f1' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Invested</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Wealth Gained</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .grid-sip-wrap { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
