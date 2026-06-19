export const MFAPI_BASE = 'https://api.mfapi.in';

export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  FUND_DETAIL: '/fund/:schemeCode',
  COMPARE: '/compare',
  SIP_CALCULATOR: '/sip-calculator',
  WATCHLIST: '/watchlist',
  SETTINGS: '/settings',
} as const;

export const POPULAR_AMCS = [
  { name: 'HDFC Mutual Fund', query: 'HDFC', color: '#003087', abbr: 'HDFC' },
  { name: 'SBI Mutual Fund', query: 'SBI', color: '#22409A', abbr: 'SBI' },
  { name: 'ICICI Prudential', query: 'ICICI Prudential', color: '#F7941D', abbr: 'ICICI' },
  { name: 'Axis Mutual Fund', query: 'Axis', color: '#97144D', abbr: 'AXIS' },
  { name: 'Mirae Asset', query: 'Mirae Asset', color: '#E60028', abbr: 'MIRAE' },
  { name: 'Nippon India', query: 'Nippon India', color: '#DA0000', abbr: 'NIPPON' },
  { name: 'Kotak Mahindra', query: 'Kotak Mahindra', color: '#EE3124', abbr: 'KOTAK' },
  { name: 'Parag Parikh', query: 'Parag Parikh', color: '#1A3668', abbr: 'PPFAS' },
  { name: 'UTI Mutual Fund', query: 'UTI', color: '#FF6B00', abbr: 'UTI' },
  { name: 'DSP Mutual Fund', query: 'DSP', color: '#005DA8', abbr: 'DSP' },
  { name: 'Tata Mutual Fund', query: 'Tata', color: '#004B8E', abbr: 'TATA' },
  { name: 'Franklin Templeton', query: 'Franklin Templeton', color: '#0073CF', abbr: 'FRANKLIN' },
] as const;

export const TRENDING_FUND_CODES = [
  125497, // SBI Small Cap - Direct Growth
  119598, // Mirae Asset Large Cap - Direct Growth
  120503, // Axis Bluechip - Direct Growth
  118989, // Parag Parikh Flexi Cap - Direct Growth
  120586, // HDFC Mid-Cap Opportunities - Direct Growth
  118825, // ICICI Pru Technology - Direct Growth
] as const;

export const DATE_RANGE_PRESETS = [
  { label: '1M', value: '1M' as const },
  { label: '3M', value: '3M' as const },
  { label: '6M', value: '6M' as const },
  { label: '1Y', value: '1Y' as const },
  { label: '3Y', value: '3Y' as const },
  { label: '5Y', value: '5Y' as const },
  { label: 'All', value: 'ALL' as const },
] as const;

export const STALE_TIME = 5 * 60 * 1000; // 5 minutes
export const MAX_COMPARE_FUNDS = 4;
export const MAX_RECENTLY_VIEWED = 10;
export const MAX_SEARCH_HISTORY = 20;
export const DEBOUNCE_DELAY = 350;

export const COMPARE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'] as const;

export const SITE_CONFIG = {
  name: 'MF Tracker',
  description: 'Track, compare and analyze Indian mutual funds with real-time NAV data. Free mutual fund tracker with historical charts and SIP calculator.',
  url: 'https://your-username.github.io/mf-tracker',
  twitter: '@mftracker',
  keywords: 'mutual fund tracker, NAV tracker, SIP calculator, mutual fund comparison, India mutual funds, AMFI',
} as const;
