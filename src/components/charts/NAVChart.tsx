import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { useSettingsStore } from '@/store/settingsStore';
import { formatCurrency, formatNAV } from '@/utils';

interface NAVChartProps {
  data: Array<{ date: string; nav: number; displayDate: string }>;
  chartId?: string;
  height?: number;
}

export function NAVChart({ data, chartId = 'nav-historical-chart', height = 300 }: NAVChartProps) {
  const { showGridLines, animateCharts, chartType } = useSettingsStore();

  const minNav = Math.min(...data.map((d) => d.nav));
  const maxNav = Math.max(...data.map((d) => d.nav));
  const buffer = (maxNav - minNav) * 0.05 || 1;
  const yDomain = [Math.max(0, minNav - buffer), maxNav + buffer];

  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div id={chartId} style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        {chartType === 'line' ? (
          <LineChart data={sortedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {showGridLines && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
            <XAxis
              dataKey="displayDate"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
            />
            <YAxis
              domain={yDomain}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => v.toFixed(1)}
              tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(17, 24, 39, 0.95)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
              }}
              formatter={(value: any) => [formatNAV(value), 'NAV']}
              labelStyle={{ fontSize: 11, color: 'var(--text-tertiary)' }}
            />
            <Line
              type="monotone"
              dataKey="nav"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              isAnimationActive={animateCharts}
            />
          </LineChart>
        ) : (
          <AreaChart data={sortedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorNav" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            {showGridLines && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
            <XAxis
              dataKey="displayDate"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
            />
            <YAxis
              domain={yDomain}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => v.toFixed(1)}
              tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(17, 24, 39, 0.95)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
              }}
              formatter={(value: any) => [formatNAV(value), 'NAV']}
              labelStyle={{ fontSize: 11, color: 'var(--text-tertiary)' }}
            />
            <Area
              type="monotone"
              dataKey="nav"
              stroke="#6366f1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorNav)"
              isAnimationActive={animateCharts}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

// ─── Multi Fund Comparison Chart ─────────────────────────────────────────────

interface CompareChartProps {
  data: any[];
  keys: string[];
  colors: readonly string[];
  chartId?: string;
  height?: number;
}

export function CompareChart({
  data,
  keys,
  colors,
  chartId = 'nav-compare-chart',
  height = 350,
}: CompareChartProps) {
  const { showGridLines, animateCharts } = useSettingsStore();

  return (
    <div id={chartId} style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          {showGridLines && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
          <XAxis
            dataKey="displayDate"
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}%`}
            tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
            }}
            formatter={(value: any) => [`${parseFloat(value).toFixed(2)}%`, 'Relative Return']}
            labelStyle={{ fontSize: 11, color: 'var(--text-tertiary)' }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: 11, color: 'var(--text-primary)' }}
          />
          {keys.map((key, idx) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[idx % colors.length]}
              strokeWidth={2}
              dot={false}
              name={key}
              isAnimationActive={animateCharts}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
